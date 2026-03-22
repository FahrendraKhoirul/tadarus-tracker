type Props = {
  data: {
    text: string;
  };
};

export default function BreakSlide({ data }: Props) {
  const lines = data.text.split("\n");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-blue-950 to-black px-8 text-center relative overflow-hidden">
      <div className="absolute top-12 right-8 w-52 h-52 rounded-full bg-blue-500 opacity-10 blur-3xl" />
      <div className="absolute bottom-16 left-8 w-44 h-44 rounded-full bg-slate-400 opacity-10 blur-3xl" />

      <p className="text-6xl mb-6">💤</p>
      <div className="flex flex-col gap-4 text-white text-xl md:text-2xl leading-relaxed font-semibold max-w-md">
        {lines.map((line, i) => (
          <p key={i} className={i === 0 ? "text-blue-300" : "text-white/80"}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
