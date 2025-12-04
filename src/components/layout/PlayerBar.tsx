import { Play, SkipForward, Volume2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export function PlayerBar() {
  const { status, bpm } = usePlayerStore();

  return (
    <div className="h-20 border-t border-white/10 bg-slate-900/80 backdrop-blur-md fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 text-white">
      {/* Left: Active Info (Takes available space) */}
      <div className="flex-1 flex justify-start">
        <div>
          <h3 className="text-sm font-medium text-slate-300">Quick Practice</h3>
          <p className="text-xs text-slate-500">No exercise loaded</p>
        </div>
      </div>

      {/* Center: Transport Controls (Centered absolutely or via flex) */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-6">
          <button className="p-2 text-slate-400 hover:text-white transition">
            <Volume2 size={20} />
          </button>

          <button className="w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition">
            <Play size={24} fill="currentColor" className="ml-1" />
          </button>

          <button className="p-2 text-slate-400 hover:text-white transition">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Right: Status & BPM (Aligned right) */}
      <div className="flex-1 flex justify-end items-center gap-4 min-w-[140px]">
        <div className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-blue-300 border border-slate-700 whitespace-nowrap">
          {bpm} BPM
        </div>
        <span className="text-xs uppercase font-bold tracking-wider text-slate-500 whitespace-nowrap">
          {status}
        </span>
      </div>
    </div>
  );
}
