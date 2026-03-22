type Props = {
  data: {
    text: string;
  };
};

function parseHour(text: string): string | null {
  const match = text.match(/pukul (\d{1,2}:\d{2})/);
  return match ? match[1] : null;
}

export default function TimePatternSlide({ data }: Props) {
  const lines = data.text.split("\n");
  const hour = parseHour(data.text);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-950 to-black px-8 text-center relative overflow-hidden">
      <div className="absolute top-10 left-10 w-56 h-56 rounded-full bg-indigo-400 opacity-10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-400 opacity-15 blur-3xl" />

      <p className="text-5xl mb-4">🌙</p>

      {hour && (
        <div className="mb-6 px-6 py-4 bg-white/10 rounded-3xl border border-white/20 shadow-xl backdrop-blur-sm">
          <p className="text-white/60 text-sm mb-1 font-medium">Waktu Favorit</p>
          <p className="text-white font-extrabold text-6xl md:text-7xl tracking-tight">
            {hour}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 text-white text-lg md:text-xl leading-relaxed font-semibold max-w-md">
        {lines.map((line, i) => (
          <p key={i} className={i === 0 ? "text-purple-300 text-xl" : "text-white/70 text-base"}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
