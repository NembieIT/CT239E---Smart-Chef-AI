import { useState, useEffect, useRef } from "react";
import { Search, Bell, User, LogOut, LogIn, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

export function TopBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // BIẾN MỚI: Lưu trữ từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/auth");
  };

  const handleLogin = () => navigate("/auth");

  // HÀM MỚI: Xử lý khi bấm Enter ở ô tìm kiếm
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Đẩy người dùng sang trang search cùng với từ khóa trên URL
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // (Tuỳ chọn) Xóa trắng ô tìm kiếm sau khi enter
    }
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-cyan-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* Khung tìm kiếm đã được nâng cấp */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Nhập miêu tả, cảm nghĩ về món ăn bạn đang nghĩ tới và nhấn Enter"
              className="w-full pl-12 pr-4 py-2.5 glass rounded-xl border border-cyan-500/20 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-gray-300 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* ... Phần icon User bên phải giữ nguyên như cũ ... */}
        <div className="flex items-center gap-4 pl-4" ref={menuRef}>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-3 pr-2 glass border border-cyan-500/30 rounded-full hover:bg-cyan-500/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 glass border border-cyan-500/20 rounded-2xl shadow-2xl py-2 overflow-hidden"
                >
                  {isLoggedIn ? (
                    <div className="px-2">
                      <div className="px-3 py-2 border-b border-cyan-500/10 mb-2">
                        <p className="text-xs text-gray-400">Trạng thái</p>
                        <p className="text-sm font-bold text-cyan-300">Đã đăng nhập</p>
                      </div>
                      <button 
                        onClick={() => { setIsMenuOpen(false); navigate("/profile"); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors font-medium text-sm mb-1"
                      >
                        <User className="w-4 h-4" />
                        Thông tin cá nhân
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm">
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <div className="px-2 flex flex-col gap-1">
                      <button onClick={handleLogin} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-cyan-300 hover:bg-cyan-500/10 transition-colors font-medium text-sm border border-transparent hover:border-cyan-500/30">
                        <LogIn className="w-4 h-4" /> Đăng nhập
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}