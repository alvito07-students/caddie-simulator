export type HolePar = 3 | 4 | 5;

export type HazardType =
  | "bunker"
  | "water"
  | "obi"
  | "penalty"
  | "tree"
  | "marker"
  | "dropZone"
  | "other";

export type TeeDistance = {
  black?: number;
  gold?: number;
  blue?: number;
  white?: number;
  red?: number;
  sc?: number;
  tb?: number;
};

export type HoleLandmark = {
  distance?: number;
  label: string;
  side?: "left" | "right" | "center";
  type: HazardType;
};

export type HoleData = {
  hole: number;
  par: HolePar;
  target: string;
  boundaries?: {
    left?: "obi" | "penalty" | "safe";
    right?: "obi" | "penalty" | "safe";
  };
  teeDistances?: TeeDistance;
  landmarks: HoleLandmark[];
  notes?: string[];
};

export const courseData: HoleData[] = [
  {
    hole: 1,
    par: 4,
    target: "Antara bunker",
    boundaries: {
      left: "obi",
      right: "obi",
    },
    landmarks: [
      { distance: 200, label: "Bunker kiri 200-185m", side: "left", type: "bunker" },
      { distance: 180, label: "Bunker kanan 180-150m", side: "right", type: "bunker" },
      { distance: 200, label: "Penangkal petir (170m)", type: "marker" },
      { distance: 150, label: "PCH 3", type: "marker" },
      { distance: 100, label: "PCH 5", type: "marker" },
      { distance: 50, label: "PCH 8 (60m)", type: "marker" },
    ],
  },
  {
    hole: 2,
    par: 4,
    target: "Tower kiri-kanan penangkal petir",
    landmarks: [
      { distance: 150, label: "Bunker kiri 1: 150-130m", side: "left", type: "bunker" },
      { distance: 180, label: "Bunker kiri 2: 180-150m", side: "left", type: "bunker" },
      { distance: 180, label: "Bunker kanan: 180-150m", side: "right", type: "bunker" },
      { distance: 200, label: "Ujung bunker kiri", side: "left", type: "bunker" },
      { distance: 150, label: "Box hijau kanan", side: "right", type: "marker" },
      { distance: 100, label: "Pohon cemara kecil", type: "tree" },
      { distance: 50, label: "Bunker kiri", side: "left", type: "bunker" },
    ],
  },
  {
    hole: 3,
    par: 5,
    target: "Tower kiri / antara bunker",
    landmarks: [
      { distance: 210, label: "Bunker kiri 1", side: "left", type: "bunker" },
      { distance: 230, label: "Bunker kiri 2", side: "left", type: "bunker" },
      { distance: 230, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 250, label: "Pohon bunga oranye sebelah kanan", side: "right", type: "tree" },
      { distance: 200, label: "Pohon besar ke-2 sebelah kanan", side: "right", type: "tree" },
      { distance: 150, label: "Cemara 1 sebelah kiri", side: "left", type: "tree" },
      { distance: 100, label: "Cemara 2 sebelah kiri", side: "left", type: "tree" },
      { distance: 50, label: "Bunker tengah", side: "center", type: "bunker" },
      { distance: 140, label: "Air dari TB putih", type: "water" },
    ],
  },
  {
    hole: 4,
    par: 3,
    target: "Green",
    teeDistances: {
      black: 186,
      gold: 170,
      blue: 160,
      white: 135,
      red: 104,
    },
    landmarks: [
      { label: "Par 3 green approach", type: "marker" },
    ],
  },
  {
    hole: 5,
    par: 4,
    target: "Kanan bunker",
    landmarks: [
      { distance: 200, label: "Bunker kiri 1", side: "left", type: "bunker" },
      { distance: 220, label: "Bunker kiri 2", side: "left", type: "bunker" },
      { distance: 200, label: "Pohon kecil pertama sebelah kiri", side: "left", type: "tree" },
      { distance: 150, label: "Bunker kiri pertama", side: "left", type: "bunker" },
      { distance: 100, label: "Setelah bunker ke-2", type: "marker" },
      { distance: 50, label: "Patok keluar car (65m)", type: "marker" },
    ],
  },
  {
    hole: 6,
    par: 4,
    target: "Pohon jomblo",
    boundaries: {
      left: "obi",
      right: "obi",
    },
    landmarks: [
      { distance: 190, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 180, label: "Bunker kiri 1", side: "left", type: "bunker" },
      { distance: 200, label: "Bunker kiri 2", side: "left", type: "bunker" },
      { distance: 200, label: "Patok OBI pertama sebelah kanan", side: "right", type: "obi" },
      { distance: 150, label: "Box hijau kiri", side: "left", type: "marker" },
      { distance: 100, label: "Ujung depan bunker kanan", side: "right", type: "bunker" },
      { distance: 50, label: "Penangkal petir kiri (70m)", side: "left", type: "marker" },
    ],
  },
  {
    hole: 7,
    par: 3,
    target: "Green",
    teeDistances: {
      black: 182,
      gold: 161,
      blue: 155,
      white: 139,
      red: 87,
    },
    landmarks: [
      { distance: 70, label: "Drop zone di depan tee box ladies", type: "dropZone" },
    ],
    notes: ["Terdapat data SC/TB pada gambar sumber."],
  },
  {
    hole: 8,
    par: 5,
    target: "Bunker kiri ke-4",
    boundaries: {
      left: "obi",
      right: "penalty",
    },
    landmarks: [
      { distance: 180, label: "Bunker kiri 1", side: "left", type: "bunker" },
      { distance: 200, label: "Bunker kiri 2", side: "left", type: "bunker" },
      { distance: 220, label: "Bunker kiri 3", side: "left", type: "bunker" },
      { distance: 250, label: "Antara 2 bunker kiri", side: "left", type: "bunker" },
      { distance: 200, label: "Sprinkler bulat besar sebelah kanan", side: "right", type: "marker" },
      { distance: 150, label: "Pohon kecil tinggi sebelah kanan", side: "right", type: "tree" },
      { distance: 100, label: "Bunker kiri pertama", side: "left", type: "bunker" },
      { distance: 50, label: "Patok keluar car (62m)", type: "marker" },
    ],
  },
  {
    hole: 9,
    par: 4,
    target: "Bunker tengah / crane",
    landmarks: [
      { distance: 175, label: "Bunker kiri 1", side: "left", type: "bunker" },
      { distance: 175, label: "Bunker kiri 2", side: "left", type: "bunker" },
      { distance: 150, label: "Bunker tengah", side: "center", type: "bunker" },
      { distance: 150, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 200, label: "Antara 2 bunker kanan", side: "right", type: "bunker" },
      { distance: 150, label: "Pohon kecil sendiri sebelah kanan", side: "right", type: "tree" },
      { distance: 100, label: "Patok penalty / ilalang", type: "penalty" },
      { distance: 50, label: "Patok keluar (70m)", type: "marker" },
    ],
  },
  {
    hole: 10,
    par: 5,
    target: "Bunker kiri dekat green",
    boundaries: {
      left: "obi",
      right: "obi",
    },
    landmarks: [
      { distance: 200, label: "Bunker kiri", side: "left", type: "bunker" },
      { distance: 180, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 250, label: "Bunker kiri / pohon kering sebelah kanan", type: "bunker" },
      { distance: 200, label: "Pohon kering ke-2 sebelah kanan / sprinkler bulat", side: "right", type: "tree" },
      { distance: 150, label: "Pohon pinus kiri", side: "left", type: "tree" },
      { distance: 100, label: "Cemara kecil ke-3 sebelah kanan", side: "right", type: "tree" },
      { distance: 75, label: "Pohon kering sebelah kanan", side: "right", type: "tree" },
    ],
    notes: ["Kanan OBI jika over bunker."],
  },
  {
    hole: 11,
    par: 4,
    target: "Bunker kiri kanannya",
    boundaries: {
      left: "obi",
      right: "obi",
    },
    landmarks: [
      { distance: 180, label: "Bunker kiri", side: "left", type: "bunker" },
      { distance: 200, label: "BNN Gedung Putih", type: "marker" },
      { distance: 150, label: "Bunker kiri pertama", side: "left", type: "bunker" },
      { distance: 100, label: "Bunker kiri kedua", side: "left", type: "bunker" },
    ],
  },
  {
    hole: 12,
    par: 3,
    target: "Green",
    teeDistances: {
      black: 174,
      gold: 144,
      blue: 130,
      white: 123,
      red: 85,
    },
    landmarks: [
      { distance: 70, label: "Drop zone sebelah kanan green / arah pohon miring", side: "right", type: "dropZone" },
    ],
    notes: ["Terdapat data SC/TB pada gambar sumber."],
  },
  {
    hole: 13,
    par: 4,
    target: "Arah bunker tengah",
    landmarks: [
      { distance: 200, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 220, label: "Bunker kiri", side: "left", type: "bunker" },
      { distance: 200, label: "Pohon besar cabang 3 sebelah kiri", side: "left", type: "tree" },
      { distance: 150, label: "Pohon cemara satu sebelah kiri", side: "left", type: "tree" },
      { distance: 100, label: "Penangkal petir kiri", side: "left", type: "marker" },
    ],
  },
  {
    hole: 14,
    par: 5,
    target: "Bunker kiri",
    boundaries: {
      left: "obi",
      right: "penalty",
    },
    landmarks: [
      { distance: 190, label: "Bunker kiri 1", side: "left", type: "bunker" },
      { distance: 220, label: "Bunker kiri 2", side: "left", type: "bunker" },
      { distance: 250, label: "Box hijau pertama sebelah kiri", side: "left", type: "marker" },
      { distance: 200, label: "Penangkal petir", type: "marker" },
      { distance: 150, label: "Pohon besar kering sebelah kiri", side: "left", type: "tree" },
      { distance: 100, label: "Air mancur / jembatan", type: "water" },
      { distance: 50, label: "Bunker kiri (70m)", side: "left", type: "bunker" },
    ],
    notes: ["Split fairway."],
  },
  {
    hole: 15,
    par: 4,
    target: "Bunker kiri ujung",
    boundaries: {
      left: "obi",
      right: "penalty",
    },
    landmarks: [
      { distance: 190, label: "Bunker kiri 190-200m", side: "left", type: "bunker" },
      { distance: 180, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 200, label: "Penangkal petir sebelah kanan", side: "right", type: "marker" },
      { distance: 150, label: "Box hijau sebelah kiri", side: "left", type: "marker" },
      { distance: 100, label: "Pohon miring sebelah kanan", side: "right", type: "tree" },
      { distance: 70, label: "Patok keluar car 70/60m", type: "marker" },
    ],
    notes: ["Kanan penalty sebelah HH."],
  },
  {
    hole: 16,
    par: 3,
    target: "Green",
    teeDistances: {
      black: 138,
      gold: 128,
      blue: 115,
      white: 110,
      red: 97,
    },
    landmarks: [
      { distance: 50, label: "Drop zone samping kiri green", side: "left", type: "dropZone" },
    ],
    notes: ["Terdapat data SC/TB pada gambar sumber."],
  },
  {
    hole: 17,
    par: 4,
    target: "Bunker tengah",
    boundaries: {
      left: "obi",
      right: "obi",
    },
    landmarks: [
      { distance: 180, label: "Bunker tengah", side: "center", type: "bunker" },
      { distance: 200, label: "Bunker kiri", side: "left", type: "bunker" },
      { distance: 150, label: "Patok OBI pertama", type: "obi" },
      { distance: 100, label: "Sebelum bunker tengah", side: "center", type: "marker" },
      { distance: 70, label: "Bunker kiri pertama", side: "left", type: "bunker" },
      { distance: 50, label: "Bunker kanan", side: "right", type: "bunker" },
    ],
  },
  {
    hole: 18,
    par: 4,
    target: "Tengah fairway",
    boundaries: {
      left: "penalty",
      right: "obi",
    },
    landmarks: [
      { distance: 180, label: "Bunker kanan", side: "right", type: "bunker" },
      { distance: 150, label: "Flower bed kiri", side: "left", type: "marker" },
      { distance: 200, label: "Penangkal petir sebelah kiri", side: "left", type: "marker" },
      { distance: 100, label: "Bunker kanan ke-2", side: "right", type: "bunker" },
      { distance: 75, label: "Box hijau kanan", side: "right", type: "marker" },
      { distance: 50, label: "Patok penalty kiri", side: "left", type: "penalty" },
    ],
  },
];