export type GreenPinZone =
  | "frontLeft"
  | "frontCenter"
  | "frontRight"
  | "middleLeft"
  | "middleCenter"
  | "middleRight"
  | "backLeft"
  | "backCenter"
  | "backRight";

export type GreenShape =
  | "oval"
  | "round"
  | "wide"
  | "narrow"
  | "long"
  | "kidney"
  | "irregular";

export type GreenHazardType =
  | "bunker"
  | "water"
  | "slope"
  | "rough"
  | "dropZone"
  | "other";

export type GreenHazardZone =
  | GreenPinZone
  | "front"
  | "back"
  | "left"
  | "right"
  | "around";

export type GreenHazard = {
  type: GreenHazardType;
  zone: GreenHazardZone;
  label: string;
};

export type GreenLayout = {
  hole: number;
  shape: GreenShape;
  pinZone: GreenPinZone;
  safeAimZone: GreenPinZone;
  protectedZones: GreenPinZone[];
  hazards: GreenHazard[];
  approachNote: string;
  verificationStatus: "draft" | "verified";
};

export const greenData: GreenLayout[] = [
  {
    hole: 1,
    shape: "oval",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "left", label: "Green-side bunker left" },
      { type: "bunker", zone: "right", label: "Green-side bunker right" },
    ],
    approachNote:
      "Use center green as default safe target. Avoid attacking pin if bunker side is active.",
    verificationStatus: "draft",
  },
  {
    hole: 2,
    shape: "long",
    pinZone: "middleRight",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "middleRight"],
    hazards: [
      { type: "bunker", zone: "left", label: "Left bunker near green" },
      { type: "bunker", zone: "right", label: "Right bunker near green" },
    ],
    approachNote:
      "If pin is right, safer recommendation is middle green unless player has strong distance control.",
    verificationStatus: "draft",
  },
  {
    hole: 3,
    shape: "irregular",
    pinZone: "backCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
    ],
    approachNote:
      "Long par 5 approach. Prioritize safe landing zone before attacking back pin.",
    verificationStatus: "draft",
  },
  {
    hole: 4,
    shape: "long",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight", "backLeft"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
      { type: "bunker", zone: "backLeft", label: "Back-left bunker" },
    ],
    approachNote:
      "Par 3. Club selection must match tee distance. Center green is safer than attacking protected edges.",
    verificationStatus: "draft",
  },
  {
    hole: 5,
    shape: "long",
    pinZone: "middleRight",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "middleLeft"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Left bunker near approach" },
      { type: "bunker", zone: "middleLeft", label: "Left-side green bunker" },
    ],
    approachNote:
      "Avoid missing left. If pin is right, aim center-right rather than direct flag attack.",
    verificationStatus: "draft",
  },
  {
    hole: 6,
    shape: "kidney",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
      { type: "rough", zone: "around", label: "Tree-lined green complex" },
    ],
    approachNote:
      "OBI pressure on the hole makes center green recommendation more valuable.",
    verificationStatus: "draft",
  },
  {
    hole: 7,
    shape: "long",
    pinZone: "backCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "dropZone", zone: "front", label: "Drop zone around 70m" },
    ],
    approachNote:
      "Par 3. If pin is back, avoid under-clubbing. Middle green is still the safest target.",
    verificationStatus: "draft",
  },
  {
    hole: 8,
    shape: "long",
    pinZone: "middleLeft",
    safeAimZone: "middleCenter",
    protectedZones: ["middleLeft", "frontLeft"],
    hazards: [
      { type: "bunker", zone: "left", label: "Left bunker complex" },
      { type: "rough", zone: "right", label: "Right-side miss area" },
    ],
    approachNote:
      "Par 5 green. If pin is left, do not attack directly when left bunker is in play.",
    verificationStatus: "draft",
  },
  {
    hole: 9,
    shape: "oval",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
      { type: "bunker", zone: "middleRight", label: "Right bunker" },
    ],
    approachNote:
      "Bunker pressure around green. Center green is preferred unless player has high control.",
    verificationStatus: "draft",
  },
  {
    hole: 10,
    shape: "oval",
    pinZone: "frontCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
    ],
    approachNote:
      "Par 5. If pin is front, avoid short miss into bunker. Recommend enough club to reach middle green.",
    verificationStatus: "draft",
  },
  {
    hole: 11,
    shape: "long",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "middleLeft"],
    hazards: [
      { type: "bunker", zone: "left", label: "Left bunker series" },
      { type: "rough", zone: "around", label: "Tree-lined green area" },
    ],
    approachNote:
      "Kanan-kiri OBI on the hole. Approach should favor controlled center green.",
    verificationStatus: "draft",
  },
  {
    hole: 12,
    shape: "irregular",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontRight", "middleRight"],
    hazards: [
      { type: "bunker", zone: "right", label: "Right-side bunker near green" },
      { type: "dropZone", zone: "right", label: "Drop zone right of green / pohon miring" },
    ],
    approachNote:
      "Par 3. Avoid right-side miss if pin is right. Safer target is middle green.",
    verificationStatus: "draft",
  },
  {
    hole: 13,
    shape: "long",
    pinZone: "middleRight",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Left bunker near green" },
      { type: "bunker", zone: "frontRight", label: "Right bunker near green" },
    ],
    approachNote:
      "If pin is right, avoid overcommitting toward bunker side. Center-right is safer.",
    verificationStatus: "draft",
  },
  {
    hole: 14,
    shape: "long",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "left", label: "Left bunker near green" },
      { type: "bunker", zone: "right", label: "Right bunker near green" },
    ],
    approachNote:
      "Split fairway par 5. Approach strategy should depend on layup position and bunker angle.",
    verificationStatus: "draft",
  },
  {
    hole: 15,
    shape: "narrow",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["middleLeft", "middleRight"],
    hazards: [
      { type: "bunker", zone: "left", label: "Left bunker complex" },
      { type: "bunker", zone: "right", label: "Right bunker" },
    ],
    approachNote:
      "Narrow green feel. Recommend center target unless pin has clearly safe access.",
    verificationStatus: "draft",
  },
  {
    hole: 16,
    shape: "round",
    pinZone: "middleLeft",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight", "backLeft"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
      { type: "dropZone", zone: "left", label: "Drop zone 50m left side of green" },
    ],
    approachNote:
      "Par 3. If pin is left, do not short-side the player near bunker/drop-zone side.",
    verificationStatus: "draft",
  },
  {
    hole: 17,
    shape: "wide",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["frontLeft", "frontRight"],
    hazards: [
      { type: "bunker", zone: "frontLeft", label: "Front-left bunker" },
      { type: "bunker", zone: "frontRight", label: "Front-right bunker" },
      { type: "bunker", zone: "backRight", label: "Back-right bunker" },
    ],
    approachNote:
      "OBI both sides on the hole. Center green target reduces unnecessary risk.",
    verificationStatus: "draft",
  },
  {
    hole: 18,
    shape: "long",
    pinZone: "middleCenter",
    safeAimZone: "middleCenter",
    protectedZones: ["middleRight", "frontRight"],
    hazards: [
      { type: "bunker", zone: "right", label: "Right bunker near green" },
      { type: "penalty", zone: "left", label: "Left penalty side on hole" },
      { type: "rough", zone: "around", label: "Closing hole pressure area" },
    ],
    approachNote:
      "Closing par 4. Left penalty and right OBI context make center-green strategy safer.",
    verificationStatus: "draft",
  },
];

export function getGreenLayoutByHole(holeNumber: number) {
  return greenData.find((green) => green.hole === holeNumber);
}

export function isPinProtected(green: GreenLayout) {
  return green.protectedZones.includes(green.pinZone);
}

export function getGreenStrategyAdvice(green: GreenLayout) {
  const protectedPin = isPinProtected(green);

  if (protectedPin) {
    return `Pin is in a protected zone. Safer recommendation: aim ${formatPinZone(
      green.safeAimZone
    )}, not directly at the flag.`;
  }

  return `Pin is not heavily protected. Direct approach can be acceptable if club distance and player control are reliable.`;
}

export function formatPinZone(zone: GreenPinZone) {
  const labels: Record<GreenPinZone, string> = {
    frontLeft: "front-left",
    frontCenter: "front-center",
    frontRight: "front-right",
    middleLeft: "middle-left",
    middleCenter: "middle-center",
    middleRight: "middle-right",
    backLeft: "back-left",
    backCenter: "back-center",
    backRight: "back-right",
  };

  return labels[zone];
}