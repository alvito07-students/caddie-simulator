import type { HazardType, HoleData, HoleLandmark } from "./courseData";
import type { GreenLayout } from "./greenData";
import { formatPinZone } from "./greenData";

export type ClubChoice =
  | "Driver"
  | "3 Wood"
  | "5 Wood"
  | "5 Iron"
  | "6 Iron"
  | "7 Iron"
  | "8 Iron"
  | "9 Iron"
  | "Pitching Wedge"
  | "Sand Wedge";

export type TargetChoice =
  | "safeAim"
  | "directPin"
  | "layupFairway"
  | "leftSide"
  | "rightSide";

export type TeeChoice = "black" | "gold" | "blue" | "white" | "red";

export type DecisionQuality =
  | "Excellent"
  | "Good"
  | "Needs Review"
  | "Poor";

export type RiskLevel = "low" | "medium" | "high";

export type ShotResult = {
  score: number;
  quality: DecisionQuality;
  title: string;
  feedback: string;
  recommendation: string;
  riskLevel: RiskLevel;
  mistakePattern: string;
  riskFactors: string[];
};

type EvaluateShotParams = {
  holeData: HoleData;
  greenData?: GreenLayout;
  club: ClubChoice;
  target: TargetChoice;
  selectedTee: TeeChoice;
};

type RuleIssue = {
  penalty: number;
  message: string;
  pattern: string;
  recommendation: string;
};

export const clubCarryMeters: Record<ClubChoice, number> = {
  Driver: 210,
  "3 Wood": 190,
  "5 Wood": 175,
  "5 Iron": 160,
  "6 Iron": 150,
  "7 Iron": 140,
  "8 Iron": 130,
  "9 Iron": 120,
  "Pitching Wedge": 105,
  "Sand Wedge": 70,
};

export const targetLabels: Record<TargetChoice, string> = {
  safeAim: "Safe green / safe target",
  directPin: "Attack pin directly",
  layupFairway: "Layup to fairway",
  leftSide: "Left-side target",
  rightSide: "Right-side target",
};

