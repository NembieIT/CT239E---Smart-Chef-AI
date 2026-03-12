import { useState, useEffect } from "react";
import axios from "axios";
import { User, Dumbbell, Scale, Heart, Salad, Leaf, AlertTriangle, X, Plus, Save, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedPage } from "../components/AnimatedPage";

const DIET_OPTIONS = [
    { name: "Gym", icon: Dumbbell, color: "text-orange-400" },
    { name: "Giảm cân", icon: Scale, color: "text-green-400" },
    { name: "Bệnh", icon: Heart, color: "text-red-400" },
    { name: "Ăn lành mạnh", icon: Salad, color: "text-emerald-400" },
    { name: "Ăn chay", icon: Leaf, color: "text-lime-400" },
];

export function ProfilePage() {
    const [username, setUsername] = useState("");
    const [dietModes, setDietModes] = useState<string[]>([]);
    const [allergens, setAllergens] = useState<string[]>([]);
    const [allergenInput, setAllergenInput] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:8000/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsername(res.data.username);
            setDietModes(res.data.diet_modes || []);
            setAllergens(res.data.allergens || []);
        } catch (err) {
            console.error("Lỗi tải thông tin:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem("access_token");
        setIsSaving(true);
        try {
            await axios.put("http://localhost:8000/auth/me/preferences",
                { diet_modes: dietModes, allergens: allergens },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            alert("Có lỗi khi lưu thông tin.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleDiet = (mode: string) => setDietModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
    const addAllergen = () => { if (allergenInput.trim() && !allergens.includes(allergenInput.trim())) setAllergens([...allergens, allergenInput.trim()]); setAllergenInput(""); };

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin" /></div>;

    return (
        <AnimatedPage>
            <div className="p-8 max-w-3xl mx-auto min-h-screen">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Hồ sơ của {username}</h1>
                    <p className="text-gray-400 mt-2">Thiết lập các ưu tiên dinh dưỡng để AI phục vụ bạn tốt nhất</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-8 border border-cyan-500/20 space-y-8">

                    {/* Chọn chế độ ăn */}
                    <div>
                        <label className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 block">Chế độ ăn của bạn</label>
                        <div className="flex flex-wrap gap-3">
                            {DIET_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const active = dietModes.includes(opt.name);
                                return (
                                    <button key={opt.name} onClick={() => toggleDiet(opt.name)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border ${active ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md" : "glass border-white/5 text-gray-400 hover:border-cyan-500/30"}`}>
                                        <Icon className={`w-5 h-5 ${active ? opt.color : ""}`} /> {opt.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dị ứng */}
                    <div>
                        <label className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Dị ứng & Kiêng kỵ
                        </label>
                        <div className="flex gap-2 mb-4">
                            <input type="text" value={allergenInput} onChange={(e) => setAllergenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAllergen()} placeholder="Nhập tên thực phẩm (VD: Đậu phộng, Tôm...)" className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none" />
                            <button onClick={addAllergen} className="px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all"><Plus className="w-5 h-5" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allergens.length === 0 && <span className="text-gray-500 italic text-sm">Chưa thêm thực phẩm nào.</span>}
                            {allergens.map((a) => (
                                <span key={a} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-sm font-bold text-red-300">
                                    {a} <X className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => setAllergens(allergens.filter(item => item !== a))} />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Nút Lưu */}
                    <div className="pt-6 border-t border-white/5">
                        <button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50">
                            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-6 h-6" /> : <Save className="w-6 h-6" />}
                            {isSaving ? "Đang lưu..." : saveSuccess ? "Đã lưu thành công!" : "Lưu hồ sơ"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
}