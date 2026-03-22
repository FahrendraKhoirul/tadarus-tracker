type StreakEntry = {
  name: string;
  longest_streak: number;
  start: string;
  end: string;
};

type Props = {
  data: {
    list: StreakEntry[];
  };
};

const streakEmoji = (days: number) => {
  if (days >= 6) return "🔥";
  if (days >= 4) return "⚡";
  if (days >= 2) return "✨";
  return "🌱";
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function UserStreakSlide({ data }: Props) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-900 via-pink-900 to-black px-6 relative overflow-hidden">
      <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-rose-500 opacity-10 blur-3xl" />

      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1 text-center">
        🔥 Streak Terpanjang
      </h2>
      <p className="text-white/50 text-sm mb-5 text-center">per anggota</p>

      <div className="w-full max-w-sm flex flex-col gap-3 overflow-y-auto max-h-[65vh] pr-1">
        {data.list.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{streakEmoji(entry.longest_streak)}</span>
              <div>
                <p className="text-white font-bold text-base leading-tight">
                  {entry.name}
                </p>
                <p className="text-white/40 text-xs">
                  {formatDate(entry.start)} – {formatDate(entry.end)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-orange-300 font-extrabold text-2xl">
                {entry.longest_streak}
              </span>
              <span className="text-white/50 text-xs ml-1">hari</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
