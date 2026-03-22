type Props = {
  data: {
    text: string;
  };
};

function highlightNumbers(text: string) {
  const parts = text.split(/(\d[\d,]*)/g);
  return parts.map((part, i) =>
    /^\d[\d,]*$/.test(part) ? (
      <span
        key={i}
        className="text-orange-300 font-extrabold text-4xl md:text-5xl"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function BestDaySlide({ data }: Props) {
  const lines = data.text.split("\n");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-700 via-orange-800 to-black px-8 text-center relative overflow-hidden">
      <div className="absolute top-12 right-8 w-52 h-52 rounded-full bg-yellow-400 opacity-10 blur-3xl" />
      <div className="absolute bottom-12 left-8 w-48 h-48 rounded-full bg-orange-500 opacity-15 blur-3xl" />

      <p className="text-5xl mb-6">🚀</p>
      <div className="flex flex-col gap-4 text-white text-xl md:text-2xl leading-relaxed font-semibold max-w-md">
        {lines.map((line, i) => (
          <p key={i}>{highlightNumbers(line)}</p>
        ))}
      </div>
    </div>
  );
}
