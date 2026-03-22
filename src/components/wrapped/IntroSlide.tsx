type Props = {
  data: {
    text: string;
  };
};

export default function IntroSlide({ data }: Props) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-8 text-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-16 left-10 w-40 h-40 rounded-full bg-purple-500 opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-52 h-52 rounded-full bg-pink-500 opacity-20 blur-3xl" />

      <p className="text-5xl mb-6 animate-bounce">🌙</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-snug whitespace-pre-line drop-shadow-lg">
        {data.text}
      </h1>
      <div className="mt-10 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150" />
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-300" />
      </div>
    </div>
  );
}
