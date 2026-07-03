export type EnergyLevel =
  | "Sangat siap"
  | "Cukup baik"
  | "Lumayan lelah"
  | "Sangat lelah"
  | "Butuh recovery";

export type DailyReflectionInput = {
  caddieId: string;
  caddieName: string;
  playerSituation: string;
  wentWell: string;
  bestDecision: string;
  hesitation: string;
  challenge: string;
  lesson: string;
  nextTry: string;
  trainingNeed: string;
  energyLevel: EnergyLevel;
};

export type CoachingNote = {
  trainerName: string;
  note: string;
  updatedAt: string;
};

export type StoredDailyReflection = DailyReflectionInput & {
  id: string;
  submittedAt: string;
  internalMapping: {
    strengthSignal: string;
    developmentArea: string;
    fieldChallenge: string;
    opportunity: string;
    trainingNeed: string;
  };
  systemSummary: {
    highlight: string;
    developmentArea: string;
    trainingNeed: string;
    nextAction: string;
  };
  coachingNote?: CoachingNote;
};

const STORAGE_KEY = "caddie-daily-reflections";

export function createDailyReflectionId() {
  return `DR-${Date.now()}`;
}

export function saveDailyReflection(input: DailyReflectionInput) {
  if (typeof window === "undefined") {
    return null;
  }

  const reflection: StoredDailyReflection = {
    id: createDailyReflectionId(),
    submittedAt: new Date().toISOString(),
    ...input,
    internalMapping: {
      strengthSignal: input.wentWell,
      developmentArea: input.hesitation,
      fieldChallenge: input.challenge,
      opportunity: input.nextTry,
      trainingNeed: input.trainingNeed,
    },
    systemSummary: {
      highlight: buildHighlight(input),
      developmentArea: buildDevelopmentArea(input),
      trainingNeed: buildTrainingNeed(input),
      nextAction: buildNextAction(input),
    },
  };

  const existing = getDailyReflections();
  const updated = [reflection, ...existing];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return reflection;
}

export function getDailyReflections(): StoredDailyReflection[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredDailyReflection[];
  } catch {
    return [];
  }
}

export function getDailyReflectionsByCaddie(
  caddieId: string
): StoredDailyReflection[] {
  return getDailyReflections().filter((item) => item.caddieId === caddieId);
}

export function clearDailyReflections() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function saveCoachingNoteToReflection(
  reflectionId: string,
  trainerName: string,
  note: string
) {
  if (typeof window === "undefined") {
    return [];
  }

  const updated = getDailyReflections().map((item) => {
    if (item.id !== reflectionId) {
      return item;
    }

    return {
      ...item,
      coachingNote: {
        trainerName,
        note,
        updatedAt: new Date().toISOString(),
      },
    };
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function getEnergyRiskCount(reflections: StoredDailyReflection[]) {
  return reflections.filter(
    (item) =>
      item.energyLevel === "Sangat lelah" ||
      item.energyLevel === "Butuh recovery"
  ).length;
}

export function getTrainingNeedCount(reflections: StoredDailyReflection[]) {
  return reflections.filter((item) => item.trainingNeed.trim().length > 0)
    .length;
}

function buildHighlight(input: DailyReflectionInput) {
  if (input.wentWell.trim().length > 0) {
    return `Caddie merasa bagian yang berjalan baik hari ini adalah: ${input.wentWell}`;
  }

  return "Caddie sudah menyelesaikan refleksi turun hari ini.";
}

function buildDevelopmentArea(input: DailyReflectionInput) {
  if (input.hesitation.trim().length > 0) {
    return `Area yang perlu dikembangkan: ${input.hesitation}`;
  }

  if (input.challenge.trim().length > 0) {
    return `Situasi yang perlu diperhatikan: ${input.challenge}`;
  }

  return "Belum ada area pengembangan spesifik yang ditulis.";
}

function buildTrainingNeed(input: DailyReflectionInput) {
  if (input.trainingNeed.trim().length > 0) {
    return input.trainingNeed;
  }

  return "Belum ada kebutuhan latihan spesifik.";
}

function buildNextAction(input: DailyReflectionInput) {
  if (input.nextTry.trim().length > 0) {
    return `Pada kesempatan berikutnya, caddie ingin mencoba: ${input.nextTry}`;
  }

  return "Trainer dapat membantu caddie menentukan latihan berikutnya berdasarkan refleksi ini.";
}