import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Flame, Coffee, Sun, Moon, Loader2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";

export function MealPlanPage() {
    // weeklyPlan giờ có thể là null (chưa có)
    const [weeklyPlan, setWeeklyPlan] = useState<any[] | null>(null);
    const [isFetching, setIsFetching] = useState(true); // Loading khi chui vào DB lấy
    const [isGenerating, setIsGenerating] = useState(false); // Loading khi nhờ AI nghĩ
    const [error, setError] = useState<string | null>(null);

    // 1. TỰ ĐỘNG CHẠY: Vào DB lấy lộ trình cũ
    useEffect(() => {
        fetchSavedPlan();
    }, []);

    const fetchSavedPlan = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return setError("Vui lòng đăng nhập để xem lộ trình!");

        setIsFetching(true);
        try {
            // Gọi API GET (Cực nhanh)
            const res = await axios.get("http://localhost:8000/recipe/weekly-plan", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeeklyPlan(res.data.weekly_plan); // Sẽ là array hoặc null
        } catch (err) {
            setError("Không thể kết nối đến máy chủ. Vui lòng tải lại trang.");
        } finally {
            setIsFetching(false);
        }
    };

    // 2. KHI BẤM NÚT: Xóa cái cũ, gọi AI tạo cái mới
    const generateNewPlan = async () => {
        const token = localStorage.getItem("access_token");
        setIsGenerating(true);
        setError(null);
        try {
            // Gọi API POST (Phải đợi AI nghĩ)
            const res = await axios.post("http://localhost:8000/recipe/weekly-plan", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeeklyPlan(res.data.weekly_plan);
        } catch (err) {
            setError("AI đang quá tải, không thể tạo lộ trình mới lúc này. Vui lòng thử lại sau.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="p-8 max-w-7xl mx-auto min-h-screen">
                {/* Tiêu đề & Nút Tạo mới */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                            <Calendar className="text-cyan-400 w-10 h-10" /> Lộ trình ăn uống
                        </h1>
                        <p className="text-gray-400 mt-2">Thực đơn được AI thiết kế riêng dựa theo hồ sơ sức khỏe của bạn</p>
                    </div>

                    {/* Chỉ hiện nút tạo lại nếu đã có plan */}
                    {weeklyPlan && (
                        <button
                            onClick={generateNewPlan}
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl text-cyan-400 font-bold hover:bg-cyan-500/20 transition-all border border-cyan-500/30 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            {isGenerating ? "Đang tạo mới..." : "Tạo lộ trình mới"}
                        </button>
                    )}
                </motion.div>

                {/* XỬ LÝ CÁC TRẠNG THÁI HIỂN THỊ */}
                <AnimatePresence mode="wait">
                    {/* Trạng thái 1: Đang lấy dữ liệu từ DB (Chớp nhoáng) */}
                    {isFetching ? (
                        <motion.div key="fetching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                            <p className="text-cyan-300 font-medium tracking-widest uppercase">Đang tải dữ liệu của bạn...</p>
                        </motion.div>
                    )

                        /* Trạng thái 2: Đang chờ AI thiết kế (Lâu hơn) */
                        : isGenerating ? (
                            <motion.div key="generating" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
                                    <Sparkles className="w-20 h-20 text-cyan-300 relative z-10 animate-bounce mb-6" />
                                </div>
                                <p className="text-xl text-white font-black tracking-widest uppercase mb-2">Chuyên gia AI đang lập kế hoạch</p>
                                <p className="text-cyan-400">Đang tính toán dinh dưỡng 7 ngày tiếp theo...</p>
                            </motion.div>
                        )

                            /* Trạng thái 3: Lỗi */
                            : error ? (
                                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-10 rounded-3xl text-center border border-red-500/20 max-w-lg mx-auto mt-20">
                                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                                    <p className="text-red-400 mb-6 font-medium">{error}</p>
                                    <button onClick={fetchSavedPlan} className="px-6 py-2 glass text-white rounded-xl hover:bg-white/10 border border-white/20">Tải lại trang</button>
                                </motion.div>
                            )

                                /* Trạng thái 4: CHƯA CÓ LỘ TRÌNH (Tài khoản mới toanh) */
                                : !weeklyPlan ? (
                                    <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 glass rounded-3xl border border-cyan-500/20 max-w-2xl mx-auto mt-10">
                                        <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Calendar className="w-12 h-12 text-cyan-400" />
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">Bạn chưa có Lộ trình ăn!</h2>
                                        <p className="text-gray-400 mb-10 px-8">Hãy để Bếp trưởng AI phân tích hồ sơ dinh dưỡng của bạn và thiết kế một thực đơn hoàn hảo cho cả tuần.</p>
                                        <button onClick={generateNewPlan} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                                            <Sparkles className="w-6 h-6" /> Bắt đầu tạo lộ trình
                                        </button>
                                    </motion.div>
                                )

                                    /* Trạng thái 5: ĐÃ CÓ LỘ TRÌNH (Render ra lịch) */
                                    : (
                                        <motion.div key="content" variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {weeklyPlan.map((dayPlan, index) => (
                                                <motion.div key={index} variants={fadeInUp} className="glass rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 group-hover:border-cyan-500/30 transition-colors">
                                                        <h2 className="text-2xl font-black text-white">{dayPlan.day}</h2>
                                                        <div className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 border border-orange-500/20">
                                                            <Flame className="w-4 h-4" /> {dayPlan.daily_total_calories} kcal
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Bữa sáng */}
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 relative overflow-hidden group-hover:bg-slate-800/50 transition-colors">
                                                            <div className="absolute top-0 right-0 p-2 opacity-10"><Coffee className="w-10 h-10 text-white" /></div>
                                                            <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">Bữa sáng</p>
                                                            <p className="text-white font-medium text-lg leading-tight mb-2 relative z-10">{dayPlan.meals.breakfast.name}</p>
                                                            <p className="text-sm text-gray-500 font-bold">{dayPlan.meals.breakfast.calories} kcal</p>
                                                        </div>

                                                        {/* Bữa trưa */}
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 relative overflow-hidden group-hover:bg-slate-800/50 transition-colors">
                                                            <div className="absolute top-0 right-0 p-2 opacity-10"><Sun className="w-10 h-10 text-white" /></div>
                                                            <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">Bữa trưa</p>
                                                            <p className="text-white font-medium text-lg leading-tight mb-2 relative z-10">{dayPlan.meals.lunch.name}</p>
                                                            <p className="text-sm text-gray-500 font-bold">{dayPlan.meals.lunch.calories} kcal</p>
                                                        </div>

                                                        {/* Bữa tối */}
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 relative overflow-hidden group-hover:bg-slate-800/50 transition-colors">
                                                            <div className="absolute top-0 right-0 p-2 opacity-10"><Moon className="w-10 h-10 text-white" /></div>
                                                            <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Bữa tối</p>
                                                            <p className="text-white font-medium text-lg leading-tight mb-2 relative z-10">{dayPlan.meals.dinner.name}</p>
                                                            <p className="text-sm text-gray-500 font-bold">{dayPlan.meals.dinner.calories} kcal</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
}