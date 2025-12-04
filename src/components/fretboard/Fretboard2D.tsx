import { useMemo } from "react";

// -- Configuration --
const NUM_FRETS = 22;
// We define the SVG coordinate system
const WIDTH = 1000;
const HEIGHT = 180;
const PADDING_X = 50; // Space for the Nut
const PADDING_Y = 30; // Space for top/bottom margins

export interface ActiveNote {
  string: number; // 1 (High E) to 6 (Low E)
  fret: number; // 0 (Open) to 22
  color?: string;
  isGhost?: boolean;
}

interface FretboardProps {
  activeNotes?: ActiveNote[];
  showFretNumbers?: boolean;
}

export function Fretboard2D({
  activeNotes = [],
  showFretNumbers = true,
}: FretboardProps) {
  // 1. Math Helpers
  // Calculate X position of a fret wire based on Rule of 18 (scaled to our SVG width)
  const getFretX = (fretIndex: number) => {
    if (fretIndex === 0) return PADDING_X; // Nut Position
    // Scale factor to fit 22 frets into WIDTH
    const scaleLen = WIDTH * 1.3;
    return PADDING_X + scaleLen * (1 - 1 / Math.pow(2, fretIndex / 12));
  };

  // Calculate Y position of a string
  const getStringY = (stringIndex: number) => {
    // stringIndex: 1 (High E, top) to 6 (Low E, bottom)
    // Actually in diagrams, High E is usually Top visually?
    // Let's stick to Tab standard: High E (1) is TOP line in the drawing?
    // No, standard Tab: High E is TOP line.
    // Standard Guitar View (looking down): Low E is Bottom.
    // Let's do Standard Tab View: String 1 (High E) at Top.
    const availableHeight = HEIGHT - PADDING_Y * 2;
    const spacing = availableHeight / 5;
    return PADDING_Y + (stringIndex - 1) * spacing;
  };

  // 2. Memoize Geometry
  const frets = useMemo(
    () => Array.from({ length: NUM_FRETS + 1 }, (_, i) => i),
    []
  );
  const strings = useMemo(() => [1, 2, 3, 4, 5, 6], []);
  const markers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

  return (
    <div className="w-full overflow-x-auto select-none bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto min-w-[800px]" // Ensures it scrolls on small phones
        preserveAspectRatio="xMidYMid meet"
      >
        {/* -- A. Fretboard Background (Wood) -- */}
        <rect
          x={PADDING_X}
          y={10}
          width={WIDTH - PADDING_X}
          height={HEIGHT - 20}
          fill="#1a1a1a"
          rx={4}
        />

        {/* -- B. Frets -- */}
        {frets.map((i) => {
          const x = getFretX(i);
          if (i === 0) {
            // The Nut (Thick)
            return (
              <rect
                key={i}
                x={x - 4}
                y={10}
                width={8}
                height={HEIGHT - 20}
                fill="#eecfa1"
              />
            );
          }
          return (
            <g key={i}>
              {/* Fret Wire */}
              <line
                x1={x}
                y1={10}
                x2={x}
                y2={HEIGHT - 10}
                stroke="#555"
                strokeWidth={2}
              />
              {/* Fret Number (Below) */}
              {showFretNumbers && markers.includes(i) && (
                <text
                  x={x - (x - getFretX(i - 1)) / 2}
                  y={HEIGHT - 5}
                  fill="#64748b"
                  fontSize={10}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {i}
                </text>
              )}
            </g>
          );
        })}

        {/* -- C. Inlays (Dots) -- */}
        {markers.map((i) => {
          // Center between fret i and i-1
          const x = (getFretX(i) + getFretX(i - 1)) / 2;
          const y = HEIGHT / 2;
          if (i === 12) {
            return (
              <g key={i}>
                <circle cx={x - 8} cy={y} r={4} fill="#333" />
                <circle cx={x + 8} cy={y} r={4} fill="#333" />
              </g>
            );
          }
          return <circle key={i} cx={x} cy={y} r={4} fill="#333" />;
        })}

        {/* -- D. Strings -- */}
        {strings.map((s) => (
          <line
            key={s}
            x1={PADDING_X}
            y1={getStringY(s)}
            x2={WIDTH}
            y2={getStringY(s)}
            stroke={s > 3 ? "#b87333" : "#94a3b8"} // Bronze vs Silver
            strokeWidth={0.5 + s * 0.4} // Variable thickness
            opacity={0.9}
          />
        ))}

        {/* -- E. Active Notes -- */}
        {activeNotes.map((note, idx) => {
          const stringY = getStringY(note.string);
          let noteX;

          if (note.fret === 0) {
            noteX = PADDING_X - 15; // Open string logic (to left of nut)
          } else {
            // Center of fret
            noteX = (getFretX(note.fret) + getFretX(note.fret - 1)) / 2;
          }

          return (
            <g key={`${idx}-${note.string}`}>
              {/* Glow effect */}
              <circle
                cx={noteX}
                cy={stringY}
                r={10}
                fill={note.color || "#3b82f6"}
                fillOpacity={note.isGhost ? 0.2 : 0.4}
                filter="blur(4px)"
              />
              {/* The Note Dot */}
              <circle
                cx={noteX}
                cy={stringY}
                r={7}
                fill={note.color || "#3b82f6"}
                stroke="#fff"
                strokeWidth={2}
                fillOpacity={note.isGhost ? 0.4 : 1}
              />
              {/* Note Name (Optional, basic placeholder) */}
              <text
                x={noteX}
                y={stringY + 2.5}
                fontSize={7}
                fill="#fff"
                textAnchor="middle"
                fontWeight="bold"
                pointerEvents="none"
              >
                {/* Could map 0->E, 1->F etc later */}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
