type Props = {
  data: {
    text: string;
  };
};

export default function ClosingSlide({ data }: Props) {
  const lines = data.text.split("\n");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-black px-8 text-center relative overflow-hidden">
      <div className="absolute top-16 left-12 w-52 h-52 rounded-full bg-indigo-500 opacity-10 blur-3xl" />
      <div className="absolute bottom-16 right-12 w-44 h-44 rounded-full bg-purple-400 opacity-10 blur-3xl" />

      <p className="text-5xl mb-8">🌙</p>

      <div className="flex flex-col gap-4 max-w-md">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`text-xl md:text-2xl font-semibold leading-relaxed ${
              i === 0
                ? "text-white"
                : i === lines.length - 1
                ? "text-purple-300 text-2xl font-extrabold"
                : "text-white/70"
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="mt-12 flex gap-2 items-center">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse delay-150" />
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-300" />
      </div>

      <p className="mt-8 text-white/30 text-xs tracking-widest uppercase">
        Ramadhan Wrapped · 2026
      </p>
    </div>
  );
}
