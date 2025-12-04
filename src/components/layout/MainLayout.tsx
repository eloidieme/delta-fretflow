import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { PlayerBar } from "./PlayerBar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Scrollable Stage */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          {" "}
          {/* pb-32 ensures content isn't hidden behind PlayerBar */}
          <Outlet />
        </div>

        {/* Sticky Player */}
        <div className="sticky bottom-0 w-full">
          <PlayerBar />
        </div>
      </main>
    </div>
  );
}
