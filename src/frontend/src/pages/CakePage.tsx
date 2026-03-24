import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

interface Props {
  onNext: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const CANDLE_COLORS = ["#FF8FAB", "#FF9E6C", "#FFC857", "#A8E6CF", "#C3A8E0"];
const CONFETTI_COLORS = [
  "#E58D95",
  "#F9C4BA",
  "#E6C0A9",
  "#A8D8EA",
  "#FFC857",
  "#C3A8E0",
  "#FBCFE8",
  "#BBF7D0",
];

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  isCircle: boolean;
  swayOffset: number;
}

function makeConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 1.67) % 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i * 0.048) % 0.8,
    duration: 2.2 + (i % 7) * 0.35,
    size: 6 + (i % 6),
    isCircle: i % 3 === 0,
    swayOffset: (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 15),
  }));
}

const CANDLE_XS = [116, 128, 140, 152, 164];

function CakeSVG({
  blownCandles,
  onBlowCandle,
}: {
  blownCandles: Set<number>;
  onBlowCandle: (i: number) => void;
}) {
  return (
    <svg
      viewBox="0 0 300 290"
      width="min(300px, 88vw)"
      height="min(290px, 85vw)"
      style={{ filter: "drop-shadow(0 10px 28px rgba(160,80,60,0.28))" }}
      role="img"
    >
      <title>Birthday cake with 5 candles</title>

      {/* Plate shadow */}
      <ellipse
        cx="150"
        cy="272"
        rx="128"
        ry="11"
        fill="#C49070"
        opacity={0.3}
      />

      {/* Bottom tier */}
      <rect x="22" y="196" width="256" height="68" rx="12" fill="#F8C8C8" />
      <rect x="22" y="196" width="256" height="16" rx="10" fill="#FFF0F0" />
      {[44, 72, 100, 128, 156, 184, 212, 240, 262].map((x) => (
        <ellipse key={x} cx={x} cy={196} rx={7} ry={9} fill="#FFF0F0" />
      ))}
      {[50, 92, 138, 184, 228].map((x) => (
        <circle key={x} cx={x} cy={228} r={4.5} fill="#E58D95" />
      ))}
      {[71, 115, 162, 207].map((x) => (
        <circle key={x} cx={x} cy={228} r={3} fill="#C084FC" />
      ))}
      <text
        x="150"
        y="252"
        textAnchor="middle"
        fontFamily="Dancing Script, cursive"
        fontSize="13"
        fill="#8B4A6A"
        fontWeight="600"
      >
        Happy Birthday!
      </text>

      {/* Middle tier */}
      <rect x="60" y="148" width="180" height="52" rx="12" fill="#F9A8D4" />
      <rect x="60" y="148" width="180" height="15" rx="10" fill="#FFECF6" />
      {[76, 100, 124, 150, 174, 198, 220].map((x) => (
        <ellipse key={x} cx={x} cy={148} rx={6} ry={8} fill="#FFECF6" />
      ))}
      {[82, 116, 150, 182, 214].map((x) => (
        <circle key={x} cx={x} cy={172} r={3.5} fill="#C084FC" />
      ))}

      {/* Top tier */}
      <rect x="98" y="108" width="104" height="44" rx="12" fill="#FBCFE8" />
      <rect x="98" y="108" width="104" height="14" rx="10" fill="#FFF5FB" />
      {[112, 130, 150, 170, 188].map((x) => (
        <ellipse key={x} cx={x} cy={108} rx={6} ry={8} fill="#FFF5FB" />
      ))}
      <text x="150" y="138" textAnchor="middle" fontSize="16" fill="#E58D95">
        ♥
      </text>

      {/* Candles */}
      {CANDLE_XS.map((cx, i) => (
        <g
          key={cx}
          onClick={() => {
            if (!blownCandles.has(i)) onBlowCandle(i);
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !blownCandles.has(i)) {
              onBlowCandle(i);
            }
          }}
          // biome-ignore lint/a11y/useSemanticElements: SVG g elements cannot be replaced with button
          tabIndex={blownCandles.has(i) ? -1 : 0}
          role="button"
          aria-label={`Candle ${i + 1}${blownCandles.has(i) ? " (blown out)" : " — click to blow out"}`}
          style={{ cursor: blownCandles.has(i) ? "default" : "pointer" }}
        >
          <rect
            x={cx - 4.5}
            y={72}
            width={10}
            height={37}
            rx={3}
            fill={CANDLE_COLORS[i]}
          />
          <rect
            x={cx - 4.5}
            y={79}
            width={10}
            height={3}
            rx={1.5}
            fill="white"
            opacity={0.4}
          />
          <rect
            x={cx - 4.5}
            y={89}
            width={10}
            height={3}
            rx={1.5}
            fill="white"
            opacity={0.4}
          />
          <line
            x1={cx}
            y1={72}
            x2={cx}
            y2={67}
            stroke="#555"
            strokeWidth={1.5}
          />
          {!blownCandles.has(i) ? (
            <g
              className="candle-flame"
              style={{ transformOrigin: `${cx}px 72px` }}
            >
              <ellipse
                cx={cx}
                cy={60}
                rx={6}
                ry={10}
                fill="#FFD700"
                opacity={0.92}
              />
              <ellipse
                cx={cx}
                cy={63}
                rx={3.5}
                ry={6}
                fill="#FF9500"
                opacity={0.85}
              />
              <ellipse
                cx={cx}
                cy={65}
                rx={1.8}
                ry={3}
                fill="#FF4500"
                opacity={0.7}
              />
              <ellipse
                cx={cx}
                cy={60}
                rx={10}
                ry={14}
                fill="#FFD700"
                opacity={0.14}
              />
            </g>
          ) : (
            <g className="smoke-puff">
              <circle cx={cx} cy={66} r={3.5} fill="#9CA3AF" opacity={0.5} />
              <circle cx={cx + 1} cy={61} r={2} fill="#9CA3AF" opacity={0.3} />
            </g>
          )}
        </g>
      ))}

      {blownCandles.size === 5 && (
        <>
          <text x="18" y="100" fontSize="18" fill="#FFC857">
            ✨
          </text>
          <text x="268" y="100" fontSize="18" fill="#FFC857">
            ✨
          </text>
          <text x="10" y="150" fontSize="14" fill="#E58D95">
            🌟
          </text>
          <text x="274" y="150" fontSize="14" fill="#E58D95">
            🌟
          </text>
        </>
      )}
    </svg>
  );
}

