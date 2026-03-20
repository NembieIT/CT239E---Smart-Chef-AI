import { useState, useEffect, useRef } from "react";
import { Search, User, LogOut, LogIn, Command } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export function TopBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-20 flex items-center justify-between px-8 glass-panel border-b border-white/5">
      <div className="flex-1 max-w-2xl">
        <div className="relative group flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Tìm kiếm công thức, nguyên liệu..."
            className="w-full bg-white/[0.03] border border-white/10 group-focus-within:border-white/30 rounded-full pl-12 pr-16 py-2.5 transition-all outline-none text-sm text-white placeholder:text-zinc-600"
          />
          <div className="absolute right-2 flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full pointer-events-none">
            <Command className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-400 font-medium">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-6" ref={menuRef}>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors overflow-hidden">
            <User className="w-5 h-5 text-zinc-400" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-48 glass-elegant rounded-2xl p-2 shadow-2xl">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => { setIsMenuOpen(false); navigate("/profile"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium mb-1">
                      <User className="w-4 h-4" /> Hồ sơ cá nhân
                    </button>
                    <button onClick={() => { localStorage.removeItem("access_token"); setIsLoggedIn(false); setIsMenuOpen(false); navigate("/auth"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <button onClick={() => navigate("/auth")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all text-sm font-medium">
                    <LogIn className="w-4 h-4" /> Đăng nhập
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}