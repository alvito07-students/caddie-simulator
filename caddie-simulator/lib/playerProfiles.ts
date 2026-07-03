import type { ClubChoice } from "./simulatorEngine";

export type PlayerSkillLevel = "beginner" | "intermediate" | "advanced";
export type PlayerPlayStyle = "conservative" | "balanced" | "aggressive";

export type PlayerProfile = {
  id: string;
  name: string;
  handicap: number;
  skillLevel: PlayerSkillLevel;
  playStyle: PlayerPlayStyle;
  strength: string;
  weakness: string;
  clubBag: ClubChoice[];
};

const playerNames: string[] = [
  "Mr. Tanaka",
  "Mr. Aditya",
  "Mr. Wilson",
  "Mr. Budi",
  "Mr. Chen",
  "Mr. Sato",
  "Mr. Rahman",
  "Mr. Hendra",
];

const playStyles: PlayerPlayStyle[] = [
  "conservative",
  "balanced",
  "aggressive",
];

const strengths: string[] = [
  "Putting",
  "Fairway shots",
  "Short game patience",
  "Distance control",
  "Course management",
  "Calm tempo",
];

const weaknesses: string[] = [
  "Driver accuracy",
  "Long iron distance control",
  "Bunker recovery",
  "Risk management",
  "Wind judgment",
  "Water hazard pressure",
  "Distance estimation",
];

const allClubs: ClubChoice[] = [
  "Driver",
  "3 Wood",
  "5 Wood",
  "5 Iron",
  "6 Iron",
  "7 Iron",
  "8 Iron",
  "9 Iron",
  "Pitching Wedge",
  "Sand Wedge",
];

const bagTemplates: ClubChoice[][] = [
  [
    "Driver",
    "3 Wood",
    "5 Wood",
    "5 Iron",
    "6 Iron",
    "7 Iron",
    "8 Iron",
    "9 Iron",
    "Pitching Wedge",
    "Sand Wedge",
  ],
  [
    "Driver",
    "5 Wood",
    "7 Iron",
    "8 Iron",
    "9 Iron",
    "Pitching Wedge",
    "Sand Wedge",
  ],
  [
    "Driver",
    "3 Wood",
    "6 Iron",
    "7 Iron",
    "9 Iron",
    "Pitching Wedge",
    "Sand Wedge",
  ],
  [
    "Driver",
    "7 Iron",
    "9 Iron",
    "Pitching Wedge",
    "Sand Wedge",
  ],
  [
    "5 Wood",
    "6 Iron",
    "7 Iron",
    "8 Iron",
    "Pitching Wedge",
    "Sand Wedge",
  ],
];

export function generateRandomPlayerProfile(): PlayerProfile {
  const handicap = randomNumber(4, 32);

  return {
    id: `P-${Date.now()}-${randomNumber(100, 999)}`,
    name: randomItem(playerNames),
    handicap,
    skillLevel: getSkillLevel(handicap),
    playStyle: randomItem(playStyles),
    strength: randomItem(strengths),
    weakness: randomItem(weaknesses),
    clubBag: randomItem(bagTemplates),
  };
}

export function getMissingClubs(player: PlayerProfile) {
  return allClubs.filter((club) => !player.clubBag.includes(club));
}

function getSkillLevel(handicap: number): PlayerSkillLevel {
  if (handicap <= 10) return "advanced";
  if (handicap <= 20) return "intermediate";
  return "beginner";
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}