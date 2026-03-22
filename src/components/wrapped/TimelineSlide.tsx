import { useMemo, useState } from "react";

type TimelineEntry = { date: string; total_ayah: number };

type Props = {
  data: {
    timeline: TimelineEntry[];
  };
};

const W = 340;
const H = 180;
const PAD = { top: 16, right: 12, bottom: 32, left: 36 };

function toPoints(
  timeline: TimelineEntry[],
  max: number,
): { x: number; y: number; entry: TimelineEntry }[] {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  return timeline.map((entry, i) => ({
    x: PAD.left + (i / Math.max(timeline.length - 1, 1)) * innerW,
    y: PAD.top + innerH - (entry.total_ayah / max) * innerH,
    entry,
  }));
}

function smoothPath(
  pts: { x: number; y: number }[],
  tension = 0.35,
): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * tension;
    const cp1y = pts[i].y;
    const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) * tension;
    const cp2y = pts[i + 1].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function formatFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TimelineSlide({ data }: Props) {
  const timeline = data.timeline ?? [];
  const max = Math.max(...timeline.map((d) => d.total_ayah), 1);
  const [hovered, setHovered] = useState<number | null>(null);

  const pts = useMemo(() => toPoints(timeline, max), [timeline, max]);
  const maxIdx = timeline.findIndex((d) => d.total_ayah === max);

  const linePath = smoothPath(pts);

  // Close path for fill: go to bottom-right then bottom-left
  const lastPt = pts[pts.length - 1];
  const firstPt = pts[0];
  const fillPath =
    linePath +
    ` L ${lastPt?.x} ${H - PAD.bottom} L ${firstPt?.x} ${H - PAD.bottom} Z`;

  // Y-axis labels
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    value: Math.round(max * frac),
    y: PAD.top + (H - PAD.top - PAD.bottom) * (1 - frac),
  }));

  // X-axis: show every ~4th label to avoid crowding
  const step = Math.ceil(timeline.length / 6);
  const xLabels = pts.filter((_, i) => i % step === 0 || i === pts.length - 1);

  const hoveredEntry = hovered !== null ? timeline[hovered] : null;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-black px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-indigo-500 opacity-10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-500 opacity-10 blur-3xl" />

      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1 text-center">
        📅 Perjalanan Harian
      </h2>
      <p className="text-white/50 text-sm mb-5 text-center">Total ayat per hari</p>

      {/* Tooltip */}
      <div
        className={`mb-3 px-4 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm text-center transition-all duration-200 ${
          hoveredEntry ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ minHeight: 48 }}
      >
        {hoveredEntry && (
          <>
            <p className="text-white/60 text-xs">{formatFull(hoveredEntry.date)}</p>
            <p className="text-white font-extrabold text-xl">
              {hoveredEntry.total_ayah.toLocaleString()}{" "}
              <span className="text-white/50 text-sm font-medium">ayat</span>
            </p>
          </>
        )}
      </div>

      {/* SVG Chart */}
      <div className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 shadow-2xl p-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="auto"
          className="overflow-visible"
        >
          <defs>
            {/* Gradient fill under the line */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
            </linearGradient>
            {/* Peak gradient */}
            <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yLabels.map((lbl, i) => (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={lbl.y}
                y2={lbl.y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 4}
                y={lbl.y + 4}
                textAnchor="end"
                fontSize={8}
                fill="rgba(255,255,255,0.3)"
              >
                {lbl.value >= 1000
                  ? `${(lbl.value / 1000).toFixed(1)}k`
                  : lbl.value}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={fillPath} fill="url(#areaGrad)" />

          {/* Smooth line */}
          <path
            d={linePath}
            fill="none"
            stroke="#818cf8"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis labels */}
          {xLabels.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={H - PAD.bottom + 14}
              textAnchor="middle"
              fontSize={8}
              fill="rgba(255,255,255,0.3)"
            >
              {formatDate(pt.entry.date)}
            </text>
          ))}

          {/* Dots — all data points, interactive */}
          {pts.map((pt, i) => {
            const isPeak = i === maxIdx;
            const isHov = i === hovered;
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setHovered(i === hovered ? null : i);
                }}
                style={{ cursor: "pointer" }}
              >
                {/* Invisible larger hit area */}
                <circle cx={pt.x} cy={pt.y} r={10} fill="transparent" />

                {isPeak && (
                  <>
                    {/* Peak glow */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHov ? 10 : 7}
                      fill="rgba(251,146,60,0.25)"
                    />
                    <circle cx={pt.x} cy={pt.y} r={4} fill="#fb923c" />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#fb923c"
                      fontWeight="bold"
                    >
                      🔥 Peak
                    </text>
                  </>
                )}
                {!isPeak && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHov ? 5 : 3}
                    fill={isHov ? "#ffffff" : "#818cf8"}
                    stroke={isHov ? "#818cf8" : "none"}
                    strokeWidth={1.5}
                    style={{ transition: "r 0.15s" }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-white/30 text-xs mt-3 text-center">
        Tap titik untuk detail • 🔥 = hari paling produktif
      </p>
    </div>
  );
}
