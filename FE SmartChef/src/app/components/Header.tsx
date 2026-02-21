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
        <div className="flex justify-start items-center h-16 gap-[20%]">
          {/* Logo với tên dự án mới */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-orange-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r bg-blue-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r bg-black bg-clip-text text-transparent">
              Smart Chef AI
            </span>
          </Link>

          {/* Điều hướng Tiếng Việt */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors ${isActive(item.path)
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
                  }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r bg-blue-500" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
