import type { HoleData, HoleLandmark } from "./courseData";
import type { GreenLayout } from "./greenData";

import {
  clubCarryMeters,
  targetLabels,
  type ClubChoice,
  type TargetChoice,
  type TeeChoice,
} from "./simulatorEngine";

export type LandingZoneType =
  | "green"
  | "fairway"
  | "bunker"
  | "water"
  | "obi"
  | "penalty"
  | "rough"
  | "short"
  | "long"
  | "layup";

export type LandingSide = "left" | "center" | "right";

export type LandingResult = {
  carryDistance: number;
  intendedDistance: number;
  actualLandingDistance: number;
  side: LandingSide;
  landingZone: LandingZoneType;
  nearestLandmark?: HoleLandmark;
  landmarkGap?: number;
  visualPosition: {
    left: string;
    top: string;
  };
  title: string;
  description: string;
  caddieLine: string;
  coachNote: string;
};

export function getShotLandingResult({
  holeData,
  greenData,
  club,
  target,
  selectedTee,
}: {
  holeData: HoleData;
  greenData?: GreenLayout;
  club: ClubChoice;
  target: TargetChoice;
  selectedTee: TeeChoice;
}): LandingResult {
  const carryDistance = clubCarryMeters[club];
  const side = getTargetSide(target);

  const parThreeDistance =
    holeData.par === 3 ? holeData.teeDistances?.[selectedTee] : undefined;

  const intendedDistance =
    target === "layupFairway"
      ? Math.min(carryDistance, 145)
      : parThreeDistance ?? carryDistance;

  const actualLandingDistance =
    target === "layupFairway"
      ? Math.min(carryDistance, 145)
      : carryDistance;

  const nearest = findNearestLandmark(holeData, actualLandingDistance);
  const boundaryRisk = getBoundaryRisk(holeData, side, actualLandingDistance);

  if (holeData.par === 3 && parThreeDistance) {
    return buildParThreeLanding({
      holeData,
      greenData,
      club,
      target,
      selectedTee,
      carryDistance,
      teeDistance: parThreeDistance,
      side,
      nearestLandmark: nearest.landmark,
      landmarkGap: nearest.gap,
    });
  }

  if (boundaryRisk) {
    return buildLandingResult({
      holeData,
      club,
      target,
      carryDistance,
      intendedDistance,
      actualLandingDistance,
      side,
      landingZone: boundaryRisk,
      nearestLandmark: nearest.landmark,
      landmarkGap: nearest.gap,
      reason:
        boundaryRisk === "obi"
          ? "Target line terlalu dekat dengan area OBI."
          : "Target line terlalu dekat dengan area penalty.",
    });
  }

  if (nearest.landmark && nearest.gap <= 18) {
    return buildLandingResult({
      holeData,
      club,
      target,
      carryDistance,
      intendedDistance,
      actualLandingDistance,
      side: nearest.landmark.side ?? side,
      landingZone: getLandingZoneFromLandmark(nearest.landmark),
      nearestLandmark: nearest.landmark,
      landmarkGap: nearest.gap,
      reason: `Landing berada dekat dengan ${nearest.landmark.label}.`,
    });
  }

  return buildLandingResult({
    holeData,
    club,
    target,
    carryDistance,
    intendedDistance,
    actualLandingDistance,
    side,
    landingZone: target === "layupFairway" ? "layup" : "fairway",
    nearestLandmark: nearest.landmark,
    landmarkGap: nearest.gap,
    reason:
      target === "layupFairway"
        ? "Caddie memilih landing aman sebelum area risiko."
        : "Landing berada di area fairway tanpa hazard dekat.",
  });
}

