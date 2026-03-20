import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Search, ChevronLeft, ChevronRight, Clock, Flame, ArrowRight, Plus, X, Loader2, Sparkles, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";

const ITEMS_PER_PAGE = 6;
const DIET_OPTIONS = ["Gym", "Giảm cân", "Bệnh", "Ăn lành mạnh", "Ăn chay"];

export function RecipesPage() {
  const navigate = useNavigate(); 

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [dietModes, setDietModes] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [allergenInput, setAllergenInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(generatedRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecipes = generatedRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddIngredient = (e?: React.KeyboardEvent) => { if (e && e.key !== 'Enter') return; const val = ingredientInput.trim(); if (val && !ingredients.includes(val)) setIngredients([...ingredients, val]); setIngredientInput(""); };
  const handleAddAllergen = (e?: React.KeyboardEvent) => { if (e && e.key !== 'Enter') return; const val = allergenInput.trim(); if (val && !allergens.includes(val)) setAllergens([...allergens, val]); setAllergenInput(""); };
  const toggleDietMode = (mode: string) => { setDietModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]); };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return alert("Vui lòng nhập ít nhất 1 nguyên liệu.");
    setIsGenerating(true); setHasSearched(true);
    try {
      const res = await axios.post("http://localhost:8000/recipe/generate", { ingredients, dietModes, allergens });
      const mappedRecipes = (res.data.suggestions || []).map((recipe: any, index: number) => {
        const p = recipe.nutrition?.protein || 0; const c = recipe.nutrition?.carbs || 0; const f = recipe.nutrition?.fat || 0;
        return {
          id: `ai-gen-${Date.now()}-${index}`, 
          name: recipe.name, 
          reason: recipe.reason, 
          cookingTime: recipe.cookingTime || 15,
          calories: Math.round((p * 4) + (c * 4) + (f * 9)) || 250, 
          protein: p,
          carbs: c,
          fat: f,
          image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500",
          ingredientsList: recipe.ingredients, 
          instructions: recipe.instructions
        };
      });
      setGeneratedRecipes(mappedRecipes); setCurrentPage(1);
    } catch (err) { alert("Có lỗi khi tạo công thức."); } finally { setIsGenerating(false); }
  };

  // LƯU LỊCH SỬ TRƯỚC KHI CHUYỂN TRANG
  const handleViewRecipeDetail = async (recipe: any) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await axios.post('http://localhost:8000/save-history', {
          input_data: { dietModes, allergens },
          detected_ingredients: ingredients, // Lưu chính xác mảng nguyên liệu user vừa gõ
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

  return (
    <ReactLenis root>
      <AnimatedPage>
        <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black font-sans pb-32">
          
          <div className="fixed inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

          <section className="relative z-10 max-w-6xl mx-auto pt-20 px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Sáng tạo <span className="text-zinc-500">công thức.</span></h1>
              <p className="text-zinc-400 text-lg max-w-2xl">Cung cấp nguyên liệu bạn có, hệ thống sẽ sử dụng thuật toán để tổng hợp các công thức món ăn tối ưu nhất.</p>
            </motion.div>

            {/* Form Input Hiện Đại */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 mb-16 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12">
                
                {/* Nguyên liệu */}
                <div>
                  <label className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Search className="w-4 h-4 text-zinc-400" /> Nhập nguyên liệu</label>
                  <div className="relative mb-6">
                    <input type="text" value={ingredientInput} onChange={(e) => setIngredientInput(e.target.value)} onKeyDown={handleAddIngredient} placeholder="VD: Thịt bò, cà chua..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-white/30 outline-none transition-all placeholder:text-zinc-600" />
                    <button onClick={() => handleAddIngredient()} className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-colors"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map(ing => (
                      <span key={ing} className="px-4 py-2 bg-white/10 border border-white/5 rounded-full text-sm text-white flex items-center gap-2 group">
                        {ing} <X className="w-3.5 h-3.5 text-zinc-400 cursor-pointer group-hover:text-white transition-colors" onClick={() => setIngredients(ingredients.filter(i => i !== ing))} />
                      </span>
                    ))}
                    {ingredients.length === 0 && <span className="text-sm text-zinc-600">Chưa có nguyên liệu nào.</span>}
                  </div>
                </div>

                {/* Tùy chỉnh (Settings) */}
                <div className="space-y-8 md:border-l md:border-white/10 md:pl-12">
                  <div>
                    <label className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4 text-zinc-400" /> Chế độ ăn</label>
                    <div className="flex flex-wrap gap-2">
                      {DIET_OPTIONS.map((opt) => (
                        <button key={opt} onClick={() => toggleDietMode(opt)} className={`px-4 py-2 text-sm rounded-full transition-all border ${dietModes.includes(opt) ? "bg-white text-black border-white font-medium" : "bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white mb-4 block">Kiêng kỵ / Dị ứng</label>
                    <input type="text" value={allergenInput} onChange={(e) => setAllergenInput(e.target.value)} onKeyDown={handleAddAllergen} placeholder="VD: Đậu phộng..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-white/30 outline-none mb-4 transition-colors" />
                    <div className="flex flex-wrap gap-2">
                      {allergens.map(al => (
                        <span key={al} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                          {al} <X className="w-3 h-3 cursor-pointer hover:text-red-300" onClick={() => setAllergens(allergens.filter(a => a !== al))} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex justify-end">
                <button onClick={handleGenerate} disabled={isGenerating || ingredients.length === 0} className="w-full md:w-auto px-10 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {isGenerating ? "Đang xử lý..." : "Phân tích & Đề xuất"}
                </button>
              </div>
            </motion.div>

            {/* Kết Quả */}
            {hasSearched && !isGenerating && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-8">Kết quả đề xuất</h2>
                {currentRecipes.length > 0 ? (
                  <>
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {currentRecipes.map((recipe, index) => (
                        <motion.div 
                          key={recipe.id} 
                          variants={fadeInUp} 
                          custom={index} 
                          className="bg-white/[0.02] border border-white/10 hover:border-white/[0.05] rounded-3xl overflow-hidden group transition-all flex flex-col cursor-pointer" 
                          // SỰ KIỆN GỌI HÀM LƯU LỊCH SỬ THAY VÌ NAVIGATE TRỰC TIẾP
                          onClick={() => handleViewRecipeDetail(recipe)}
                        >
                          <div className="relative h-56 overflow-hidden">
                            <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
                          </div>
                          
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{recipe.name}</h3>
                            <p className="text-sm text-zinc-500 mb-6 line-clamp-2">"{recipe.reason}"</p>
                            
                            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                              <div className="flex gap-4">
                                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> {recipe.calories} kcal</span>
                                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {recipe.cookingTime} min</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-10 h-10 border border-white/10 rounded-full flex justify-center items-center disabled:opacity-30 hover:bg-white/5 text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button key={idx + 1} onClick={() => setCurrentPage(idx + 1)} className={`w-10 h-10 text-sm font-medium rounded-full transition-colors ${currentPage === idx + 1 ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                            {idx + 1}
                          </button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-10 h-10 border border-white/10 rounded-full flex justify-center items-center disabled:opacity-30 hover:bg-white/5 text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 border border-white/10 rounded-3xl text-center">
                    <p className="text-zinc-500">Không tìm thấy công thức phù hợp với dữ liệu đầu vào.</p>
                  </div>
                )}
              </motion.div>
            )}
          </section>
        </div>
      </AnimatedPage>
    </ReactLenis>
  );
}