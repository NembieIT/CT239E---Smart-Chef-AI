import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import axios from "axios";
import { Search, Loader2, ArrowRight, Flame, Clock, ChefHat } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

export function SearchRecipe() {
    const [searchParams] = useSearchParams();
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

                // Mông má lại dữ liệu
                const p = rawRecipe.nutrition?.protein || 0;
                const c = rawRecipe.nutrition?.carbs || 0;
                const f = rawRecipe.nutrition?.fat || 0;

                setRecipe({
                    id: `search-${Date.now()}`,
                    name: rawRecipe.name,
                    reason: rawRecipe.reason,
                    cookingTime: rawRecipe.cookingTime || 30,
                    calories: Math.round((p * 4) + (c * 4) + (f * 9)) || 350,
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", // Ảnh đồ ăn đẹp
                    ingredientsList: rawRecipe.ingredients,
                    instructions: rawRecipe.instructions
                });
            } else {
                setError("Không tìm thấy kết quả phù hợp.");
            }
        } catch (err) {
            console.error(err);
            setError("Hệ thống AI đang quá tải hoặc có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="p-8 min-h-screen max-w-5xl mx-auto">

                {/* Tiêu đề trang */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 mb-6">
                        <Search className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        Kết quả tìm kiếm cho: <span className="text-cyan-400">"{query}"</span>
                    </h1>
                </motion.div>

                {/* Trạng thái Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border border-cyan-500/20">
                        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-6" />
                        <p className="text-lg text-cyan-200 font-bold animate-pulse uppercase tracking-widest">
                            Đầu bếp AI đang soạn công thức...
                        </p>
                    </div>
                )}

                {/* Trạng thái Lỗi / Trống */}
                {error && !isLoading && (
                    <div className="text-center py-20 glass rounded-3xl border border-red-500/20">
                        <ChefHat className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-red-400 text-lg font-medium">{error}</p>
                    </div>
                )}

                {/* Trạng thái Thành công (Hiển thị thẻ công thức) */}
                {!isLoading && recipe && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-3xl overflow-hidden border border-cyan-500/30 flex flex-col md:flex-row group"
                    >
                        {/* Ảnh bên trái */}
                        <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden shrink-0">
                            <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/90 hidden md:block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent md:hidden" />
                        </div>

                        {/* Thông tin bên phải */}
                        <div className="p-8 flex-1 flex flex-col">
                            <h2 className="text-3xl font-bold text-white mb-2">{recipe.name}</h2>
                            <p className="text-cyan-400 text-sm italic mb-6">"{recipe.reason}"</p>

                            <div className="flex gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <Flame className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Năng lượng</p>
                                        <p className="text-lg font-bold text-white">{recipe.calories} kcal</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                        <Clock className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Thời gian</p>
                                        <p className="text-lg font-bold text-white">{recipe.cookingTime} phút</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nút Xem chi tiết truyền thẳng recipe */}
                            <div className="mt-auto">
                                <Link
                                    to={`/recipe/${recipe.id}`}
                                    state={{ recipe: recipe }}
                                    className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/30 group/btn"
                                >
                                    Xem quy trình nấu chi tiết
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatedPage>
    );
}