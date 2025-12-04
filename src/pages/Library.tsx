import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Play, Music } from "lucide-react";
import { db } from "@/db/db";
import { usePlayerStore } from "@/store/playerStore";
import { Modal } from "@/components/ui/Modal";
import { CreateExerciseForm } from "@/components/library/CreateExerciseForm";

export function Library() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hooks for Navigation and Store Actions
  const navigate = useNavigate();
  const { loadSession } = usePlayerStore();

  // Real-time query to the local DB
  const exercises = useLiveQuery(() =>
    db.exercises.orderBy("createdAt").reverse().toArray()
  );

  // -- Handlers --

  const handleDelete = (id: number) => {
    if (confirm("Delete this exercise?")) {
      db.exercises.delete(id);
    }
  };

  const handleStart = (ex: any) => {
    // Determine App Type from the DB record (default to basic if missing)
    const appType = ex.appType || "basic_utility";

    // Pass everything to the store
    loadSession(
      ex.title,
      appType,
      ex.settings.config || {}, // Pass specific config (e.g. {root:'C', scale:'minor'})
      ex.settings.duration,
      ex.settings.bpm,
      ex.settings.notes || ""
    );

    navigate("/");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Library</h1>
          <p className="text-slate-400">Manage your practice routines</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={20} />
          <span>New Exercise</span>
        </button>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises?.map((ex) => (
          <div
            key={ex.id}
            className="group bg-slate-800/50 border border-slate-700 hover:border-slate-500 p-5 rounded-xl transition-all shadow-lg hover:shadow-blue-900/10"
          >
            {/* Top Row: Icon & Delete */}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 rounded-lg text-blue-400">
                <Music size={24} />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleDelete(ex.id!);
                  }}
                  className="p-2 text-slate-500 hover:text-red-400 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <h3
              className="font-bold text-lg text-white mb-1 truncate"
              title={ex.title}
            >
              {ex.title}
            </h3>

            {/* Badges */}
            <div className="flex gap-3 text-xs text-slate-400 mb-6">
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {(ex.settings.duration / 60).toFixed(1)} min
              </span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {ex.settings.bpm} BPM
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleStart(ex)}
              className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-300 py-2 rounded-lg transition-colors font-medium"
            >
              <Play size={16} />
              Start Practice
            </button>
          </div>
        ))}

        {/* Empty State */}
        {exercises?.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <Music className="text-slate-600" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              No exercises yet
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first routine to get started.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              + Create New Exercise
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Exercise"
      >
        <CreateExerciseForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
