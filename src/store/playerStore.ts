import {create} from 'zustand';

// 1. The States of the Runner Machine
export type PlayerStatus =|'idle'  // Nothing loaded
    |'warmup'                      // The 3-second countdown before an exercise
    |'running'                     // Exercise in progress
    |'paused'                      // User hit pause OR inter-exercise break
    |'finished';                   // Playlist complete

// 2. The Store Interface
interface PlayerState {
  // -- Engine Status --
  status: PlayerStatus;
  bpm: number;     // Global Tempo
  volume: number;  // Master volume (0.0 to 1.0)

  // -- Active Session Data --
  activeTitle: string;
  activeDuration: number;  // Total seconds for the current exercise
  activeNotes: string;     // Instructions or notes for the current exercise

  // -- Actions --
  setStatus: (status: PlayerStatus) => void;
  setBpm: (bpm: number) => void;

  // Load a new session configuration
  loadSession:
      (title: string, duration: number, bpm: number, notes?: string) => void;

  reset: () => void;
}

// 3. The Implementation
export const usePlayerStore = create<PlayerState>(
    (set) => ({
      // Initial State
      status: 'idle',
      bpm: 120,
      volume: 0.8,

      activeTitle: 'Quick Start',
      activeDuration: 300,  // Default 5 mins
      activeNotes: '',      // Default empty

      // Actions
      setStatus: (status) => set({status}),

      setBpm: (bpm) => set({bpm}),

      loadSession: (title, duration, bpm, notes = '') => set({
        activeTitle: title,
        activeDuration: duration,
        bpm: bpm,
        activeNotes: notes,
        status: 'idle'  // Reset to idle so user has to hit "Start"
      }),

      reset: () => set({
        status: 'idle',
        activeTitle: 'Quick Start',
        activeDuration: 300,
        activeNotes: ''
      })
    }));