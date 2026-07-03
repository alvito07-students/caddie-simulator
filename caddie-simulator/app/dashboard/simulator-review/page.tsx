"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import {
  clearSimulationResults,
  getAverageScore,
  getHighRiskCount,
  getNeedReviewCount,
  getSimulationResults,
  type StoredSimulationResult,
} from "../../../lib/simulationStorage";

export default function SimulatorReviewPage() {
  const [results, setResults] = useState<StoredSimulationResult[]>([]);

  useEffect(() => {
    setResults(getSimulationResults());
  }, []);

  function handleClearResults() {
    clearSimulationResults();
    setResults([]);
  }

  const averageScore = getAverageScore(results);
  const highRiskCount = getHighRiskCount(results);
  const needReviewCount = getNeedReviewCount(results);

  return (
    <div>
      <h1>Simulator Review</h1>
      <p>
        Review saved simulator results, decision quality, mistake patterns, and
        coaching priorities.
      </p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>Total Results</h3>
          <p style={numberStyle}>{results.length}</p>
        </div>

        <div style={cardStyle}>
          <h3>Average Score</h3>
          <p style={numberStyle}>{averageScore}</p>
        </div>

        <div style={cardStyle}>
          <h3>Need Review</h3>
          <p style={numberStyle}>{needReviewCount}</p>
        </div>

        <div style={cardStyle}>
          <h3>High Risk</h3>
          <p style={numberStyle}>{highRiskCount}</p>
        </div>
      </div>

      <button onClick={handleClearResults} style={clearButtonStyle}>
        Clear Saved Results
      </button>

      {results.length === 0 && (
        <div style={emptyStateStyle}>
          <h3>No saved simulator results yet.</h3>
          <p>
            Run a simulation, click <strong>Finish & Save Simulation</strong>,
            then return to this page.
          </p>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        {results.map((item) => (
          <div key={item.id} style={resultCardStyle}>
            <div style={resultHeaderStyle}>
              <div>
                <h3 style={{ marginBottom: 4 }}>{item.caddieName}</h3>
                <p style={{ margin: 0 }}>
                  {item.player.name} · HCP {item.player.handicap} · Hole{" "}
                  {item.hole.number}
                </p>
              </div>

              <div style={scoreBadgeStyle}>{item.result.score}</div>
            </div>

            <div style={detailGridStyle}>
              <p>
                <strong>Quality:</strong> {item.result.quality}
              </p>
              <p>
                <strong>Risk:</strong> {item.result.riskLevel}
              </p>
              <p>
                <strong>Club:</strong> {item.decision.club}
              </p>
              <p>
                <strong>Target:</strong> {item.decision.targetLabel}
              </p>
            </div>

            <p>
              <strong>Mistake Pattern:</strong> {item.result.mistakePattern}
            </p>

            <p>
              <strong>Recommendation:</strong> {item.result.recommendation}
            </p>

            <div style={reflectionStyle}>
              <h4>Learning Reflection</h4>
              <p>
                <strong>Observation:</strong> {item.reflection.observation}
              </p>
              <p>
                <strong>Next Experiment:</strong>{" "}
                {item.reflection.nextExperiment}
              </p>
            </div>

            <small>Saved at: {new Date(item.completedAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
  marginTop: 24,
};

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const numberStyle: CSSProperties = {
  fontSize: 32,
  fontWeight: "bold",
  margin: 0,
};

const clearButtonStyle: CSSProperties = {
  marginTop: 20,
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#991b1b",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const emptyStateStyle: CSSProperties = {
  marginTop: 24,
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const resultCardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const resultHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "center",
};

const scoreBadgeStyle: CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 999,
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  fontWeight: 900,
};

const detailGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 8,
  marginTop: 16,
};

const reflectionStyle: CSSProperties = {
  marginTop: 14,
  background: "#f0fdf4",
  padding: 14,
  borderRadius: 10,
  border: "1px solid #bbf7d0",
};