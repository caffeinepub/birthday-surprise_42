import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ExternalBlob, type backendInterface } from "../backend";

interface Props {
  actor: backendInterface | null;
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DEFAULT_LETTER = [
  "My dearest love, where do I even begin? Every day I wake up overwhelmed by how lucky I am to have you in my life. You have this extraordinary way of making ordinary moments feel magical — a quiet laugh, a gentle touch, the way your eyes light up when you talk about the things you love.",
  "Today is your day, and I want you to know that every single memory we have created together is something I hold close to my heart. You have given me sunsets I never expected to see and mornings I never wanted to end. Every adventure with you feels like a dream I never want to wake from.",
  "Thank you for loving me the way you do — with patience, with warmth, with your whole heart. You are my safe place and my greatest adventure all at once. I fall more deeply in love with you every single day, and I am grateful beyond words for the beautiful life we share.",
  "Happy birthday, my love. Here's to many more years of laughter, adventures, and simply being together. You are my everything, my home, my heart. I love you more than words will ever capture.",
];

const LETTER_LABELS = [
  "Opening",
  "Paragraph 2",
  "Paragraph 3",
  "Closing",
] as const;
const SLOT_KEYS = [
  "slot-0",
  "slot-1",
  "slot-2",
  "slot-3",
  "slot-4",
  "slot-5",
] as const;

type Tab = "details" | "letter" | "memories";

interface MemorySlot {
  image: ExternalBlob | null;
  previewSrc: string;
  caption: string;
}

const EMPTY_SLOTS: MemorySlot[] = Array.from({ length: 6 }, () => ({
  image: null,
  previewSrc: "",
  caption: "",
}));

export default function CustomizeModal({
  actor,
  currentName,
  onSave,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  // Details tab state
  const [name, setName] = useState(
    currentName === "My Love" ? "" : currentName,
  );
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Letter tab state
  const [letterParagraphs, setLetterParagraphs] =
    useState<string[]>(DEFAULT_LETTER);
  const [letterSaving, setLetterSaving] = useState(false);
  const [letterSaved, setLetterSaved] = useState(false);

  // Memories tab state
  const [memories, setMemories] = useState<MemorySlot[]>(EMPTY_SLOTS);
  const [memoriesSaving, setMemoriesSaving] = useState(false);
  const [memoriesSaved, setMemoriesSaved] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load letter and memories from backend
  useEffect(() => {
    if (!actor) {
      // Fall back to localStorage for letter while actor loads
      try {
        const stored = localStorage.getItem("birthday_letter");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === 4) {
            setLetterParagraphs(parsed);
          }
        }
      } catch {}
      return;
    }

    // Load letter from backend
    actor
      .getLetter()
      .then((paragraphs) => {
        if (
          Array.isArray(paragraphs) &&
          paragraphs.length === 4 &&
          paragraphs[0]
        ) {
          setLetterParagraphs(paragraphs);
          localStorage.setItem("birthday_letter", JSON.stringify(paragraphs));
        } else {
          try {
            const stored = localStorage.getItem("birthday_letter");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length === 4) {
                setLetterParagraphs(parsed);
              }
            }
          } catch {}
        }
      })
      .catch(() => {});

