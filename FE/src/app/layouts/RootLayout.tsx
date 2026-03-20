import { Outlet } from "react-router";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      
      if (window.location.pathname !== '/auth') {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.");
        window.location.href = "/auth"; 
      }
    }
    return Promise.reject(error);
  }
);

export function RootLayout() {
  return (
    <div className="font-sans min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}