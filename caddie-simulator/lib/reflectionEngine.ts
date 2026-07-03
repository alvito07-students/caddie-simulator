import type { ShotResult } from "./simulatorEngine";

export type ReflectionResult = {
  experience: string;
  observation: string;
  concept: string;
  nextExperiment: string;
};

export function generateReflection(result: ShotResult): ReflectionResult {
  if (result.quality === "Excellent") {
    return {
      experience:
        "The caddie made a strong recommendation with low risk and good alignment to the hole situation.",
      observation:
        "The decision showed good control of target safety, club selection, and hazard awareness.",
      concept:
        "A strong caddie decision is not always aggressive. It balances player ability, hole risk, and available clubs.",
      nextExperiment:
        "Try a more difficult scenario with protected pin or incomplete club bag.",
    };
  }

  if (result.quality === "Good") {
    return {
      experience:
        "The shot recommendation was generally safe and usable for the player.",
      observation:
        "There may still be minor risk factors, but the caddie kept the decision under control.",
      concept:
        "Good course management means reducing unnecessary mistakes before chasing perfect outcomes.",
      nextExperiment:
        "Repeat the same hole with a different player profile or different club bag.",
    };
  }

  if (result.quality === "Needs Review") {
    return {
      experience:
        "The caddie recommendation created a moderate risk that needs review.",
      observation: `Main pattern detected: ${result.mistakePattern}.`,
      concept:
        "A risky recommendation often comes from ignoring one constraint: hazard position, player weakness, club availability, or pin protection.",
      nextExperiment:
        "Replay this scenario and choose a safer target or a club that avoids the risk zone.",
    };
  }

  return {
    experience:
      "The recommendation created a high-risk situation or could not be executed by the player.",
    observation: `Main mistake pattern: ${result.mistakePattern}.`,
    concept:
      "A caddie must adapt to the player in front of them. A technically ideal club is useless if it is not in the player's bag or does not match the player's ability.",
    nextExperiment:
      "Restart the scenario and build the decision from player profile first, then hole data, then club selection.",
  };
}