import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Upload, Camera, Flame, Clock, Dumbbell, Scale, Heart, Leaf, Salad, AlertTriangle, X, Plus, Sparkles, RefreshCw, CheckCircle2, UserCircle, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage } from "../components/AnimatedPage";

type MealTime = "Sáng" | "Trưa" | "Tối" | null;
type DietMode = "Gym" | "Giảm cân" | "Bệnh" | "Ăn lành mạnh" | "Ăn chay";

export function HomePage() {
  const navigate = useNavigate();

  // States File, Camera & DRAG DROP
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // STATE MỚI CHO KÉO THẢ

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States Giao diện chính & Thông tin cá nhân
  const [mealTime, setMealTime] = useState<MealTime>(null);
  const [userDiet, setUserDiet] = useState<string[]>([]);
  const [userAllergens, setUserAllergens] = useState<string[]>([]);
  const [allergenInput, setAllergenInput] = useState("");

  // States Modal Xác Nhận & Kết quả
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);
  const [detectedDetails, setDetectedDetails] = useState<any[]>([]);

  // LẤY THÔNG TIN CÁ NHÂN KHI VÀO TRANG
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:8000/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserDiet(res.data.diet_modes || []);
        setUserAllergens(res.data.allergens || []);
      } catch (err) {
        console.error("Lỗi lấy thông tin:", err);
      }
    };
    fetchProfile();
  }, []);

  // LOGIC CAMERA
  const startWebcam = async () => {
    setIsWebcamActive(true); setUploadedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) { videoRef.current.srcObject = stream; streamRef.current = stream; }
    } catch (err) { setIsWebcamActive(false); alert("Lỗi camera"); }
  };
  const stopWebcam = () => { if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop()); setIsWebcamActive(false); };
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas"); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d"); ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg"); setUploadedImage(dataUrl);
      fetch(dataUrl).then(res => res.blob()).then(blob => { setImageFile(new File([blob], "capture.jpg", { type: "image/jpeg" })); });
      stopWebcam();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chỉ tải lên tệp hình ảnh!");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true); // Khi ảnh lướt vào hộp -> Bật trạng thái kéo
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false); // Khi ảnh lướt ra khỏi hộp -> Tắt trạng thái
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false); // Tắt trạng thái kéo
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handlePrepareAnalyze = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập để sử dụng tính năng AI!");
      navigate("/auth");
      return;
    }
    if (!imageFile) return;
    setShowConfirmModal(true);
  };

  const handleConfirmAndAnalyze = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    const token = localStorage.getItem("access_token");

    try {
      await axios.put('http://localhost:8000/auth/me/preferences',
        { diet_modes: userDiet, allergens: userAllergens },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (err) { console.error("Không thể lưu thiết lập", err); }

    const requestData = { mealTime, dietModes: userDiet, allergens: userAllergens };
    const formData = new FormData();
    formData.append("file", imageFile!);
    formData.append("data", JSON.stringify(requestData));

    try {
      const res = await axios.post('http://localhost:8000/detect-ingredients', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });

      setDetectedDetails(res.data.details || []);

      const mappedRecipes = (res.data.suggestions || []).map((recipe: any, index: number) => {
        // 1. Trích xuất các giá trị dinh dưỡng để tính toán và dự phòng (fallback)
        const protein = recipe.nutrition?.protein || 0;
        const carbs = recipe.nutrition?.carbs || 0;
        const fat = recipe.nutrition?.fat || 0;

        // 2. Tính toán Calo dựa trên chỉ số dinh dưỡng thực tế từ AI
        const cal = Math.round((protein * 4) + (carbs * 4) + (fat * 9));

        return {
          id: String(index + 1),
          name: recipe.name,
          reason: recipe.reason,
          calories: cal > 0 ? cal : (recipe.calories || 0), // Ưu tiên calo tính toán được
          cookTime: recipe.cookingTime || 15,
          image: recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",

          // Đảm bảo các trường này được truyền đi đầy đủ
          ingredientsList: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          nutrition: {
            protein: protein,
            carbs: carbs,
            fat: fat
          },
          servings: recipe.servings || 2
        };
      });

      // Sau đó nhớ set state cho recipes của bạn (ví dụ: setRecipes(mappedRecipes))
      setSuggestedRecipes(mappedRecipes);
      setShowResults(true);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("access_token");
        navigate("/auth");
      } else {
        alert("Có lỗi xảy ra khi phân tích. Vui lòng thử lại.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewRecipeDetail = async (recipe: any) => {
    const token = localStorage.getItem("access_token");

    // Gọi API lưu lịch sử ngầm (Không cần await để chờ nó xong, cứ cho nó chạy ngầm)
    if (token) {
      axios.post('http://localhost:8000/save-history', {
        input_data: { mealTime, dietModes: userDiet, allergens: userAllergens },
        detected_ingredients: detectedDetails.map(d => d.name),
        selected_recipe: recipe
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Lỗi lưu lịch sử:", err));
    }

    // Chuyển sang trang chi tiết ngay lập tức
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  // Helpers Modal
  const toggleDiet = (mode: string) => setUserDiet(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  const addAllergen = () => { if (allergenInput.trim() && !userAllergens.includes(allergenInput.trim())) setUserAllergens([...userAllergens, allergenInput.trim()]); setAllergenInput(""); };

  const mealTimes: MealTime[] = ["Sáng", "Trưa", "Tối"];
  const dietOptions = [{ name: "Gym", icon: Dumbbell, color: "text-orange-400" }, { name: "Giảm cân", icon: Scale, color: "text-green-400" }, { name: "Bệnh", icon: Heart, color: "text-red-400" }, { name: "Ăn lành mạnh", icon: Salad, color: "text-emerald-400" }, { name: "Ăn chay", icon: Leaf, color: "text-lime-400" }];

  return (
    <AnimatedPage>
      <div className="p-8 space-y-8 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2 uppercase italic tracking-tighter">Đăng tải hình ảnh</h1>
          <p className="text-gray-400">Chụp ảnh nguyên liệu để nhận thực đơn AI (Tùy biến theo hồ sơ của bạn)</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* KHU VỰC UPLOAD - ĐÃ GẮN SỰ KIỆN KÉO THẢ */}
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 text-center min-h-[450px] flex flex-col justify-center items-center transition-all duration-300
              ${isDragging ? "bg-cyan-500/20 border-cyan-400 scale-[1.02]" : "glass border-cyan-500/30"}
            `}
          >
            {isProcessing && (
              <div className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center z-50 bg-slate-900/90">
                <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                <p className="mt-6 text-lg font-medium text-cyan-200 animate-pulse">AI đang quét và phân tích hồ sơ...</p>
              </div>
            )}

            {isWebcamActive ? (
              <div className="w-full space-y-4">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-2xl scale-x-[-1]" />
                <div className="flex gap-4 justify-center">
                  <button onClick={capturePhoto} className="px-8 py-3 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-400">Chụp</button>
                  <button onClick={stopWebcam} className="px-6 py-3 glass text-red-400 rounded-xl hover:bg-red-500/10">Hủy</button>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                <img src={uploadedImage} alt="Captured" className="w-full max-w-sm rounded-2xl shadow-lg shadow-cyan-500/20" />
                <button onClick={() => { setUploadedImage(null); setImageFile(null); }} className="px-6 py-2 glass text-cyan-300 rounded-full hover:bg-cyan-500/20">Đổi ảnh khác</button>
              </div>
            ) : (
              <>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isDragging ? "bg-cyan-400 text-white scale-110" : "bg-cyan-500/10 text-cyan-400"}`}>
                  {isDragging ? <ImagePlus className="w-12 h-12 animate-bounce" /> : <Upload className="w-10 h-10" />}
                </div>

                <h3 className={`text-2xl font-bold mb-2 transition-colors ${isDragging ? "text-cyan-300" : "text-white"}`}>
                  {isDragging ? "THẢ ẢNH VÀO ĐÂY" : "KÉO THẢ NGUYÊN LIỆU"}
                </h3>
                <p className="text-gray-400 mb-8 text-sm">hoặc bấm vào nút bên dưới để chọn ảnh</p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                    Chọn ảnh
                  </button>
                  <button onClick={startWebcam} className="flex-1 py-3 glass border border-cyan-500/40 text-cyan-300 rounded-xl font-bold hover:bg-cyan-500/20 transition-all">
                    Mở Camera
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {/* KHU VỰC THIẾT LẬP */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-8 border border-cyan-500/20 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Bối cảnh bữa ăn</h2>
                <p className="text-sm text-gray-400">Các tùy chọn cá nhân được lấy từ hồ sơ của bạn</p>
              </div>
            </div>

            <div className="space-y-8 flex-1">
              <div>
                <label className="text-sm font-bold text-cyan-500/60 uppercase tracking-widest mb-4 block">Món này dành cho buổi nào?</label>
                <div className="flex gap-4">
                  {mealTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setMealTime(time)}
                      className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all border ${mealTime === time ? "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30" : "glass text-gray-500 border-white/5 hover:border-cyan-500/30 hover:text-cyan-300"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handlePrepareAnalyze}
              disabled={!imageFile || isProcessing || !mealTime}
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white relative overflow-hidden group disabled:opacity-30 mt-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-gradient" />
              <span className="relative z-10 flex items-center justify-center gap-2">Phân tích nguyên liệu</span>
            </button>
          </motion.div>
        </div>

        {/* MODAL XÁC NHẬN */}
        <AnimatePresence>
          {showConfirmModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40" />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass rounded-3xl w-full max-w-xl border border-cyan-500/30 bg-slate-900/90 overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><UserCircle className="text-cyan-400" /> Xác nhận Hồ sơ Dinh dưỡng</h3>
                    <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-white"><X /></button>
                  </div>

                  <div className="p-8 space-y-6">
                    <p className="text-gray-300 text-sm">Hệ thống sẽ dùng cấu hình này để tạo món ăn. Bạn có thể thay đổi nhanh tại đây (sẽ được lưu lại cho lần sau).</p>

                    <div>
                      <label className="text-xs font-bold text-cyan-500 uppercase tracking-widest block mb-3">Chế độ ăn hiện tại</label>
                      <div className="flex flex-wrap gap-2">
                        {dietOptions.map((opt) => {
                          const active = userDiet.includes(opt.name);
                          return (
                            <button key={opt.name} onClick={() => toggleDiet(opt.name)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${active ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "border-white/10 text-gray-500"}`}>
                              {opt.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">Thực phẩm Dị ứng / Kiêng kỵ</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {userAllergens.length === 0 && <span className="text-sm text-gray-500 italic">Chưa có dữ liệu</span>}
                        {userAllergens.map((a) => (
                          <span key={a} className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
                            {a} <X className="w-3 h-3 cursor-pointer" onClick={() => setUserAllergens(userAllergens.filter(item => item !== a))} />
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={allergenInput} onChange={(e) => setAllergenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAllergen()} placeholder="Nhập tên thực phẩm..." className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-red-500 outline-none" />
                        <button onClick={addAllergen} className="p-2 glass text-red-400 rounded-xl hover:bg-red-500/20"><Plus className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950/50 flex gap-4">
                    <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 glass rounded-xl text-gray-300 font-bold hover:text-white">Hủy</button>
                    <button onClick={handleConfirmAndAnalyze} className="flex-1 py-3 bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/30 flex justify-center items-center gap-2">
                      <Sparkles className="w-5 h-5" /> Bắt đầu nấu
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* KẾT QUẢ PHÂN TÍCH */}
        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 pt-10 border-t border-cyan-500/10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Công thức đề xuất</h2>
                <button onClick={() => setShowResults(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              {/* Hộp hiển thị danh sách nguyên liệu AI nhận diện được */}
              <div className="glass p-6 rounded-2xl border border-cyan-500/20 mb-6">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">AI đã nhận diện được:</h3>
                <div className="flex flex-wrap gap-2">
                  {detectedDetails.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 glass border border-cyan-500/40 rounded-xl text-cyan-100 text-sm font-bold shadow-sm">
                      {item.name} <span className="text-emerald-400 ml-1">{item.confidence}%</span>
                    </span>
                  ))}
                  {detectedDetails.length === 0 && <span className="text-gray-500 italic text-sm">Không nhận diện được nguyên liệu rõ ràng nào.</span>}
                </div>
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
                        onClick={() => handleViewRecipeDetail(recipe)}
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
    </AnimatedPage>
  );
}