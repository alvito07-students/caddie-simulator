"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { currentUser } from "../../../lib/roles";

import {
  clearDailyReflections,
  getDailyReflectionsByCaddie,
  saveDailyReflection,
  type EnergyLevel,
  type StoredDailyReflection,
} from "../../../lib/dailyReflectionStorage";

const energyOptions: EnergyLevel[] = [
  "Sangat siap",
  "Cukup baik",
  "Lumayan lelah",
  "Sangat lelah",
  "Butuh recovery",
];

export default function DailyReflectionPage() {
  const isMobile = useIsMobile();

  const [playerSituation, setPlayerSituation] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [bestDecision, setBestDecision] = useState("");
  const [hesitation, setHesitation] = useState("");
  const [challenge, setChallenge] = useState("");
  const [lesson, setLesson] = useState("");
  const [nextTry, setNextTry] = useState("");
  const [trainingNeed, setTrainingNeed] = useState("");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>("Cukup baik");

  const [submittedReflection, setSubmittedReflection] =
    useState<StoredDailyReflection | null>(null);

  const [history, setHistory] = useState<StoredDailyReflection[]>([]);

  useEffect(() => {
    setHistory(getDailyReflectionsByCaddie(currentUser.caddieId ?? "CAD-DEMO"));
  }, []);

  const requiredProgress = getRequiredProgress(
    playerSituation,
    wentWell,
    lesson
  );

  const isFormReady = requiredProgress === 3;

  function submitReflection() {
    const saved = saveDailyReflection({
      caddieId: currentUser.caddieId ?? "CAD-DEMO",
      caddieName: currentUser.name,
      playerSituation,
      wentWell,
      bestDecision,
      hesitation,
      challenge,
      lesson,
      nextTry,
      trainingNeed,
      energyLevel,
    });

    if (!saved) {
      return;
    }

    setSubmittedReflection(saved);
    setHistory(getDailyReflectionsByCaddie(currentUser.caddieId ?? "CAD-DEMO"));

    setPlayerSituation("");
    setWentWell("");
    setBestDecision("");
    setHesitation("");
    setChallenge("");
    setLesson("");
    setNextTry("");
    setTrainingNeed("");
    setEnergyLevel("Cukup baik");
  }

  function clearMyHistory() {
    clearDailyReflections();
    setHistory([]);
    setSubmittedReflection(null);
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle(isMobile)}>
        <div style={heroContentStyle}>
          <div style={eyebrowStyle}>Daily Field Reflection</div>

          <h1 style={heroTitleStyle}>Evaluasi Turun Hari Ini</h1>

          <p style={heroTextStyle}>
            Refleksi singkat setelah turun lapangan. Tujuannya bukan mencari
            salah, tapi membantu caddie mengenali pengalaman, keputusan, dan
            langkah perbaikan berikutnya.
          </p>
        </div>

        <div style={heroStatPanelStyle}>
          <HeroStat label="Caddie" value={currentUser.name} />
          <HeroStat label="Total Refleksi" value={String(history.length)} />
          <HeroStat label="Mode" value="LMS" />
        </div>
      </section>

      <section style={mainGridStyle(isMobile)}>
        <div style={formCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionLabelStyle}>Refleksi Hari Ini</div>
              <h2 style={sectionTitleStyle}>
                Isi berdasarkan pengalaman hari ini
              </h2>
            </div>

            <span style={statusBadgeStyle}>
              {isFormReady ? "Ready" : `${requiredProgress}/3 Required`}
            </span>
          </div>

          <div style={progressBoxStyle}>
            <div style={progressHeaderStyle}>
              <strong>Required Fields</strong>
              <span>{requiredProgress}/3</span>
            </div>

            <div style={progressTrackStyle}>
              <div
                style={{
                  ...progressFillStyle,
                  width: `${(requiredProgress / 3) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <FieldTextArea
            number="01"
            label="Ceritakan singkat situasi turun hari ini. Kamu mendampingi player seperti apa?"
            value={playerSituation}
            onChange={setPlayerSituation}
            placeholder="Contoh: Player cukup agresif, sering minta attack pin, tapi beberapa kali ragu saat dekat hazard."
            required
            isMobile={isMobile}
          />

          <FieldTextArea
            number="02"
            label="Bagian mana dari tugas hari ini yang kamu rasa paling berjalan baik?"
            value={wentWell}
            onChange={setWentWell}
            placeholder="Contoh: Komunikasi dengan player lebih tenang, dan saya lebih cepat membaca arah target aman."
            required
            isMobile={isMobile}
          />

          <FieldTextArea
            number="03"
            label="Keputusan apa yang hari ini kamu rasa paling tepat sebagai caddie?"
            value={bestDecision}
            onChange={setBestDecision}
            placeholder="Contoh: Saya menyarankan layup karena posisi bola dekat water hazard."
            isMobile={isMobile}
          />

          <FieldTextArea
            number="04"
            label="Di bagian mana kamu sempat merasa ragu, kurang yakin, atau perlu berpikir lebih lama?"
            value={hesitation}
            onChange={setHesitation}
            placeholder="Contoh: Saya masih ragu saat memilih club untuk jarak 140 meter dengan angin."
            isMobile={isMobile}
          />

          <FieldTextArea
            number="05"
            label="Situasi apa yang paling menantang hari ini?"
            value={challenge}
            onChange={setChallenge}
            placeholder="Bisa dari player, cuaca, club selection, green reading, hazard, pace of play, atau komunikasi."
            isMobile={isMobile}
          />

          <FieldTextArea
            number="06"
            label="Dari pengalaman hari ini, hal apa yang kamu pelajari?"
            value={lesson}
            onChange={setLesson}
            placeholder="Contoh: Player agresif tetap perlu diberi pilihan aman dengan alasan yang jelas."
            required
            isMobile={isMobile}
          />

          <FieldTextArea
            number="07"
            label="Kalau ketemu situasi mirip lagi, apa yang ingin kamu coba lakukan lebih baik?"
            value={nextTry}
            onChange={setNextTry}
            placeholder="Contoh: Saya ingin menjelaskan risiko target lebih dulu sebelum memberi rekomendasi club."
            isMobile={isMobile}
          />

          <FieldTextArea
            number="08"
            label="Materi latihan atau bantuan apa yang menurut kamu paling dibutuhkan sekarang?"
            value={trainingNeed}
            onChange={setTrainingNeed}
            placeholder="Contoh: Latihan membaca hazard dan memilih safe target."
            isMobile={isMobile}
          />

          <div style={fieldShellStyle(isMobile)}>
            <div style={fieldNumberStyle}>09</div>

            <div style={fieldContentStyle}>
              <label style={labelStyle}>
                Setelah turun hari ini, kondisi kamu seperti apa?
              </label>

              <div style={energyGridStyle}>
                {energyOptions.map((option) => {
                  const isSelected = energyLevel === option;

                  return (
                    <button
                      key={option}
                      onClick={() => setEnergyLevel(option)}
                      type="button"
                      style={{
                        ...energyButtonStyle,
                        ...(isSelected ? selectedEnergyButtonStyle : {}),
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={submitReflection}
            disabled={!isFormReady}
            style={{
              ...submitButtonStyle,
              opacity: isFormReady ? 1 : 0.55,
              cursor: isFormReady ? "pointer" : "not-allowed",
            }}
          >
            Submit Evaluasi
          </button>
        </div>

        <aside style={sideColumnStyle}>
          <div style={summaryCardStyle}>
            <div style={sectionLabelStyle}>System Summary</div>
            <h2 style={sectionTitleStyle}>Ringkasan Pengembangan</h2>

            {!submittedReflection && (
              <div style={emptySummaryStyle}>
                <strong>Belum ada submit baru.</strong>
                <p>
                  Setelah kamu submit evaluasi, sistem akan membuat ringkasan
                  highlight, development area, training need, dan next action.
                </p>
              </div>
            )}

            {submittedReflection && (
              <div style={submittedBoxStyle}>
                <SummaryItem
                  label="Highlight"
                  value={submittedReflection.systemSummary.highlight}
                />

                <SummaryItem
                  label="Development Area"
                  value={submittedReflection.systemSummary.developmentArea}
                />

                <SummaryItem
                  label="Training Need"
                  value={submittedReflection.systemSummary.trainingNeed}
                />

                <SummaryItem
                  label="Next Action"
                  value={submittedReflection.systemSummary.nextAction}
                />
              </div>
            )}
          </div>

          <div style={guideCardStyle}>
            <div style={sectionLabelStyle}>Learning Logic</div>
            <h2 style={sectionTitleStyle}>Bukan SWOT yang kaku</h2>

            <p style={paragraphStyle}>
              Pertanyaan ini tetap membaca sinyal kekuatan, area pengembangan,
              tantangan, peluang latihan, dan kebutuhan training. Tapi caddie
              mengisinya dengan bahasa pengalaman sehari-hari.
            </p>

            <div style={mappingGridStyle}>
              <MappingItem title="Yang berjalan baik" value="Strength Signal" />
              <MappingItem title="Bagian yang ragu" value="Development Area" />
              <MappingItem title="Situasi menantang" value="Field Challenge" />
              <MappingItem title="Ingin dicoba" value="Next Experiment" />
            </div>
          </div>
        </aside>
      </section>

      <section style={historySectionStyle}>
        <div style={historyHeaderStyle(isMobile)}>
          <div>
            <div style={sectionLabelStyle}>Reflection History</div>
            <h2 style={sectionTitleStyle}>Riwayat Refleksi Saya</h2>
          </div>

          <button onClick={clearMyHistory} style={clearButtonStyle}>
            Clear Reflection Data
          </button>
        </div>

        {history.length === 0 && (
          <div style={emptyStateStyle}>
            Belum ada refleksi tersimpan. Isi evaluasi pertama setelah turun
            lapangan.
          </div>
        )}

        <div style={historyGridStyle}>
          {history.map((item) => (
            <div key={item.id} style={historyCardStyle}>
              <div style={historyCardHeaderStyle}>
                <div>
                  <strong>{item.caddieName}</strong>
                  <small>{new Date(item.submittedAt).toLocaleString()}</small>
                </div>

                <span style={getEnergyBadgeStyle(item.energyLevel)}>
                  {item.energyLevel}
                </span>
              </div>

              <ReflectionLine label="Situasi" value={item.playerSituation} />
              <ReflectionLine label="Yang berjalan baik" value={item.wentWell} />
              <ReflectionLine label="Masih ragu" value={item.hesitation || "-"} />
              <ReflectionLine label="Pelajaran" value={item.lesson} />
              <ReflectionLine
                label="Latihan dibutuhkan"
                value={item.trainingNeed || "-"}
              />

              {item.coachingNote && (
                <div style={coachingNoteBoxStyle}>
                  <strong>Coaching Note</strong>
                  <p>{item.coachingNote.note}</p>
                  <small>
                    By {item.coachingNote.trainerName} ·{" "}
                    {new Date(item.coachingNote.updatedAt).toLocaleString()}
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={heroStatItemStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FieldTextArea({
  number,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  isMobile,
}: {
  number: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  isMobile: boolean;
}) {
  return (
    <div style={fieldShellStyle(isMobile)}>
      <div style={fieldNumberStyle}>{number}</div>

      <div style={fieldContentStyle}>
        <label style={labelStyle}>
          {label} {required && <span style={requiredStyle}>Required</span>}
        </label>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={textAreaStyle}
        />
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryItemStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MappingItem({ title, value }: { title: string; value: string }) {
  return (
    <div style={mappingItemStyle}>
      <strong>{title}</strong>
      <span>{value}</span>
    </div>
  );
}

function ReflectionLine({ label, value }: { label: string; value: string }) {
  return (
    <p style={reflectionLineStyle}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

function getRequiredProgress(
  playerSituation: string,
  wentWell: string,
  lesson: string
) {
  return [playerSituation, wentWell, lesson].filter(
    (item) => item.trim().length > 0
  ).length;
}

function getEnergyBadgeStyle(energy: EnergyLevel): CSSProperties {
  const base: CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
  };

  if (energy === "Sangat siap" || energy === "Cukup baik") {
    return {
      ...base,
      background: "#f0fdf4",
      color: "#15803d",
      border: "1px solid #bbf7d0",
    };
  }

  if (energy === "Lumayan lelah") {
    return {
      ...base,
      background: "#fff7ed",
      color: "#c2410c",
      border: "1px solid #fed7aa",
    };
  }

  return {
    ...base,
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < 760);
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

const pageStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  display: "grid",
  gap: 18,
  paddingBottom: 96,
};

function heroStyle(isMobile: boolean): CSSProperties {
  return {
    minWidth: 0,
    borderRadius: isMobile ? 20 : 24,
    padding: isMobile ? 18 : 28,
    color: "#fff",
    background:
      "linear-gradient(135deg, #06142f 0%, #0b2a63 52%, #1d4ed8 100%)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 320px",
    gap: isMobile ? 16 : 22,
    alignItems: "start",
  };
}

const heroContentStyle: CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  maxWidth: "100%",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  lineHeight: 1.2,
};

const heroTitleStyle: CSSProperties = {
  margin: "14px 0 8px",
  fontSize: "clamp(30px, 8vw, 42px)",
  lineHeight: 1.08,
  wordBreak: "normal",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 760,
  color: "#dbeafe",
  lineHeight: 1.6,
  fontSize: "clamp(15px, 4vw, 16px)",
};

const heroStatPanelStyle: CSSProperties = {
  minWidth: 0,
  width: "100%",
  background: "rgba(2,6,23,0.22)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 18,
  padding: 12,
  display: "grid",
  gap: 10,
};

const heroStatItemStyle: CSSProperties = {
  minWidth: 0,
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,0.1)",
  display: "grid",
  gap: 4,
};

function mainGridStyle(isMobile: boolean): CSSProperties {
  return {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 380px",
    gap: 16,
    alignItems: "start",
  };
}

const formCardStyle: CSSProperties = {
  minWidth: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: "clamp(16px, 4vw, 22px)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const sideColumnStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gap: 16,
};

const summaryCardStyle: CSSProperties = {
  minWidth: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: "clamp(16px, 4vw, 20px)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const guideCardStyle: CSSProperties = {
  minWidth: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: "clamp(16px, 4vw, 20px)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const sectionLabelStyle: CSSProperties = {
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  lineHeight: 1.2,
};

const sectionTitleStyle: CSSProperties = {
  margin: "5px 0 0",
  fontSize: "clamp(18px, 5vw, 20px)",
  lineHeight: 1.2,
};

const statusBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  whiteSpace: "nowrap",
};

const progressBoxStyle: CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const progressHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
};

const progressTrackStyle: CSSProperties = {
  height: 8,
  borderRadius: 999,
  background: "#e2e8f0",
  overflow: "hidden",
};

const progressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  transition: "width 0.2s ease",
};

function fieldShellStyle(isMobile: boolean): CSSProperties {
  return {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "44px minmax(0, 1fr)",
    gap: isMobile ? 8 : 12,
    marginTop: 18,
  };
}

const fieldNumberStyle: CSSProperties = {
  width: 44,
  height: 36,
  borderRadius: 12,
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

const fieldContentStyle: CSSProperties = {
  minWidth: 0,
  width: "100%",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 900,
  marginBottom: 8,
  lineHeight: 1.4,
  wordBreak: "normal",
};

const requiredStyle: CSSProperties = {
  display: "inline-flex",
  marginLeft: 8,
  padding: "3px 7px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 900,
};

const textAreaStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  minHeight: 92,
  padding: 13,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  resize: "vertical",
  fontFamily: "inherit",
  fontSize: 14,
  lineHeight: 1.55,
  background: "#fff",
  whiteSpace: "normal",
};

const energyGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))",
  gap: 8,
};

const energyButtonStyle: CSSProperties = {
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#334155",
  fontWeight: 900,
  cursor: "pointer",
};

const selectedEnergyButtonStyle: CSSProperties = {
  background: "#eff6ff",
  borderColor: "#2563eb",
  color: "#1d4ed8",
  boxShadow: "0 0 0 2px rgba(37,99,235,0.1)",
};

const submitButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: 22,
  padding: "14px 16px",
  borderRadius: 14,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  fontWeight: 900,
};

const emptySummaryStyle: CSSProperties = {
  marginTop: 14,
  padding: 16,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#64748b",
  lineHeight: 1.55,
};

const submittedBoxStyle: CSSProperties = {
  marginTop: 14,
  display: "grid",
  gap: 10,
};

const summaryItemStyle: CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 5,
  lineHeight: 1.5,
};

const paragraphStyle: CSSProperties = {
  color: "#475569",
  lineHeight: 1.7,
};

const mappingGridStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  marginTop: 14,
};

const mappingItemStyle: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 4,
};

const historySectionStyle: CSSProperties = {
  minWidth: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: "clamp(16px, 4vw, 20px)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

function historyHeaderStyle(isMobile: boolean): CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: isMobile ? "stretch" : "center",
    flexDirection: isMobile ? "column" : "row",
  };
}

const clearButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  background: "#991b1b",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const emptyStateStyle: CSSProperties = {
  marginTop: 14,
  padding: 18,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#64748b",
  lineHeight: 1.5,
};

const historyGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 12,
  marginTop: 14,
};

const historyCardStyle: CSSProperties = {
  minWidth: 0,
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const historyCardHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: 10,
};

const reflectionLineStyle: CSSProperties = {
  margin: "9px 0",
  color: "#334155",
  lineHeight: 1.5,
};

const coachingNoteBoxStyle: CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 14,
  background: "#faf5ff",
  border: "1px solid #d8b4fe",
};