"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { currentUser } from "../../../lib/roles";

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
  generateRandomPlayerProfile,
  getMissingClubs,
  type PlayerProfile,
} from "../../../lib/playerProfiles";

import {
  generateReflection,
  type ReflectionResult,
} from "../../../lib/reflectionEngine";

import {
  createSimulationResultId,
  saveSimulationResult,
  type StoredSimulationResult,
} from "../../../lib/simulationStorage";

import {
  getShotLandingResult,
  type LandingResult,
  type LandingZoneType,
} from "../../../lib/landingEngine";

const ballStartPosition = {
  left: "50%",
  top: "88%",
};

type SimulationSummary = {
  id: string;
  caddieName: string;
  playerName: string;
  handicap: number;
  hole: number;
  par: number;
  club: ClubChoice;
  target: string;
  landing: string;
  score: number;
  quality: string;
  riskLevel: string;
  mistakePattern: string;
  trainingFocus: string;
};

export default function SimulatorPage() {
  const isMobile = useIsMobile();

  const [currentPlayer, setCurrentPlayer] = useState<PlayerProfile | null>(
    null
  );

  const [selectedHole, setSelectedHole] = useState(1);
  const [selectedTee, setSelectedTee] = useState<TeeChoice>("white");
  const [club, setClub] = useState<ClubChoice>("Driver");
  const [target, setTarget] = useState<TargetChoice>("safeAim");
  const [isSwinging, setIsSwinging] = useState(false);
  const [ballPosition, setBallPosition] = useState(ballStartPosition);
  const [landing, setLanding] = useState<LandingResult | null>(null);
  const [result, setResult] = useState<ShotResult | null>(null);
  const [reflection, setReflection] = useState<ReflectionResult | null>(null);
  const [summary, setSummary] = useState<SimulationSummary | null>(null);
  const [isDecisionOpen, setIsDecisionOpen] = useState(true);

  useEffect(() => {
    setCurrentPlayer(generateRandomPlayerProfile());
  }, []);

  const holeData =
    courseData.find((hole) => hole.hole === selectedHole) ?? courseData[0];

  const greenData = getGreenLayoutByHole(selectedHole);

  const selectedClubAvailable = currentPlayer
    ? isClubAvailable(currentPlayer, club)
    : false;

  function generateNewPlayer() {
    setCurrentPlayer(generateRandomPlayerProfile());
    resetScenario();
  }

  function changeHole(holeNumber: number) {
    setSelectedHole(holeNumber);
    resetScenario();
  }

  function resetScenario() {
    setIsSwinging(false);
    setBallPosition(ballStartPosition);
    setLanding(null);
    setResult(null);
    setReflection(null);
    setSummary(null);
  }

  function handleSwing() {
    setLanding(null);
    setResult(null);
    setReflection(null);
    setSummary(null);

    if (!currentPlayer) {
      return;
    }

    if (!selectedClubAvailable) {
      const unavailableResult = createUnavailableClubResult(currentPlayer, club);
      setResult(unavailableResult);
      setReflection(generateReflection(unavailableResult));
      return;
    }

    const shotLanding = getShotLandingResult({
      holeData,
      greenData,
      club,
      target,
      selectedTee,
    });

    setIsSwinging(true);
    setBallPosition(ballStartPosition);

    setTimeout(() => {
      setLanding(shotLanding);
      setBallPosition(shotLanding.visualPosition);
    }, 300);

    setTimeout(() => {
      setIsSwinging(false);

      const shotResult = evaluateShot({
        holeData,
        greenData,
        club,
        target,
        selectedTee,
      });

      setResult(shotResult);
      setReflection(generateReflection(shotResult));
    }, 1400);
  }

  function finishSimulation() {
    if (!currentPlayer || !result || !reflection) {
      return;
    }

    const completedAt = new Date().toISOString();
    const simulationId = createSimulationResultId();

    const storedResult: StoredSimulationResult = {
      id: simulationId,
      completedAt,

      caddieId: currentUser.caddieId ?? "CAD-DEMO",
      caddieName: currentUser.name,

      player: {
        name: currentPlayer.name,
        handicap: currentPlayer.handicap,
        skillLevel: currentPlayer.skillLevel,
        playStyle: currentPlayer.playStyle,
        strength: currentPlayer.strength,
        weakness: currentPlayer.weakness,
        clubBag: currentPlayer.clubBag,
      },

      hole: {
        number: holeData.hole,
        par: holeData.par,
        tee: holeData.par === 3 ? selectedTee : "default",
        mainTarget: holeData.target,
      },

      decision: {
        club,
        target,
        targetLabel: targetLabels[target],
      },

      result: {
        score: result.score,
        quality: result.quality,
        riskLevel: result.riskLevel,
        mistakePattern: result.mistakePattern,
        riskFactors: result.riskFactors,
        feedback: result.feedback,
        recommendation: result.recommendation,
      },

      reflection,
    };

    saveSimulationResult(storedResult);

    setSummary({
      id: simulationId,
      caddieName: currentUser.name,
      playerName: currentPlayer.name,
      handicap: currentPlayer.handicap,
      hole: holeData.hole,
      par: holeData.par,
      club,
      target: targetLabels[target],
      landing: landing?.title ?? "No landing data",
      score: result.score,
      quality: result.quality,
      riskLevel: result.riskLevel,
      mistakePattern: result.mistakePattern,
      trainingFocus: result.recommendation,
    });
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div style={heroContentStyle}>
          <div style={moduleLabelStyle}>LIVE TRAINING MODULE</div>

          <h1 style={heroTitleStyle}>Caddie Simulator</h1>

          <p style={heroTextStyle}>
            Simulate real tournament scenarios, get caddie recommendations, and
            make better decisions under pressure.
          </p>

          <div style={heroActionRowStyle}>
            <span>▶ How it works</span>
            <span>▣ View Tutorial</span>
          </div>
        </div>

        <div style={heroRightStyle}>
          <div style={practiceBadgeStyle}>
            Practice Session <span style={greenDotStyle}></span>
          </div>

          <span style={sessionTextStyle}>Session 18</span>

          <div style={heroSilhouetteStyle}>
            <div style={personOneStyle}></div>
            <div style={personTwoStyle}></div>
            <div style={bagStyle}></div>
          </div>
        </div>
      </section>

      <section style={controlGridStyle}>
        <ControlCard
          label="ASSIGNED COURSE"
          title="Golf Course"
          subtitle="Internal Training Course"
          icon="♣"
        />

        <div style={controlCardStyle}>
          <div style={controlHeaderStyle}>
            <span style={controlIconStyle}>☘</span>
            <span style={controlLabelStyle}>PLAYER ASSIGNMENT</span>
          </div>

          <div style={controlContentStyle}>
            <div>
              <strong>
                {currentPlayer ? currentPlayer.name : "Assigning Player"}
              </strong>
              <small>
                {currentPlayer
                  ? `${currentPlayer.skillLevel} • HCP ${currentPlayer.handicap}`
                  : "Random profile"}
              </small>
            </div>

            <button onClick={generateNewPlayer} style={shuffleButtonStyle}>
              ⟳
            </button>
          </div>
        </div>

        <div style={controlCardStyle}>
          <div style={controlHeaderStyle}>
            <span style={controlIconStyle}>▣</span>
            <span style={controlLabelStyle}>HOLE & SCENARIO</span>
          </div>

          <select
            value={selectedHole}
            onChange={(event) => changeHole(Number(event.target.value))}
            style={cleanSelectStyle}
          >
            {courseData.map((hole) => (
              <option key={hole.hole} value={hole.hole}>
                Hole {hole.hole} • Par {hole.par}
              </option>
            ))}
          </select>

          {holeData.par === 3 && (
            <select
              value={selectedTee}
              onChange={(event) =>
                setSelectedTee(event.target.value as TeeChoice)
              }
              style={{ ...cleanSelectStyle, marginTop: 8 }}
            >
              <option value="black">Black Tee</option>
              <option value="gold">Gold Tee</option>
              <option value="blue">Blue Tee</option>
              <option value="white">White Tee</option>
              <option value="red">Red Tee</option>
            </select>
          )}
        </div>
      </section>

      <section style={isMobile ? mobileMiddleGridStyle : middleGridStyle}>
        <ScenarioBriefingCard
          player={currentPlayer}
          holeData={holeData}
          greenData={greenData}
          selectedTee={selectedTee}
        />

        <LiveCourseView
          holeData={holeData}
          greenData={greenData}
          ballPosition={ballPosition}
          isSwinging={isSwinging}
          landing={landing}
          selectedTee={selectedTee}
          club={club}
          isMobile={isMobile}
        />

        <ConversationCard
          player={currentPlayer}
          holeData={holeData}
          club={club}
          target={target}
          landing={landing}
          result={result}
        />
      </section>

      {!isMobile && (
        <DecisionRecommendation
          currentPlayer={currentPlayer}
          club={club}
          setClub={setClub}
          target={target}
          setTarget={setTarget}
          selectedClubAvailable={selectedClubAvailable}
          isSwinging={isSwinging}
          handleSwing={handleSwing}
          resetScenario={resetScenario}
          result={result}
          finishSimulation={finishSimulation}
        />
      )}

      {isMobile && (
        <>
          {!isDecisionOpen && (
            <button
              onClick={() => setIsDecisionOpen(true)}
              style={mobileFloatingButtonStyle}
            >
              Decision & Recommendation
            </button>
          )}

          {isDecisionOpen && (
            <div style={mobileSheetStyle}>
              <div style={sheetHandleStyle}></div>

              <div style={mobileSheetHeaderStyle}>
                <div>
                  <span style={controlLabelStyle}>
                    DECISION & RECOMMENDATION
                  </span>
                  <h2 style={mobileSheetTitleStyle}>Caddie Advice</h2>
                </div>

                <button
                  onClick={() => setIsDecisionOpen(false)}
                  style={closeSheetButtonStyle}
                >
                  ×
                </button>
              </div>

              <DecisionRecommendation
                currentPlayer={currentPlayer}
                club={club}
                setClub={setClub}
                target={target}
                setTarget={setTarget}
                selectedClubAvailable={selectedClubAvailable}
                isSwinging={isSwinging}
                handleSwing={handleSwing}
                resetScenario={resetScenario}
                result={result}
                finishSimulation={finishSimulation}
                compact
              />
            </div>
          )}
        </>
      )}

      {(landing || result || reflection || summary) && (
        <section style={feedbackGridStyle}>
          {landing && (
            <FeedbackCard title={landing.title} tone="cyan">
              <p>{landing.description}</p>
              <p>
                <strong>Caddie says:</strong> {landing.caddieLine}
              </p>
              <p>
                <strong>Coach note:</strong> {landing.coachNote}
              </p>
            </FeedbackCard>
          )}

          {result && (
            <FeedbackCard title={result.title} tone="blue">
              <div style={resultMiniGridStyle}>
                <MiniMetric label="Score" value={String(result.score)} />
                <MiniMetric label="Quality" value={result.quality} />
                <MiniMetric label="Risk" value={result.riskLevel} />
              </div>

              <p>
                <strong>Mistake Pattern:</strong> {result.mistakePattern}
              </p>

              <p>{result.feedback}</p>

              <p>
                <strong>Training Focus:</strong> {result.recommendation}
              </p>
            </FeedbackCard>
          )}

          {reflection && (
            <FeedbackCard title="Learning Reflection" tone="green">
              <p>
                <strong>Experience:</strong> {reflection.experience}
              </p>
              <p>
                <strong>Observation:</strong> {reflection.observation}
              </p>
              <p>
                <strong>Concept:</strong> {reflection.concept}
              </p>
              <p>
                <strong>Next:</strong> {reflection.nextExperiment}
              </p>
            </FeedbackCard>
          )}

          {summary && (
            <FeedbackCard title="Simulation Saved" tone="purple">
              <p>
                <strong>ID:</strong> {summary.id}
              </p>
              <p>
                <strong>Caddie:</strong> {summary.caddieName}
              </p>
              <p>
                <strong>Player:</strong> {summary.playerName} · HCP{" "}
                {summary.handicap}
              </p>
              <p>
                <strong>Hole:</strong> {summary.hole} · Par {summary.par}
              </p>
              <p>
                <strong>Score:</strong> {summary.score}
              </p>
            </FeedbackCard>
          )}
        </section>
      )}
    </div>
  );
}

