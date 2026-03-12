import { Link, useLocation } from "react-router";
import {
  Upload,
  Image as ImageIcon,
  History,
  HelpCircle,
  Sparkles,
  CalendarDays, // Icon cho Lộ trình ăn
  UserCircle    // Icon cho Hồ sơ
} from "lucide-react";
import { motion } from "motion/react";

export function Sidebar() {
  const location = useLocation();

  // Đã cập nhật thêm 2 trang mới vào danh sách điều hướng
  const navItems = [
    { name: "Upload", path: "/", icon: Upload },
    { name: "Công thức", path: "/recipes", icon: ImageIcon },
    { name: "Lịch sử", path: "/history", icon: History },
    { name: "Lộ trình ăn", path: "/meal-plan", icon: CalendarDays }, // TRANG MỚI
    { name: "Hồ sơ cá nhân", path: "/profile", icon: UserCircle },  // TRANG MỚI
    { name: "Giới thiệu", path: "/about", icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-cyan-500/10 flex flex-col z-40 bg-slate-950/80 backdrop-blur-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-cyan-500/10">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-tight">
              AI CT239E
            </span>
            <p className="text-xs text-gray-500 font-medium">Nhận diện thực phẩm</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block"
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent"
                  }`}
              >
                {/* Active glow indicator */}
                {active && (
                  <motion.div
                    layoutId="activeNavGlow"
                    className="absolute inset-0 rounded-xl glow-cyan opacity-30 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon className={`w-5 h-5 relative z-10 ${active ? "text-cyan-400" : ""}`} />
                <span className={`relative z-10 font-bold tracking-wide ${active ? "text-cyan-300" : ""}`}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* CSS cho scrollbar nếu nội dung menu quá dài */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.5); }
      `}</style>
    </aside>
  );
}