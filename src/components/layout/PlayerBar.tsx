import { useEffect } from "react";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { metronome } from "@/audio/MetronomeEngine";

export function PlayerBar() {
  // 1. Access the store state and actions
  const { status, bpm, setStatus } = usePlayerStore();

  // 2. Sync the Metronome Engine with the Store
  useEffect(() => {
    // Whenever BPM changes in the UI/Store, update the Audio Engine immediately
    metronome.setBpm(bpm);
  }, [bpm]);

  // 3. Handle Play/Pause Logic
  const togglePlay = () => {
    if (status === "running") {
      // Stop Logic
      metronome.stop();
      setStatus("paused");
    } else {
      // Start Logic
      // (Later, this will trigger the 'Warmup' state first, but for now we test audio direct)
      metronome.start();
      setStatus("running");
    }
  };

  return (
    <div className="h-20 border-t border-white/10 bg-slate-900/80 backdrop-blur-md fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 text-white">
      {/* Left: Active Info */}
      <div className="flex-1 flex justify-start">
        <div>
          <h3 className="text-sm font-medium text-slate-300">Quick Practice</h3>
          <p className="text-xs text-slate-500">No exercise loaded</p>
        </div>
      </div>

      {/* Center: Transport Controls */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-6">
          {/* Volume (Mock) */}
          <button className="p-2 text-slate-400 hover:text-white transition">
            <Volume2 size={20} />
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 active:scale-95"
          >
            {status === "running" ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>

          {/* Skip (Mock) */}
          <button className="p-2 text-slate-400 hover:text-white transition">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Right: Status & BPM */}
      <div className="flex-1 flex justify-end items-center gap-4 min-w-[140px]">
        {/* BPM Display */}
        <div className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-blue-300 border border-slate-700 whitespace-nowrap">
          {bpm} BPM
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs uppercase font-bold tracking-wider whitespace-nowrap transition-colors
          ${status === "running" ? "text-green-400" : "text-slate-500"}
        `}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
