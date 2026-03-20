import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Clock, X, ChevronLeft, ChevronRight, Search, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { AnimatedPage } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

interface HistoryItem {
  id: string; image: string; detectedItems: number; timestamp: string; topIngredients: string[];
  recipe?: { name: string; calories: number; servings: number; ingredients: string[]; instructions: string[]; };
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentItems = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/auth");
    try {
      const res = await axios.get("http://localhost:8000/my-history", { headers: { Authorization: `Bearer ${token}` } });
      const formattedHistory: HistoryItem[] = (res.data.history || []).map((item: any) => {
        const firstRecipe = item.suggestions?.[0];
        const dateObj = new Date(item.timestamp);
        return {
          id: item._id, image: firstRecipe?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
          detectedItems: item.detected_ingredients?.length || 0,
          timestamp: `${dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · ${dateObj.toLocaleDateString('vi-VN')}`,
          topIngredients: item.detected_ingredients?.slice(0, 3) || [],
          recipe: firstRecipe ? { name: firstRecipe.name, calories: Math.round(((firstRecipe.nutrition?.protein||0)*4)+((firstRecipe.nutrition?.carbs||0)*4)+((firstRecipe.nutrition?.fat||0)*9)) || 250, servings: firstRecipe.servings || 2, ingredients: firstRecipe.ingredientsList || [], instructions: firstRecipe.instructions || [] } : undefined
        };
      });
      setHistory(formattedHistory);
    } catch (err) {} finally { setIsLoading(false); }
  };

  return (
    <ReactLenis root>
      <AnimatedPage>
        <div className="relative min-h-screen bg-[#000000] text-white p-6 md:p-10 pb-32">
          <div className="max-w-6xl mx-auto pt-10">
            
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Lịch sử hoạt động</h1>
                <p className="text-zinc-500 text-sm">Quản lý và xem lại các phân tích nguyên liệu trước đây.</p>
              </div>
              <div className="text-sm font-medium text-zinc-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                Tổng: {history.length} bản ghi
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center"><Activity className="w-8 h-8 text-zinc-500 animate-spin" /></div>
            ) : history.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentItems.map((item) => (
                    <motion.div key={item.id} whileHover={{ y: -4 }} onClick={() => setSelectedItem(item)} className="bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors rounded-3xl overflow-hidden cursor-pointer group flex flex-col">
                      <div className="relative h-48">
                        <ImageWithFallback src={item.image} alt="Scan" className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-zinc-400" /> {item.timestamp.split(' · ')[0]}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-semibold text-white mb-3 line-clamp-1">{item.recipe?.name || "Chưa xác định"}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {item.topIngredients.map((ing, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/5 text-zinc-400 rounded-md text-[10px] font-medium border border-white/5">{ing}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-sm font-medium text-zinc-400 mx-4">{currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                )}
              </>
            ) : (
               <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02]">
                 <Search className="w-8 h-8 text-zinc-600 mx-auto mb-4" />
                 <p className="text-zinc-500">Chưa có dữ liệu lịch sử.</p>
               </div>
            )}
          </div>

          {/* Modal Modal (Clean Design) */}
          <AnimatePresence>
            {selectedItem && selectedItem.recipe && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-[#09090b] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto custom-scrollbar shadow-2xl">
                    <div className="sticky top-0 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between z-10">
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedItem.recipe.name}</h2>
                        <p className="text-zinc-500 text-xs mt-1">{selectedItem.timestamp}</p>
                      </div>
                      <button onClick={() => setSelectedItem(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="p-8">
                      <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="w-full md:w-1/3 h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                          <img src={selectedItem.image} alt={selectedItem.recipe.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-6">
                           <div className="flex gap-6">
                             <div>
                               <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Calo</p>
                               <p className="text-2xl font-bold">{selectedItem.recipe.calories}</p>
                             </div>
                             <div>
                               <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Khẩu phần</p>
                               <p className="text-2xl font-bold">{selectedItem.recipe.servings} người</p>
                             </div>
                           </div>
                           <div>
                             <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest font-semibold">Nguyên liệu phát hiện</p>
                             <div className="flex flex-wrap gap-2">
                               {selectedItem.recipe.ingredients.map((ing, i) => (
                                 <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-xs text-zinc-300">{ing}</span>
                               ))}
                             </div>
                           </div>
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
    </ReactLenis>
  );
}