import { usePlayerStore } from "@/store/playerStore";
import { useRunner } from "@/hooks/useRunner";
import { StickyNote, Activity } from "lucide-react";
// IMPORT THE NEW 2D COMPONENT
import {
  Fretboard2D,
  type ActiveNote,
} from "@/components/fretboard/Fretboard2D";

export function BasicApp() {
  const { activeTitle, activeNotes, status } = usePlayerStore();
  const { displayTime, displayProgress, isWarmup } = useRunner();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Test Data: C Major Scale
  const testNotes: ActiveNote[] = [
    { string: 5, fret: 3, color: "#ef4444" }, // C (Red)
    { string: 5, fret: 5, color: "#3b82f6" }, // D
    { string: 4, fret: 2, color: "#3b82f6" }, // E
    { string: 4, fret: 3, color: "#3b82f6" }, // F
    { string: 4, fret: 5, color: "#3b82f6" }, // G
    { string: 3, fret: 2, color: "#3b82f6" }, // A
    { string: 3, fret: 4, color: "#3b82f6" }, // B
    { string: 3, fret: 5, color: "#ef4444" }, // C
  ];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 gap-4">
      {/* 1. Header */}
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {activeTitle}
          </h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Activity size={14} />
            <span>Basic Utility</span>
          </div>
        </div>
        <div
          className={`px-4 py-1 rounded-lg font-bold uppercase tracking-wider text-sm
          ${isWarmup ? "bg-orange-500/20 text-orange-400" : ""}
          ${status === "running" ? "bg-green-500/20 text-green-400" : ""}
          ${
            status === "idle" || status === "finished"
              ? "bg-slate-800 text-slate-400"
              : ""
          }
          ${status === "paused" ? "bg-yellow-500/20 text-yellow-400" : ""}
        `}
        >
          {isWarmup ? "Get Ready" : status}
        </div>
      </header>

      {/* 2. THE MAIN STAGE (2D SVG Fretboard) */}
      <div className="w-full relative">
        <Fretboard2D activeNotes={testNotes} />
      </div>

      {/* 3. CONTROL DECK (Timer + Notes) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {/* Timer Panel */}
        <div className="md:col-span-1 bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="text-6xl font-mono font-bold text-white tabular-nums z-10">
            {formatTime(displayTime)}
          </div>
          <div className="text-slate-400 text-sm font-medium z-10 mt-1 uppercase tracking-widest">
            {isWarmup ? "Warmup" : "Remaining"}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-700">
            <div
              className={`h-full transition-all duration-100 linear
                ${isWarmup ? "bg-orange-500" : "bg-blue-500"}
              `}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>

        {/* Notes Panel */}
        <div className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700 overflow-y-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2 sticky top-0 bg-transparent">
            <StickyNote size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Session Notes
            </span>
          </div>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {activeNotes || "No notes for this session."}
          </p>
        </div>
      </div>
    </div>
  );
}
