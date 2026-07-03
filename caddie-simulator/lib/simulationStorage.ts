import type {
  ClubChoice,
  DecisionQuality,
  RiskLevel,
  TargetChoice,
} from "./simulatorEngine";
import type { ReflectionResult } from "./reflectionEngine";
import type { PlayerPlayStyle, PlayerSkillLevel } from "./playerProfiles";

export type StoredSimulationResult = {
  id: string;
  completedAt: string;

  caddieId: string;
  caddieName: string;

  player: {
    name: string;
    handicap: number;
    skillLevel: PlayerSkillLevel;
    playStyle: PlayerPlayStyle;
    strength: string;
    weakness: string;
    clubBag: ClubChoice[];
  };

  hole: {
    number: number;
    par: number;
    tee: string;
    mainTarget: string;
  };

  decision: {
    club: ClubChoice;
    target: TargetChoice;
    targetLabel: string;
  };

  result: {
    score: number;
    quality: DecisionQuality;
    riskLevel: RiskLevel;
    mistakePattern: string;
    riskFactors: string[];
    feedback: string;
    recommendation: string;
  };

  reflection: ReflectionResult;
};

const STORAGE_KEY = "caddie-simulator-results";

export function saveSimulationResult(result: StoredSimulationResult) {
  if (typeof window === "undefined") {
    return;
  }

  const existingResults = getSimulationResults();
  const updatedResults = [result, ...existingResults];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
}

export function getSimulationResults(): StoredSimulationResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredSimulationResult[];
  } catch {
    return [];
  }
}

export function clearSimulationResults() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function getSimulationResultsByCaddie(
  caddieId: string
): StoredSimulationResult[] {
  return getSimulationResults().filter(
    (result) => result.caddieId === caddieId
  );
}

export function createSimulationResultId() {
  return `SIM-${Date.now()}`;
}

export function getAverageScore(results: StoredSimulationResult[]) {
  if (results.length === 0) {
    return 0;
  }

  const total = results.reduce((sum, item) => sum + item.result.score, 0);

  return Math.round(total / results.length);
}

export function getHighRiskCount(results: StoredSimulationResult[]) {
  return results.filter((item) => item.result.riskLevel === "high").length;
}

export function getNeedReviewCount(results: StoredSimulationResult[]) {
  return results.filter(
    (item) =>
      item.result.quality === "Needs Review" || item.result.quality === "Poor"
  ).length;
}