function DecisionRecommendation({
  currentPlayer,
  club,
  setClub,
  target,
  setTarget,
  selectedClubAvailable,
  isSwinging,
  handleSwing,
  resetScenario,
  result,
  finishSimulation,
  compact = false,
}: {
  currentPlayer: PlayerProfile | null;
  club: ClubChoice;
  setClub: (club: ClubChoice) => void;
  target: TargetChoice;
  setTarget: (target: TargetChoice) => void;
  selectedClubAvailable: boolean;
  isSwinging: boolean;
  handleSwing: () => void;
  resetScenario: () => void;
  result: ShotResult | null;
  finishSimulation: () => void;
  compact?: boolean;
}) {
  const visibleClubs = compact
    ? (Object.keys(clubCarryMeters) as ClubChoice[]).slice(0, 4)
    : (Object.keys(clubCarryMeters) as ClubChoice[]);

  return (
    <section style={compact ? compactDecisionSectionStyle : decisionSectionStyle}>
      {!compact && (
        <div style={decisionHeaderStyle}>
          <div>
            <span style={controlLabelStyle}>DECISION & RECOMMENDATION</span>
            <h2 style={decisionTitleStyle}>Choose the best caddie advice</h2>
          </div>

          <span style={scoringImpactStyle}>
            Scoring Impact {result ? result.score : "--"}
          </span>
        </div>
      )}

      <div
        style={compact ? compactClubOptionGridStyle : clubOptionGridStyle}
      >
        {visibleClubs.map((clubName) => {
          const isSelected = club === clubName;
          const isAvailable = currentPlayer
            ? currentPlayer.clubBag.includes(clubName)
            : true;

          return (
            <button
              key={clubName}
              onClick={() => setClub(clubName)}
              style={{
                ...clubOptionStyle,
                ...(isSelected ? selectedClubOptionStyle : {}),
                opacity: isAvailable ? 1 : 0.48,
              }}
            >
              <span style={clubIconStyle}>◒</span>

              <div style={{ textAlign: "left" }}>
                <strong>{clubName}</strong>
                <small>{clubCarryMeters[clubName]}m</small>
              </div>

              {isSelected && <span style={checkCircleStyle}>✓</span>}
            </button>
          );
        })}

        {compact && (
          <button style={clubOptionStyle}>
            <span style={clubIconStyle}>＋</span>
            <div style={{ textAlign: "left" }}>
              <strong>More</strong>
              <small>Options</small>
            </div>
          </button>
        )}
      </div>

      {currentPlayer && !selectedClubAvailable && (
        <div style={warningBoxStyle}>
          Club ini tidak ada di bag {currentPlayer.name}. Caddie harus adaptasi
          dengan club yang tersedia.
        </div>
      )}

      <div style={compact ? compactDecisionBottomGridStyle : decisionBottomGridStyle}>
        <div style={decisionInputGroupStyle}>
          <label>Target Line</label>

          <select
            value={target}
            onChange={(event) => setTarget(event.target.value as TargetChoice)}
            style={decisionSelectStyle}
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

        <DecisionReadout label="Aim Point" value={targetLabels[target]} />
        <DecisionReadout
          label="Confidence"
          value={result ? result.quality : "Medium"}
        />

        <div style={decisionButtonAreaStyle}>
          <button
            onClick={handleSwing}
            disabled={isSwinging || !currentPlayer}
            style={{
              ...submitButtonStyle,
              opacity: isSwinging || !currentPlayer ? 0.6 : 1,
              cursor: isSwinging || !currentPlayer ? "not-allowed" : "pointer",
            }}
          >
            {isSwinging ? "Swinging..." : "Submit Recommendation"}
          </button>

          {result && (
            <button onClick={finishSimulation} style={saveButtonStyle}>
              Finish & Save
            </button>
          )}

          <button onClick={resetScenario} style={resetButtonStyle}>
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

function ControlCard({
  label,
  title,
  subtitle,
  icon,
}: {
  label: string;
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div style={controlCardStyle}>
      <div style={controlHeaderStyle}>
        <span style={controlIconStyle}>{icon}</span>
        <span style={controlLabelStyle}>{label}</span>
      </div>

      <div style={controlContentStyle}>
        <div>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>

        <span style={{ color: "#64748b" }}>⌄</span>
      </div>
    </div>
  );
}

function ScenarioBriefingCard({
  player,
  holeData,
  greenData,
  selectedTee,
}: {
  player: PlayerProfile | null;
  holeData: HoleData;
  greenData: GreenLayout | undefined;
  selectedTee: TeeChoice;
}) {
  return (
    <div style={panelCardStyle}>
      <div style={panelHeaderStyle}>
        <div>
          <span style={controlLabelStyle}>SCENARIO BRIEFING</span>
          <h3 style={panelTitleStyle}>Read Before Recommending</h3>
        </div>

        <span style={activeBadgeStyle}>Active</span>
      </div>

      <InfoRow
        label="Player"
        value={
          player ? `${player.name} • HCP ${player.handicap}` : "Assigning..."
        }
        sideValue={player ? player.playStyle : ""}
      />

      <InfoRow
        label="Player Weakness"
        value={player?.weakness ?? "-"}
        sideValue={player?.skillLevel ?? ""}
      />

      <InfoRow
        label="Hole Target"
        value={`Hole ${holeData.hole} • Par ${holeData.par}`}
        sideValue={
          holeData.par === 3
            ? `${holeData.teeDistances?.[selectedTee] ?? "-"}m`
            : "Course data"
        }
      />

      <InfoRow
        label="Green Strategy"
        value={greenData ? formatPinZone(greenData.safeAimZone) : "-"}
        sideValue={greenData ? `Pin ${formatPinZone(greenData.pinZone)}` : ""}
      />

      <InfoRow
        label="Boundary"
        value={formatBoundary(holeData)}
        sideValue="Risk side"
      />

      {greenData && (
        <div style={adviceBoxStyle}>{getGreenStrategyAdvice(greenData)}</div>
      )}
    </div>
  );
}

function LiveCourseView({
  holeData,
  greenData,
  ballPosition,
  isSwinging,
  landing,
  selectedTee,
  club,
  isMobile,
}: {
  holeData: HoleData;
  greenData: GreenLayout | undefined;
  ballPosition: { left: string; top: string };
  isSwinging: boolean;
  landing: LandingResult | null;
  selectedTee: TeeChoice;
  club: ClubChoice;
  isMobile: boolean;
}) {
  const trailTop = landing ? Number.parseFloat(landing.visualPosition.top) : 88;
  const trailHeight = landing ? Math.max(88 - trailTop, 8) : 0;

  return (
    <div style={panelCardStyle}>
      <div style={panelHeaderStyle}>
        <div>
          <span style={controlLabelStyle}>LIVE COURSE VIEW</span>
          <h3 style={panelTitleStyle}>Shot Landing Map</h3>
        </div>

        <span style={windBadgeStyle}>↗ 6 mph SW</span>
      </div>

      <div
        style={{
          ...courseViewStyle,
          height: isMobile ? 360 : 310,
        }}
      >
        <div style={courseSkyStyle}></div>
        <div style={courseTreeLeftStyle}></div>
        <div style={courseTreeRightStyle}></div>
        <div style={courseFairwayStyle}></div>
        <div style={courseGreenStyle}></div>

        {greenData && (
          <div
            style={{
              ...coursePinStyle,
              ...getPinDotPosition(greenData.pinZone),
            }}
          ></div>
        )}

        {holeData.landmarks
          .filter((landmark) => shouldRenderHazard(landmark.type))
          .map((landmark, index) => (
            <HazardMarker
              key={`${landmark.label}-${index}`}
              landmark={landmark}
              index={index}
            />
          ))}

        {landing && (
          <>
            <div
              style={{
                ...shotTrailStyle,
                top: `${trailTop}%`,
                height: `${trailHeight}%`,
              }}
            ></div>

            <div
              style={{
                ...landingRingStyle,
                left: landing.visualPosition.left,
                top: landing.visualPosition.top,
                borderColor: getLandingZoneColor(landing.landingZone),
              }}
            ></div>

            <div
              style={{
                ...landingLabelStyle,
                left: landing.visualPosition.left,
                top: `calc(${landing.visualPosition.top} - 34px)`,
                background: getLandingZoneColor(landing.landingZone),
              }}
            >
              {getLandingZoneLabel(landing.landingZone)}
            </div>
          </>
        )}

        <div style={teeBoxStyle}>TEE</div>

        <div style={playerStyle}>
          <div style={headStyle}></div>
          <div style={bodyStyle}></div>
          <div
            style={{
              ...clubStyle,
              transform: isSwinging ? "rotate(-100deg)" : "rotate(-25deg)",
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

        <div style={courseStatsOverlayStyle}>
          <CourseStat
            value={
              holeData.par === 3
                ? `${holeData.teeDistances?.[selectedTee] ?? "-"}`
                : `${clubCarryMeters[club]}`
            }
            label={holeData.par === 3 ? "Meters" : "Carry"}
          />
          <CourseStat value="+6" label="Elev" />
          <CourseStat
            value={landing ? landing.landingZone : "Fairway"}
            label="Lie"
          />
          <CourseStat
            value={landing ? `${landing.actualLandingDistance}m` : "—"}
            label="Landing"
          />
        </div>
      </div>
    </div>
  );
}

function ConversationCard({
  player,
  holeData,
  club,
  target,
  landing,
  result,
}: {
  player: PlayerProfile | null;
  holeData: HoleData;
  club: ClubChoice;
  target: TargetChoice;
  landing: LandingResult | null;
  result: ShotResult | null;
}) {
  return (
    <div style={panelCardStyle}>
      <div style={panelHeaderStyle}>
        <div>
          <span style={controlLabelStyle}>CONVERSATION / TRAINING</span>
          <h3 style={panelTitleStyle}>Caddie–Player Dialogue</h3>
        </div>
      </div>

      <ChatBubble
        role="Caddie"
        text={
          player
            ? getPlayerDialogue(player, holeData)
            : "Saya menunggu briefing player."
        }
      />

      <ChatBubble
        role="You"
        isOwn
        text={`Saya rekomendasikan ${club} ke ${targetLabels[target]}. Saya pertimbangkan isi bag, hazard, dan target aman.`}
      />

      {landing && <ChatBubble role="Caddie" text={landing.caddieLine} />}

      {result && (
        <ChatBubble
          role="Trainer"
          text={`Coach feedback: ${result.mistakePattern}. ${result.recommendation}`}
        />
      )}

      <div style={chatInputStyle}>
        <span>Type your response...</span>
        <button style={sendButtonStyle}>➤</button>
      </div>
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

function InfoRow({
  label,
  value,
  sideValue,
}: {
  label: string;
  value: string;
  sideValue?: string;
}) {
  return (
    <div style={infoRowStyle}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      {sideValue && <small>{sideValue}</small>}
    </div>
  );
}

function CourseStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={courseStatStyle}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ChatBubble({
  role,
  text,
  isOwn = false,
}: {
  role: string;
  text: string;
  isOwn?: boolean;
}) {
  return (
    <div
      style={{
        ...chatRowStyle,
        justifyContent: isOwn ? "flex-end" : "flex-start",
      }}
    >
      {!isOwn && <div style={chatAvatarStyle}>{role[0]}</div>}

      <div
        style={{
          ...chatBubbleStyle,
          ...(isOwn ? ownChatBubbleStyle : {}),
        }}
      >
        <small>{role}</small>
        <p>{text}</p>
        <span>10:24 AM</span>
      </div>
    </div>
  );
}

function DecisionReadout({ label, value }: { label: string; value: string }) {
  return (
    <div style={decisionReadoutStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeedbackCard({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "cyan" | "blue" | "green" | "purple";
  children: React.ReactNode;
}) {
  const styleMap: Record<typeof tone, CSSProperties> = {
    cyan: {
      background: "#ecfeff",
      border: "1px solid #a5f3fc",
    },
    blue: {
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
    },
    green: {
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
    },
    purple: {
      background: "#faf5ff",
      border: "1px solid #d8b4fe",
    },
  };

  return (
    <div style={{ ...feedbackCardStyle, ...styleMap[tone] }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div style={miniMetricStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < 900);
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

function getPlayerDialogue(player: PlayerProfile, holeData: HoleData) {
  if (player.playStyle === "aggressive") {
    return `We're playing Hole ${holeData.hole}. I want a chance, but my weak point is ${player.weakness}. What's your plan off the tee?`;
  }

  if (player.playStyle === "conservative") {
    return `I want to play this hole safely. Please help me choose the club and target with lower risk.`;
  }

  return `For Hole ${holeData.hole}, I need a balanced recommendation. Not too aggressive, but not too defensive.`;
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
  const normalizedTop = 88 - Math.min(distance, 260) * 0.26;

  const sideLeft: Record<string, string> = {
    left: "31%",
    center: "50%",
    right: "67%",
  };

  return {
    left: landmark.side
      ? sideLeft[landmark.side]
      : index % 2 === 0
      ? "43%"
      : "57%",
    top: `${Math.max(normalizedTop, 12)}%`,
  };
}

function getHazardStyle(type: HazardType): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    width: 58,
    height: 30,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 900,
    zIndex: 8,
    boxShadow: "0 6px 14px rgba(15,23,42,0.24)",
  };

  if (type === "bunker") {
    return { ...base, background: "#fde68a", color: "#92400e" };
  }

  if (type === "water") {
    return {
      ...base,
      background: "linear-gradient(135deg, #38bdf8, #0284c7)",
      color: "#fff",
    };
  }

  if (type === "obi") {
    return { ...base, background: "#111827", color: "#fff" };
  }

  if (type === "penalty") {
    return { ...base, background: "#dc2626", color: "#fff" };
  }

  if (type === "dropZone") {
    return { ...base, background: "#a78bfa", color: "#fff" };
  }

  return { ...base, background: "#e5e7eb", color: "#111827" };
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

function getLandingZoneColor(zone: LandingZoneType) {
  const colors: Record<LandingZoneType, string> = {
    green: "#16a34a",
    fairway: "#2563eb",
    bunker: "#d97706",
    water: "#0284c7",
    obi: "#111827",
    penalty: "#dc2626",
    rough: "#4d7c0f",
    short: "#ca8a04",
    long: "#9333ea",
    layup: "#0f766e",
  };

  return colors[zone];
}

function getLandingZoneLabel(zone: LandingZoneType) {
  const labels: Record<LandingZoneType, string> = {
    green: "GREEN",
    fairway: "FAIRWAY",
    bunker: "BUNKER",
    water: "WATER",
    obi: "OBI",
    penalty: "PENALTY",
    rough: "ROUGH",
    short: "SHORT",
    long: "LONG",
    layup: "LAYUP",
  };

  return labels[zone];
}

const pageStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const heroStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  minHeight: 210,
  borderRadius: 22,
  padding: 28,
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 20,
  background:
    "linear-gradient(135deg, #06142f 0%, #0b2a63 52%, #1d4ed8 100%)",
  color: "#fff",
  boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
};

const heroContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
};

const moduleLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#bfdbfe",
};

const heroTitleStyle: CSSProperties = {
  margin: "12px 0 10px",
  fontSize: 40,
  lineHeight: 1.05,
};

const heroTextStyle: CSSProperties = {
  maxWidth: 560,
  margin: 0,
  color: "#dbeafe",
  lineHeight: 1.6,
};

const heroActionRowStyle: CSSProperties = {
  display: "flex",
  gap: 20,
  marginTop: 22,
  flexWrap: "wrap",
  fontWeight: 800,
};

const heroRightStyle: CSSProperties = {
  position: "relative",
  minHeight: 150,
};

const practiceBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 13px",
  borderRadius: 12,
  background: "rgba(2,6,23,0.72)",
  fontSize: 12,
  fontWeight: 900,
  zIndex: 3,
};

const greenDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#22c55e",
};

const sessionTextStyle: CSSProperties = {
  position: "absolute",
  top: 48,
  right: 4,
  color: "#dbeafe",
  fontWeight: 800,
  fontSize: 13,
};

const heroSilhouetteStyle: CSSProperties = {
  position: "absolute",
  right: 30,
  bottom: -12,
  width: 210,
  height: 150,
  opacity: 0.9,
};

const personOneStyle: CSSProperties = {
  position: "absolute",
  left: 40,
  bottom: 14,
  width: 28,
  height: 92,
  borderRadius: "18px 18px 8px 8px",
  background: "#020617",
};

const personTwoStyle: CSSProperties = {
  position: "absolute",
  left: 90,
  bottom: 8,
  width: 24,
  height: 72,
  borderRadius: "18px 18px 8px 8px",
  background: "#020617",
};

const bagStyle: CSSProperties = {
  position: "absolute",
  left: 126,
  bottom: 8,
  width: 34,
  height: 82,
  borderRadius: 12,
  background: "#020617",
  transform: "rotate(-12deg)",
};

const controlGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const controlCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 14,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const controlHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 10,
};

const controlIconStyle: CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 8,
  background: "#eff6ff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const controlLabelStyle: CSSProperties = {
  color: "#475569",
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 0.6,
  textTransform: "uppercase",
};

const controlContentStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const cleanSelectStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  color: "#0f172a",
  fontWeight: 800,
};

const shuffleButtonStyle: CSSProperties = {
  width: 42,
  height: 42,
  border: "none",
  borderRadius: 12,
  background: "#1d4ed8",
  color: "#fff",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const middleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1.1fr 1fr",
  gap: 12,
  alignItems: "stretch",
};

const mobileMiddleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};

const panelCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const panelHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  marginBottom: 14,
};

const panelTitleStyle: CSSProperties = {
  margin: "5px 0 0",
  fontSize: 17,
};

const activeBadgeStyle: CSSProperties = {
  padding: "5px 9px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 900,
};

const infoRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 0",
  borderTop: "1px solid #f1f5f9",
};

