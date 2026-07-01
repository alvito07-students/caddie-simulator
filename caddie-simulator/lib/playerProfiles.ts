export type PlayerSkillLevel = "beginner" | "intermediate" | "advanced";

export type PlayerProfile = {
  id: string;
  name: string;
  handicap: number;
  skillLevel: PlayerSkillLevel;
  playStyle: "conservative" | "balanced" | "aggressive";
  strength: string;
  weakness: string;
  clubBag: string[];
};

export const playerProfiles: PlayerProfile[] = [
  {
    id: "P-001",
    name: "Mr. Tanaka",
    handicap: 24,
    skillLevel: "beginner",
    playStyle: "conservative",
    strength: "Putting",
    weakness: "Long iron distance control",
    clubBag: [
      "Driver",
      "5 Wood",
      "7 Iron",
      "8 Iron",
      "9 Iron",
      "Pitching Wedge",
      "Sand Wedge",
    ],
  },
  {
    id: "P-002",
    name: "Mr. Aditya",
    handicap: 16,
    skillLevel: "intermediate",
    playStyle: "balanced",
    strength: "Fairway shots",
    weakness: "Bunker recovery",
    clubBag: [
      "Driver",
      "3 Wood",
      "5 Wood",
      "6 Iron",
      "7 Iron",
      "8 Iron",
      "9 Iron",
      "Pitching Wedge",
      "Sand Wedge",
    ],
  },
  {
    id: "P-003",
    name: "Mr. Wilson",
    handicap: 8,
    skillLevel: "advanced",
    playStyle: "aggressive",
    strength: "Distance control",
    weakness: "Risk management",
    clubBag: [
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
  },
  {
    id: "P-004",
    name: "Mr. Budi",
    handicap: 30,
    skillLevel: "beginner",
    playStyle: "conservative",
    strength: "Short game patience",
    weakness: "Driver accuracy",
    clubBag: [
      "Driver",
      "7 Iron",
      "9 Iron",
      "Pitching Wedge",
      "Sand Wedge",
    ],
  },
];