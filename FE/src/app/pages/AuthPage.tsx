import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
    User,
    Lock,
    ArrowRight,
    Sparkles,
    ChefHat,
    Loader2,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage } from "../components/AnimatedPage"; // Giả sử bạn có wrapper này

export function AuthPage() {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Form states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Status states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!username || !password) {
            setError("Vui lòng điền đầy đủ thông tin.");
            setIsLoading(false);
            return;
        }

        try {
            if (isLoginMode) {
                // ... (Phần code đăng nhập giữ nguyên) ...
                const formData = new URLSearchParams();
                formData.append("username", username);
                formData.append("password", password);

                const res = await axios.post("http://localhost:8000/auth/login", formData, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                });

                localStorage.setItem("access_token", res.data.access_token);
                navigate("/");

            } else {
                // --- CẬP NHẬT: LUỒNG ĐĂNG KÝ VÀ THIẾT LẬP HỒ SƠ ---
                if (password !== confirmPassword) {
                    setError("Mật khẩu xác nhận không khớp.");
                    setIsLoading(false);
                    return;
                }

                // 1. Gọi API Đăng ký
                await axios.post("http://localhost:8000/auth/register", {
                    username,
                    password
                });

                // 2. Tự động Đăng nhập luôn (để lấy Token)
                const formData = new URLSearchParams();
                formData.append("username", username);
                formData.append("password", password);
                const loginRes = await axios.post("http://localhost:8000/auth/login", formData, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                });

                // 3. Lưu Token vào máy
                localStorage.setItem("access_token", loginRes.data.access_token);

                // 4. Thông báo và đẩy người dùng thẳng sang trang Profile
                alert("Đăng ký thành công! Hãy thiết lập hồ sơ dinh dưỡng của bạn.");
                navigate("/profile");
            }
        } catch (err: any) {
            console.error("Lỗi xác thực:", err);
            setError(
                err.response?.data?.detail ||
                "Có lỗi xảy ra, vui lòng kiểm tra kết nối server."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError(null);
        setPassword("");
        setConfirmPassword("");
    };

    // Variants cho Framer Motion (hiệu ứng trượt và mờ)
    const formVariants = {
        hidden: { opacity: 0, x: isLoginMode ? -50 : 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: isLoginMode ? 50 : -50, transition: { duration: 0.3 } }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 p-4">

                {/* HIỆU ỨNG BACKGROUND ORBS (Chấm sáng mờ ảo) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />

                <div className="w-full max-w-md relative z-10">
                    {/* Logo & Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-6">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                            Smart Chef <span className="text-cyan-400">AI</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Khám phá thực đơn vô tận từ tủ lạnh của bạn
                        </p>
                    </motion.div>

                    {/* Form Container (Glassmorphism) */}
                    <div className="glass rounded-3xl p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden">

                        {/* Thanh loading trang trí ở trên cùng */}
                        {isLoading && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                                <div className="h-full bg-cyan-400 animate-pulse w-full origin-left" />
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLoginMode ? "login" : "register"}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex items-center gap-2 mb-8">
                                    <Sparkles className="w-5 h-5 text-cyan-400" />
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        {isLoginMode ? "Đăng Nhập" : "Tạo Tài Khoản"}
                                    </h2>
                                </div>

                                {error && (
                                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Input Username */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Tên đăng nhập"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Input Password */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mật khẩu"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Input Confirm Password (Chỉ hiện khi đăng ký) */}
                                    {!isLoginMode && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="relative group overflow-hidden"
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Xác nhận mật khẩu"
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                            />
                                        </motion.div>
                                    )}

                                    {/* Nút Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative py-3.5 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-70 mt-4 shadow-lg shadow-cyan-500/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-gradient transition-all group-hover:bg-[100%_0]" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    {isLoginMode ? "Đăng Nhập Ngay" : "Hoàn Tất Đăng Ký"}
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Toggle Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={toggleMode}
                            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            {isLoginMode ? "Bạn chưa có tài khoản?" : "Đã có tài khoản?"}
                            <span className="text-cyan-400 font-bold border-b border-transparent hover:border-cyan-400 transition-all">
                                {isLoginMode ? "Đăng ký" : "Đăng nhập"}
                            </span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Kế thừa CSS gradient từ Home */}
            <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
        </AnimatedPage>
    );
}