const adviceBoxStyle: CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: 12,
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  lineHeight: 1.5,
};

const windBadgeStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 10,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#0f172a",
  fontSize: 12,
  fontWeight: 900,
};

const courseViewStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  background: "#14532d",
};

const courseSkyStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, #7dd3fc 0%, #bae6fd 28%, #166534 29%, #14532d 100%)",
};

const courseTreeLeftStyle: CSSProperties = {
  position: "absolute",
  left: -30,
  top: "30%",
  width: "38%",
  height: "62%",
  borderRadius: "50%",
  background: "#052e16",
  opacity: 0.92,
};

const courseTreeRightStyle: CSSProperties = {
  position: "absolute",
  right: -26,
  top: "28%",
  width: "40%",
  height: "64%",
  borderRadius: "50%",
  background: "#052e16",
  opacity: 0.92,
};

const courseFairwayStyle: CSSProperties = {
  position: "absolute",
  left: "30%",
  top: "30%",
  width: "40%",
  height: "66%",
  borderRadius: "50% 50% 20% 20%",
  background:
    "repeating-linear-gradient(180deg, #bbf7d0 0px, #bbf7d0 22px, #86efac 22px, #86efac 44px)",
  boxShadow: "inset 0 0 22px rgba(22,101,52,0.45)",
};

