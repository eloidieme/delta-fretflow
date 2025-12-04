import { useEffect } from "react";
import { db } from "./db/db";
import { usePlayerStore } from "./store/playerStore";

function App() {
  // 1. Access the store
  const { status, bpm, setStatus, setBpm } = usePlayerStore();

  // DB Check (keep this from previous step)
  useEffect(() => {
    db.open().catch((err) => console.error("❌ DB Error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-blue-400">
        DeltaFretFlow <span className="text-sm text-slate-400">v1.0</span>
      </h1>

      {/* Debug Board */}
      <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 w-96">
        <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">
          State Machine Debug
        </h2>

        <div className="space-y-4">
          {/* Status Display */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              ${status === "idle" ? "bg-gray-600" : ""}
              ${status === "running" ? "bg-green-600" : ""}
              ${status === "paused" ? "bg-yellow-600" : ""}
              ${status === "warmup" ? "bg-orange-600" : ""}
            `}
            >
              {status}
            </span>
          </div>

          {/* BPM Control */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">BPM: {bpm}</span>
            <input
              type="range"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="accent-blue-500"
            />
          </div>

          {/* State Toggles */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setStatus("warmup")}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
            >
              Simulate Start
            </button>
            <button
              onClick={() => setStatus("paused")}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
            >
              Simulate Pause
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