export function evaluateShot({
  holeData,
  greenData,
  club,
  target,
  selectedTee,
}: EvaluateShotParams): ShotResult {
  const issues: RuleIssue[] = [];
  let score = 100;

  const carry = clubCarryMeters[club];

  // 1. Par 3 tee distance logic
  if (holeData.par === 3) {
    const teeDistance = holeData.teeDistances?.[selectedTee];

    if (teeDistance) {
      const gap = Math.abs(carry - teeDistance);

      if (gap > 30) {
        issues.push({
          penalty: 35,
          message: `${club} carries around ${carry}m, but Hole ${holeData.hole} plays ${teeDistance}m from ${selectedTee} tee.`,
          pattern: "Wrong club selection",
          recommendation:
            "Choose a club closer to the tee distance and adjust for wind, player strength, and lie.",
        });
      } else if (gap > 18) {
        issues.push({
          penalty: 18,
          message: `${club} is slightly mismatched for ${teeDistance}m from ${selectedTee} tee.`,
          pattern: "Distance estimation issue",
          recommendation:
            "Review tee distance and choose a more controlled club.",
        });
      }
    }

    if (target === "layupFairway") {
      issues.push({
        penalty: 18,
        message: "Layup target is usually not suitable for a par 3 tee shot.",
        pattern: "Incorrect target strategy",
        recommendation:
          "For par 3, recommend a green target or safe green-side aim instead of a layup.",
      });
    }

    if (club === "Driver" || club === "3 Wood" || club === "5 Wood") {
      issues.push({
        penalty: 25,
        message: `${club} is too aggressive for most par 3 approach situations.`,
        pattern: "Over-clubbing",
        recommendation:
          "Use an iron or wedge that matches the actual tee distance.",
      });
    }
  }

  // 2. Boundary risk logic
  if (target === "leftSide" && isDangerBoundary(holeData.boundaries?.left)) {
    issues.push({
      penalty: holeData.boundaries?.left === "obi" ? 30 : 22,
      message: `Left-side target is risky because left boundary is ${holeData.boundaries?.left?.toUpperCase()}.`,
      pattern: "Unsafe target line",
      recommendation:
        "Move target back to center fairway or safe green zone.",
    });
  }

  if (target === "rightSide" && isDangerBoundary(holeData.boundaries?.right)) {
    issues.push({
      penalty: holeData.boundaries?.right === "obi" ? 30 : 22,
      message: `Right-side target is risky because right boundary is ${holeData.boundaries?.right?.toUpperCase()}.`,
      pattern: "Unsafe target line",
      recommendation:
        "Move target back to center fairway or safe green zone.",
    });
  }

  // 3. Carry distance hazard overlap
  const carryRiskHazards = getCarryRiskHazards(holeData.landmarks, carry);

  if (carryRiskHazards.length > 0 && target !== "layupFairway") {
    issues.push({
      penalty: 22,
      message: `Expected carry overlaps with hazard zone: ${carryRiskHazards
        .map((hazard) => hazard.label)
        .join(", ")}.`,
      pattern: "Hazard carry risk",
      recommendation:
        "Choose a safer club distance or change the target line away from the hazard.",
    });
  }

  // 4. Target side hazard risk
  const targetSide = getTargetSide(target);

  if (targetSide) {
    const sideHazards = holeData.landmarks.filter(
      (landmark) =>
        landmark.side === targetSide && isDangerHazard(landmark.type)
    );

    if (sideHazards.length > 0) {
      issues.push({
        penalty: 14,
        message: `${targetSide}-side target contains danger: ${sideHazards
          .map((hazard) => hazard.label)
          .join(", ")}.`,
        pattern: "Side hazard awareness issue",
        recommendation:
          "Avoid recommending the hazard-side line unless there is a clear strategic reason.",
      });
    }
  }

  // 5. Water special risk
  const waterRisk = holeData.landmarks.find(
    (landmark) =>
      landmark.type === "water" &&
      landmark.distance &&
      Math.abs(landmark.distance - carry) <= 20
  );

  if (waterRisk) {
    issues.push({
      penalty: 30,
      message: `Water hazard is close to expected carry distance: ${waterRisk.label}.`,
      pattern: "Water hazard risk",
      recommendation:
        "Choose enough club to safely carry the water, or select a conservative layup.",
    });
  }

  // 6. Direct pin attack logic
  if (
    target === "directPin" &&
    greenData &&
    greenData.protectedZones.includes(greenData.pinZone)
  ) {
    issues.push({
      penalty: 22,
      message: `Pin is protected at ${formatPinZone(
        greenData.pinZone
      )}. Direct pin attack is too aggressive.`,
      pattern: "Aggressive pin attack",
      recommendation: `Aim ${formatPinZone(
        greenData.safeAimZone
      )} instead of attacking the flag directly.`,
    });
  }

  // 7. Positive decision modifiers
  if (target === "safeAim") {
    score += 5;
  }

  if (target === "layupFairway" && holeData.par >= 4) {
    score += 5;
  }

  // Apply penalties
  for (const issue of issues) {
    score -= issue.penalty;
  }

  score = Math.max(0, Math.min(100, score));

  const quality = getDecisionQuality(score);
  const riskLevel = getRiskLevel(score, issues.length);

  if (issues.length === 0) {
    return {
      score,
      quality,
      riskLevel,
      title: "Good Caddie Decision",
      feedback:
        "The recommendation is aligned with hole data, target safety, club distance, and green strategy.",
      recommendation:
        "Proceed with the plan, while still confirming player ability, wind, and current lie.",
      mistakePattern: "No major mistake detected",
      riskFactors: [],
    };
  }

  return {
    score,
    quality,
    riskLevel,
    title: "Decision Needs Review",
    feedback: issues.map((issue) => issue.message).join(" "),
    recommendation: getPrimaryRecommendation(issues, greenData),
    mistakePattern: getPrimaryMistakePattern(issues),
    riskFactors: issues.map((issue) => issue.pattern),
  };
}

function getCarryRiskHazards(
  landmarks: HoleLandmark[],
  carry: number
): HoleLandmark[] {
  return landmarks.filter((landmark) => {
    if (!landmark.distance) return false;

    const nearCarryDistance = Math.abs(landmark.distance - carry) <= 15;
    const dangerous = isDangerHazard(landmark.type);

    return nearCarryDistance && dangerous;
  });
}

function isDangerHazard(type: HazardType) {
  return (
    type === "bunker" ||
    type === "water" ||
    type === "obi" ||
    type === "penalty"
  );
}

function isDangerBoundary(boundary?: "obi" | "penalty" | "safe") {
  return boundary === "obi" || boundary === "penalty";
}

function getTargetSide(target: TargetChoice): "left" | "right" | undefined {
  if (target === "leftSide") return "left";
  if (target === "rightSide") return "right";
  return undefined;
}

function getDecisionQuality(score: number): DecisionQuality {
  if (score >= 90) return "Excellent";
  if (score >= 78) return "Good";
  if (score >= 60) return "Needs Review";
  return "Poor";
}

function getRiskLevel(score: number, issueCount: number): RiskLevel {
  if (score < 60 || issueCount >= 3) return "high";
  if (score < 80 || issueCount >= 1) return "medium";
  return "low";
}

function getPrimaryMistakePattern(issues: RuleIssue[]) {
  const mostSevereIssue = [...issues].sort(
    (a, b) => b.penalty - a.penalty
  )[0];

  return mostSevereIssue?.pattern ?? "General decision issue";
}

function getPrimaryRecommendation(
  issues: RuleIssue[],
  greenData?: GreenLayout
) {
  const mostSevereIssue = [...issues].sort(
    (a, b) => b.penalty - a.penalty
  )[0];

  if (mostSevereIssue) {
    return mostSevereIssue.recommendation;
  }

  if (greenData) {
    return greenData.approachNote;
  }

  return "Choose a safer target and avoid unnecessary hazard-side risk.";
}