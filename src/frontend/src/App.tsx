import { useCallback, useEffect, useRef, useState } from "react";
import CustomizeModal from "./components/CustomizeModal";
import { useActor } from "./hooks/useActor";
import CakePage from "./pages/CakePage";
import LetterPage from "./pages/LetterPage";
import MemoriesPage from "./pages/MemoriesPage";
import WelcomePage from "./pages/WelcomePage";

type Page = 1 | 2 | 3 | 4;

export default function App() {
  const { actor, isFetching } = useActor();
  const [currentPage, setCurrentPage] = useState<Page>(1);
  const [boyfriendName, setBoyfriendName] = useState("My Love");
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    Promise.all([
      actor.getBoyfriendName(),
      actor.daysUntilNextBirthday(),
      actor.isTodayBirthday(),
    ])
      .then(([name, days, isToday]) => {
        if (name?.trim()) setBoyfriendName(name.trim());
        setDaysUntil(Number(days));
        setIsBirthdayToday(isToday);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  useEffect(() => {
    const audio = new Audio(
      "https://cdn.pixabay.com/audio/2023/02/21/audio_6dc498a93b.mp3",
    );
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.play().catch(() => {});
      setIsMuted(false);
    } else {
      audio.pause();
      setIsMuted(true);
    }
  }, [isMuted]);

  const navigateTo = useCallback((page: Page) => {
    setPageVisible(false);
    setTimeout(() => {
      setCurrentPage(page);
      setPageVisible(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 380);
  }, []);

  return (
    <div style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* biome-ignore lint/a11y/useMediaCaption: Background ambient music — no dialogue captions needed */}
      <audio ref={audioRef} preload="none" />

      <div
        style={{
          opacity: pageVisible ? 1 : 0,
          transform: pageVisible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.38s ease-in-out, transform 0.38s ease-in-out",
        }}
      >
        {currentPage === 1 && (
          <WelcomePage
            boyfriendName={boyfriendName}
            daysUntil={daysUntil}
            isBirthdayToday={isBirthdayToday}
            onNext={() => navigateTo(2)}
            isMuted={isMuted}
            onToggleMute={toggleMusic}
          />
        )}
        {currentPage === 2 && (
          <LetterPage
            actor={actor}
            onNext={() => navigateTo(3)}
            isMuted={isMuted}
            onToggleMute={toggleMusic}
          />
        )}
        {currentPage === 3 && (
          <CakePage
            onNext={() => navigateTo(4)}
            isMuted={isMuted}
            onToggleMute={toggleMusic}
          />
        )}
        {currentPage === 4 && (
          <MemoriesPage
            actor={actor}
            isMuted={isMuted}
            onToggleMute={toggleMusic}
          />
        )}
      </div>

      {/* Floating Customize button — bottom right */}
      <button
        type="button"
        data-ocid="customize.open_modal_button"
        onClick={() => setShowCustomize(true)}
        title="Customize this surprise"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 100,
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          background: "rgba(230, 192, 169, 0.92)",
          border: "none",
          cursor: "pointer",
          fontSize: "19px",
          boxShadow: "0 2px 16px rgba(180, 100, 80, 0.3)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
      >
        ✏️
      </button>

      {showCustomize && (
        <CustomizeModal
          actor={actor}
          currentName={boyfriendName}
          onSave={(name) => {
            setBoyfriendName(name);
            setShowCustomize(false);
          }}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </div>
  );
}
