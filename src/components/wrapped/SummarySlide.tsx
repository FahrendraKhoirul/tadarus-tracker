type Props = {
  data: {
    text: string;
  };
};

function highlightNumbers(text: string) {
  // Split by number patterns (digits + commas) and render big bold spans
  const parts = text.split(/(\d[\d,]*)/g);
  return parts.map((part, i) =>
    /^\d[\d,]*$/.test(part) ? (
      <span key={i} className="text-yellow-300 font-extrabold text-4xl md:text-5xl">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SummarySlide({ data }: Props) {
  const lines = data.text.split("\n");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 via-teal-900 to-black px-8 text-center relative overflow-hidden">
      <div className="absolute top-10 right-8 w-48 h-48 rounded-full bg-emerald-400 opacity-10 blur-3xl" />
      <div className="absolute bottom-16 left-8 w-56 h-56 rounded-full bg-teal-300 opacity-10 blur-3xl" />

      <p className="text-4xl mb-4">📖</p>
      <div className="flex flex-col gap-4 text-white text-xl md:text-2xl leading-relaxed font-semibold max-w-md">
        {lines.map((line, i) => (
          <p key={i}>{highlightNumbers(line)}</p>
        ))}
      </div>
    </div>
  );
}
