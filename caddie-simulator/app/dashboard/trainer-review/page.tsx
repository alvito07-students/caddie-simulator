"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { currentUser } from "../../../lib/roles";

import {
  getDailyReflections,
  getEnergyRiskCount,
  getTrainingNeedCount,
  saveCoachingNoteToReflection,
  type StoredDailyReflection,
} from "../../../lib/dailyReflectionStorage";

import {
  getAverageScore,
  getHighRiskCount,
  getNeedReviewCount,
  getSimulationResults,
  type StoredSimulationResult,
} from "../../../lib/simulationStorage";

export default function TrainerReviewPage() {
  const [reflections, setReflections] = useState<StoredDailyReflection[]>([]);
  const [simulations, setSimulations] = useState<StoredSimulationResult[]>([]);
  const [activeNotes, setActiveNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setReflections(getDailyReflections());
    setSimulations(getSimulationResults());
  }, []);

  function saveNote(reflectionId: string) {
    const note = activeNotes[reflectionId] ?? "";

    const updated = saveCoachingNoteToReflection(
      reflectionId,
      currentUser.name,
      note
    );

    setReflections(updated);
  }

  const averageScore = getAverageScore(simulations);
  const highRiskCount = getHighRiskCount(simulations);
  const needReviewCount = getNeedReviewCount(simulations);
  const energyRiskCount = getEnergyRiskCount(reflections);
  const trainingNeedCount = getTrainingNeedCount(reflections);

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <div style={eyebrowStyle}>Trainer Workspace</div>

          <h1 style={heroTitleStyle}>Trainer Review</h1>

          <p style={heroTextStyle}>
            Review daily field reflections, simulator test signals, energy
            condition, training needs, and coaching notes for caddie
            development.
          </p>
        </div>

        <div style={heroStatPanelStyle}>
          <HeroStat label="Daily Reflections" value={String(reflections.length)} />
          <HeroStat label="Simulator Results" value={String(simulations.length)} />
          <HeroStat label="Trainer" value={currentUser.name} />
        </div>
      </section>

      <section style={metricGridStyle}>
        <MetricCard
          label="Daily Reflections"
          value={String(reflections.length)}
          description="Submitted by caddies after field duty"
          icon="▣"
          tone="blue"
        />

        <MetricCard
          label="Training Needs"
          value={String(trainingNeedCount)}
          description="Reflection entries with training request"
          icon="✦"
          tone="purple"
        />

        <MetricCard
          label="Energy Risk"
          value={String(energyRiskCount)}
          description="Caddies reporting high fatigue"
          icon="!"
          tone="orange"
        />

        <MetricCard
          label="Avg Simulator Score"
          value={String(averageScore)}
          description="Saved simulator result average"
          icon="▥"
          tone="green"
        />

        <MetricCard
          label="Need Review"
          value={String(needReviewCount)}
          description="Simulator result needs trainer attention"
          icon="◎"
          tone="orange"
        />

        <MetricCard
          label="High Risk Simulation"
          value={String(highRiskCount)}
          description="High-risk simulator outcomes"
          icon="⚑"
          tone="blue"
        />
      </section>

      <section style={twoColumnStyle}>
        <div style={panelCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionLabelStyle}>Daily Field Reflection</div>
              <h2 style={sectionTitleStyle}>Caddie Self-Evaluation Review</h2>
            </div>

            <span style={statusBadgeStyle}>{reflections.length} Items</span>
          </div>

          {reflections.length === 0 && (
            <div style={emptyStateStyle}>
              Belum ada daily reflection dari caddie. Caddie perlu mengisi menu
              Evaluasi Turun Hari Ini terlebih dahulu.
            </div>
          )}

          <div style={reviewListStyle}>
            {reflections.map((item) => (
              <div key={item.id} style={reflectionCardStyle}>
                <div style={cardHeaderStyle}>
                  <div>
                    <strong>{item.caddieName}</strong>
                    <small>{new Date(item.submittedAt).toLocaleString()}</small>
                  </div>

                  <span style={energyBadgeStyle(item.energyLevel)}>
                    {item.energyLevel}
                  </span>
                </div>

                <div style={reflectionGridStyle}>
                  <ReviewLine label="Situasi Player" value={item.playerSituation} />
                  <ReviewLine label="Yang Berjalan Baik" value={item.wentWell} />
                  <ReviewLine label="Keputusan Terbaik" value={item.bestDecision || "-"} />
                  <ReviewLine label="Masih Ragu" value={item.hesitation || "-"} />
                  <ReviewLine label="Tantangan" value={item.challenge || "-"} />
                  <ReviewLine label="Pelajaran" value={item.lesson} />
                  <ReviewLine label="Next Try" value={item.nextTry || "-"} />
                  <ReviewLine label="Training Need" value={item.trainingNeed || "-"} />
                </div>

                <div style={systemSummaryBoxStyle}>
                  <h4>System Summary</h4>

                  <p>
                    <strong>Highlight:</strong>{" "}
                    {item.systemSummary.highlight}
                  </p>

                  <p>
                    <strong>Development Area:</strong>{" "}
                    {item.systemSummary.developmentArea}
                  </p>

                  <p>
                    <strong>Training Need:</strong>{" "}
                    {item.systemSummary.trainingNeed}
                  </p>

                  <p>
                    <strong>Next Action:</strong>{" "}
                    {item.systemSummary.nextAction}
                  </p>
                </div>

                {item.coachingNote && (
                  <div style={existingNoteBoxStyle}>
                    <h4>Existing Coaching Note</h4>
                    <p>{item.coachingNote.note}</p>
                    <small>
                      By {item.coachingNote.trainerName} ·{" "}
                      {new Date(item.coachingNote.updatedAt).toLocaleString()}
                    </small>
                  </div>
                )}

                <div style={coachingFormStyle}>
                  <label style={labelStyle}>Trainer Coaching Note</label>

                  <textarea
                    value={activeNotes[item.id] ?? item.coachingNote?.note ?? ""}
                    onChange={(event) =>
                      setActiveNotes((prev) => ({
                        ...prev,
                        [item.id]: event.target.value,
                      }))
                    }
                    placeholder="Tulis catatan coaching yang spesifik, suportif, dan bisa ditindaklanjuti."
                    style={textAreaStyle}
                  />

                  <button
                    onClick={() => saveNote(item.id)}
                    style={saveButtonStyle}
                  >
                    Save Coaching Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside style={sideColumnStyle}>
          <div style={panelCardStyle}>
            <div style={sectionLabelStyle}>Simulator Test Signals</div>
            <h2 style={sectionTitleStyle}>Latest Saved Results</h2>

            {simulations.length === 0 && (
              <div style={emptyStateStyle}>
                Belum ada hasil simulator yang disimpan.
              </div>
            )}

            <div style={simulationListStyle}>
              {simulations.slice(0, 8).map((item) => (
                <div key={item.id} style={simulationCardStyle}>
                  <div style={cardHeaderStyle}>
                    <div>
                      <strong>{item.caddieName}</strong>
                      <small>
                        Hole {item.hole.number} · {item.player.name} · HCP{" "}
                        {item.player.handicap}
                      </small>
                    </div>

                    <span style={scoreBadgeStyle}>{item.result.score}</span>
                  </div>

                  <div style={simMiniGridStyle}>
                    <MiniReadout label="Quality" value={item.result.quality} />
                    <MiniReadout label="Risk" value={item.result.riskLevel} />
                    <MiniReadout label="Club" value={item.decision.club} />
                    <MiniReadout
                      label="Target"
                      value={item.decision.targetLabel}
                    />
                  </div>

                  <p style={paragraphStyle}>
                    <strong>Mistake:</strong> {item.result.mistakePattern}
                  </p>

                  <p style={paragraphStyle}>
                    <strong>Training Focus:</strong>{" "}
                    {item.result.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={panelCardStyle}>
            <div style={sectionLabelStyle}>Trainer Guidance</div>
            <h2 style={sectionTitleStyle}>Coaching Rules</h2>

            <div style={guidanceListStyle}>
              <GuidanceItem
                title="Be specific"
                description="Catatan trainer harus menyebut situasi, keputusan, dan langkah latihan."
              />

              <GuidanceItem
                title="Avoid blaming"
                description="Gunakan reflection sebagai coaching signal, bukan alat menghukum."
              />

              <GuidanceItem
                title="Connect to training"
                description="Hubungkan refleksi dan simulator result ke latihan berikutnya."
              />
            </div>
          </div>
        </aside>
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

function MetricCard({
  label,
  value,
  description,
  icon,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: "blue" | "green" | "purple" | "orange";
}) {
  const toneStyle = toneMap[tone];

  return (
    <div style={metricCardStyle}>
      <div style={{ ...metricIconStyle, ...toneStyle }}>{icon}</div>

      <div>
        <span style={metricLabelStyle}>{label}</span>
        <strong style={metricValueStyle}>{value}</strong>
        <p style={metricDescriptionStyle}>{description}</p>
      </div>
    </div>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={reviewLineStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniReadout({ label, value }: { label: string; value: string }) {
  return (
    <div style={miniReadoutStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function GuidanceItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={guidanceItemStyle}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

function energyBadgeStyle(energy: string): CSSProperties {
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

const toneMap: Record<string, CSSProperties> = {
  blue: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
  },
  green: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },
  purple: {
    background: "#faf5ff",
    color: "#9333ea",
    border: "1px solid #d8b4fe",
  },
  orange: {
    background: "#fff7ed",
    color: "#ea580c",
    border: "1px solid #fed7aa",
  },
};

const pageStyle: CSSProperties = {
  display: "grid",
  gap: 18,
};

const heroStyle: CSSProperties = {
  borderRadius: 24,
  padding: 28,
  color: "#fff",
  background:
    "linear-gradient(135deg, #06142f 0%, #0b2a63 52%, #1d4ed8 100%)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 320px",
  gap: 22,
  alignItems: "center",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

const heroTitleStyle: CSSProperties = {
  margin: "14px 0 8px",
  fontSize: 36,
  lineHeight: 1.1,
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 760,
  color: "#dbeafe",
  lineHeight: 1.65,
};

const heroStatPanelStyle: CSSProperties = {
  background: "rgba(2,6,23,0.28)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 20,
  padding: 16,
  display: "grid",
  gap: 10,
};

const heroStatItemStyle: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,0.1)",
  display: "grid",
  gap: 4,
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 14,
};

const metricCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
};

const metricIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: 20,
  flexShrink: 0,
};

const metricLabelStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
};

const metricValueStyle: CSSProperties = {
  display: "block",
  marginTop: 4,
  fontSize: 22,
  color: "#0f172a",
};

const metricDescriptionStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  lineHeight: 1.4,
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 420px",
  gap: 16,
  alignItems: "start",
};

const sideColumnStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const panelCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: 20,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
};

const sectionLabelStyle: CSSProperties = {
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.6,
  textTransform: "uppercase",
};

const sectionTitleStyle: CSSProperties = {
  margin: "5px 0 0",
  fontSize: 20,
};

const statusBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  fontSize: 12,
  fontWeight: 900,
};

const emptyStateStyle: CSSProperties = {
  marginTop: 14,
  padding: 18,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#64748b",
};

const reviewListStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  marginTop: 14,
};

const reflectionCardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
};

const reflectionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 10,
  marginTop: 14,
};

const reviewLineStyle: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  background: "#fff",
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 5,
};

const systemSummaryBoxStyle: CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 16,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
};

const existingNoteBoxStyle: CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 16,
  background: "#faf5ff",
  border: "1px solid #d8b4fe",
};

const coachingFormStyle: CSSProperties = {
  marginTop: 14,
  paddingTop: 14,
  borderTop: "1px solid #e5e7eb",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 900,
  marginBottom: 8,
};

const textAreaStyle: CSSProperties = {
  width: "100%",
  minHeight: 90,
  padding: 13,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: 1.55,
};

const saveButtonStyle: CSSProperties = {
  marginTop: 10,
  padding: "11px 14px",
  borderRadius: 12,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const simulationListStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  marginTop: 14,
};

const simulationCardStyle: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const scoreBadgeStyle: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "#1d4ed8",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  flexShrink: 0,
};

const simMiniGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 8,
  marginTop: 12,
};

const miniReadoutStyle: CSSProperties = {
  padding: 10,
  borderRadius: 14,
  background: "#fff",
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 4,
};

const paragraphStyle: CSSProperties = {
  color: "#334155",
  lineHeight: 1.55,
};

const guidanceListStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 14,
};

const guidanceItemStyle: CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};