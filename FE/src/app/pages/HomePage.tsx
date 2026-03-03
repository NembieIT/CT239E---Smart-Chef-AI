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
  SearchX
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

// BỔ SUNG: Interface cho dữ liệu nhận diện
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Recipe setup states
  const [mealTime, setMealTime] = useState<MealTime>(null);
  const [dietModes, setDietModes] = useState<DietMode[]>([]);
  const [allergens, setAllergens] = useState<AllergenItem[]>([]);

  // Allergen input states
  const [allergenInput, setAllergenInput] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("Nhẹ");

  // Results states
  const [showResults, setShowResults] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<SuggestedRecipe[]>([]);

  // BỔ SUNG: State lưu nguyên liệu nhận diện để hiển thị
  const [detectedDetails, setDetectedDetails] = useState<DetectedDetail[]>([]);

  // 1. Xử lý File
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 2. Xử lý Setup Logic
  const toggleDietMode = (mode: DietMode) => {
    setDietModes(prev =>
      prev.includes(mode)
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const handleAddAllergen = () => {
    const trimmedInput = allergenInput.trim();
    if (!trimmedInput) return;

    const isExist = allergens.some(
      (a) => a.name.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (!isExist) {
      setAllergens([...allergens, { name: trimmedInput, severity: selectedSeverity }]);
    }

    setAllergenInput("");
    setSelectedSeverity("Nhẹ");
  };

  const removeAllergen = (name: string) => {
    setAllergens(allergens.filter(a => a.name !== name));
  };

  // 3. Xử lý Phân tích (Submit FormData)
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
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { details, suggestions } = res.data;

      // BỔ SUNG: Cập nhật UI nguyên liệu nhận diện
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
      // Bạn có thể thêm alert thông báo lỗi ở đây nếu muốn
    } finally {
      // BỔ SUNG BẮT BUỘC: Tắt trạng thái loading
      setIsProcessing(false);
    }
  };

  // Data helpers
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

  const getSeverityGlow = (severity: Severity) => {
    switch (severity) {
      case "Nặng": return "shadow-red-500/50";
      case "Trung bình": return "shadow-orange-500/50";
      case "Nhẹ": return "shadow-yellow-500/50";
    }
  };

  return (
    <AnimatedPage>
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 uppercase">
            Đăng tải hình ảnh
          </h1>
          <p className="text-gray-400">
            Đăng tải hình ảnh và chúng tôi sẽ phân tích cho bạn thực đơn phù hợp
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A. Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative glass rounded-3xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-800/60 p-8 text-center group glow-hover cursor-pointer"
          >
            {isProcessing && (
              <div className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center z-10 bg-slate-900/80">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <Upload className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-6 text-lg font-medium text-cyan-200">
                  Đang phân tích dữ liệu...
                </p>
              </div>
            )}

            {uploadedImage && !isProcessing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Box chứa ảnh */}
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 inline-block w-full max-w-sm">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-auto max-h-64 object-cover"
                  />
                  {detectedDetails.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* KẾT QUẢ NHẬN DIỆN HIỂN THỊ DƯỚI ẢNH */}
                {detectedDetails.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {detectedDetails.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2 px-3 py-1.5 glass border border-cyan-500/40 rounded-xl"
                      >
                        <span className="text-sm font-bold text-cyan-300 capitalize">{item.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-800/60 rounded-md text-emerald-400 font-medium">
                          {item.confidence}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Nút đăng tải ảnh khác */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setImageFile(null);
                      setDetectedDetails([]);
                      setShowResults(false);
                    }}
                    className="cursor-pointer px-6 py-2 glass hover:bg-cyan-500/20 rounded-full text-sm font-medium transition-colors text-cyan-300 border border-cyan-500/30"
                  >
                    Đăng tải ảnh khác
                  </button>
                </div>
              </motion.div>
            ) : !isProcessing ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl mb-4 group-hover:scale-110 transition-transform border border-cyan-500/30 glow-cyan">
                  <Upload className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Thả hình ảnh của bạn vào đây</h3>
                <p className="text-gray-400 mb-4 text-sm">hoặc bấm vào Chọn hình ảnh</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg opacity-0 group-hover/btn:opacity-70 transition-opacity" />
                    <Upload className="w-4 h-4 text-white relative z-10" />
                    <span className="text-white relative z-10 text-sm">Chọn hình ảnh</span>
                  </motion.button>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-2.5 glass border-2 border-cyan-500/30 text-cyan-300 rounded-xl font-medium hover:bg-cyan-500/10 transition-all text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Chụp ảnh
                  </motion.button>
                </div>
                <p className="mt-4 text-xs text-gray-600">Định dạng hỗ trợ: JPG, PNG, WebP (Tối đa 10MB)</p>
              </>
            ) : null}
          </motion.div>

          {/* B. Setup Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-3xl p-8 border border-cyan-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Thiết lập đề xuất</h2>
            </div>

            <div className="space-y-6">
              {/* Meal Time */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-3 block">Buổi ăn</label>
                <div className="flex gap-2">
                  {mealTimes.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMealTime(time)}
                      className={`cursor-pointer flex-1 px-4 py-2.5 rounded-full font-medium transition-all ${mealTime === time
                        ? "bg-gradient-to-r bg-blue-600 text-white shadow-lg shadow-cyan-800/50"
                        : "glass text-gray-400 hover:text-cyan-300 border border-white"
                        }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Diet Mode */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-3 block">Chế độ ăn</label>
                <div className="flex flex-wrap gap-2">
                  {dietOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = dietModes.includes(option.name);
                    return (
                      <motion.button
                        key={option.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDietMode(option.name)}
                        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isSelected
                          ? "glass border-2 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/30"
                          : "glass text-gray-400 hover:text-cyan-300 border border-cyan-500/20"
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? option.color : ""}`} />
                        <span className="text-sm">{option.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Thực phẩm dị ứng */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-3 block">Thực phẩm dị ứng</label>

                {allergens.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {allergens.map((allergen) => (
                      <motion.div
                        key={allergen.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getSeverityColor(allergen.severity)} ${getSeverityGlow(allergen.severity)} shadow-lg`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-sm font-medium">{allergen.name}</span>
                        <span className="text-xs opacity-75">({allergen.severity})</span>
                        <button
                          onClick={() => removeAllergen(allergen.name)}
                          className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="text"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAllergen()}
                    placeholder="Nhập thực phẩm dị ứng..."
                    className="w-full px-4 py-2.5 bg-transparent glass rounded-xl border border-cyan-500/20 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
                  />

                  <AnimatePresence>
                    {allergenInput.trim().length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <div className="flex gap-2">
                          {(["Nhẹ", "Trung bình", "Nặng"] as Severity[]).map((severity) => (
                            <button
                              key={severity}
                              onClick={() => setSelectedSeverity(severity)}
                              className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedSeverity === severity
                                ? getSeverityColor(severity)
                                : "glass text-gray-500 hover:text-gray-300 border border-cyan-500/10 hover:border-cyan-500/30"
                                }`}
                            >
                              {severity}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={handleAddAllergen}
                          className="w-full py-2.5 flex items-center justify-center gap-2 glass border border-cyan-500/30 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Thêm "{allergenInput.trim()}"</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={!imageFile || isProcessing}
                className="cursor-pointer relative w-full py-4 rounded-2xl font-bold text-white overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {/* BỔ SUNG: Class animate-gradient để background chuyển động */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-gradient" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-500 blur-xl opacity-0 group-hover/btn:opacity-50 transition-opacity" />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span className="uppercase">Phân tích và Đề xuất công thức</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Công thức đề xuất</h2>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* BỔ SUNG LẠI: HIỂN THỊ NGUYÊN LIỆU NHẬN DIỆN ĐƯỢC Ở ĐÂY CHO RÕ RÀNG */}
              {detectedDetails.length > 0 && (
                <div className="glass p-4 rounded-2xl border border-cyan-500/20 mb-6">
                  <p className="text-sm text-gray-400 mb-2">💡 Đã nhận diện được trong ảnh:</p>
                  <div className="flex flex-wrap gap-2">
                    {detectedDetails.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium">
                        {item.name} <span className="text-xs opacity-70">({item.confidence}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* KIỂM TRA ĐIỀU KIỆN ĐỂ HIỂN THỊ MÓN ĂN HOẶC THÔNG BÁO TRỐNG */}
              {suggestedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="glass rounded-3xl overflow-hidden border border-cyan-500/20 glow-hover"
                    >
                      <div className="relative h-48">
                        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white mb-1">{recipe.name}</h3>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-start gap-2 p-3 glass rounded-xl border border-green-500/20">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-300">{recipe.reason}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="glass rounded-xl p-3 border border-cyan-500/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span className="text-xs text-gray-400">Calories</span>
                            </div>
                            <p className="text-xl font-bold text-white">{recipe.calories}</p>
                          </div>
                          <div className="glass rounded-xl p-3 border border-cyan-500/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs text-gray-400">Thời gian</span>
                            </div>
                            <p className="text-xl font-bold text-white">{recipe.cookTime} phút</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Protein</span>
                              <span className="text-blue-400 font-medium">{recipe.protein}g</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${recipe.protein}%` }}
                                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Carbs</span>
                              <span className="text-yellow-400 font-medium">{recipe.carbs}g</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${recipe.carbs}%` }}
                                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Fat</span>
                              <span className="text-pink-400 font-medium">{recipe.fat}g</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${recipe.fat}%` }}
                                transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* NHỚ SỬ DỤNG navigate ĐÃ VIẾT Ở BƯỚC TRƯỚC */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                          className="cursor-pointer w-full py-3 glass border border-cyan-500/30 rounded-xl text-cyan-300 font-medium hover:bg-cyan-500/10 transition-all"
                        >
                          Xem chi tiết
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* GIAO DIỆN KHI KHÔNG TÌM THẤY CÔNG THỨC */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-3xl p-12 text-center border-2 border-dashed border-cyan-500/30"
                >
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
                    <SearchX className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Chưa tìm thấy món ăn phù hợp</h3>
                  <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                    Rất tiếc, hệ thống không thể tìm ra công thức nào đáp ứng được các nguyên liệu và thiết lập khắt khe của bạn. Vui lòng thử lại với hình ảnh khác hoặc nới lỏng các yêu cầu chế độ ăn nhé!
                  </p>
                  <button
                    onClick={() => {
                      setDietModes([]);
                      setAllergens([]);
                      setShowResults(false);
                    }}
                    className="cursor-pointer mt-6 px-6 py-2.5 glass border border-cyan-500/30 text-cyan-300 rounded-xl font-medium hover:bg-cyan-500/10 transition-all"
                  >
                    Xoá các bộ lọc khắt khe
                  </button>
                </motion.div>
              )}
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
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </AnimatedPage>
  );
}