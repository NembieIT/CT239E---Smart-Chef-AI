import { Search, Bell, User } from "lucide-react";
import { motion } from "motion/react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-cyan-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm công thức món ăn"
              className="w-full pl-12 pr-4 py-2.5 glass rounded-xl border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-gray-300 placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
