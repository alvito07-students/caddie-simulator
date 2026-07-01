"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import {
  courseData,
  type HazardType,
  type HoleData,
  type HoleLandmark,
} from "../../../lib/courseData";

import {
  formatPinZone,
  getGreenLayoutByHole,
  getGreenStrategyAdvice,
  type GreenLayout,
  type GreenPinZone,
} from "../../../lib/greenData";

import {
  clubCarryMeters,
  evaluateShot,
  targetLabels,
  type ClubChoice,
  type TargetChoice,
  type TeeChoice,
  type ShotResult,
} from "../../../lib/simulatorEngine";

import {
  playerProfiles,
  type PlayerProfile,
} from "../../../lib/playerProfiles";

const ballStartPosition = {
  left: "50%",
  top: "88%",
};

export default function SimulatorPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerProfiles[0].id);
  const [selectedHole, setSelectedHole] = useState(1);
  const [selectedTee, setSelectedTee] = useState<TeeChoice>("white");
  const [club, setClub] = useState<ClubChoice>("8 Iron");
  const [target, setTarget] = useState<TargetChoice>("safeAim");
  const [isSwinging, setIsSwinging] = useState(false);
  const [ballPosition, setBallPosition] = useState(ballStartPosition);
  const [result, setResult] = useState<ShotResult | null>(null);

  const currentPlayer =
    playerProfiles.find((player) => player.id === selectedPlayerId) ??
    playerProfiles[0];

  const holeData =
    courseData.find((hole) => hole.hole === selectedHole) ?? courseData[0];

  const greenData = getGreenLayoutByHole(selectedHole);

  const selectedClubAvailable = isClubAvailable(currentPlayer, club);

  function changePlayer(playerId: string) {
    setSelectedPlayerId(playerId);
    setResult(null);
    setBallPosition(ballStartPosition);
  }

  function changeHole(holeNumber: number) {
    setSelectedHole(holeNumber);
    setResult(null);
    setBallPosition(ballStartPosition);
  }

  function resetShot() {
    setIsSwinging(false);
    setBallPosition(ballStartPosition);
    setResult(null);
  }

  function handleSwing() {
    setResult(null);

    if (!selectedClubAvailable) {
      setResult(createUnavailableClubResult(currentPlayer, club));
      return;
    }

    setIsSwinging(true);
    setBallPosition(ballStartPosition);

    setTimeout(() => {
      setBallPosition(getBallTargetPosition(target, greenData));
    }, 300);

    setTimeout(() => {
      setIsSwinging(false);

      setResult(
        evaluateShot({
          holeData,
          greenData,
          club,
          target,
          selectedTee,
        })
      );
    }, 1400);
  }

  return (
    <div>
      <h1>Caddie Simulator</h1>
      <p>
        Visual training simulator using real hole data, green pin position,
        player profile, club bag, club selection, and hazard decision logic.
      </p>

      <div style={topControlStyle}>
        <div>
          <label style={labelStyle}>Select Player</label>
          <select
            value={selectedPlayerId}
            onChange={(event) => changePlayer(event.target.value)}
            style={selectStyle}
          >
            {playerProfiles.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} — HCP {player.handicap}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Select Hole</label>
          <select
            value={selectedHole}
            onChange={(event) => changeHole(Number(event.target.value))}
            style={selectStyle}
          >
            {courseData.map((hole) => (
              <option key={hole.hole} value={hole.hole}>
                Hole {hole.hole} — Par {hole.par}
              </option>
            ))}
          </select>
        </div>

        {holeData.par === 3 && (
          <div>
            <label style={labelStyle}>Tee Box</label>
            <select
              value={selectedTee}
              onChange={(event) =>
                setSelectedTee(event.target.value as TeeChoice)
              }
              style={selectStyle}
            >
              <option value="black">Black</option>
              <option value="gold">Gold</option>
              <option value="blue">Blue</option>
              <option value="white">White</option>
              <option value="red">Red</option>
            </select>
          </div>
        )}
      </div>

      <div style={layoutStyle}>
        <section style={gameAreaStyle}>
          <CourseVisual
            holeData={holeData}
            greenData={greenData}
            ballPosition={ballPosition}
            isSwinging={isSwinging}
          />
        </section>

        <aside style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Decision Panel</h2>

          <section style={infoSectionStyle}>
            <h3>Player Briefing</h3>

            <p>
              <strong>Name:</strong> {currentPlayer.name}
            </p>

            <p>
              <strong>Handicap:</strong> {currentPlayer.handicap}
            </p>

            <p>
              <strong>Skill Level:</strong> {currentPlayer.skillLevel}
            </p>

            <p>
              <strong>Play Style:</strong> {currentPlayer.playStyle}
            </p>

            <p>
              <strong>Strength:</strong> {currentPlayer.strength}
            </p>

            <p>
              <strong>Weakness:</strong> {currentPlayer.weakness}
            </p>

            <div style={clubBagBoxStyle}>
              <strong>Club Bag:</strong>

              <div style={clubBagListStyle}>
                {currentPlayer.clubBag.map((clubName) => (
                  <span key={clubName} style={clubChipStyle}>
                    {clubName}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section style={infoSectionStyle}>
            <h3>Hole Briefing</h3>

            <p>
              <strong>Hole:</strong> {holeData.hole}
            </p>

            <p>
              <strong>Par:</strong> {holeData.par}
            </p>

            <p>
              <strong>Main Target:</strong> {holeData.target}
            </p>

            {holeData.par === 3 && (
              <p>
                <strong>Distance from {selectedTee} tee:</strong>{" "}
                {holeData.teeDistances?.[selectedTee] ?? "No data"} m
              </p>
            )}

            <p>
              <strong>Boundary:</strong> {formatBoundary(holeData)}
            </p>
          </section>

          {greenData && (
            <section style={infoSectionStyle}>
              <h3>Green & Pin</h3>

              <p>
                <strong>Pin:</strong> {formatPinZone(greenData.pinZone)}
              </p>

              <p>
                <strong>Safe Aim:</strong>{" "}
                {formatPinZone(greenData.safeAimZone)}
              </p>

              <p>{getGreenStrategyAdvice(greenData)}</p>
            </section>
          )}

          <section style={infoSectionStyle}>
            <h3>Caddie Decision</h3>

            <div style={fieldStyle}>
              <label style={labelStyle}>Club Recommendation</label>

              <select
                value={club}
                onChange={(event) => setClub(event.target.value as ClubChoice)}
                style={{
                  ...selectStyle,
                  borderColor: selectedClubAvailable ? "#cbd5e1" : "#dc2626",
                }}
              >
                {(Object.keys(clubCarryMeters) as ClubChoice[]).map(
                  (clubName) => (
                    <option key={clubName} value={clubName}>
                      {clubName}
                    </option>
                  )
                )}
              </select>

              <small>Estimated carry: {clubCarryMeters[club]} m</small>

              {!selectedClubAvailable && (
                <div style={warningBoxStyle}>
                  This club is not available in {currentPlayer.name}'s bag.
                  Caddie must adapt the recommendation.
                </div>
              )}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Target Recommendation</label>

              <select
                value={target}
                onChange={(event) =>
                  setTarget(event.target.value as TargetChoice)
                }
                style={selectStyle}
              >
                {(Object.entries(targetLabels) as [TargetChoice, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              onClick={handleSwing}
              disabled={isSwinging}
              style={{
                ...primaryButtonStyle,
                opacity: isSwinging ? 0.6 : 1,
                cursor: isSwinging ? "not-allowed" : "pointer",
              }}
            >
              {isSwinging ? "Swinging..." : "Start Swing"}
            </button>

            <button onClick={resetShot} style={secondaryButtonStyle}>
              Reset Ball
            </button>
          </section>

          {result && (
            <section style={resultBoxStyle}>
              <h3>{result.title}</h3>

              <p>
                <strong>Score:</strong> {result.score}
              </p>

              <p>
                <strong>Quality:</strong> {result.quality}
              </p>

              <p>
                <strong>Risk Level:</strong> {result.riskLevel}
              </p>

              <p>
                <strong>Mistake Pattern:</strong> {result.mistakePattern}
              </p>

              <p>{result.feedback}</p>

              <p>
                <strong>Recommendation:</strong> {result.recommendation}
              </p>

              {result.riskFactors.length > 0 && (
                <div>
                  <strong>Risk Factors:</strong>

                  <ul>
                    {result.riskFactors.map((factor) => (
                      <li key={factor}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section style={infoSectionStyle}>
            <h3>Hazard List</h3>

            {holeData.landmarks.map((landmark, index) => (
              <p key={`${landmark.label}-${index}`} style={{ marginBottom: 8 }}>
                • {landmark.distance ? `${landmark.distance}m — ` : ""}
                {landmark.label}
              </p>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}

function CourseVisual({
  holeData,
  greenData,
  ballPosition,
  isSwinging,
}: {
  holeData: HoleData;
  greenData: GreenLayout | undefined;
  ballPosition: { left: string; top: string };
  isSwinging: boolean;
}) {
  return (
    <div style={courseStyle}>
      <div style={holeBadgeStyle}>
        Hole {holeData.hole} · Par {holeData.par}
      </div>

      {holeData.boundaries?.left && holeData.boundaries.left !== "safe" && (
        <div style={{ ...boundaryStyle, left: 8 }}>
          LEFT {holeData.boundaries.left.toUpperCase()}
        </div>
      )}

      {holeData.boundaries?.right && holeData.boundaries.right !== "safe" && (
        <div style={{ ...boundaryStyle, right: 8 }}>
          RIGHT {holeData.boundaries.right.toUpperCase()}
        </div>
      )}

      <div style={roughTextureStyle}></div>
      <div style={fairwayStyle}></div>

      <div style={greenStyle}>
        <span style={flagIconStyle}>⚑</span>

        {greenData && (
          <div
            title={`Pin: ${formatPinZone(greenData.pinZone)}`}
            style={{
              ...pinDotStyle,
              ...getPinDotPosition(greenData.pinZone),
            }}
          ></div>
        )}
      </div>

      {holeData.landmarks
        .filter((landmark) => shouldRenderHazard(landmark.type))
        .map((landmark, index) => (
          <HazardMarker
            key={`${landmark.label}-${index}`}
            landmark={landmark}
            index={index}
          />
        ))}

      <div style={teeBoxStyle}>Tee</div>

      <div style={playerStyle}>
        <div style={headStyle}></div>
        <div style={bodyStyle}></div>
        <div
          style={{
            ...clubStyle,
            transform: isSwinging ? "rotate(-95deg)" : "rotate(-25deg)",
          }}
        ></div>
      </div>

      <div
        style={{
          ...ballStyle,
          left: ballPosition.left,
          top: ballPosition.top,
        }}
      ></div>
    </div>
  );
}

function HazardMarker({
  landmark,
  index,
}: {
  landmark: HoleLandmark;
  index: number;
}) {
  const position = getLandmarkPosition(landmark, index);

  return (
    <div
      title={landmark.label}
      style={{
        ...getHazardStyle(landmark.type),
        ...position,
      }}
    >
      {getHazardShortLabel(landmark.type)}
    </div>
  );
}

function isClubAvailable(player: PlayerProfile, club: ClubChoice) {
  return player.clubBag.includes(club);
}

function createUnavailableClubResult(
  player: PlayerProfile,
  club: ClubChoice
): ShotResult {
  return {
    score: 45,
    quality: "Poor",
    riskLevel: "high",
    title: "Invalid Club Recommendation",
    feedback: `${club} is not available in ${player.name}'s club bag. The caddie recommendation cannot be executed by this player.`,
    recommendation:
      "Choose a club that exists in the player's bag. If the ideal club is missing, adapt with the closest available club and adjust target strategy.",
    mistakePattern: "Unavailable club recommendation",
    riskFactors: ["Club not available", "Poor player adaptation"],
  };
}

function shouldRenderHazard(type: HazardType) {
  return (
    type === "bunker" ||
    type === "water" ||
    type === "obi" ||
    type === "penalty" ||
    type === "dropZone"
  );
}

function getLandmarkPosition(
  landmark: HoleLandmark,
  index: number
): CSSProperties {
  const distance = landmark.distance ?? 100;
  const normalizedTop = 84 - Math.min(distance, 250) * 0.24;

  const sideLeft: Record<string, string> = {
    left: "29%",
    center: "48%",
    right: "66%",
  };

  return {
    left: landmark.side
      ? sideLeft[landmark.side]
      : index % 2 === 0
      ? "42%"
      : "56%",
    top: `${normalizedTop}%`,
  };
}

function getHazardStyle(type: HazardType): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    width: 74,
    height: 42,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    zIndex: 6,
    boxShadow: "0 6px 12px rgba(0,0,0,0.22)",
  };

  if (type === "bunker") {
    return {
      ...base,
      background: "#fde68a",
      color: "#92400e",
    };
  }

  if (type === "water") {
    return {
      ...base,
      background: "linear-gradient(135deg, #38bdf8, #0284c7)",
      color: "#fff",
    };
  }

  if (type === "obi") {
    return {
      ...base,
      background: "#111827",
      color: "#fff",
    };
  }

  if (type === "penalty") {
    return {
      ...base,
      background: "#dc2626",
      color: "#fff",
    };
  }

  if (type === "dropZone") {
    return {
      ...base,
      background: "#a78bfa",
      color: "#fff",
    };
  }

  return {
    ...base,
    background: "#e5e7eb",
    color: "#111827",
  };
}

function getHazardShortLabel(type: HazardType) {
  const labels: Record<HazardType, string> = {
    bunker: "BKR",
    water: "WTR",
    obi: "OBI",
    penalty: "PNLTY",
    tree: "TREE",
    marker: "MRK",
    dropZone: "DROP",
    other: "INFO",
  };

  return labels[type];
}

function getBallTargetPosition(
  target: TargetChoice,
  greenData: GreenLayout | undefined
) {
  if (target === "layupFairway") {
    return { left: "50%", top: "55%" };
  }

  if (target === "leftSide") {
    return { left: "33%", top: "36%" };
  }

  if (target === "rightSide") {
    return { left: "67%", top: "36%" };
  }

  if (target === "directPin" && greenData) {
    return getPinCoursePosition(greenData.pinZone);
  }

  if (target === "safeAim" && greenData) {
    return getPinCoursePosition(greenData.safeAimZone);
  }

  return { left: "50%", top: "30%" };
}

function getPinCoursePosition(zone: GreenPinZone) {
  const positions: Record<GreenPinZone, { left: string; top: string }> = {
    frontLeft: { left: "72%", top: "31%" },
    frontCenter: { left: "78%", top: "31%" },
    frontRight: { left: "84%", top: "31%" },
    middleLeft: { left: "72%", top: "24%" },
    middleCenter: { left: "78%", top: "24%" },
    middleRight: { left: "84%", top: "24%" },
    backLeft: { left: "72%", top: "17%" },
    backCenter: { left: "78%", top: "17%" },
    backRight: { left: "84%", top: "17%" },
  };

  return positions[zone];
}

function getPinDotPosition(zone: GreenPinZone): CSSProperties {
  const positions: Record<GreenPinZone, CSSProperties> = {
    frontLeft: { left: "25%", top: "68%" },
    frontCenter: { left: "48%", top: "68%" },
    frontRight: { left: "70%", top: "68%" },
    middleLeft: { left: "25%", top: "45%" },
    middleCenter: { left: "48%", top: "45%" },
    middleRight: { left: "70%", top: "45%" },
    backLeft: { left: "25%", top: "22%" },
    backCenter: { left: "48%", top: "22%" },
    backRight: { left: "70%", top: "22%" },
  };

  return positions[zone];
}

function formatBoundary(holeData: HoleData) {
  const left = holeData.boundaries?.left ?? "safe";
  const right = holeData.boundaries?.right ?? "safe";

  return `Left: ${left.toUpperCase()} · Right: ${right.toUpperCase()}`;
}

const topControlStyle: CSSProperties = {
  display: "flex",
  gap: 16,
  marginTop: 20,
  marginBottom: 20,
  flexWrap: "wrap",
};

const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 380px",
  gap: 24,
};

const gameAreaStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const courseStyle: CSSProperties = {
  position: "relative",
  height: 620,
  overflow: "hidden",
  borderRadius: 24,
  background:
    "linear-gradient(180deg, #86efac 0%, #4ade80 48%, #22c55e 100%)",
  border: "6px solid #166534",
};

const roughTextureStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 20% 20%, rgba(22,101,52,0.18), transparent 12%), radial-gradient(circle at 80% 40%, rgba(22,101,52,0.16), transparent 10%), radial-gradient(circle at 35% 75%, rgba(22,101,52,0.16), transparent 11%)",
  zIndex: 1,
};

const holeBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 20,
  zIndex: 20,
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.9)",
  fontWeight: 800,
};

const boundaryStyle: CSSProperties = {
  position: "absolute",
  top: "42%",
  zIndex: 20,
  writingMode: "vertical-rl",
  padding: "10px 6px",
  borderRadius: 999,
  background: "#991b1b",
  color: "#fff",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 1,
};

const fairwayStyle: CSSProperties = {
  position: "absolute",
  left: "32%",
  top: "14%",
  width: "35%",
  height: "74%",
  borderRadius: "50% 45% 40% 55%",
  background:
    "linear-gradient(180deg, rgba(187,247,208,0.95), rgba(34,197,94,0.9))",
  boxShadow: "inset 0 0 28px rgba(22,101,52,0.28)",
  zIndex: 2,
};

const greenStyle: CSSProperties = {
  position: "absolute",
  right: "11%",
  top: "9%",
  width: 170,
  height: 120,
  borderRadius: "52% 48% 45% 55%",
  background: "#bbf7d0",
  border: "4px solid #16a34a",
  boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
  zIndex: 10,
};

const flagIconStyle: CSSProperties = {
  position: "absolute",
  left: "46%",
  top: "24%",
  fontSize: 36,
  color: "#dc2626",
};

const pinDotStyle: CSSProperties = {
  position: "absolute",
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#111827",
  border: "2px solid #fff",
  zIndex: 14,
};

const teeBoxStyle: CSSProperties = {
  position: "absolute",
  left: "43%",
  bottom: "6%",
  width: 90,
  height: 46,
  borderRadius: 12,
  background: "#65a30d",
  border: "3px solid #365314",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  zIndex: 8,
};

const playerStyle: CSSProperties = {
  position: "absolute",
  left: "45%",
  top: "78%",
  width: 54,
  height: 100,
  zIndex: 15,
};

const headStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  background: "#facc15",
  marginLeft: 14,
};

const bodyStyle: CSSProperties = {
  width: 26,
  height: 48,
  background: "#1e3a8a",
  borderRadius: 8,
  marginLeft: 13,
  marginTop: 3,
};

const clubStyle: CSSProperties = {
  position: "absolute",
  left: 38,
  top: 26,
  width: 4,
  height: 78,
  background: "#111827",
  transformOrigin: "top center",
  transition: "transform 0.25s ease-in-out",
};

const ballStyle: CSSProperties = {
  position: "absolute",
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: "#fff",
  border: "2px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
  transition: "left 1s ease-out, top 1s ease-out",
  zIndex: 30,
};

const panelStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  height: "fit-content",
};

const infoSectionStyle: CSSProperties = {
  marginTop: 18,
  paddingTop: 12,
  borderTop: "1px solid #e5e7eb",
};

const fieldStyle: CSSProperties = {
  marginTop: 14,
};

const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 700,
  marginBottom: 8,
};

const selectStyle: CSSProperties = {
  minWidth: 180,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#fff",
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: 20,
  padding: "12px 14px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
};

const secondaryButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 800,
  cursor: "pointer",
};

const resultBoxStyle: CSSProperties = {
  marginTop: 20,
  background: "#eff6ff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #bfdbfe",
};

const warningBoxStyle: CSSProperties = {
  marginTop: 8,
  padding: 10,
  borderRadius: 10,
  background: "#fef2f2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  fontSize: 13,
  lineHeight: 1.5,
};

const clubBagBoxStyle: CSSProperties = {
  marginTop: 12,
};

const clubBagListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 8,
};

const clubChipStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  fontSize: 12,
  fontWeight: 700,
};