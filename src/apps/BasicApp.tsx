import { usePlayerStore } from "@/store/playerStore";
import { useRunner } from "@/hooks/useRunner";
import { StickyNote, Activity } from "lucide-react";
import { SceneContainer } from "@/components/3d/SceneContainer";
import { TestObject } from "@/components/3d/TestObject";

export function BasicApp() {
  // 1. Get Data from Store & Runner
  const { activeTitle, activeNotes, status } = usePlayerStore();
  const { displayTime, displayProgress, isWarmup } = useRunner();

  // 2. Format Time (mm:ss.ms)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 gap-6">
      {/* Header Info */}
      <header className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {activeTitle}
          </h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
            <Activity size={14} />
            <span>Basic Utility</span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors
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

      {/* Main Stage: Split View (Timer + 3D) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
        {/* Left Column: Timer & Progress */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-slate-900/30 rounded-xl border border-slate-800">
          <div className="relative z-10 text-center mb-8">
            <div className="text-[4rem] leading-none font-mono font-bold text-white tabular-nums drop-shadow-2xl">
              {formatTime(displayTime)}
            </div>
            <p className="text-slate-400 font-medium text-lg mt-2">
              {isWarmup ? "Warmup Phase" : "Time Remaining"}
            </p>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className={`h-full transition-all duration-100 ease-linear
                ${isWarmup ? "bg-orange-500" : "bg-blue-500"}
                ${status === "finished" ? "bg-green-500" : ""}
              `}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="lg:col-span-2 relative">
          {/* Status Glow Layer behind the canvas */}
          <div
            className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-700
             ${isWarmup ? "bg-orange-600" : ""}
             ${status === "running" ? "bg-blue-600" : ""}
          `}
          />

          <SceneContainer>
            {/* This is where the Fretboard will go next! */}
            <TestObject />
          </SceneContainer>
        </div>
      </div>

      {/* Footer: Notes Section */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-slate-400 mb-3">
          <StickyNote size={18} />
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            Exercise Notes
          </h3>
        </div>

        {activeNotes ? (
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {activeNotes}
          </p>
        ) : (
          <p className="text-slate-600 italic">
            No notes added for this exercise. Focus on your timing!
          </p>
        )}
      </div>
    </div>
  );
}