function buildParThreeLanding({
  holeData,
  club,
  target,
  selectedTee,
  carryDistance,
  teeDistance,
  side,
  nearestLandmark,
  landmarkGap,
}: {
  holeData: HoleData;
  greenData?: GreenLayout;
  club: ClubChoice;
  target: TargetChoice;
  selectedTee: TeeChoice;
  carryDistance: number;
  teeDistance: number;
  side: LandingSide;
  nearestLandmark?: HoleLandmark;
  landmarkGap?: number;
}) {
  const gap = carryDistance - teeDistance;

  if (Math.abs(gap) <= 12) {
    return buildLandingResult({
      holeData,
      club,
      target,
      carryDistance,
      intendedDistance: teeDistance,
      actualLandingDistance: teeDistance,
      side,
      landingZone: "green",
      nearestLandmark,
      landmarkGap,
      reason: `Carry ${carryDistance}m cukup sesuai dengan jarak tee ${selectedTee} sekitar ${teeDistance}m.`,
    });
  }

  if (gap < -12) {
    return buildLandingResult({
      holeData,
      club,
      target,
      carryDistance,
      intendedDistance: teeDistance,
      actualLandingDistance: carryDistance,
      side,
      landingZone: "short",
      nearestLandmark,
      landmarkGap,
      reason: `Carry ${carryDistance}m terlalu pendek dari jarak tee ${selectedTee} sekitar ${teeDistance}m.`,
    });
  }

  return buildLandingResult({
    holeData,
    club,
    target,
    carryDistance,
    intendedDistance: teeDistance,
    actualLandingDistance: carryDistance,
    side,
    landingZone: "long",
    nearestLandmark,
    landmarkGap,
    reason: `Carry ${carryDistance}m terlalu panjang dari jarak tee ${selectedTee} sekitar ${teeDistance}m.`,
  });
}

function buildLandingResult({
  holeData,
  club,
  target,
  carryDistance,
  intendedDistance,
  actualLandingDistance,
  side,
  landingZone,
  nearestLandmark,
  landmarkGap,
  reason,
}: {
  holeData: HoleData;
  club: ClubChoice;
  target: TargetChoice;
  carryDistance: number;
  intendedDistance: number;
  actualLandingDistance: number;
  side: LandingSide;
  landingZone: LandingZoneType;
  nearestLandmark?: HoleLandmark;
  landmarkGap?: number;
  reason: string;
}): LandingResult {
  return {
    carryDistance,
    intendedDistance,
    actualLandingDistance,
    side,
    landingZone,
    nearestLandmark,
    landmarkGap,
    visualPosition: getVisualPosition(actualLandingDistance, side, landingZone),
    title: getLandingTitle(landingZone),
    description: buildDescription({
      actualLandingDistance,
      landingZone,
      nearestLandmark,
      landmarkGap,
      reason,
    }),
    caddieLine: buildCaddieLine({
      holeData,
      club,
      target,
      landingZone,
      nearestLandmark,
    }),
    coachNote: buildCoachNote(landingZone),
  };
}

function findNearestLandmark(holeData: HoleData, distance: number) {
  const landmarksWithDistance = holeData.landmarks.filter(
    (landmark) => typeof landmark.distance === "number"
  );

  if (landmarksWithDistance.length === 0) {
    return {
      landmark: undefined,
      gap: undefined,
    };
  }

  const sorted = [...landmarksWithDistance].sort((a, b) => {
    const gapA = Math.abs((a.distance ?? 0) - distance);
    const gapB = Math.abs((b.distance ?? 0) - distance);

    return gapA - gapB;
  });

  const nearest = sorted[0];

  return {
    landmark: nearest,
    gap: Math.abs((nearest.distance ?? 0) - distance),
  };
}

function getBoundaryRisk(
  holeData: HoleData,
  side: LandingSide,
  distance: number
): LandingZoneType | null {
  if (side === "center") {
    return null;
  }

  if (distance < 140) {
    return null;
  }

  const boundary =
    side === "left" ? holeData.boundaries?.left : holeData.boundaries?.right;

  if (boundary === "obi") {
    return "obi";
  }

  if (boundary === "penalty") {
    return "penalty";
  }

  return null;
}

function getTargetSide(target: TargetChoice): LandingSide {
  if (target === "leftSide") return "left";
  if (target === "rightSide") return "right";
  return "center";
}

function getLandingZoneFromLandmark(landmark: HoleLandmark): LandingZoneType {
  if (landmark.type === "bunker") return "bunker";
  if (landmark.type === "water") return "water";
  if (landmark.type === "obi") return "obi";
  if (landmark.type === "penalty") return "penalty";
  if (landmark.type === "dropZone") return "layup";
  if (landmark.type === "tree") return "rough";

  return "fairway";
}

