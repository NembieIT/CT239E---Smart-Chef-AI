import { Link, useLocation } from "react-router";
import {
  Home,
  Upload,
  Image as ImageIcon,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Upload", path: "/", icon: Upload },
    { name: "Công thức", path: "/recipes", icon: ImageIcon },
    // { name: "Lịch sử", path: "/history", icon: History },
    // { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Giới thiệu", path: "/about", icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-cyan-500/10 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-cyan-500/10">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r bg-cyan-500 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r bg-cyan-400 bg-clip-text text-transparent">
              AI CT239E
            </span>
            <p className="text-xs text-gray-500">Nhận diện thực phẩm</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5"
                  }`}
              >
                {/* Active glow indicator */}
                {active && (
                  <motion.div
                    layoutId="activeNavGlow"
                    className="absolute inset-0 rounded-xl glow-cyan opacity-30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon className={`w-5 h-5 relative z-10 ${active ? "text-cyan-400" : ""}`} />
                <span className={`relative z-10 font-medium ${active ? "text-cyan-300" : ""}`}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {/* <div className="p-4 border-t border-cyan-500/10">
        <Link to="/settings">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Cài đặt</span>
          </motion.div>
        </Link>
      </div> */}
    </aside>
  );
}
