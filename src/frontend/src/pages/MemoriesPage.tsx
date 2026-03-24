import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { backendInterface } from "../backend";

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  actor?: backendInterface | null;
}

const DEFAULT_MEMORIES = [
  {
    id: "mem-1",
    src: "https://picsum.photos/seed/romance-walk/400/300",
    caption: "The day we first smiled together",
  },
  {
    id: "mem-2",
    src: "https://picsum.photos/seed/mountain-hike/400/300",
    caption: "Our adventure in the mountains",
  },
  {
    id: "mem-3",
    src: "https://picsum.photos/seed/rain-dance/400/300",
    caption: "Dancing in the rain",
  },
  {
    id: "mem-4",
    src: "https://picsum.photos/seed/coffee-morning/400/300",
    caption: "Morning coffee and lazy Sundays",
  },
  {
    id: "mem-5",
    src: "https://picsum.photos/seed/golden-sunset/400/300",
    caption: "The sunset that took our breath away",
  },
  {
    id: "mem-6",
    src: "https://picsum.photos/seed/ordinary-magic/400/300",
    caption: "Every ordinary moment with you",
  },
];

export default function MemoriesPage({ isMuted, onToggleMute, actor }: Props) {
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!actor) {
      // Fall back to localStorage
      try {
        const stored = localStorage.getItem("birthday_memories");
        if (stored) {
          const parsed: { src: string; caption: string }[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const filled = parsed
              .filter((m) => m.src)
              .map((m, i) => ({
                id: `mem-custom-${i + 1}`,
                src: m.src,
                caption: m.caption || `Memory ${i + 1}`,
              }));
            if (filled.length > 0) setMemories(filled);
          }
        }
      } catch {}
      return;
    }

    actor
      .getMemories()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0 && items[0]?.imageData) {
          const mapped = items
            .filter((m) => m.imageData)
            .map((m, i) => ({
              id: `mem-custom-${i + 1}`,
              src: m.imageData,
              caption: m.caption || `Memory ${i + 1}`,
            }));
          if (mapped.length > 0) {
            setMemories(mapped);
            localStorage.setItem(
              "birthday_memories",
              JSON.stringify(
                mapped.map((m) => ({ src: m.src, caption: m.caption })),
              ),
            );
          } else {
            // Fall back to localStorage
            try {
              const stored = localStorage.getItem("birthday_memories");
              if (stored) {
                const parsed: { src: string; caption: string }[] =
                  JSON.parse(stored);
                if (Array.isArray(parsed)) {
                  const filled = parsed
                    .filter((m) => m.src)
                    .map((m, i) => ({
                      id: `mem-custom-${i + 1}`,
                      src: m.src,
                      caption: m.caption || `Memory ${i + 1}`,
                    }));
                  if (filled.length > 0) setMemories(filled);
                }
              }
            } catch {}
          }
        } else {
          // Fall back to localStorage
          try {
            const stored = localStorage.getItem("birthday_memories");
            if (stored) {
              const parsed: { src: string; caption: string }[] =
                JSON.parse(stored);
              if (Array.isArray(parsed)) {
                const filled = parsed
                  .filter((m) => m.src)
                  .map((m, i) => ({
                    id: `mem-custom-${i + 1}`,
                    src: m.src,
                    caption: m.caption || `Memory ${i + 1}`,
                  }));
                if (filled.length > 0) setMemories(filled);
              }
            }
          } catch {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("birthday_memories");
          if (stored) {
            const parsed: { src: string; caption: string }[] =
              JSON.parse(stored);
            if (Array.isArray(parsed)) {
              const filled = parsed
                .filter((m) => m.src)
                .map((m, i) => ({
                  id: `mem-custom-${i + 1}`,
                  src: m.src,
                  caption: m.caption || `Memory ${i + 1}`,
                }));
              if (filled.length > 0) setMemories(filled);
            }
          }
        } catch {}
      });
  }, [actor]);

  useEffect(() => {
    if (!slideshowActive) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [slideshowActive, memories.length]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F2EA",
        padding: "4rem 1.5rem 3rem",
        position: "relative",
      }}
    >
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
          background: "rgba(230, 192, 169, 0.9)",
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

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(1.7rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "#1E1B18",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: "0 0 0.5rem",
          }}
        >
          Our Beautiful Journey ✨
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "Lato, sans-serif",
            color: "#6B5040",
            fontSize: "1rem",
            margin: "0 0 1rem",
          }}
        >
          Every moment with you is a treasure I hold dear
        </motion.p>
        <motion.button
          type="button"
          data-ocid="memories.toggle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setSlideshowActive((v) => !v)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            fontFamily: "Lato, sans-serif",
            fontSize: "0.9rem",
            color: "#1E1B18",
            background: slideshowActive
              ? "#E58D95"
              : "rgba(230, 192, 169, 0.85)",
            border: "none",
            borderRadius: "9999px",
            padding: "0.5rem 1.6rem",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            transition: "background 0.3s",
          }}
        >
          {slideshowActive ? "⏸ Stop Slideshow" : "▶ Slideshow Mode"}
        </motion.button>
      </div>

      {/* Slideshow */}
      {slideshowActive ? (
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto 4rem",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={memories[currentSlide]?.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55 }}
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 8px 36px rgba(0,0,0,0.14)",
              }}
            >
              <img
                src={memories[currentSlide]?.src}
                alt={memories[currentSlide]?.caption}
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
              />
              <div
                style={{
                  background: "#FFFDF9",
                  padding: "1rem 1.6rem",
                  fontFamily: "Dancing Script, cursive",
                  fontSize: "1.25rem",
                  color: "#3E2020",
                  textAlign: "center",
                }}
              >
                {memories[currentSlide]?.caption}
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "1rem",
            }}
          >
            {memories.map((mem, i) => (
              <button
                key={mem.id}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to memory ${i + 1}`}
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: i === currentSlide ? "#E58D95" : "#D0B0A0",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background 0.3s, transform 0.2s",
                  transform: i === currentSlide ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Grid */
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto 4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.6rem",
          }}
        >
          {memories.map((memory, i) => (
            <motion.div
              key={memory.id}
              data-ocid={`memories.item.${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 36px rgba(0,0,0,0.14)" }}
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 4px 22px rgba(0,0,0,0.08)",
                background: "#FFFDF9",
                transition: "box-shadow 0.3s",
              }}
            >
              <img
                src={memory.src}
                alt={memory.caption}
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
              />
              <div
                style={{
                  padding: "0.9rem 1.2rem",
                  fontFamily: "Dancing Script, cursive",
                  fontSize: "1.15rem",
                  color: "#3E2020",
                  textAlign: "center",
                }}
              >
                {memory.caption}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ending message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ textAlign: "center", padding: "1rem 1rem 2.5rem" }}
      >
        <p
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.9rem, 5.5vw, 3.2rem)",
            color: "#5C1A1A",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            margin: 0,
          }}
        >
          Forever with you{" "}
          <span className="pulse-heart" style={{ display: "inline-block" }}>
            ❤️
          </span>
        </p>
      </motion.div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem 1rem",
          borderTop: "1px solid rgba(180, 120, 100, 0.2)",
        }}
      >
        <p
          style={{
            fontFamily: "Lato, sans-serif",
            fontSize: "0.85rem",
            color: "#9B8070",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()}. Built with{" "}
          <span style={{ color: "#E58D95" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#B06060", textDecoration: "none" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