function getVisualPosition(
  distance: number,
  side: LandingSide,
  landingZone: LandingZoneType
) {
  if (landingZone === "green") {
    return {
      left: "50%",
      top: "14%",
    };
  }

  if (landingZone === "long") {
    return {
      left: sideToLeft(side),
      top: "8%",
    };
  }

  const safeDistance = Math.min(distance, 260);
  const top = 88 - safeDistance * 0.26;

  return {
    left: sideToLeft(side),
    top: `${Math.max(top, 12)}%`,
  };
}

function sideToLeft(side: LandingSide) {
  if (side === "left") return "33%";
  if (side === "right") return "67%";
  return "50%";
}

function getLandingTitle(zone: LandingZoneType) {
  const titles: Record<LandingZoneType, string> = {
    green: "Ball lands on green",
    fairway: "Ball lands on fairway",
    bunker: "Ball lands near bunker",
    water: "Ball finds water hazard",
    obi: "Ball is at OBI risk",
    penalty: "Ball is in penalty risk",
    rough: "Ball lands in rough area",
    short: "Ball comes up short",
    long: "Ball goes long",
    layup: "Ball lands in layup zone",
  };

  return titles[zone];
}

function buildDescription({
  actualLandingDistance,
  landingZone,
  nearestLandmark,
  landmarkGap,
  reason,
}: {
  actualLandingDistance: number;
  landingZone: LandingZoneType;
  nearestLandmark?: HoleLandmark;
  landmarkGap?: number;
  reason: string;
}) {
  const landmarkText =
    nearestLandmark && typeof landmarkGap === "number"
      ? ` Nearest course reference: ${nearestLandmark.label} (${nearestLandmark.distance}m), gap ${landmarkGap}m.`
      : "";

  return `Estimated landing around ${actualLandingDistance}m. Zone: ${landingZone}. ${reason}${landmarkText}`;
}

function buildCaddieLine({
  holeData,
  club,
  target,
  landingZone,
  nearestLandmark,
}: {
  holeData: HoleData;
  club: ClubChoice;
  target: TargetChoice;
  landingZone: LandingZoneType;
  nearestLandmark?: HoleLandmark;
}) {
  const targetLabel = targetLabels[target];

  if (
    landingZone === "bunker" ||
    landingZone === "water" ||
    landingZone === "obi" ||
    landingZone === "penalty"
  ) {
    return `Saya sarankan evaluasi ulang, Sir. ${club} ke ${targetLabel} berpotensi masuk area risiko di Hole ${holeData.hole}.`;
  }

  if (landingZone === "short") {
    return `Dengan ${club}, bola kemungkinan masih short. Kita bisa pilih club lebih panjang atau target lebih aman.`;
  }

  if (landingZone === "long") {
    return `Dengan ${club}, bola berpotensi terlalu panjang. Lebih aman turunkan club atau arahkan ke miss yang aman.`;
  }

  if (nearestLandmark) {
    return `Dengan ${club}, bola diperkirakan landing dekat referensi ${nearestLandmark.label}. Target ${targetLabel} masih bisa dipertimbangkan.`;
  }

  return `Dengan ${club}, target ${targetLabel} cukup aman untuk kondisi hole ini.`;
}

function buildCoachNote(zone: LandingZoneType) {
  if (zone === "bunker") {
    return "Coach note: caddie perlu membaca carry distance terhadap bunker sebelum memberi rekomendasi club.";
  }

  if (zone === "water") {
    return "Coach note: caddie perlu mempertimbangkan layup atau safe miss ketika carry mendekati water hazard.";
  }

  if (zone === "obi") {
    return "Coach note: target line terlalu dekat OBI. Latih safe target selection.";
  }

  if (zone === "penalty") {
    return "Coach note: target line mendekati penalty area. Latih risk communication ke player.";
  }

  if (zone === "short") {
    return "Coach note: club selection kurang carry untuk jarak aktual.";
  }

  if (zone === "long") {
    return "Coach note: club selection terlalu agresif untuk jarak aktual.";
  }

  return "Coach note: keputusan cukup aman, tetap jelaskan alasan club dan target ke player.";
}