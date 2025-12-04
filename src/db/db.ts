import Dexie, {type EntityTable} from 'dexie';

// -- 1. Type Definitions --

// The specific "App" engine used (Source: Spec Section 3)
export type AppType =|'basic_utility'  // Notes + Timer + Metronome
    |'active_recall'                   // Fretboard visualization
    |'finger_gym'                      // Dexterity drills
    |'scale_explorer'                  // Scale fluency
    |'song_practice';                  // Songbook integration

// An "Exercise" is a saved configuration of an App (Source: Spec 2.2.2)
export interface Exercise {
  id: number;
  title: string;
  appType: AppType;
  settings: any;  // We will define specific shapes for this later (JSON)
  createdAt: Date;
  updatedAt: Date;
}

// A Playlist Item can be an Exercise reference or a Category header (Source:
// Spec 2.2.3)
export interface PlaylistItem {
  type: 'exercise'|'category_header'|'break';
  contentId?: number;        // ID of the exercise (if type is exercise)
  label?: string;            // Text for the header (e.g. "Warmup")
  durationSeconds?: number;  // Override duration
}

// A Playlist is an ordered list of items (Source: Spec 2.2.4)
export interface Playlist {
  id: number;
  title: string;
  items: PlaylistItem[];  // The ordered list
  totalDurationSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

// -- 2. The Database Class --

class DeltaFretFlowDB extends Dexie {
  // Declare tables with strict types
  exercises!: EntityTable<Exercise, 'id'>;
  playlists!: EntityTable<Playlist, 'id'>;

  constructor() {
    super('DeltaFretFlowDB');

    // Define the schema
    // Note: We only index fields we need to query/sort by.
    // '++id' means auto-incrementing primary key.
    this.version(1).stores({
      exercises: '++id, title, appType, createdAt',
      playlists: '++id, title, createdAt'
    });
  }
}

// Export a single instance of the DB
export const db = new DeltaFretFlowDB();