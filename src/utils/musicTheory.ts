import {type ActiveNote} from '@/components/fretboard/Fretboard2D';

// -- Constants --
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Standard Tuning: String 6 (Low) -> String 1 (High)
// Indices in NOTES array: E=4, A=9, D=2, G=7, B=11, E=4
const STANDARD_TUNING = [4, 11, 7, 2, 9, 4];  // Strings 1 to 6

// Scale Formulas (in semitones)
export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],  // W W H W W W H
  minor: [0, 2, 3, 5, 7, 8, 10],  // W H W W H W W (Natural Minor)
  major_pentatonic: [0, 2, 4, 7, 9],
  minor_pentatonic: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],  // Minor Pentatonic + Blue Note (#4/b5)
} as const;

export type ScaleType = keyof typeof SCALES;
export type NoteName = typeof NOTES[number];

// -- Helpers --

/**
 * Returns an array of notes in the requested scale.
 * e.g. getScaleNotes('C', 'major') -> ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 */
export function getScaleNotes(
    root: NoteName, scaleType: ScaleType): NoteName[] {
  const rootIdx = NOTES.indexOf(root);
  if (rootIdx === -1) return [];

  const intervals = SCALES[scaleType];

  return intervals.map(interval => {
    const noteIdx = (rootIdx + interval) % 12;
    return NOTES[noteIdx];
  });
}

/**
 * Generates the full fretboard mapping for the 2D component.
 * It calculates every note on the neck and checks if it belongs to the scale.
 */
export function generateFretboardMapping(
    root: NoteName, scaleType: ScaleType): ActiveNote[] {
  const scaleNotes = getScaleNotes(root, scaleType);
  const activeNotes: ActiveNote[] = [];

  // Iterate over all 6 strings
  // String 1 is index 0 in STANDARD_TUNING array
  STANDARD_TUNING.forEach((openStringNoteIdx, stringArrIdx) => {
    const stringNum = stringArrIdx + 1;  // 1 to 6

    // Iterate over 22 frets
    for (let fret = 0; fret <= 22; fret++) {
      // Calculate the note at this specific string/fret
      const currentNoteIdx = (openStringNoteIdx + fret) % 12;
      const currentNoteName = NOTES[currentNoteIdx];

      // Check if this note is in our scale
      if (scaleNotes.includes(currentNoteName)) {
        // Determine Color: Root = Red, Others = Blue
        const isRoot = currentNoteName === root;

        activeNotes.push({
          string: stringNum,
          fret: fret,
          color: isRoot ? '#ef4444' :
                          '#3b82f6',  // Tailwind Red-500 vs Blue-500
          isGhost: false
        });
      }
    }
  });

  return activeNotes;
}