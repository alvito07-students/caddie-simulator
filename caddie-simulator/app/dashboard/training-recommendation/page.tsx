"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import {
  getSimulationResults,
  type StoredSimulationResult,
} from "../../../lib/simulationStorage";

type TrainingCluster = {
  mistakePattern: string;
  count: number;
  averageScore: number;
  examples: StoredSimulationResult[];
};

export default function TrainingRecommendationPage() {
  const [results, setResults] = useState<StoredSimulationResult[]>([]);

  useEffect(() => {
    setResults(getSimulationResults());
  }, []);

  const clusters = useMemo(() => buildTrainingClusters(results), [results]);

  return (
    <div>
      <h1>Training Recommendation</h1>
      <p>
        Recommended learning actions based on saved simulator mistake patterns.
      </p>

      {results.length === 0 && (
        <div style={emptyStateStyle}>
          <h3>No simulator result data yet.</h3>
          <p>
            Finish and save simulation results first. Recommendations will be
            generated from score, risk level, and mistake pattern.
          </p>
        </div>
      )}

      {clusters.length > 0 && (
        <div style={gridStyle}>
          {clusters.map((cluster) => (
            <div key={cluster.mistakePattern} style={cardStyle}>
              <h3>{cluster.mistakePattern}</h3>

              <p>
                <strong>Occurrences:</strong> {cluster.count}
              </p>

              <p>
                <strong>Average Score:</strong> {cluster.averageScore}
              </p>

              <p>
                <strong>Recommended Training:</strong>{" "}
                {getTrainingRecommendation(cluster.mistakePattern)}
              </p>

              <div style={exampleBoxStyle}>
                <h4>Recent Example</h4>

                <p>
                  <strong>Caddie:</strong> {cluster.examples[0].caddieName}
                </p>

                <p>
                  <strong>Hole:</strong> {cluster.examples[0].hole.number}
                </p>

                <p>
                  <strong>Issue:</strong>{" "}
                  {cluster.examples[0].result.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildTrainingClusters(results: StoredSimulationResult[]) {
  const reviewResults = results.filter(
    (item) =>
      item.result.quality === "Needs Review" || item.result.quality === "Poor"
  );

  const grouped = new Map<string, StoredSimulationResult[]>();

  for (const result of reviewResults) {
    const key = result.result.mistakePattern;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)?.push(result);
  }

  const clusters: TrainingCluster[] = Array.from(grouped.entries()).map(
    ([mistakePattern, items]) => {
      const totalScore = items.reduce(
        (sum, item) => sum + item.result.score,
        0
      );

      return {
        mistakePattern,
        count: items.length,
        averageScore: Math.round(totalScore / items.length),
        examples: items,
      };
    }
  );

  return clusters.sort((a, b) => b.count - a.count);
}

function getTrainingRecommendation(mistakePattern: string) {
  const lower = mistakePattern.toLowerCase();

  if (lower.includes("club")) {
    return "Club selection drill: match player bag, distance, and safe target strategy.";
  }

  if (lower.includes("hazard")) {
    return "Hazard reading drill: identify bunker, water, penalty, and OBI before choosing club.";
  }

  if (lower.includes("pin")) {
    return "Green strategy drill: aim safe zone when pin is protected.";
  }

  if (lower.includes("target")) {
    return "Course management drill: choose safer target line based on player skill and boundary risk.";
  }

  if (lower.includes("water")) {
    return "Water hazard scenario drill: decide between carry, layup, and safe miss.";
  }

  return "Decision review session: repeat similar scenarios and compare aggressive vs safe recommendations.";
}

const emptyStateStyle: CSSProperties = {
  marginTop: 24,
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
  marginTop: 24,
};

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const exampleBoxStyle: CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 10,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};