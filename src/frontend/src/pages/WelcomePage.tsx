import { motion } from "motion/react";
import { useMemo } from "react";

interface Props {
  boyfriendName: string;
  daysUntil: number | null;
  isBirthdayToday: boolean;
  onNext: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const STAR_DATA = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  left: (((i * 137.508) % 100) + 100) % 100,
  top: (((i * 73.21) % 100) + 100) % 100,
  size: (i % 4) * 0.7 + 1,
  delay: (i * 0.19) % 4,
  duration: (i % 5) * 0.5 + 2,
}));

const HEART_DATA = [
  { id: 0, left: 4, delay: 0, dur: 8, size: 16, emoji: "❤️" },
  { id: 1, left: 16, delay: 1.2, dur: 10, size: 20, emoji: "💕" },
  { id: 2, left: 27, delay: 2.5, dur: 7, size: 13, emoji: "💖" },
  { id: 3, left: 40, delay: 0.6, dur: 11, size: 22, emoji: "✨" },
  { id: 4, left: 55, delay: 1.8, dur: 9, size: 15, emoji: "💗" },
  { id: 5, left: 68, delay: 3.0, dur: 8, size: 18, emoji: "💫" },
  { id: 6, left: 80, delay: 0.3, dur: 10, size: 12, emoji: "❤️" },
  { id: 7, left: 92, delay: 2.1, dur: 7, size: 20, emoji: "🌹" },
];

export default function WelcomePage({
  boyfriendName,
  daysUntil,
  isBirthdayToday,
  onNext,
  isMuted,
  onToggleMute,
}: Props) {
  const stars = useMemo(() => STAR_DATA, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Hero background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/assets/generated/hero-bg.dim_1200x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(12,20,48,0.72) 0%, rgba(30,45,80,0.45) 40%, rgba(90,35,45,0.58) 100%)",
          zIndex: 1,
        }}
      />

      {/* Twinkling stars */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {stars.map((s) => (
          <div
            key={s.id}
            className="star-dot"
            style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "50%",
              background: "white",
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating hearts */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {HEART_DATA.map((h) => (
          <span
            key={h.id}
            className="heart-float"
            style={{
              position: "absolute",
              bottom: "-40px",
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.dur}s`,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {/* Music toggle */}
      <button
        type="button"
        data-ocid="music.toggle"
        onClick={onToggleMute}
        title={isMuted ? "Play music" : "Pause music"}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "50%",
          width: "46px",
          height: "46px",
          cursor: "pointer",
          fontSize: "18px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMuted ? "🔇" : "🎵"}
      </button>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          padding: "2rem 1.5rem",
          maxWidth: "720px",
          width: "100%",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            fontFamily: "Dancing Script, cursive",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            color: "rgba(255, 215, 195, 0.92)",
            marginBottom: "0.8rem",
            letterSpacing: "0.04em",
          }}
        >
          ✨ A Special Surprise Just For You ✨
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2.4rem, 8vw, 5.5rem)",
            fontWeight: 700,
            color: "#F3EEE6",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1.15,
            marginBottom: "1.2rem",
            textShadow: "0 3px 24px rgba(0,0,0,0.35)",
          }}
        >
          Happy Birthday,
          <br />
          <span style={{ color: "#FBBDB4" }}>{boyfriendName}</span>!
          <span style={{ letterSpacing: "0.02em" }}> ❤️</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          style={{
            fontFamily: "Lato, sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "rgba(243, 238, 230, 0.85)",
            maxWidth: "500px",
            margin: "0 auto 1.6rem",
            lineHeight: 1.75,
            fontWeight: 300,
          }}
        >
          Today is all about you, my love. Every moment we&apos;ve shared has
          made my world more beautiful than I ever imagined.
        </motion.p>

        {!isBirthdayToday && daysUntil !== null && daysUntil > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "9999px",
              padding: "0.5rem 1.6rem",
              marginBottom: "1.6rem",
              color: "#FAD4C0",
              fontFamily: "Lato, sans-serif",
              fontSize: "1rem",
            }}
          >
            {daysUntil} days until your special day ✨
          </motion.div>
        )}

        <motion.button
          type="button"
          data-ocid="welcome.primary_button"
          onClick={onNext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{
            scale: 1.06,
            boxShadow: "0 10px 36px rgba(240, 150, 120, 0.5)",
          }}
          whileTap={{ scale: 0.96 }}
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            fontWeight: 600,
            color: "#1E1B18",
            background: "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
            border: "none",
            borderRadius: "9999px",
            padding: "0.9rem 2.8rem",
            cursor: "pointer",
            boxShadow: "0 4px 22px rgba(230, 140, 110, 0.4)",
            letterSpacing: "0.02em",
          }}
        >
          Start the Surprise ✨
        </motion.button>
      </div>
    </div>
  );
}
