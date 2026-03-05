import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Upload,
  Camera,
  Flame,
  Clock,
  Dumbbell,
  Scale,
  Heart,
  Leaf,
  Salad,
  AlertTriangle,
  X,
  CheckCircle2,
  Plus,
  Sparkles,
  SearchX,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage } from "../components/AnimatedPage";

type MealTime = "Sáng" | "Trưa" | "Tối" | null;
type DietMode = "Gym" | "Giảm cân" | "Bệnh" | "Ăn lành mạnh" | "Ăn chay";
type Severity = "Nhẹ" | "Trung bình" | "Nặng";

interface AllergenItem {
  name: string;
  severity: Severity;
}

interface SuggestedRecipe {
  id: string;
  name: string;
  reason: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookTime: number;
  image: string;
  ingredientsList: string[];
  instructions: string[];
}

interface DetectedDetail {
  name: string;
  confidence: number;
}

export function HomePage() {
  const navigate = useNavigate();
  
  // File states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Webcam states
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recipe setup states
  const [mealTime, setMealTime] = useState<MealTime>(null);
  const [dietModes, setDietModes] = useState<DietMode[]>([]);
  const [allergens, setAllergens] = useState<AllergenItem[]>([]);
  const [allergenInput, setAllergenInput] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("Nhẹ");

  // Results states
  const [showResults, setShowResults] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<SuggestedRecipe[]>([]);
  const [detectedDetails, setDetectedDetails] = useState<DetectedDetail[]>([]);

  // 1. Logic Webcam
  const startWebcam = async () => {
    setIsWebcamActive(true);
    setUploadedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Không thể mở camera:", err);
      setIsWebcamActive(false);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsWebcamActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      
      const dataUrl = canvas.toDataURL("image/jpeg");
      setUploadedImage(dataUrl);
      
      // Chuyển dataUrl thành file để xử lý logic gửi API
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "webcam_capture.jpg", { type: "image/jpeg" });
          setImageFile(file);
        });
        
      stopWebcam();
    }
  };

  // 2. Xử lý File (Upload)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // 3. Xử lý Setup Logic
  const toggleDietMode = (mode: DietMode) => {
    setDietModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  };

  const handleAddAllergen = () => {
    const trimmedInput = allergenInput.trim();
    if (!trimmedInput) return;
    if (!allergens.some((a) => a.name.toLowerCase() === trimmedInput.toLowerCase())) {
      setAllergens([...allergens, { name: trimmedInput, severity: selectedSeverity }]);
    }
    setAllergenInput("");
    setSelectedSeverity("Nhẹ");
  };

  const removeAllergen = (name: string) => setAllergens(allergens.filter(a => a.name !== name));

  // 4. Xử lý Phân tích
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsProcessing(true);

    const requestData = {
      mealTime: mealTime || null,
      dietModes: dietModes,
      allergens: allergens
    };

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("data", JSON.stringify(requestData));

    try {
      const res = await axios.post('http://localhost:8000/detect-ingredients', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { details, suggestions } = res.data;
      setDetectedDetails(details || []);

      const mappedRecipes: SuggestedRecipe[] = (suggestions || []).map((recipe: any, index: number) => {
        const protein = recipe.nutrition?.protein || 0;
        const carbs = recipe.nutrition?.carbs || 0;
        const fat = recipe.nutrition?.fat || 0;
        const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);

        return {
          id: String(index + 1),
          name: recipe.name || "Món ăn chưa đặt tên",
          reason: recipe.reason || "Phù hợp với nguyên liệu của bạn",
          calories: Math.round(calculatedCalories),
          protein: protein,
          carbs: carbs,
          fat: fat,
          cookTime: recipe.cookingTime || 15,
          image: recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
          ingredientsList: recipe.ingredients || [],
          instructions: recipe.instructions || []
        };
      });

      setSuggestedRecipes(mappedRecipes);
      setShowResults(true);
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helpers
  const mealTimes: MealTime[] = ["Sáng", "Trưa", "Tối"];
  const dietOptions: { name: DietMode; icon: any; color: string }[] = [
    { name: "Gym", icon: Dumbbell, color: "text-orange-400" },
    { name: "Giảm cân", icon: Scale, color: "text-green-400" },
    { name: "Bệnh", icon: Heart, color: "text-red-400" },
    { name: "Ăn lành mạnh", icon: Salad, color: "text-emerald-400" },
    { name: "Ăn chay", icon: Leaf, color: "text-lime-400" },
  ];

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "Nặng": return "bg-red-500/20 border-red-500/40 text-red-300";
      case "Trung bình": return "bg-orange-500/20 border-orange-500/40 text-orange-300";
      case "Nhẹ": return "bg-yellow-500/20 border-yellow-500/40 text-yellow-300";
    }
  };

  return (
    <AnimatedPage>
      <div className="p-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2 uppercase italic tracking-tighter">Đăng tải hình ảnh</h1>
          <p className="text-gray-400">Chụp hoặc tải ảnh nguyên liệu để nhận thực đơn AI cá nhân hóa</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A. Upload/Camera Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative glass rounded-3xl border-2 border-dashed border-cyan-500/30 p-8 text-center group min-h-[450px] flex flex-col justify-center items-center overflow-hidden"
          >
            {isProcessing && (
              <div className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center z-50 bg-slate-900/90">
                <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                <p className="mt-6 text-lg font-medium text-cyan-200 animate-pulse">Đang quét nguyên liệu...</p>
              </div>
            )}

            {/* UI CHẾ ĐỘ CAMERA ĐANG MỞ */}
            {isWebcamActive ? (
              <div className="w-full space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover scale-x-[-1]" />
                  <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent border-t-cyan-500/20 border-b-cyan-500/20 flex items-center justify-center">
                    <div className="w-48 h-48 border border-cyan-500/30 rounded-full animate-ping opacity-20" />
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button onClick={capturePhoto} className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/40">
                    <Camera className="w-5 h-5" /> Bấm để chụp
                  </button>
                  <button onClick={stopWebcam} className="px-6 py-3 glass border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-all">
                    Hủy
                  </button>
                </div>
              </div>
            ) : uploadedImage ? (
              /* UI HIỂN THỊ ẢNH ĐÃ CHỌN/CHỤP */
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 w-full">
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 inline-block w-full max-w-sm">
                  <img src={uploadedImage} alt="Captured" className="w-full h-auto max-h-64 object-cover" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {detectedDetails.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 glass border border-cyan-500/40 rounded-xl text-cyan-300 text-sm font-bold">
                      {item.name} <span className="text-emerald-400 ml-1">{item.confidence}%</span>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => { setUploadedImage(null); setImageFile(null); setDetectedDetails([]); setShowResults(false); }}
                  className="px-6 py-2 glass hover:bg-cyan-500/20 rounded-full text-sm font-medium text-cyan-300 border border-cyan-500/30 transition-colors"
                >
                  Sử dụng hình ảnh khác
                </button>
              </motion.div>
            ) : (
              /* UI TRẠNG THÁI TRỐNG */
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-500/10 rounded-3xl mb-6 border border-cyan-500/30 glow-cyan group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 italic tracking-tight">THẢ NGUYÊN LIỆU VÀO ĐÂY</h3>
                <p className="text-gray-400 mb-8 text-sm">Hệ thống AI sẽ tự động nhận diện thành phần</p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-bold shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    <Upload className="w-4 h-4" /> Chọn ảnh
                  </button>
                  <button
                    onClick={startWebcam}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass border border-cyan-500/40 text-cyan-300 rounded-xl font-bold hover:bg-cyan-500/10 transition-all"
                  >
                    <Camera className="w-4 h-4" /> Mở Camera
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {/* B. Setup Card (Giữ nguyên logic của bạn) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-8 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Thiết lập đề xuất</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-cyan-500/60 uppercase tracking-widest mb-3 block">Buổi ăn</label>
                <div className="flex gap-2">
                  {mealTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setMealTime(time)}
                      className={`flex-1 py-2.5 rounded-xl font-bold transition-all border ${mealTime === time ? "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20" : "glass text-gray-500 border-white/5 hover:border-cyan-500/30"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-cyan-500/60 uppercase tracking-widest mb-3 block">Chế độ ăn</label>
                <div className="flex flex-wrap gap-2">
                  {dietOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = dietModes.includes(opt.name);
                    return (
                      <button
                        key={opt.name}
                        onClick={() => toggleDietMode(opt.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${active ? "glass border-cyan-500/50 text-cyan-300 shadow-md" : "glass text-gray-500 border-white/5"}`}
                      >
                        <Icon className={`w-4 h-4 ${active ? opt.color : ""}`} /> {opt.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-cyan-500/60 uppercase tracking-widest mb-3 block">Thực phẩm dị ứng</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {allergens.map((a) => (
                    <div key={a.name} className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold ${getSeverityColor(a.severity)}`}>
                      <AlertTriangle className="w-3 h-3" /> {a.name}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeAllergen(a.name)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    placeholder="Ví dụ: Đậu phộng, Hải sản..."
                    className="flex-1 bg-slate-900/50 border border-cyan-500/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  />
                  <button onClick={handleAddAllergen} className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/20">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!imageFile || isProcessing}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-white relative overflow-hidden group disabled:opacity-30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-gradient" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Phân tích nguyên liệu"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Results Section (Giữ nguyên logic của bạn) */}
        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 pt-10 border-t border-cyan-500/10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Công thức đề xuất</h2>
                <button onClick={() => setShowResults(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedRecipes.map((recipe) => (
                  <motion.div key={recipe.id} whileHover={{ y: -5 }} className="glass rounded-3xl overflow-hidden border border-white/5 group">
                    <div className="relative h-52">
                      <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-bold text-white tracking-tight">{recipe.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-orange-400 font-bold bg-orange-400/10 px-2 py-1 rounded-md">
                            <Flame className="w-3 h-3" /> {recipe.calories} kcal
                          </span>
                          <span className="flex items-center gap-1 text-xs text-cyan-400 font-bold bg-cyan-400/10 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> {recipe.cookTime} phút
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-400 text-sm italic mb-6">"{recipe.reason}"</p>
                      <button 
                        onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                        className="w-full py-3 glass border border-cyan-500/20 rounded-xl text-cyan-300 font-bold hover:bg-cyan-500/10 transition-all uppercase text-xs tracking-widest"
                      >
                        Xem quy trình chế biến
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .glow-cyan { box-shadow: 0 0 20px rgba(6, 182, 212, 0.15); }
      `}</style>
    </AnimatedPage>
  );
}