const courseGreenStyle: CSSProperties = {
  position: "absolute",
  left: "39%",
  top: "18%",
  width: 90,
  height: 58,
  borderRadius: "50%",
  background: "#dcfce7",
  border: "3px solid #16a34a",
  zIndex: 6,
};

const coursePinStyle: CSSProperties = {
  position: "absolute",
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#dc2626",
  zIndex: 12,
};

const courseStatsOverlayStyle: CSSProperties = {
  position: "absolute",
  left: 12,
  right: 12,
  bottom: 12,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  background: "rgba(2,6,23,0.82)",
  color: "#fff",
  borderRadius: 14,
  overflow: "hidden",
  zIndex: 20,
};

const courseStatStyle: CSSProperties = {
  padding: "10px 8px",
  display: "grid",
  gap: 2,
  textAlign: "center",
  borderRight: "1px solid rgba(255,255,255,0.12)",
};

const teeBoxStyle: CSSProperties = {
  position: "absolute",
  left: "42%",
  bottom: "7%",
  width: 70,
  height: 34,
  borderRadius: 12,
  background: "#365314",
  border: "2px solid #bef264",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 900,
  zIndex: 10,
};

const playerStyle: CSSProperties = {
  position: "absolute",
  left: "45%",
  top: "76%",
  width: 48,
  height: 90,
  zIndex: 13,
};

