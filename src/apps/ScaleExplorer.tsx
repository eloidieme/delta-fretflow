import { useState, useMemo } from "react";
import { Activity, Music } from "lucide-react";
import { Fretboard2D } from "@/components/fretboard/Fretboard2D";
import {
  generateFretboardMapping,
  SCALES,
  type NoteName,
  type ScaleType,
} from "@/utils/musicTheory";

// Helper to format "minor_pentatonic" -> "Minor Pentatonic"
const formatScaleName = (key: string) =>
  key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const ALL_NOTES: NoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function ScaleExplorer() {
  // 1. Local State for Exploration
  // (In the future "Runner Mode", this will come from the Store)
  const [selectedRoot, setSelectedRoot] = useState<NoteName>("A");
  const [selectedScale, setSelectedScale] =
    useState<ScaleType>("minor_pentatonic");

  // 2. The Logic Engine
  const activeNotes = useMemo(() => {
    return generateFretboardMapping(selectedRoot, selectedScale);
  }, [selectedRoot, selectedScale]);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 gap-4">
      {/* 1. Header */}
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Scale Explorer
          </h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
            <Activity size={14} />
            <span>Theory & Visualization</span>
          </div>
        </div>

        {/* Simple Mode Badge */}
        <div className="px-4 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-sm">
          Explore Mode
        </div>
      </header>

      {/* 2. THE MAIN STAGE (2D Fretboard) */}
      <div className="w-full relative">
        <Fretboard2D activeNotes={activeNotes} />
      </div>

      {/* 3. CONTROL DECK (Theory Controls) */}
      <div className="flex-1 bg-slate-800/50 rounded-xl p-6 border border-slate-700 min-h-0">
        <div className="flex items-center gap-2 text-slate-400 mb-6 border-b border-slate-700 pb-4">
          <Music size={18} />
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Key Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Key Center (Root)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => setSelectedRoot(note)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all
                    ${
                      selectedRoot === note
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-110"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }
                  `}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Scale Type
            </label>
            <div className="flex flex-col gap-2">
              {(Object.keys(SCALES) as ScaleType[]).map((scaleKey) => (
                <button
                  key={scaleKey}
                  onClick={() => setSelectedScale(scaleKey)}
                  className={`px-4 py-3 rounded-lg font-medium text-sm text-left transition-all flex justify-between items-center
                    ${
                      selectedScale === scaleKey
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }
                  `}
                >
                  <span>{formatScaleName(scaleKey)}</span>
                  {selectedScale === scaleKey && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Legend / Info (Placeholder for future features) */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
            <h4 className="text-slate-300 font-medium mb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500 border border-white" />
                <span className="text-slate-400">
                  Root Note ({selectedRoot})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 border border-white" />
                <span className="text-slate-400">Scale Notes</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">
              Tip: Try playing this pattern up and down the neck with a
              metronome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
