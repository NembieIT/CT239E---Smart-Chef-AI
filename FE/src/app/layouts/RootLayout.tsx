import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export function RootLayout() {
  return (
    <div className="font-font2 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
