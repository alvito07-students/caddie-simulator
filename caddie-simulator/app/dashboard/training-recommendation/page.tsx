import type { CSSProperties } from "react";
import { caddies, simulatorResults } from "../../../lib/mockData";

export default function TrainingRecommendationPage() {
  const lowScoreResults = simulatorResults.filter((result) => result.score < 80);

  return (
    <div>
      <h1>Training Recommendation</h1>
      <p>Recommended learning actions based on simulator result patterns.</p>

      <div style={{ marginTop: 24 }}>
        {lowScoreResults.map((result) => {
          const caddie = caddies.find((item) => item.id === result.caddieId);

          return (
            <div key={result.id} style={cardStyle}>
              <h3>{caddie?.name ?? "Unknown Caddie"}</h3>
              <p>Scenario: {result.scenario}</p>
              <p>Score: {result.score}</p>
              <p>Issue: {result.mistakePattern}</p>
              <p>
                Recommended Action: <strong>{result.recommendation}</strong>
              </p>
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
  marginBottom: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};