type Entry = { name: string; total_ayah: number };

type Props = {
  data: {
    headline: string;
    subtext: string;
    top3: Entry[];
  };
};

const medals = ["🥇", "🥈", "🥉"];
const podiumColors = [
  "from-cyan-400 to-blue-500",
  "from-slate-300 to-slate-400",
  "from-amber-600 to-amber-700",
];

export default function LeaderboardLongestSlide({ data }: Props) {
  const winner = data.top3[0];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-cyan-900 to-black px-6 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-cyan-500 opacity-10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-blue-400 opacity-10 blur-3xl" />

      {/* Badge */}
      <span className="mb-3 px-4 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold tracking-widest uppercase">
        📖 Longest Session
      </span>

      {/* Winner highlight */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <p className="text-white font-extrabold text-3xl md:text-4xl">
          {winner?.name}
        </p>
        <p className="text-cyan-300 font-extrabold text-5xl md:text-6xl leading-none">
          {winner?.total_ayah.toLocaleString()}
        </p>
        <p className="text-white/50 text-sm font-medium">ayat dalam satu sesi</p>
      </div>

      <p className="text-sm md:text-base text-white/70 whitespace-pre-line mb-6 max-w-xs">
        {data.subtext}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {data.top3.map((entry, i) => (
          <div
            key={i}
            className={`flex items-center justify-between bg-gradient-to-r ${podiumColors[i]} rounded-2xl px-5 py-3 shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{medals[i]}</span>
              <span className="text-white font-bold text-lg">{entry.name}</span>
            </div>
            <span className={`font-extrabold ${i === 0 ? "text-2xl text-white" : "text-xl text-white/80"}`}>
              {entry.total_ayah.toLocaleString()}
              <span className="text-sm font-medium ml-1 opacity-70">ayat</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
