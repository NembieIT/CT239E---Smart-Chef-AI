import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { User, Lock, Loader2, AlertCircle, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "../components/AnimatedPage";

export function AuthPage() {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); setError(null); setIsLoading(true);
        if (!username || !password) { setError("Vui lòng điền đủ thông tin."); setIsLoading(false); return; }

        try {
            if (isLoginMode) {
                const formData = new URLSearchParams(); formData.append("username", username); formData.append("password", password);
                const res = await axios.post("http://localhost:8000/auth/login", formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
                localStorage.setItem("access_token", res.data.access_token); navigate("/");
            } else {
                if (password !== confirmPassword) { setError("Mật khẩu không khớp."); setIsLoading(false); return; }
                await axios.post("http://localhost:8000/auth/register", { username, password });
                const formData = new URLSearchParams(); formData.append("username", username); formData.append("password", password);
                const loginRes = await axios.post("http://localhost:8000/auth/login", formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
                localStorage.setItem("access_token", loginRes.data.access_token); navigate("/profile");
            }
        } catch (err: any) { setError(err.response?.data?.detail || "Lỗi kết nối."); } finally { setIsLoading(false); }
    };

    const toggleMode = () => { setIsLoginMode(!isLoginMode); setError(null); setPassword(""); setConfirmPassword(""); };

    return (
        <AnimatedPage>
            <div className="min-h-screen flex items-center justify-center bg-[#000000] p-6 text-white font-sans">
                <div className="w-full max-w-[400px]">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
                            <ChefHat className="w-6 h-6 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {isLoginMode ? "Đăng nhập" : "Tạo tài khoản"}
                        </h1>
                        <p className="text-zinc-500 text-sm">Trải nghiệm Smart Chef AI System.</p>
                    </motion.div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
                        <AnimatePresence mode="wait">
                            <motion.form key={isLoginMode ? "login" : "reg"} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="space-y-4">
                                
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-6">
                                        <AlertCircle className="w-4 h-4 shrink-0" /> <p>{error}</p>
                                    </div>
                                )}

                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tên đăng nhập" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all" />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all" />
                                </div>

                                {!isLoginMode && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="relative group overflow-hidden">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all" />
                                    </motion.div>
                                )}

                                <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white text-black font-semibold rounded-2xl mt-4 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {isLoginMode ? "Đăng nhập" : "Đăng ký"}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        <div className="mt-6 text-center">
                            <button onClick={toggleMode} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                {isLoginMode ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                                <span className="font-semibold text-white">
                                    {isLoginMode ? "Tạo ngay" : "Đăng nhập"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}