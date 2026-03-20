import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { Search, Loader2, ArrowRight, Flame, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { AnimatedPage } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

export function SearchRecipe() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || ""; // Lấy từ khóa từ URL

    const [isLoading, setIsLoading] = useState(false);
    const [recipe, setRecipe] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query) {
            fetchRecipe(query);
        }
    }, [query]);

    const fetchRecipe = async (searchStr: string) => {
        setIsLoading(true);
        setError(null);
        setRecipe(null);

        try {
            const res = await axios.post("http://localhost:8000/recipe/search", {
                query: searchStr
            });

            const suggestions = res.data.suggestions;
            if (suggestions && suggestions.length > 0) {
                const rawRecipe = suggestions[0];

                // Map dữ liệu chuẩn để truyền sang Detail
                const p = rawRecipe.nutrition?.protein || 0;
                const c = rawRecipe.nutrition?.carbs || 0;
                const f = rawRecipe.nutrition?.fat || 0;
                const cal = Math.round((p * 4) + (c * 4) + (f * 9));

                setRecipe({
                    id: `search-${Date.now()}`,
                    name: rawRecipe.name,
                    reason: rawRecipe.reason,
                    cookingTime: rawRecipe.cookingTime || 30,
                    calories: cal || 350,
                    protein: p,
                    carbs: c,
                    fat: f,
                    image: rawRecipe.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
                    ingredientsList: rawRecipe.ingredients,
                    instructions: rawRecipe.instructions
                });
            } else {
                setError("Không tìm thấy kết quả phù hợp.");
            }
        } catch (err) {
            setError("Hệ thống đang quá tải. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    // HÀM LƯU LỊCH SỬ KHI CLICK XEM CHI TIẾT
    const handleViewRecipeDetail = async (recipe: any) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                await axios.post('http://localhost:8000/save-history', {
                    input_data: { query: query }, // Lưu lại từ khóa đã search
                    detected_ingredients: recipe.ingredientsList || [], 
                    selected_recipe: recipe
                }, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
            } catch (err) {
                console.error("Lỗi lưu lịch sử tìm kiếm:", err);
            }
        }
        navigate(`/recipe/${recipe.id}`, { state: { recipe } });
    };

    return (
        <ReactLenis root>
            <AnimatedPage>
                <div className="min-h-screen bg-[#000000] p-6 md:p-10 flex flex-col items-center justify-center text-white font-sans selection:bg-white selection:text-black relative">
                    <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

                    <div className="w-full max-w-4xl relative z-10">
                        
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
                            <h1 className="text-xl text-zinc-500 font-medium uppercase tracking-widest">Kết quả tìm kiếm</h1>
                            <p className="text-4xl md:text-5xl font-bold mt-3 tracking-tighter">"{query}"</p>
                        </motion.div>

                        {isLoading && (
                            <div className="flex flex-col items-center py-20">
                                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
                                <p className="text-zinc-500 text-sm font-medium animate-pulse uppercase tracking-widest">Đang truy xuất dữ liệu...</p>
                            </div>
                        )}

                        {error && !isLoading && (
                            <div className="py-20 text-center bg-[#0A0A0A] border border-white/5 rounded-[2rem]">
                                <Search className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-400 font-medium">{error}</p>
                                <button 
                                    onClick={() => navigate("/")}
                                    className="mt-6 text-sm text-white border-b border-white/20 hover:border-white transition-all pb-1"
                                >
                                    Quay lại trang chủ
                                </button>
                            </div>
                        )}

                        {!isLoading && recipe && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                className="bg-[#0A0A0A] rounded-[2.5rem] p-4 md:p-6 border border-white/5 flex flex-col md:flex-row gap-8 items-center shadow-2xl"
                            >
                                <div className="w-full md:w-1/2 h-[400px] rounded-[2rem] overflow-hidden shrink-0">
                                    <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-full object-cover filter brightness-90 contrast-110" />
                                </div>
                                
                                <div className="w-full md:w-1/2 pr-4 md:pr-10 py-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Suggestion</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">{recipe.name}</h2>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-10 italic">"{recipe.reason}"</p>
                                    
                                    <div className="flex gap-10 mb-12 border-t border-white/5 pt-8">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Flame className="w-3 h-3" /> Năng lượng</p>
                                            <p className="text-2xl font-bold">{recipe.calories}<span className="text-sm font-normal text-zinc-600 ml-1">kcal</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Chuẩn bị</p>
                                            <p className="text-2xl font-bold">{recipe.cookingTime}<span className="text-sm font-normal text-zinc-600 ml-1">phút</span></p>
                                        </div>
                                    </div>

                                    {/* NÚT CLICK ĐÃ ĐƯỢC THÊM LOGIC LƯU LỊCH SỬ */}
                                    <button 
                                        onClick={() => handleViewRecipeDetail(recipe)} 
                                        className="inline-flex items-center justify-center gap-3 w-full px-8 py-5 bg-white text-black text-sm font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
                                    >
                                        Xem quy trình chi tiết <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </AnimatedPage>
        </ReactLenis>
    );
}