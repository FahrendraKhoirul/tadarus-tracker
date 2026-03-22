import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWrappedByTadarusId } from "../api/tadarusApi";

import IntroSlide from "../components/wrapped/IntroSlide";
import SummarySlide from "../components/wrapped/SummarySlide";
import LeaderboardTopReaderSlide from "../components/wrapped/LeaderboardTopReaderSlide";
import LeaderboardSessionsSlide from "../components/wrapped/LeaderboardSessionsSlide";
import LeaderboardLongestSlide from "../components/wrapped/LeaderboardLongestSlide";
import BestDaySlide from "../components/wrapped/BestDaySlide";
import TimelineSlide from "../components/wrapped/TimelineSlide";
import StreakSlide from "../components/wrapped/StreakSlide";
import BreakSlide from "../components/wrapped/BreakSlide";
import UserStreakSlide from "../components/wrapped/UserStreakSlide";
import UserBreakSlide from "../components/wrapped/UserBreakSlide";
import TimePatternSlide from "../components/wrapped/TimePatternSlide";
import PersonalitySlide from "../components/wrapped/PersonalitySlide";
import ClosingSlide from "../components/wrapped/ClosingSlide";

function renderSlide(type: string, data: any) {
  switch (type) {
    case "intro":
      return <IntroSlide data={data} />;
    case "summary":
      return <SummarySlide data={data} />;
    case "leaderboard_top_reader":
      return <LeaderboardTopReaderSlide data={data} />;
    case "leaderboard_sessions":
      return <LeaderboardSessionsSlide data={data} />;
    case "leaderboard_longest":
      return <LeaderboardLongestSlide data={data} />;
    case "best_day":
      return <BestDaySlide data={data} />;
    case "timeline":
      return <TimelineSlide data={data} />;
    case "streak":
      return <StreakSlide data={data} />;
    case "break":
      return <BreakSlide data={data} />;
    case "user_streak":
      return <UserStreakSlide data={data} />;
    case "user_break":
      return <UserBreakSlide data={data} />;
    case "time_pattern":
      return <TimePatternSlide data={data} />;
    case "personality":
      return <PersonalitySlide data={data} />;
    case "closing":
      return <ClosingSlide data={data} />;
    default:
      return (
        <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
          Unknown slide: {type}
        </div>
      );
  }
}

export default function WrappedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slides, setSlides] = useState<{ type: string; data: any }[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState<string>("");
  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Touch swipe state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getWrappedByTadarusId(Number(id));
        setSlides(data.data_json.slides);
        setEventName(data.event_name ?? "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const goNext = useCallback(() => {
    setIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Audio: attempt autoplay; fall back to play on first user interaction
  useEffect(() => {
    const audio = new Audio(
      // Soft royalty-free ambient nasheed — replace with your own track in /public/
      "/music_wrapped.mp3",
    );
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio
      .play()
      .then(() => setAudioReady(true))
      .catch(() => {
        // Autoplay blocked — unlock on first tap
        const unlock = () => {
          audio.play().then(() => {
            setAudioReady(true);
            document.removeEventListener("click", unlock);
            document.removeEventListener("touchend", unlock);
          });
        };
        document.addEventListener("click", unlock);
        document.addEventListener("touchend", unlock);
      });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Sync mute state with audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <p className="text-4xl animate-spin">🌙</p>
          <p className="text-white/60 text-sm animate-pulse">
            Memuat wrapped...
          </p>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <p>Data wrapped tidak tersedia 😔</p>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (dx < -50) goNext();
        if (dx > 50) goPrev();
        setTouchStartX(null);
      }}
      onClick={(e) => {
        const halfWidth = window.innerWidth / 2;
        if (e.clientX > halfWidth) goNext();
        else goPrev();
      }}
    >
      {/* Slide content */}
      <div key={index} className="w-full h-full animate-fadeIn">
        {renderSlide(slide.type, slide.data)}
      </div>

      {/* Progress bar */}
      <div className="absolute top-5 left-0 right-0 px-4 flex gap-1 z-20 pointer-events-none">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-white"
                : i < index
                  ? "bg-white/60"
                  : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Tadarus name */}
      {eventName && (
        <div className="absolute top-9 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <span className="text-white/50 text-[11px] font-semibold tracking-widest uppercase">
            {eventName}
          </span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(-1);
        }}
        className="absolute top-10 left-4 z-30 text-white/60 hover:text-white text-sm font-semibold backdrop-blur-sm bg-black/20 rounded-full px-3 py-1 transition-all"
      >
        ← Back
      </button>

      {/* Mute toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        className="absolute top-10 right-4 z-30 flex items-center gap-1.5 backdrop-blur-sm bg-black/20 rounded-full px-3 py-1 transition-all hover:bg-black/40"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <span className="text-white/40 text-sm">🔇</span>
        ) : (
          <span className="flex items-end gap-[2px] h-4">
            {/* Animated equalizer bars */}
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="w-[3px] rounded-full bg-white/60"
                style={{
                  height: audioReady ? undefined : "4px",
                  animation: audioReady
                    ? `eqBar${n} ${0.6 + n * 0.15}s ease-in-out infinite alternate`
                    : "none",
                }}
              />
            ))}
          </span>
        )}
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <span className="text-white/40 text-xs font-mono">
          {index + 1} / {slides.length}
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease forwards;
        }
        @keyframes eqBar1 {
          from { height: 4px; } to { height: 14px; }
        }
        @keyframes eqBar2 {
          from { height: 8px; } to { height: 16px; }
        }
        @keyframes eqBar3 {
          from { height: 3px; } to { height: 12px; }
        }
      `}</style>
    </div>
  );
}
