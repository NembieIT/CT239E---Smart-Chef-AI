import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Clock, Sparkles, X, Flame, Users, CheckCircle2, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

interface HistoryItem {
  id: string;
  image: string;
  detectedItems: number;
  timestamp: string;
  topIngredients: string[];
  recipe?: {
    name: string;
    calories: number;
    servings: number;
    ingredients: string[];
    instructions: string[];
  };
}

export function HistoryPage() {
  const navigate = useNavigate();
  
  // States quản lý dữ liệu và UI
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // LOGIC PHÂN TRANG (PAGINATION)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Cố định 10 món 1 trang

  // Tính toán số lượng trang và cắt mảng dữ liệu để hiển thị
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  // Gọi API lấy dữ liệu khi trang vừa render
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Vui lòng đăng nhập để xem lịch sử!");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8000/my-history", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rawHistory = res.data.history || [];
      const formattedHistory: HistoryItem[] = rawHistory.map((item: any) => {
        const firstRecipe = item.suggestions && item.suggestions.length > 0 ? item.suggestions[0] : null;
        
        let calculatedCalories = 0;
        if (firstRecipe && firstRecipe.nutrition) {
          calculatedCalories = 
            (firstRecipe.nutrition.protein * 4) + 
            (firstRecipe.nutrition.carbs * 4) + 
            (firstRecipe.nutrition.fat * 9);
        }

        const dateObj = new Date(item.timestamp);
        const formattedTime = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const formattedDate = dateObj.toLocaleDateString('vi-VN');
        return {
          id: item._id,
          image: firstRecipe?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
          detectedItems: item.detected_ingredients?.length || 0,
          timestamp: `${formattedTime} - ${formattedDate}`,
          topIngredients: item.detected_ingredients?.slice(0, 3) || [],
          recipe: firstRecipe ? {
            name: firstRecipe.name || "Món ăn chưa đặt tên",
            calories: Math.round(calculatedCalories) || 250,
            servings: firstRecipe.servings || 2,
            ingredients: firstRecipe.ingredientsList || [],
            instructions: firstRecipe.instructions || []
          } : undefined
        };
      });

      setHistory(formattedHistory);
      setCurrentPage(1); // Reset về trang 1 khi lấy dữ liệu mới
    } catch (err: any) {
      console.error("Lỗi khi tải lịch sử:", err);
      if (err.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("access_token");
        navigate("/auth");
      } else {
        setError("Không thể tải lịch sử lúc này. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="p-8 min-h-screen">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl top-20 left-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-20 right-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <section className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase italic tracking-tighter p-2">
              Lịch sử quét
            </h1>
            <div className="flex items-center gap-2 text-amber-400/80 bg-amber-400/5 border border-amber-400/20 px-4 py-2 rounded-xl w-fit mt-2">
              <AlertCircle className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Hệ thống chỉ lưu trữ 30 món ăn gần nhất
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
              <p className="text-cyan-300 animate-pulse">Đang đồng bộ dữ liệu của bạn...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-400">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p>{error}</p>
              <button onClick={fetchHistory} className="mt-4 px-6 py-2 glass border border-red-500/30 rounded-xl hover:bg-red-500/10">
                Thử lại
              </button>
            </div>
          ) : history.length > 0 ? (
            <>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    custom={index}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedItem(item)}
                    className="glass rounded-3xl overflow-hidden glow-hover cursor-pointer group border border-white/5 hover:border-cyan-500/30 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt="Thực phẩm đã quét"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full border border-white/10">
                        <div className="flex items-center gap-1 text-sm">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-cyan-100">
                            {item.detectedItems} món
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 font-medium">
                        <Clock className="w-4 h-4 text-cyan-500/50" />
                        {item.timestamp}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                        {item.recipe?.name || "Đã quét nguyên liệu"}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {item.topIngredients.map((ingredient, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-800/50 text-cyan-200 rounded-full text-xs font-bold border border-cyan-500/20"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {item.detectedItems > 3 && (
                          <span className="px-3 py-1 bg-slate-800/50 text-gray-400 rounded-full text-xs font-bold border border-white/5">
                            +{item.detectedItems - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 glass rounded-xl border border-cyan-500/20 disabled:opacity-30 hover:bg-cyan-500/20 transition-all text-cyan-400 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNumber = idx + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-11 h-11 rounded-xl font-bold transition-all border flex items-center justify-center ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                              : "glass text-gray-400 border-white/5 hover:border-cyan-500/50 hover:text-cyan-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-3 glass rounded-xl border border-cyan-500/20 disabled:opacity-30 hover:bg-cyan-500/20 transition-all text-cyan-400 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="glass rounded-3xl p-10 max-w-md mx-auto border border-cyan-500/20">
                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 italic tracking-tighter uppercase">
                  Chưa có lịch sử
                </h3>
                <p className="text-gray-400 mb-8">
                  Bắt đầu tải lên hình ảnh thực phẩm để nhận diện và xem lịch sử quét của bạn tại đây.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30"
                >
                  Quét món ăn ngay
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Modal chi tiết món ăn */}
        <AnimatePresence>
          {selectedItem && selectedItem.recipe && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50"
              />

              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-cyan-500/30 bg-slate-900/50"
                >
                  <div className="sticky top-0 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 px-8 py-6 flex items-center justify-between z-10">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                        {selectedItem.recipe.name}
                      </h2>
                      <p className="text-sm text-cyan-400 font-medium mt-1">
                        Đã quét lúc: {selectedItem.timestamp}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedItem(null)}
                      className="p-2 glass border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-full transition-all text-gray-400"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="p-8">
                    <div className="relative h-72 rounded-2xl overflow-hidden mb-8 border border-white/5">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.recipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-4 p-5 glass rounded-2xl border border-orange-500/20">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                          <Flame className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 font-medium">Năng lượng</p>
                          <p className="text-2xl font-black text-white">
                            {selectedItem.recipe.calories} <span className="text-lg text-orange-400">kcal</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 glass rounded-2xl border border-cyan-500/20">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 font-medium">Khẩu phần</p>
                          <p className="text-2xl font-black text-white">
                            {selectedItem.recipe.servings} <span className="text-lg text-cyan-400">người</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 uppercase italic tracking-tighter">
                        <Sparkles className="w-5 h-5 text-cyan-400" /> Nguyên liệu
                      </h3>
                      <div className="glass rounded-2xl p-6 border border-cyan-500/10">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedItem.recipe.ingredients.map((ingredient, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 text-gray-300"
                            >
                              <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="font-medium">{ingredient}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 uppercase italic tracking-tighter">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" /> Hướng dẫn thực hiện
                      </h3>
                      <div className="space-y-4">
                        {selectedItem.recipe.instructions.map((instruction, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-4 glass border border-white/5 hover:border-cyan-500/30 transition-colors rounded-2xl p-5"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                              {index + 1}
                            </div>
                            <p className="text-gray-300 flex-1 pt-1.5 leading-relaxed font-medium">
                              {instruction}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}