    // Load memories from backend using ExternalBlob.getDirectURL()
    actor
      .getMemories()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          const mapped = Array.from({ length: 6 }, (_, i) =>
            items[i]
              ? {
                  image: items[i].image,
                  previewSrc: items[i].image.getDirectURL(),
                  caption: items[i].caption,
                }
              : { image: null, previewSrc: "", caption: "" },
          );
          setMemories(mapped);
        }
      })
      .catch(() => {});
  }, [actor]);

  const handleDetailsSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const saveName = name.trim() || "My Love";
      const calls: Promise<unknown>[] = [actor.setBoyfriendName(saveName)];
      if (month && day && !Number.isNaN(Number(day))) {
        calls.push(actor.setBirthday(BigInt(month), BigInt(day)));
      }
      await Promise.all(calls);
      setSaved(true);
      setTimeout(() => onSave(saveName), 800);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLetterSave = async () => {
    if (!actor) return;
    setLetterSaving(true);
    try {
      await actor.setLetter(letterParagraphs);
      // Keep localStorage as a fast cache
      localStorage.setItem("birthday_letter", JSON.stringify(letterParagraphs));
      setLetterSaved(true);
      setTimeout(() => setLetterSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLetterSaving(false);
    }
  };

  const handleMemoriesSave = async () => {
    if (!actor) return;
    setMemoriesSaving(true);
    try {
      const toSave = memories
        .filter((m) => m.image !== null)
        .map((m) => ({ image: m.image!, caption: m.caption }));
      await actor.setMemories(toSave);
      setMemoriesSaved(true);
      setTimeout(() => setMemoriesSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setMemoriesSaving(false);
    }
  };

  const handleFileChange = async (index: number, file: File) => {
    const previewSrc = URL.createObjectURL(file);
    const arrayBuffer = await file.arrayBuffer();
    const blob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
    setMemories((prev) =>
      prev.map((m, i) => (i === index ? { ...m, image: blob, previewSrc } : m)),
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid #E0C4B8",
    fontFamily: "Lato, sans-serif",
    fontSize: "1rem",
    background: "#FFF8F5",
    color: "#1E1B18",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "Lato, sans-serif",
    fontSize: "0.82rem",
    color: "#4A3030",
    marginBottom: "0.3rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "0.5rem 0.75rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    fontFamily: "Lato, sans-serif",
    fontSize: "0.82rem",
    fontWeight: active ? 700 : 500,
    background: active
      ? "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)"
      : "transparent",
    color: active ? "#1E1B18" : "#8B6050",
    transition: "all 0.25s",
  });

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Modal overlay close on click is supplementary
    <div
      data-ocid="customize.modal"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(20, 10, 10, 0.55)",
        backdropFilter: "blur(7px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ type: "spring", damping: 20, stiffness: 160 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFCF8",
          borderRadius: "22px",
          padding: "1.8rem 1.8rem",
          maxWidth: "520px",
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
          border: "1px solid rgba(210, 170, 155, 0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.2rem",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.5rem",
                color: "#1E1B18",
                margin: 0,
              }}
            >
              Customize ✨
            </h3>
            <p
              style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "0.88rem",
                color: "#8B6050",
                margin: "0.3rem 0 0",
              }}
            >
              Personalize this birthday surprise
            </p>
          </div>
          <button
            type="button"
            data-ocid="customize.close_button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.3rem",
              color: "#9B8070",
              lineHeight: 1,
              padding: "0.2rem",
            }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.3rem",
            background: "#F4EBE4",
            borderRadius: "9999px",
            padding: "4px",
            marginBottom: "1.4rem",
          }}
        >
          <button
            type="button"
            data-ocid="customize.tab"
            style={tabBtnStyle(activeTab === "details")}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            type="button"
            data-ocid="customize.tab"
            style={tabBtnStyle(activeTab === "letter")}
            onClick={() => setActiveTab("letter")}
          >
            Letter 💌
          </button>
          <button
            type="button"
            data-ocid="customize.tab"
            style={tabBtnStyle(activeTab === "memories")}
            onClick={() => setActiveTab("memories")}
          >
            Memories 📸
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div>
            <div style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="customize-name" style={labelStyle}>
                His Name
              </label>
              <input
                id="customize-name"
                data-ocid="customize.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter his name..."
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && handleDetailsSave()}
              />
            </div>
            <div
              style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem" }}
            >
              <div style={{ flex: 1.6 }}>
                <label htmlFor="customize-month" style={labelStyle}>
                  Birth Month
                </label>
                <select
                  id="customize-month"
                  data-ocid="customize.select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={MONTHS.indexOf(m) + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="customize-day" style={labelStyle}>
                  Day
                </label>
                <input
                  id="customize-day"
                  data-ocid="customize.input"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Day"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                data-ocid="customize.cancel_button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "0.72rem",
                  borderRadius: "12px",
                  border: "1.5px solid #E0C4B8",
                  background: "transparent",
                  fontFamily: "Lato, sans-serif",
                  fontSize: "0.95rem",
                  color: "#6B5040",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="customize.save_button"
                onClick={handleDetailsSave}
                disabled={saving}
                style={{
                  flex: 1.4,
                  padding: "0.72rem",
                  borderRadius: "12px",
                  border: "none",
                  background: saved
                    ? "#A8E6CF"
                    : "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
                  fontFamily: "Lato, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#1E1B18",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.75 : 1,
                  transition: "background 0.4s",
                }}
              >
                {saved ? "Saved! 🎉" : saving ? "Saving..." : "Save ✨"}
              </button>
            </div>
          </div>
        )}

        {/* Letter Tab */}
        {activeTab === "letter" && (
          <div>
            <p
              style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "0.85rem",
                color: "#8B6050",
                marginBottom: "1.2rem",
                background: "#FFF0EB",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                border: "1px solid #F0D0C0",
              }}
            >
              💌 Write your personal letter below. It will appear on the Letter
              page.
            </p>
            {LETTER_LABELS.map((label, i) => (
              <div key={label} style={{ marginBottom: "1rem" }}>
                <label htmlFor={`letter-para-${i}`} style={labelStyle}>
                  {label}
                </label>
                <textarea
                  id={`letter-para-${i}`}
                  data-ocid="customize.textarea"
                  value={letterParagraphs[i] || ""}
                  onChange={(e) => {
                    const updated = [...letterParagraphs];
                    updated[i] = e.target.value;
                    setLetterParagraphs(updated);
                  }}
                  rows={3}
                  placeholder={`Write your ${label.toLowerCase()}...`}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.6,
                    fontFamily: "Lato, sans-serif",
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              data-ocid="customize.save_button"
              onClick={handleLetterSave}
              disabled={letterSaving || !actor}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "none",
                background: letterSaved
                  ? "#A8E6CF"
                  : "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
                fontFamily: "Lato, sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#1E1B18",
                cursor: letterSaving ? "not-allowed" : "pointer",
                opacity: letterSaving ? 0.75 : 1,
                transition: "background 0.4s",
              }}
            >
              {letterSaved
                ? "Saved! ✨"
                : letterSaving
                  ? "Saving..."
                  : "Save Letter ✨"}
            </button>
          </div>
        )}

        {/* Memories Tab */}
        {activeTab === "memories" && (
          <div>
            <p
              style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "0.85rem",
                color: "#8B6050",
                marginBottom: "1.2rem",
                background: "#FFF0EB",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                border: "1px solid #F0D0C0",
              }}
            >
              📸 Upload up to 6 photos from your device.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.9rem",
                marginBottom: "1.2rem",
              }}
            >
              {SLOT_KEYS.map((slotKey, i) => (
                <div
                  key={slotKey}
                  style={{
                    borderRadius: "12px",
                    border: "1.5px solid #E0C4B8",
                    overflow: "hidden",
                    background: "#FFF8F5",
                  }}
                >
                  {/* Upload area */}
                  <label
                    htmlFor={`mem-upload-${slotKey}`}
                    style={
                      {
                        position: "relative",
                        aspectRatio: "4/3",
                        background: memories[i]?.previewSrc
                          ? "#000"
                          : "#F4EBE4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        cursor: "pointer",
                      } as React.CSSProperties
                    }
                  >
                    {memories[i]?.previewSrc ? (
                      <img
                        src={memories[i].previewSrc}
                        alt={`Memory ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}
                        >
                          📷
                        </div>
                        <div
                          style={{
                            fontFamily: "Lato, sans-serif",
                            fontSize: "0.75rem",
                            color: "#B08070",
                          }}
                        >
                          Upload Photo
                        </div>
                      </div>
                    )}
                    <input
                      id={`mem-upload-${slotKey}`}
                      ref={(el) => {
                        fileInputRefs.current[i] = el;
                      }}
                      type="file"
                      accept="image/*"
                      data-ocid="customize.upload_button"
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(i, file);
                      }}
                    />
                  </label>
                  {/* Caption */}
                  <div style={{ padding: "0.5rem" }}>
                    <input
                      data-ocid="customize.input"
                      value={memories[i]?.caption || ""}
                      onChange={(e) =>
                        setMemories((prev) =>
                          prev.map((m, idx) =>
                            idx === i ? { ...m, caption: e.target.value } : m,
                          ),
                        )
                      }
                      placeholder="Add a caption..."
                      style={{
                        ...inputStyle,
                        padding: "0.4rem 0.6rem",
                        fontSize: "0.8rem",
                        borderRadius: "7px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              data-ocid="customize.save_button"
              onClick={handleMemoriesSave}
              disabled={memoriesSaving || !actor}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "none",
                background: memoriesSaved
                  ? "#A8E6CF"
                  : "linear-gradient(135deg, #E6C0A9 0%, #F5A99A 100%)",
                fontFamily: "Lato, sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#1E1B18",
                cursor: memoriesSaving ? "not-allowed" : "pointer",
                opacity: memoriesSaving ? 0.75 : 1,
                transition: "background 0.4s",
              }}
            >
              {memoriesSaved
                ? "Saved! ✨"
                : memoriesSaving
                  ? "Saving..."
                  : "Save Photos ✨"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
