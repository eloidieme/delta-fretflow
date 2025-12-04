import { useForm } from "react-hook-form";
import { db, type AppType } from "@/db/db";

interface FormData {
  title: string;
  durationMinutes: number;
  bpm: number;
}

interface Props {
  onSuccess: () => void;
}

export function CreateExerciseForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      durationMinutes: 5,
      bpm: 120,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Create the Exercise in Dexie
      await db.exercises.add({
        title: data.title,
        appType: "basic_utility", // Hardcoded for Phase 3
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          // Convert minutes to seconds for the engine
          duration: data.durationMinutes * 60,
          bpm: data.bpm,
          notes: "",
        },
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to save exercise:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Exercise Title
        </label>
        <input
          {...register("title", { required: true })}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="e.g. C Major Scale Warmup"
        />
        {errors.title && (
          <span className="text-red-400 text-xs">Title is required</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Duration */}
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

        {/* BPM */}
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

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition"
      >
        Create Exercise
      </button>
    </form>
  );
}
