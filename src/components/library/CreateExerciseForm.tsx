import { useForm } from "react-hook-form";
import { Activity, Music } from "lucide-react";
import { db, type AppType } from "@/db/db";
import { SCALES, type NoteName, type ScaleType } from "@/utils/musicTheory";

// Helper to format scale names nicely
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

interface FormData {
  title: string;
  durationMinutes: number;
  bpm: number;
  appType: AppType;
  // Scale Explorer specific
  rootNote: NoteName;
  scaleType: ScaleType;
}

interface Props {
  onSuccess: () => void;
}

export function CreateExerciseForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      appType: "basic_utility",
      durationMinutes: 5,
      bpm: 120,
      rootNote: "C",
      scaleType: "minor_pentatonic",
    },
  });

  // Watch appType to conditionally render fields
  const selectedAppType = watch("appType");

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Build the Config Object based on App Type
      let config = {};

      if (data.appType === "scale_explorer") {
        config = {
          root: data.rootNote,
          scale: data.scaleType,
        };
      }

      // 2. Save to Dexie
      await db.exercises.add({
        title: data.title,
        appType: data.appType,
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          duration: data.durationMinutes * 60,
          bpm: data.bpm,
          notes: "", // We could add a notes field here later
          config: config, // Save the specific app config
        },
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to save exercise:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. App Type Selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setValue("appType", "basic_utility")}
          className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all
            ${
              selectedAppType === "basic_utility"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }
          `}
        >
          <Activity size={16} />
          <span>Basic Timer</span>
        </button>
        <button
          type="button"
          onClick={() => setValue("appType", "scale_explorer")}
          className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all
            ${
              selectedAppType === "scale_explorer"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }
          `}
        >
          <Music size={16} />
          <span>Scale Explorer</span>
        </button>
      </div>

      {/* 2. Common Fields */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Exercise Title
        </label>
        <input
          {...register("title", { required: true })}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder={
            selectedAppType === "scale_explorer"
              ? "e.g. A Minor Pentatonic Run"
              : "e.g. Morning Warmup"
          }
        />
        {errors.title && (
          <span className="text-red-400 text-xs">Title is required</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Duration (Min)
          </label>
          <input
            type="number"
            {...register("durationMinutes", { min: 1, max: 60 })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Target BPM
          </label>
          <input
            type="number"
            {...register("bpm", { min: 40, max: 300 })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 3. Scale Explorer Specific Fields */}
      {selectedAppType === "scale_explorer" && (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Music size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Theory Config
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Root Note */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Key Center
              </label>
              <select
                {...register("rootNote")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {ALL_NOTES.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </div>

            {/* Scale Type */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Scale Pattern
              </label>
              <select
                {...register("scaleType")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.keys(SCALES).map((key) => (
                  <option key={key} value={key}>
                    {formatScaleName(key)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-2 transition shadow-lg shadow-blue-600/20"
      >
        Create Routine
      </button>
    </form>
  );
}
