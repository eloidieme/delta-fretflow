import {create} from 'zustand';
import {type AppType} from '@/db/db';  // Import AppType

export type PlayerStatus = 'idle'|'warmup'|'running'|'paused'|'finished';

interface PlayerState {
  status: PlayerStatus;
  bpm: number;
  volume: number;

  // -- Active Session Data --
  activeTitle: string;
  activeApp: AppType;  // <--- NEW: Which App engine to load?
  activeConfig:
      any;  // <--- NEW: Specific settings (e.g. { root: 'C', scale: 'minor' })
  activeDuration: number;
  activeNotes: string;

  // -- Actions --
  setStatus: (status: PlayerStatus) => void;
  setBpm: (bpm: number) => void;

  // Update signature to accept appType and config
  loadSession:
      (title: string, appType: AppType, config: any, duration: number,
       bpm: number, notes?: string) => void;

  reset: () => void;
}

export const usePlayerStore = create<PlayerState>(
    (set) => ({
      status: 'idle',
      bpm: 120,
      volume: 0.8,

      activeTitle: 'Quick Start',
      activeApp: 'basic_utility',  // Default
      activeConfig: {},
      activeDuration: 300,
      activeNotes: '',

      setStatus: (status) => set({status}),
      setBpm: (bpm) => set({bpm}),

      loadSession: (title, appType, config, duration, bpm, notes = '') => set({
        activeTitle: title,
        activeApp: appType,    // Set App
        activeConfig: config,  // Set Config
        activeDuration: duration,
        bpm: bpm,
        activeNotes: notes,
        status: 'idle'
      }),

      reset: () => set({
        status: 'idle',
        activeTitle: 'Quick Start',
        activeApp: 'basic_utility',
        activeDuration: 300,
        activeNotes: ''
      })
    }));