export default function CakePage({ onNext, isMuted, onToggleMute }: Props) {
  const [blownCandles, setBlownCandles] = useState<Set<number>>(new Set());
  const [showWish, setShowWish] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showNext, setShowNext] = useState(false);

  const blowCandle = useCallback((index: number) => {
    setBlownCandles((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      if (next.size === 5) {
        setTimeout(() => {
          setShowWish(true);
          setConfetti(makeConfetti(70));
          setTimeout(() => setShowNext(true), 1800);
        }, 400);
      }
      return next;
    });
  }, []);

  const blowAllSequentially = useCallback(() => {
    for (const i of [0, 1, 2, 3, 4]) {
      setTimeout(() => blowCandle(i), i * 220);
    }
  }, [blowCandle]);

  const allBlown = blownCandles.size === 5;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #D9B7A7 0%, #C8A090 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            position: "fixed",
            top: "-12px",
            left: `${c.left}%`,
            width: `${c.size}px`,
            height: `${c.size * (c.isCircle ? 1 : 1.6)}px`,
            background: c.color,
            borderRadius: c.isCircle ? "50%" : "2px",
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            zIndex: 20,
            pointerEvents: "none",
            marginLeft: `${c.swayOffset}px`,
          }}
        />
      ))}

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
          boxShadow: "0 2px 14px rgba(180,80,60,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMuted ? "🔇" : "🎵"}
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.6rem",
          maxWidth: "580px",
          width: "100%",
          position: "relative",
          zIndex: 5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 6vw, 3.2rem)",
              fontWeight: 700,
              color: "#1E1B18",
              margin: 0,
              marginBottom: "0.4rem",
            }}
          >
            🎂 Make a Wish!
          </h2>
          <p
            style={{
              fontFamily: "Lato, sans-serif",
              color: "#4A3020",
              fontSize: "1.05rem",
              margin: 0,
            }}
          >
            {allBlown
              ? "Your wish is soaring up to the stars ✨"
              : "Click the candles — or the button below — to blow them out!"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            type: "spring",
            damping: 14,
          }}
        >
          <CakeSVG blownCandles={blownCandles} onBlowCandle={blowCandle} />
        </motion.div>

        {!allBlown && (
          <motion.button
            type="button"
            data-ocid="cake.primary_button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={blowAllSequentially}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#1E1B18",
              background: "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
              border: "none",
              borderRadius: "9999px",
              padding: "0.85rem 2.4rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(200, 110, 90, 0.35)",
            }}
          >
            🌬️ Blow Out the Candles!
          </motion.button>
        )}

        <AnimatePresence>
          {showWish && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              style={{ textAlign: "center" }}
            >
              <p
                style={{
                  fontFamily: "Dancing Script, cursive",
                  fontSize: "clamp(2rem, 7vw, 3.8rem)",
                  color: "#5C1A1A",
                  margin: 0,
                  textShadow: "0 2px 14px rgba(220, 100, 80, 0.3)",
                }}
              >
                Make a wish 💫
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNext && (
            <motion.button
              type="button"
              data-ocid="cake.secondary_button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onNext}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#1E1B18",
                background: "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
                border: "none",
                borderRadius: "9999px",
                padding: "0.85rem 2.4rem",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(200, 110, 90, 0.35)",
              }}
            >
              See Our Memories →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
