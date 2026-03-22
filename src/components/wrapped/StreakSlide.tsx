type Props = {
  data: {
    text: string;
  };
};

function highlightNumbers(text: string) {
  const parts = text.split(/(\d[\d,]*)/g);
  return parts.map((part, i) =>
    /^\d[\d,]*$/.test(part) ? (
      <span key={i} className="text-orange-300 font-extrabold text-5xl md:text-6xl">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function StreakSlide({ data }: Props) {
  const lines = data.text.split("\n");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-black px-8 text-center relative overflow-hidden">
      <div className="absolute top-16 left-8 w-56 h-56 rounded-full bg-red-500 opacity-15 blur-3xl" />
      <div className="absolute bottom-12 right-8 w-48 h-48 rounded-full bg-orange-400 opacity-10 blur-3xl" />

      <p className="text-6xl mb-6">🔥</p>
      <div className="flex flex-col gap-4 text-white text-xl md:text-2xl leading-relaxed font-semibold max-w-md">
        {lines.map((line, i) => (
          <p key={i}>{highlightNumbers(line)}</p>
        ))}
      </div>
    </div>
  );
}