const headStyle: CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#facc15",
  marginLeft: 12,
};

const bodyStyle: CSSProperties = {
  width: 23,
  height: 42,
  background: "#1e3a8a",
  borderRadius: 8,
  marginLeft: 11,
  marginTop: 3,
};

const clubStyle: CSSProperties = {
  position: "absolute",
  left: 34,
  top: 24,
  width: 3,
  height: 68,
  background: "#111827",
  transformOrigin: "top center",
  transition: "transform 0.25s ease-in-out",
};

const ballStyle: CSSProperties = {
  position: "absolute",
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#fff",
  border: "2px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
  transform: "translate(-50%, -50%)",
  transition: "left 1s ease-out, top 1s ease-out",
  zIndex: 30,
};

const shotTrailStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  width: 3,
  transform: "translateX(-50%)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1))",
  borderRadius: 999,
  zIndex: 22,
};

const landingRingStyle: CSSProperties = {
  position: "absolute",
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "4px solid",
  transform: "translate(-50%, -50%)",
  background: "rgba(255,255,255,0.22)",
  zIndex: 24,
};

const landingLabelStyle: CSSProperties = {
  position: "absolute",
  transform: "translateX(-50%)",
  padding: "5px 9px",
  borderRadius: 999,
  color: "#fff",
  fontSize: 10,
  fontWeight: 900,
  zIndex: 25,
  whiteSpace: "nowrap",
};

const chatRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

const chatAvatarStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: "#0f172a",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  flexShrink: 0,
};

const chatBubbleStyle: CSSProperties = {
  maxWidth: "82%",
  padding: 12,
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  lineHeight: 1.45,
};

const ownChatBubbleStyle: CSSProperties = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
};

const chatInputStyle: CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: 10,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  color: "#94a3b8",
};

const sendButtonStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  cursor: "pointer",
};

const decisionSectionStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const compactDecisionSectionStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
};

const decisionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
  marginBottom: 14,
};

const decisionTitleStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 17,
};

const scoringImpactStyle: CSSProperties = {
  color: "#475569",
  fontSize: 12,
  fontWeight: 900,
};

const clubOptionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
};

const compactClubOptionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 8,
};

const clubOptionStyle: CSSProperties = {
  minHeight: 64,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 11,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  position: "relative",
};

const selectedClubOptionStyle: CSSProperties = {
  borderColor: "#2563eb",
  background: "#eff6ff",
  boxShadow: "0 0 0 2px rgba(37,99,235,0.12)",
};

const clubIconStyle: CSSProperties = {
  fontSize: 21,
};

const checkCircleStyle: CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 900,
};

const warningBoxStyle: CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: "#fef2f2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  fontSize: 13,
  lineHeight: 1.5,
};

const decisionBottomGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 220px",
  gap: 12,
  marginTop: 14,
  alignItems: "end",
};

const compactDecisionBottomGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 10,
  marginTop: 12,
};

const decisionInputGroupStyle: CSSProperties = {
  display: "grid",
  gap: 6,
};

const decisionSelectStyle: CSSProperties = {
  width: "100%",
  border: "none",
  background: "#f8fafc",
  borderRadius: 12,
  padding: 12,
  fontWeight: 800,
};

const decisionReadoutStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  padding: 12,
  borderRadius: 12,
  background: "#f8fafc",
};

const decisionButtonAreaStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const submitButtonStyle: CSSProperties = {
  width: "100%",
  padding: 13,
  borderRadius: 12,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  fontWeight: 900,
};

const resetButtonStyle: CSSProperties = {
  width: "100%",
  padding: 11,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 900,
};

const saveButtonStyle: CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 900,
};

const mobileFloatingButtonStyle: CSSProperties = {
  position: "fixed",
  left: 14,
  right: 14,
  bottom: 92,
  zIndex: 90,
  padding: 14,
  borderRadius: 18,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  fontWeight: 900,
  boxShadow: "0 18px 42px rgba(37,99,235,0.32)",
};

const mobileSheetStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 95,
  maxHeight: "72vh",
  overflowY: "auto",
  padding: "10px 14px 96px",
  borderRadius: "26px 26px 0 0",
  background: "rgba(255,255,255,0.98)",
  border: "1px solid #e5e7eb",
  boxShadow: "0 -18px 44px rgba(15,23,42,0.22)",
};

const sheetHandleStyle: CSSProperties = {
  width: 48,
  height: 5,
  borderRadius: 999,
  background: "#cbd5e1",
  margin: "0 auto 12px",
};

const mobileSheetHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 12,
};

const mobileSheetTitleStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 18,
};

const closeSheetButtonStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "#f1f5f9",
  color: "#64748b",
  fontSize: 22,
  cursor: "pointer",
};

const feedbackGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const feedbackCardStyle: CSSProperties = {
  padding: 16,
  borderRadius: 16,
};

const resultMiniGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
};

const miniMetricStyle: CSSProperties = {
  padding: 10,
  borderRadius: 12,
  background: "#fff",
  display: "grid",
  gap: 4,
};