import { Link, useLocation } from "react-router";
import { Upload, Image as ImageIcon, History, HelpCircle, CalendarDays, UserCircle, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Phân tích ảnh", path: "/", icon: Upload },
    { name: "Sáng tạo món", path: "/recipes", icon: ImageIcon },
    { name: "Lịch sử", path: "/history", icon: History },
    { name: "Lộ trình ăn", path: "/meal-plan", icon: CalendarDays },
    { name: "Hồ sơ", path: "/profile", icon: UserCircle },
    { name: "Hệ thống", path: "/about", icon: HelpCircle },
  ];

  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r flex flex-col z-40">
      <div className="p-8 pb-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black group-hover:scale-105 transition-transform duration-500">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">Smart Chef</span>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">AI Platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 pt-8 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-zinc-600 mb-4 uppercase tracking-widest">Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className="block outline-none">
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                <item.icon className={`w-5 h-5 transition-colors ${active ? "text-white" : ""}`} />
                <span className="text-sm font-medium">{item.name}</span>
                {active && <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}