import { useState, useEffect } from "react";
import axios from "axios";
import { User, Dumbbell, Scale, Heart, Salad, Leaf, ShieldAlert, X, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { AnimatedPage } from "../components/AnimatedPage";

const DIET_OPTIONS = [
    { name: "Gym", icon: Dumbbell },
    { name: "Giảm cân", icon: Scale },
    { name: "Bệnh", icon: Heart },
    { name: "Ăn lành mạnh", icon: Salad },
    { name: "Ăn chay", icon: Leaf },
];

export function ProfilePage() {
    const [username, setUsername] = useState("");
    const [dietModes, setDietModes] = useState<string[]>([]);
    const [allergens, setAllergens] = useState<string[]>([]);
    const [allergenInput, setAllergenInput] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:8000/auth/me", { headers: { Authorization: `Bearer ${token}` } });
            setUsername(res.data.username); setDietModes(res.data.diet_modes || []); setAllergens(res.data.allergens || []);
        } catch (err) {} finally { setIsLoading(false); }
    };

    const handleSave = async () => {
        const token = localStorage.getItem("access_token");
        setIsSaving(true);
        try {
            await axios.put("http://localhost:8000/auth/me/preferences", { diet_modes: dietModes, allergens: allergens }, { headers: { Authorization: `Bearer ${token}` } });
            // Có thể thêm 1 toast thông báo thành công nhẹ nhàng ở đây
        } catch (err) { alert("Lưu thất bại."); } finally { setIsSaving(false); }
    };

    const toggleDiet = (mode: string) => setDietModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
    const addAllergen = () => { if (allergenInput.trim() && !allergens.includes(allergenInput.trim())) setAllergens([...allergens, allergenInput.trim()]); setAllergenInput(""); };

    if (isLoading) return (
        <div className="min-h-screen bg-[#000000] flex flex-col justify-center items-center">
            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
            <p className="text-zinc-500 text-sm font-medium">Đang tải hồ sơ...</p>
        </div>
    );

    return (
        <ReactLenis root>
            <AnimatedPage>
                <div className="relative min-h-screen bg-[#000000] text-white p-6 md:p-10 pb-32">
                    <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

                    <div className="max-w-3xl mx-auto relative z-10 pt-10">
                        {/* Header */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex items-center gap-6 border-b border-white/10 pb-10">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <User className="w-8 h-8 text-zinc-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-1">{username}</h1>
                                <p className="text-zinc-500 text-sm">Quản lý hồ sơ dinh dưỡng cá nhân</p>
                            </div>
                        </motion.div>

                        <div className="space-y-12">
                            {/* Section: Chế độ ăn */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-lg font-semibold text-white mb-4">Chế độ ăn ưu tiên</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {DIET_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        const active = dietModes.includes(opt.name);
                                        return (
                                            <button key={opt.name} onClick={() => toggleDiet(opt.name)} className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-medium transition-all border ${active ? "bg-white text-black border-white" : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                                                <Icon className="w-4 h-4" /> {opt.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Section: Dị ứng / Blacklist */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    Danh sách kiêng kỵ
                                </h2>
                                <p className="text-sm text-zinc-500 mb-4">AI sẽ loại bỏ hoàn toàn các thực phẩm này khỏi thực đơn.</p>
                                
                                <div className="flex gap-3 mb-6">
                                    <input type="text" value={allergenInput} onChange={(e) => setAllergenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAllergen()} placeholder="Nhập thực phẩm (VD: Sữa, Đậu phộng)..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:border-white/30 outline-none transition-colors placeholder:text-zinc-600" />
                                    <button onClick={addAllergen} className="px-5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"><Plus className="w-5 h-5" /></button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {allergens.length === 0 && <span className="text-zinc-600 text-sm">Chưa có dữ liệu.</span>}
                                    <AnimatePresence>
                                        {allergens.map((a) => (
                                            <motion.span key={a} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-medium text-red-400">
                                                {a} <X className="w-3 h-3 cursor-pointer hover:text-white transition-colors" onClick={() => setAllergens(allergens.filter(item => item !== a))} />
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>

                            {/* Divider & Nút Lưu */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-8 border-t border-white/10 flex justify-end">
                                <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        </ReactLenis>
    );
}