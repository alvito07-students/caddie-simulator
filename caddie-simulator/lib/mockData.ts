export type CaddieLevel = "junior" | "regular" | "senior";

export type Caddie = {
  id: string;
  name: string;
  level: CaddieLevel;
  totalSimulations: number;
  averageScore: number;
  strength: string;
  improvementArea: string;
};

export type DecisionQuality = "Excellent" | "Good" | "Needs Review" | "Poor";

export type SimulatorResult = {
  id: string;
  caddieId: string;
  hole: number;
  scenario: string;
  score: number;
  decisionQuality: DecisionQuality;
  mistakePattern: string;
  recommendation: string;
  completedAt: string;
};

export const caddies: Caddie[] = [
  {
    id: "CAD-001",
    name: "Ayu Lestari",
    level: "senior",
    totalSimulations: 18,
    averageScore: 87,
    strength: "Club selection",
    improvementArea: "Hazard reading",
  },
  {
    id: "CAD-002",
    name: "Dina Pratiwi",
    level: "regular",
    totalSimulations: 12,
    averageScore: 76,
    strength: "Green approach",
    improvementArea: "Wind judgment",
  },
  {
    id: "CAD-003",
    name: "Rina Marlina",
    level: "junior",
    totalSimulations: 7,
    averageScore: 64,
    strength: "Player communication",
    improvementArea: "Distance estimation",
  },
  {
    id: "CAD-004",
    name: "Sari Wijaya",
    level: "regular",
    totalSimulations: 10,
    averageScore: 81,
    strength: "Fairway strategy",
    improvementArea: "Bunker decision",
  },
];

export const simulatorResults: SimulatorResult[] = [
  {
    id: "SIM-001",
    caddieId: "CAD-001",
    hole: 3,
    scenario: "Approach shot with bunker risk",
    score: 88,
    decisionQuality: "Good",
    mistakePattern: "Underestimated bunker carry distance",
    recommendation: "Repeat bunker approach scenarios",
    completedAt: "2026-07-01",
  },
  {
    id: "SIM-002",
    caddieId: "CAD-001",
    hole: 7,
    scenario: "Long par 4 with crosswind",
    score: 84,
    decisionQuality: "Good",
    mistakePattern: "Slightly late wind adjustment",
    recommendation: "Practice wind judgment cases",
    completedAt: "2026-07-01",
  },
  {
    id: "SIM-003",
    caddieId: "CAD-002",
    hole: 5,
    scenario: "Fairway shot with water hazard on right",
    score: 74,
    decisionQuality: "Needs Review",
    mistakePattern: "Target line too aggressive near water hazard",
    recommendation: "Review safe target selection",
    completedAt: "2026-07-01",
  },
  {
    id: "SIM-004",
    caddieId: "CAD-003",
    hole: 2,
    scenario: "Par 3 club selection from red tee",
    score: 61,
    decisionQuality: "Poor",
    mistakePattern: "Wrong club selection for carry distance",
    recommendation: "Repeat distance estimation drills",
    completedAt: "2026-07-01",
  },
  {
    id: "SIM-005",
    caddieId: "CAD-004",
    hole: 9,
    scenario: "Bunker recovery decision",
    score: 79,
    decisionQuality: "Needs Review",
    mistakePattern: "Recovery target not conservative enough",
    recommendation: "Practice bunker exit strategy",
    completedAt: "2026-07-01",
  },
];