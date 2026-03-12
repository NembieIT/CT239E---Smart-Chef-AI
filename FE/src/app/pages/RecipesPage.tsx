import { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Search, ChevronLeft, ChevronRight, Clock, Flame, ArrowRight, ChefHat, Plus, X, Loader2, Sparkles, Dumbbell, Scale, Heart, Salad, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

const ITEMS_PER_PAGE = 6;

// Định nghĩa các lựa chọn chế độ ăn
const DIET_OPTIONS = [
  { name: "Gym", icon: Dumbbell, color: "text-orange-400" },
  { name: "Giảm cân", icon: Scale, color: "text-green-400" },
  { name: "Bệnh", icon: Heart, color: "text-red-400" },
  { name: "Ăn lành mạnh", icon: Salad, color: "text-emerald-400" },
  { name: "Ăn chay", icon: Leaf, color: "text-lime-400" },
];

export function RecipesPage() {
  // 1. CÁC BIẾN LƯU TRỮ DỮ LIỆU ĐẦU VÀO (INPUT STATES)
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  
  const [dietModes, setDietModes] = useState<string[]>([]);
  
  const [allergens, setAllergens] = useState<string[]>([]);
  const [allergenInput, setAllergenInput] = useState("");

  // 2. CÁC BIẾN TRẠNG THÁI (UI STATES)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 3. CÁC BIẾN PHÂN TRANG (PAGINATION)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(generatedRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecipes = generatedRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- CÁC HÀM XỬ LÝ GIAO DIỆN THÊM/XÓA TAG ---
  const handleAddIngredient = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    const val = ingredientInput.trim();
    if (val && !ingredients.includes(val)) setIngredients([...ingredients, val]);
    setIngredientInput("");
  };

  const handleAddAllergen = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    const val = allergenInput.trim();
    if (val && !allergens.includes(val)) setAllergens([...allergens, val]);
    setAllergenInput("");
  };

  const toggleDietMode = (mode: string) => {
    setDietModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  };

  // --- HÀM GỌI API BACKEND ---
  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      alert("Vui lòng nhập ít nhất 1 nguyên liệu bạn đang có!");
      return;
    }

    setIsGenerating(true);
    setHasSearched(true);
    
    try {
      // Gọi sang API mình vừa viết bên Backend
      const res = await axios.post("http://localhost:8000/recipe/generate", {
        ingredients: ingredients,
        dietModes: dietModes,
        allergens: allergens
      });

      // Mông má lại dữ liệu (tính calo, thêm ảnh mặc định nếu thiếu)
      const mappedRecipes = (res.data.suggestions || []).map((recipe: any, index: number) => {
        const p = recipe.nutrition?.protein || 0;
        const c = recipe.nutrition?.carbs || 0;
        const f = recipe.nutrition?.fat || 0;
        const calories = Math.round((p * 4) + (c * 4) + (f * 9));

        return {
          id: `ai-gen-${Date.now()}-${index}`, // Tạo ID giả để điều hướng
          name: recipe.name,
          reason: recipe.reason,
          cookingTime: recipe.cookingTime || 15,
          calories: calories || 250,
          image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500", // Ảnh đồ ăn mặc định
          ingredientsList: recipe.ingredients,
          instructions: recipe.instructions
        };
      });

      setGeneratedRecipes(mappedRecipes);
      setCurrentPage(1); // Reset trang
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tạo công thức. Vui lòng thử lại!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="p-8 min-h-screen">
        {/* Background ngầu */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl top-20 right-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-20 left-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <section className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase italic tracking-tighter p-5">
              Bếp Trưởng AI
            </h1>
            <p className="text-gray-400 text-lg">Cho tôi biết bạn có gì, tôi sẽ nấu cho bạn món ngon nhất!</p>
          </motion.div>

          {/* KHU VỰC ĐIỀN THÔNG TIN (FORM) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 border border-cyan-500/20 mb-12 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Cột Trái: Nguyên liệu */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">
                  <ChefHat className="w-5 h-5" /> Nguyên liệu đang có (*)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={handleAddIngredient}
                    placeholder="VD: Thịt bò, Trứng, Cà chua... (Bấm Enter)"
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                  />
                  <button onClick={() => handleAddIngredient()} className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map(ing => (
                    <span key={ing} className="flex items-center gap-1 px-3 py-1.5 glass border border-cyan-500/30 rounded-lg text-sm text-cyan-100">
                      {ing} <X className="w-4 h-4 cursor-pointer hover:text-red-400" onClick={() => setIngredients(ingredients.filter(i => i !== ing))} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Cột Phải: Dị ứng & Chế độ ăn */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">Chế độ ăn (Tuỳ chọn)</label>
                  <div className="flex flex-wrap gap-2">
                    {DIET_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = dietModes.includes(opt.name);
                      return (
                        <button key={opt.name} onClick={() => toggleDietMode(opt.name)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isActive ? "glass border-cyan-500 text-cyan-300 shadow-md" : "border-white/5 text-gray-500 hover:border-white/20"}`}>
                          <Icon className={`w-4 h-4 ${isActive ? opt.color : ""}`} /> {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">Dị ứng / Kiêng kỵ (Tuỳ chọn)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={allergenInput}
                      onChange={(e) => setAllergenInput(e.target.value)}
                      onKeyDown={handleAddAllergen}
                      placeholder="VD: Đậu phộng, Sữa..."
                      className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-red-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map(al => (
                      <span key={al} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
                        {al} <X className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => setAllergens(allergens.filter(a => a !== al))} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-8">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || ingredients.length === 0}
                className="w-full md:w-auto md:min-w-[300px] mx-auto flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black text-white uppercase tracking-wider overflow-hidden group disabled:opacity-50 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-gradient" />
                <span className="relative z-10 flex items-center gap-2">
                  {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  {isGenerating ? "AI ĐANG NẤU ĂN..." : "PHÁT MINH MÓN MỚI"}
                </span>
              </button>
            </div>
          </motion.div>

          {/* KHU VỰC KẾT QUẢ CÔNG THỨC */}
          {hasSearched && !isGenerating && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">Kết Quả Từ AI</h2>
              {currentRecipes.length > 0 ? (
                <>
                  <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {currentRecipes.map((recipe, index) => (
                      <motion.div key={recipe.id} variants={fadeInUp} custom={index} whileHover={{ scale: 1.02, y: -5 }} className="glass rounded-3xl overflow-hidden glow-hover group flex flex-col border border-white/5">
                        <div className="relative h-48 overflow-hidden shrink-0">
                          <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-bold text-purple-100 mb-2 line-clamp-2">{recipe.name}</h3>
                          <p className="text-sm text-gray-400 italic mb-4 line-clamp-2">"{recipe.reason}"</p>

                          <div className="flex items-center gap-4 mb-6 mt-auto">
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span className="font-semibold text-white">{recipe.calories}</span> kcal
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Clock className="w-4 h-4 text-cyan-400" />
                              <span className="font-semibold text-white">{recipe.cookingTime}</span> phút
                            </div>
                          </div>

                          <Link
                            to={`/recipe/${recipe.id}`}
                            state={{ recipe: recipe }} 
                            className="relative flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold overflow-hidden group/btn bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white"
                          >
                            <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            <span className="relative z-10">Bắt đầu nấu</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Phân trang (Giữ nguyên logic cực mượt như cũ) */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-3 glass rounded-xl disabled:opacity-30">
                        <ChevronLeft className="w-5 h-5 text-cyan-400" />
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button key={idx + 1} onClick={() => setCurrentPage(idx + 1)} className={`w-11 h-11 rounded-xl font-bold border ${currentPage === idx + 1 ? "bg-cyan-500 text-white" : "glass text-gray-400"}`}>
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 glass rounded-xl disabled:opacity-30">
                        <ChevronRight className="w-5 h-5 text-cyan-400" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="glass p-8 text-center rounded-3xl">
                  <p className="text-gray-400">AI không tìm thấy món nào phù hợp. Bạn thử nhập thêm nguyên liệu khác xem sao!</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
      <style>{`
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
    </AnimatedPage>
  );
}