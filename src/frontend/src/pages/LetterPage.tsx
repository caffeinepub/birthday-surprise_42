import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { backendInterface } from "../backend";

interface Props {
  onNext: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  actor?: backendInterface | null;
}

const DEFAULT_PARAGRAPHS = [
  "My dearest love, where do I even begin? Every day I wake up overwhelmed by how lucky I am to have you in my life. You have this extraordinary way of making ordinary moments feel magical — a quiet laugh, a gentle touch, the way your eyes light up when you talk about the things you love.",
  "Today is your day, and I want you to know that every single memory we have created together is something I hold close to my heart. You have given me sunsets I never expected to see and mornings I never wanted to end. Every adventure with you feels like a dream I never want to wake from.",
  "Thank you for loving me the way you do — with patience, with warmth, with your whole heart. You are my safe place and my greatest adventure all at once. I fall more deeply in love with you every single day, and I am grateful beyond words for the beautiful life we share.",
  "Happy birthday, my love. Here's to many more years of laughter, adventures, and simply being together. You are my everything, my home, my heart. I love you more than words will ever capture.",
];

const PARA_IDS = [
  "para-opening",
  "para-two",
  "para-three",
  "para-closing",
] as const;

export default function LetterPage({
  onNext,
  isMuted,
  onToggleMute,
  actor,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [paragraphs, setParagraphs] = useState(DEFAULT_PARAGRAPHS);

  useEffect(() => {
    if (!actor) {
      // Fall back to localStorage
      try {
        const stored = localStorage.getItem("birthday_letter");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === 4 && parsed[0]) {
            setParagraphs(parsed);
          }
        }
      } catch {}
      return;
    }

    actor
      .getLetter()
      .then((result) => {
        if (Array.isArray(result) && result.length === 4 && result[0]) {
          setParagraphs(result);
          localStorage.setItem("birthday_letter", JSON.stringify(result));
        } else {
          // Fall back to localStorage
          try {
            const stored = localStorage.getItem("birthday_letter");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length === 4 && parsed[0]) {
                setParagraphs(parsed);
              }
            }
          } catch {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("birthday_letter");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length === 4 && parsed[0]) {
              setParagraphs(parsed);
            }
          }
        } catch {}
      });
  }, [actor]);

  useEffect(() => {
    const timers = paragraphs.map((_, i) =>
      setTimeout(
        () => setVisibleCount((prev) => Math.max(prev, i + 1)),
        500 + i * 900,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [paragraphs]);

  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: `heart-${i}`,
        left: (i * 7.14 + 3) % 100,
        delay: (i * 0.55) % 6,
        dur: 7 + (i % 6),
        size: 11 + (i % 5) * 3,
        emoji: ["❤️", "💕", "💗", "💖", "💓"][i % 5],
      })),
    [],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6E7E6",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem 3rem",
      }}
    >
      {/* Floating hearts */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart-float"
            style={{
              position: "absolute",
              bottom: "-30px",
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.dur}s`,
              opacity: 0.55,
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
          position: "fixed",
          top: "20px",
          right: "74px",
          zIndex: 50,
          background: "rgba(230, 192, 169, 0.88)",
          backdropFilter: "blur(8px)",
          border: "none",
          borderRadius: "50%",
          width: "46px",
          height: "46px",
          cursor: "pointer",
          fontSize: "18px",
          boxShadow: "0 2px 14px rgba(180,80,60,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMuted ? "🔇" : "🎵"}
      </button>

      {/* Page label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: "Lato, sans-serif",
          fontSize: "0.8rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#B08080",
          marginBottom: "1.2rem",
        }}
      >
        A Letter From My Heart
      </motion.p>

      {/* Letter card */}
      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.2 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "600px",
          width: "100%",
          background: "#FFFCF8",
          borderRadius: "4px",
          padding: "clamp(1.8rem, 5vw, 3rem) clamp(1.5rem, 5vw, 2.8rem)",
          boxShadow:
            "0 10px 50px rgba(180, 90, 70, 0.16), 0 2px 8px rgba(0,0,0,0.07)",
          border: "1px solid rgba(210, 170, 155, 0.45)",
        }}
      >
        {/* Decorative top */}
        <div style={{ textAlign: "center", marginBottom: "1.6rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>❤️</div>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
              color: "#7A3A3A",
              fontStyle: "italic",
              fontWeight: 400,
              margin: 0,
            }}
          >
            To My Dearest Love
          </h2>
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, #D4A0A0 30%, #D4A0A0 70%, transparent)",
              margin: "1rem 0 0",
            }}
          />
        </div>

        {/* Paragraphs */}
        <div
          style={{
            fontFamily: "Dancing Script, cursive",
            fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
            lineHeight: 1.9,
            color: "#3E2020",
          }}
        >
          {paragraphs.map((text, i) => (
            <AnimatePresence key={PARA_IDS[i]}>
              {visibleCount > i && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65 }}
                  style={{ marginBottom: "1.1rem" }}
                >
                  {text}
                </motion.p>
              )}
            </AnimatePresence>
          ))}

          {visibleCount >= paragraphs.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                textAlign: "right",
                marginTop: "0.8rem",
                fontSize: "clamp(1.2rem, 3.5vw, 1.4rem)",
                color: "#7A3A3A",
              }}
            >
              With all my love, always yours ❤️
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Next button */}
      <AnimatePresence>
        {visibleCount >= paragraphs.length && (
          <motion.button
            type="button"
            data-ocid="letter.primary_button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onNext}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{
              marginTop: "2.2rem",
              fontFamily: "Playfair Display, serif",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#1E1B18",
              background: "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
              border: "none",
              borderRadius: "9999px",
              padding: "0.85rem 2.4rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(230, 140, 110, 0.35)",
              position: "relative",
              zIndex: 10,
            }}
          >
            Next →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
