import type { CSSProperties } from "react";
import { caddies, simulatorResults } from "../../../lib/mockData";

export default function SimulatorReviewPage() {
  return (
    <div>
      <h1>Simulator Review</h1>
      <p>Review simulator results, decision quality, and improvement areas.</p>

      <div style={{ marginTop: 24 }}>
        {simulatorResults.map((result) => {
          const caddie = caddies.find((item) => item.id === result.caddieId);

          return (
            <div key={result.id} style={cardStyle}>
              <div style={headerStyle}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>
                    {caddie?.name ?? "Unknown Caddie"}
                  </h3>
                  <p style={{ margin: 0 }}>Result ID: {result.id}</p>
                </div>

                <div style={scoreBadgeStyle}>
                  <strong>{result.score}</strong>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <p>Hole: {result.hole}</p>
                <p>Scenario: {result.scenario}</p>
                <p>Decision Quality: {result.decisionQuality}</p>
                <p>Mistake Pattern: {result.mistakePattern}</p>
                <p>Recommendation: {result.recommendation}</p>
                <p>Completed At: {result.completedAt}</p>
              </div>

              <button style={buttonStyle}>Open Coaching Notes</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const scoreBadgeStyle: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 999,
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
};

const buttonStyle: CSSProperties = {
  marginTop: 12,
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
};