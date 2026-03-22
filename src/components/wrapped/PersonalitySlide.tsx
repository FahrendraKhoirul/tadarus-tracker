type PersonalityEntry = {
  name: string;
  personality: string;
  description?: string;
};

type Props = {
  data: {
    list: PersonalityEntry[];
  };
};

const cardColors = [
  "from-violet-500/30 to-purple-600/30",
  "from-rose-500/30 to-pink-600/30",
  "from-blue-500/30 to-cyan-600/30",
  "from-emerald-500/30 to-teal-600/30",
  "from-orange-500/30 to-amber-600/30",
  "from-red-500/30 to-rose-600/30",
  "from-indigo-500/30 to-violet-600/30",
  "from-pink-500/30 to-fuchsia-600/30",
  "from-slate-500/30 to-zinc-600/30",
];

export default function PersonalitySlide({ data }: Props) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-fuchsia-900 via-purple-900 to-black px-4 relative overflow-hidden">
      <div className="absolute top-8 right-8 w-44 h-44 rounded-full bg-fuchsia-500 opacity-15 blur-3xl" />
      <div className="absolute bottom-8 left-8 w-52 h-52 rounded-full bg-purple-400 opacity-10 blur-3xl" />

      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1 text-center">
        🎭 Kepribadian Tadarus
      </h2>
      <p className="text-white/50 text-sm mb-5 text-center">Siapa kamu tahun ini?</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm overflow-y-auto max-h-[70vh] pr-1">
        {data.list.map((entry, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${cardColors[i % cardColors.length]} backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-1`}
          >
            <p className="text-white font-extrabold text-base leading-tight">
              {entry.name}
            </p>
            <p className="text-yellow-200 text-xs font-semibold leading-tight">
              {entry.personality}
            </p>
            {entry.description && (
              <p className="text-white/60 text-[11px] leading-snug mt-1">
                {entry.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
