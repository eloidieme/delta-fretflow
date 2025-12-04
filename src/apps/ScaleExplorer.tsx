import { useState, useMemo, useEffect } from "react";
import { Activity, Music, StickyNote, Clock } from "lucide-react";
import { Fretboard2D } from "@/components/fretboard/Fretboard2D";
import { usePlayerStore } from "@/store/playerStore"; // Import Store
import { useRunner } from "@/hooks/useRunner"; // Import Runner
import {
  generateFretboardMapping,
  SCALES,
  type NoteName,
  type ScaleType,
} from "@/utils/musicTheory";

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
  // 1. Access Store to check if we are in "Runner Mode"
  const { activeTitle, activeConfig, activeNotes, status } = usePlayerStore();
  const { displayTime, displayProgress, isWarmup } = useRunner();

  // Determine Mode: If activeConfig has data, we are in Runner Mode.
  const isRunnerMode = !!activeConfig?.scale;

  // 2. State (Local vs Store)
  const [localRoot, setLocalRoot] = useState<NoteName>("C");
  const [localScale, setLocalScale] = useState<ScaleType>("minor_pentatonic");

  // Derive active values based on mode
  const currentRoot = isRunnerMode
    ? (activeConfig.root as NoteName)
    : localRoot;
  const currentScale = isRunnerMode
    ? (activeConfig.scale as ScaleType)
    : localScale;

  // 3. Logic Engine
  const activeFretboardNotes = useMemo(() => {
    return generateFretboardMapping(currentRoot, currentScale);
  }, [currentRoot, currentScale]);

  // -- Render Helpers --
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 gap-4">
      {/* Header */}
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRunnerMode ? activeTitle : "Scale Explorer"}
          </h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
            <Activity size={14} />
            <span>
              {isRunnerMode
                ? `${currentRoot} ${formatScaleName(currentScale)}`
                : "Theory Sandbox"}
            </span>
          </div>
        </div>

        <div
          className={`px-4 py-1 rounded-lg font-bold uppercase tracking-wider text-sm
          ${
            isRunnerMode
              ? status === "running"
                ? "bg-green-500/20 text-green-400"
                : "bg-slate-800 text-slate-400"
              : "bg-blue-500/20 text-blue-400"
          }
        `}
        >
          {isRunnerMode ? (isWarmup ? "Warmup" : status) : "Explore Mode"}
        </div>
      </header>

      {/* Main Stage */}
      <div className="w-full relative">
        <Fretboard2D activeNotes={activeFretboardNotes} />
      </div>

      {/* Control Deck: Switches based on Mode */}
      {isRunnerMode ? (
        // -- RUNNER CONTROL DECK (Timer + Notes) --
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
          {/* Timer */}
          <div className="md:col-span-1 bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="text-6xl font-mono font-bold text-white tabular-nums z-10">
              {formatTime(displayTime)}
            </div>
            <div className="text-slate-400 text-sm font-medium z-10 mt-1 uppercase tracking-widest">
              {isWarmup ? "Warmup" : "Remaining"}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-700">
              <div
                className={`h-full transition-all duration-100 linear ${
                  isWarmup ? "bg-orange-500" : "bg-blue-500"
                }`}
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
          {/* Notes */}
          <div className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700 overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-400 mb-2 sticky top-0 bg-transparent">
              <StickyNote size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Session Notes
              </span>
            </div>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {activeNotes ||
                "Practice this scale pattern up and down the neck."}
            </p>
          </div>
        </div>
      ) : (
        // -- EXPLORE CONTROL DECK (Dropdowns) --
        <div className="flex-1 bg-slate-800/50 rounded-xl p-6 border border-slate-700 min-h-0 overflow-y-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-6 border-b border-slate-700 pb-4">
            <Music size={18} />
            <h3 className="font-semibold text-sm uppercase tracking-wide">
              Configuration
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Key Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Key Center
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_NOTES.map((note) => (
                  <button
                    key={note}
                    onClick={() => setLocalRoot(note)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all
                      ${
                        localRoot === note
                          ? "bg-red-500 text-white"
                          : "bg-slate-700 text-slate-300"
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
                    onClick={() => setLocalScale(scaleKey)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm text-left flex justify-between items-center
                      ${
                        localScale === scaleKey
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      }
                    `}
                  >
                    <span>{formatScaleName(scaleKey)}</span>
                    {localScale === scaleKey && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
