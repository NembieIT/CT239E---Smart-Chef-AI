import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Upload, Camera, Flame, Clock, X, Plus, ImagePlus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { AnimatedPage } from "../components/AnimatedPage";

type MealTime = "Sáng" | "Trưa" | "Tối" | null;

export function HomePage() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mealTime, setMealTime] = useState<MealTime>(null);
  const [userDiet, setUserDiet] = useState<string[]>([]);
  const [userAllergens, setUserAllergens] = useState<string[]>([]);
  const [allergenInput, setAllergenInput] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);
  const [detectedDetails, setDetectedDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:8000/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
        setUserDiet(res.data.diet_modes || []); setUserAllergens(res.data.allergens || []);
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const startWebcam = async () => { setIsWebcamActive(true); setUploadedImage(null); try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); if (videoRef.current) { videoRef.current.srcObject = stream; streamRef.current = stream; } } catch (err) { setIsWebcamActive(false); } };
  const stopWebcam = () => { if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop()); setIsWebcamActive(false); };
  const capturePhoto = () => { if (videoRef.current) { const canvas = document.createElement("canvas"); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight; const ctx = canvas.getContext("2d"); ctx?.drawImage(videoRef.current, 0, 0); const dataUrl = canvas.toDataURL("image/jpeg"); setUploadedImage(dataUrl); fetch(dataUrl).then(res => res.blob()).then(blob => { setImageFile(new File([blob], "capture.jpg", { type: "image/jpeg" })); }); stopWebcam(); } };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) processFile(e.target.files[0]); };
  const processFile = (file: File) => { if (!file.type.startsWith("image/")) return; setImageFile(file); const reader = new FileReader(); reader.onloadend = () => setUploadedImage(reader.result as string); reader.readAsDataURL(file); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) processFile(file); };
  
  const handlePrepareAnalyze = () => { if (!localStorage.getItem("access_token")) { navigate("/auth"); return; } if (!imageFile) return; setShowConfirmModal(true); };
  
  const handleConfirmAndAnalyze = async () => {
    setShowConfirmModal(false); setIsProcessing(true); const token = localStorage.getItem("access_token");
    try { await axios.put('http://localhost:8000/auth/me/preferences', { diet_modes: userDiet, allergens: userAllergens }, { headers: { 'Authorization': `Bearer ${token}` } }); } catch (err) {}
    const requestData = { mealTime, dietModes: userDiet, allergens: userAllergens };
    const formData = new FormData(); formData.append("file", imageFile!); formData.append("data", JSON.stringify(requestData));
    try {
      const res = await axios.post('http://localhost:8000/detect-ingredients', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } });
      setDetectedDetails(res.data.details || []);
      const mappedRecipes = (res.data.suggestions || []).map((r: any, i: number) => ({ id: String(i + 1), name: r.name, reason: r.reason, calories: Math.round(((r.nutrition?.protein||0)*4)+((r.nutrition?.carbs||0)*4)+((r.nutrition?.fat||0)*9)) || r.calories || 0, cookTime: r.cookingTime || 15, image: r.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", ingredientsList: r.ingredients || [], instructions: r.instructions || [], servings: r.servings || 2 }));
      setSuggestedRecipes(mappedRecipes); setShowResults(true);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 600);
    } catch (err: any) { if (err.response?.status === 401) { localStorage.removeItem("access_token"); navigate("/auth"); } } finally { setIsProcessing(false); }
  };

  // LƯU LỊCH SỬ TRƯỚC KHI CHUYỂN TRANG
  const handleViewRecipeDetail = async (recipe: any) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await axios.post('http://localhost:8000/save-history', {
          input_data: { mealTime, dietModes: userDiet, allergens: userAllergens },
          detected_ingredients: detectedDetails.map(d => d.name),
          selected_recipe: recipe
        }, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
      } catch (err) {
        console.error("Lỗi lưu lịch sử:", err);
      }
    }
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  const toggleDiet = (mode: string) => setUserDiet(p => p.includes(mode) ? p.filter(m => m !== mode) : [...p, mode]);
  const addAllergen = () => { if (allergenInput.trim() && !userAllergens.includes(allergenInput.trim())) setUserAllergens([...userAllergens, allergenInput.trim()]); setAllergenInput(""); };

  const mealTimes: MealTime[] = ["Sáng", "Trưa", "Tối"];
  const dietOptions = ["Gym", "Giảm cân", "Bệnh", "Ăn lành mạnh", "Ăn chay"];

  // PARALLAX SCROLL EFFECTS
  const { scrollY } = useScroll();
  const yHeroText1 = useTransform(scrollY, [0, 800], [0, 150]);
  const yHeroText2 = useTransform(scrollY, [0, 800], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <ReactLenis root>
      <AnimatedPage>
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden pb-32">
          
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-[1400px] mx-auto pt-24 px-6 md:px-12">
            
            {/* HERO SECTION WITH PARALLAX */}
            <motion.div style={{ opacity: opacityHero }} className="text-center mb-24 relative">
              <motion.h1 style={{ y: yHeroText1 }} className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-none mb-2">
                Trí tuệ nhân tạo.
              </motion.h1>
              <motion.h1 style={{ y: yHeroText2 }} className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-none text-zinc-600">
                Ẩm thực đích thực.
              </motion.h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium mt-12">
                Tải lên nguyên liệu của bạn. Hệ thống sẽ phân tích và đề xuất lộ trình nấu ăn tinh gọn, hoàn hảo.
              </p>
            </motion.div>

            {/* UPLOAD & CONFIG SECTION */}
            <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-8">
                <div 
                  onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  className={`relative h-[500px] rounded-[2rem] border flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${isDragging ? "border-white bg-white/5 scale-[0.98]" : "border-white/10 bg-[#0A0A0A] hover:border-white/20"}`}
                >
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50">
                      <div className="w-12 h-12 border border-zinc-600 border-t-white rounded-full animate-spin mb-6" />
                      <p className="text-xs font-bold tracking-widest uppercase text-white animate-pulse">Processing Data...</p>
                    </div>
                  )}

                  {isWebcamActive ? (
                    <div className="absolute inset-0 bg-black">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-4">
                        <button onClick={capturePhoto} className="px-8 py-3 bg-white text-black rounded-full text-sm font-semibold hover:scale-105 transition-transform">Chụp</button>
                        <button onClick={stopWebcam} className="px-8 py-3 bg-black/50 text-white border border-white/20 rounded-full text-sm font-semibold backdrop-blur-md hover:bg-white/10 transition-colors">Hủy</button>
                      </div>
                    </div>
                  ) : uploadedImage ? (
                    <div className="absolute inset-0 group">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button onClick={() => { setUploadedImage(null); setImageFile(null); }} className="px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 transition-transform">
                          Xóa & Thử lại
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-8 z-10">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${isDragging ? "bg-white text-black" : "bg-white/5 border border-white/5 text-zinc-400"}`}>
                        <ImagePlus className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Thả ảnh vào đây</h3>
                      <p className="text-sm text-zinc-500 mb-10">Hỗ trợ định dạng JPG, PNG, WEBP</p>
                      
                      <div className="flex gap-3">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
                          Duyệt tệp
                        </button>
                        <button onClick={startWebcam} className="px-6 py-3 bg-[#0A0A0A] border border-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                          <Camera className="w-4 h-4" /> Camera
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[#0A0A0A] rounded-[2rem] p-8 flex-1 border border-white/5 flex flex-col">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Mục tiêu bữa ăn</h3>
                  <div className="flex flex-col gap-3">
                    {mealTimes.map((time) => (
                      <button key={time} onClick={() => setMealTime(time)} className={`px-6 py-4 rounded-2xl text-sm font-semibold transition-all border ${mealTime === time ? "bg-white text-black border-white" : "bg-[#0A0A0A] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handlePrepareAnalyze} disabled={!imageFile || isProcessing || !mealTime} className="w-full py-5 rounded-full bg-white text-black text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                  Phân tích dữ liệu <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* RESULTS SECTION - CINEMATIC SLIDER EFFECT */}
            <AnimatePresence>
              {showResults && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="mt-32">
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                      <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Kết quả đề xuất.</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-[#0A0A0A] rounded-full text-xs font-semibold text-zinc-400 border border-white/10">Detect Log:</span>
                        {detectedDetails.map((item, idx) => (
                          <span key={idx} className="px-4 py-2 bg-white/5 rounded-full text-xs font-medium text-white border border-white/5 flex items-center gap-2">
                            {item.name} <span className="text-zinc-500">{item.confidence}%</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Slider */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 hide-scrollbar w-full">
                    {suggestedRecipes.map((recipe, idx) => (
                      <motion.div 
                        key={recipe.id} 
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }} 
                        onClick={() => handleViewRecipeDetail(recipe)}
                        className="min-w-[85vw] md:min-w-[450px] snap-center shrink-0 group cursor-pointer"
                      >
                        <div className="relative h-[500px] rounded-[2rem] overflow-hidden bg-[#0A0A0A] border border-white/5 mb-6">
                          <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                          
                          <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                            <h3 className="text-3xl font-bold text-white mb-3 leading-tight">{recipe.name}</h3>
                            <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                              <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-white" /> {recipe.calories} kcal</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-white" /> {recipe.cookTime} min</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Modal Xác nhận */}
          <AnimatePresence>
            {showConfirmModal && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">Xác nhận cấu hình</h3>
                      <button onClick={() => setShowConfirmModal(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-8 space-y-8">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-4">Chế độ ăn</label>
                        <div className="flex flex-wrap gap-2">
                          {dietOptions.map((opt) => (
                            <button key={opt} onClick={() => toggleDiet(opt)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${userDiet.includes(opt) ? "bg-white text-black border-white" : "bg-transparent text-zinc-400 border-white/10 hover:border-white/30"}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-4">Dị ứng / Loại trừ</label>
                        <div className="flex gap-2 mb-4">
                          <input type="text" value={allergenInput} onChange={(e) => setAllergenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAllergen()} placeholder="Thêm nguyên liệu..." className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none transition-colors" />
                          <button onClick={addAllergen} className="px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {userAllergens.map((a) => (
                            <span key={a} className="px-3 py-1.5 bg-white/5 border border-white/10 text-zinc-300 rounded-full text-xs font-medium flex items-center gap-1.5">
                              {a} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setUserAllergens(userAllergens.filter(i => i !== a))} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-white/5 flex gap-3">
                      <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3.5 rounded-full text-zinc-400 font-semibold hover:text-white hover:bg-white/5 transition-colors text-sm">Hủy</button>
                      <button onClick={handleConfirmAndAnalyze} className="flex-1 py-3.5 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors text-sm">Thực thi</button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </AnimatedPage>
    </ReactLenis>
  );
}