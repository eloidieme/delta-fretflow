import {create} from 'zustand';

// 1. The States of the Runner Machine (Spec Section 4.1)
export type PlayerStatus =|'idle'  // Nothing loaded
    |'warmup'                      // The 3-second countdown before an exercise
    |'running'                     // Exercise in progress
    |'paused'                      // User hit pause OR inter-exercise break
    |'finished';                   // Playlist complete

// 2. The Store Interface
interface PlayerState {
  // Status
  status: PlayerStatus;

  // Active Data
  activePlaylistId: number|null;
  activeExerciseId: number|null;  // ID of the currently running exercise

  // Playback Controls (Spec Section 4.2)
  bpm: number;     // Global or Local Tempo
  volume: number;  // Master volume (0.0 to 1.0)

  // Actions
  setStatus: (status: PlayerStatus) => void;
  setBpm: (bpm: number) => void;
  loadPlaylist: (playlistId: number) => void;
  reset: () => void;
}

// 3. The Implementation
export const usePlayerStore = create<PlayerState>(
    (set) => ({
      // Initial State
      status: 'idle',
      activePlaylistId: null,
      activeExerciseId: null,
      bpm: 120,  // Default standard tempo
      volume: 0.8,

      // Actions
      setStatus: (status) => set({status}),

      setBpm: (bpm) => set({bpm}),

      loadPlaylist: (playlistId) => set({
        activePlaylistId: playlistId,
        status: 'idle'  // Ready to start
      }),

      reset: () =>
          set({status: 'idle', activePlaylistId: null, activeExerciseId: null})
    }));