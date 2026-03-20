import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Flame, Coffee, Sun, Moon, Loader2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";

export function MealPlanPage() {
    const [weeklyPlan, setWeeklyPlan] = useState<any[] | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { fetchSavedPlan(); }, []);

    const fetchSavedPlan = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return setError("Vui lòng xác thực tài khoản.");
        setIsFetching(true);
        try {
            const res = await axios.get("http://localhost:8000/recipe/weekly-plan", { headers: { Authorization: `Bearer ${token}` } });
            setWeeklyPlan(res.data.weekly_plan);
        } catch (err) { setError("Không thể tải lộ trình."); } finally { setIsFetching(false); }
    };

    const generateNewPlan = async () => {
        const token = localStorage.getItem("access_token");
        setIsGenerating(true); setError(null);
        try {
            const res = await axios.post("http://localhost:8000/recipe/weekly-plan", {}, { headers: { Authorization: `Bearer ${token}` } });
            setWeeklyPlan(res.data.weekly_plan);
        } catch (err) { setError("Lỗi khi tạo lộ trình mới."); } finally { setIsGenerating(false); }
    };

    return (
        <ReactLenis root>
            <AnimatedPage>
                <div className="relative min-h-screen bg-[#000000] text-white p-6 md:p-10 font-sans pb-32">
                    <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10 pt-10">
                        {/* HEADER */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Lộ trình <span className="text-zinc-500">của bạn.</span></h1>
                                <p className="text-zinc-400 text-sm">Thực đơn 7 ngày được cá nhân hóa dựa trên dữ liệu sức khỏe.</p>
                            </div>

                            {weeklyPlan && (
                                <button onClick={generateNewPlan} disabled={isGenerating} className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white hover:text-black transition-all flex items-center gap-2 disabled:opacity-50 text-sm">
                                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    {isGenerating ? "Đang xử lý..." : "Tạo lộ trình mới"}
                                </button>
                            )}
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {isFetching ? (
                                <motion.div key="fetching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-32 text-zinc-500">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                    <p className="text-sm font-medium">Đang tải dữ liệu...</p>
                                </motion.div>
                            ) : isGenerating ? (
                                <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-32 text-center">
                                    <Sparkles className="w-10 h-10 text-white mb-6 animate-pulse" />
                                    <h3 className="text-2xl font-bold text-white mb-2">Đang thiết kế thực đơn</h3>
                                    <p className="text-zinc-400 text-sm">Quá trình này mất khoảng vài giây...</p>
                                </motion.div>
                            ) : error ? (
                                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/5 p-10 rounded-3xl border border-red-500/10 max-w-xl mx-auto mt-20 text-center">
                                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-400 font-medium mb-6">{error}</p>
                                    <button onClick={fetchSavedPlan} className="px-6 py-2.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors">Thử lại</button>
                                </motion.div>
                            ) : !weeklyPlan ? (
                                <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 bg-white/[0.02] rounded-[2rem] border border-white/10 max-w-3xl mx-auto">
                                    <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold text-white mb-4">Chưa có dữ liệu</h2>
                                    <p className="text-zinc-500 text-sm mb-8 px-8">Hệ thống chưa tìm thấy lộ trình nào cho bạn. Hãy tạo mới ngay bây giờ.</p>
                                    <button onClick={generateNewPlan} className="px-8 py-3.5 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                                        <Sparkles className="w-4 h-4" /> Bắt đầu tạo
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="content" variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {weeklyPlan.map((dayPlan, index) => (
                                        <motion.div key={index} variants={fadeInUp} className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors hover:bg-white/[0.04]">
                                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                                <h2 className="text-xl font-bold text-white">{dayPlan.day}</h2>
                                                <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {dayPlan.daily_total_calories} kcal</span>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { meal: dayPlan.meals.breakfast, icon: Coffee, title: "Bữa sáng" },
                                                    { meal: dayPlan.meals.lunch, icon: Sun, title: "Bữa trưa" },
                                                    { meal: dayPlan.meals.dinner, icon: Moon, title: "Bữa tối" }
                                                ].map((data, i) => (
                                                    <div key={i} className="group">
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                                                            <data.icon className="w-3.5 h-3.5" /> {data.title}
                                                        </div>
                                                        <p className="text-white font-medium text-sm leading-snug mb-1 group-hover:text-zinc-300 transition-colors">{data.meal.name}</p>
                                                        <p className="text-xs text-zinc-500">{data.meal.calories} kcal</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </AnimatedPage>
        </ReactLenis>
    );
}