import {create} from 'zustand';

// 1. Define the statuses
export type PlayerStatus = 'idle'|'warmup'|'running'|'paused'|'finished';

// 2. Define the Store State
interface PlayerState {
  // Engine Status
  status: PlayerStatus;
  bpm: number;

  // Active Session Data (New!)
  activeTitle: string;
  activeDuration: number;  // Total seconds for the current exercise

  // Actions
  setStatus: (status: PlayerStatus) => void;
  setBpm: (bpm: number) => void;

  // Load a new session configuration
  loadSession: (title: string, duration: number, bpm: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>(
    (set) => ({
      status: 'idle',
      bpm: 120,

      // Default State
      activeTitle: 'Quick Start',
      activeDuration: 300,  // Default 5 mins if nothing loaded

      setStatus: (status) => set({status}),
      setBpm: (bpm) => set({bpm}),

      loadSession: (title, duration, bpm) => set({
        activeTitle: title,
        activeDuration: duration,
        bpm: bpm,
        status: 'idle'  // Reset to idle so user has to hit "Start" (or we can
                        // auto-start)
      }),

      reset: () => set({status: 'idle'})
    }));