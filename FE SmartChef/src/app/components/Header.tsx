import { Link, useLocation } from "react-router";
import { Sparkles, User } from "lucide-react";

export function Header() {
  const location = useLocation();

  // Việt hóa danh sách menu điều hướng
  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Công thức", path: "/recipes" },
    { name: "Lịch sử", path: "/history" },
    { name: "Giới thiệu", path: "/about" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo với tên dự án mới */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-orange-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Smart Chef AI
            </span>
          </Link>

          {/* Điều hướng Tiếng Việt */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-orange-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Nút Hồ sơ */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-orange-500 text-white hover:shadow-lg transition-all">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Hồ sơ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
