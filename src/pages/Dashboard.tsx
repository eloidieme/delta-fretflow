import { usePlayerStore } from "@/store/playerStore";
import { useRunner } from "@/hooks/useRunner";

export function Dashboard() {
  // 1. Initialize the Runner Logic
  // This hook runs in the background and listens to the store
  const { displayTime, displayProgress, isWarmup } = useRunner();

  // 2. Access Store to trigger actions
  const { status, setStatus } = usePlayerStore();

  const handleStart = () => {
    // Spec: Start sequence begins with Warmup [cite: 84]
    setStatus("warmup");
  };

  const handleStop = () => {
    setStatus("idle");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Dashboard</h1>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-6 text-white">
          Hands-Free Runner Alpha
        </h2>

        {/* The Big Visual Display */}
        <div className="mb-8">
          <div className="text-6xl font-mono font-bold text-white mb-4">
            {displayTime.toFixed(1)}{" "}
            <span className="text-lg text-slate-500">s</span>
          </div>

          {/* Status Indicator */}
          <div
            className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6
            ${isWarmup ? "bg-orange-500/20 text-orange-400" : ""}
            ${status === "running" ? "bg-green-500/20 text-green-400" : ""}
            ${status === "idle" ? "bg-slate-700 text-slate-400" : ""}
          `}
          >
            {isWarmup ? "Get Ready..." : status}
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden max-w-md mx-auto">
            <div
              className={`h-full transition-all duration-100 ease-linear
                ${isWarmup ? "bg-orange-500" : "bg-green-500"}
              `}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>

        {/* Big Start Button */}
        {status === "idle" || status === "finished" ? (
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/20 transition hover:scale-105 active:scale-95"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg shadow-lg shadow-red-600/20 transition"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
