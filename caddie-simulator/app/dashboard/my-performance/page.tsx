import type { CSSProperties } from "react";
import { currentUser } from "../../../lib/roles";
import { caddies, simulatorResults } from "../../../lib/mockData";

export default function MyPerformancePage() {
  const currentCaddie = caddies.find(
    (caddie) => caddie.id === currentUser.caddieId
  );

  const myResults = simulatorResults.filter(
    (result) => result.caddieId === currentUser.caddieId
  );

  if (!currentCaddie) {
    return (
      <div>
        <h1>My Performance</h1>
        <p>Caddie profile not found.</p>
      </div>
    );
  }

  const latestResult = myResults[0];

  return (
    <div>
      <h1>My Performance</h1>
      <p>Personal simulator performance and learning progress.</p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>Average Score</h3>
          <p style={numberStyle}>{currentCaddie.averageScore}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Simulations</h3>
          <p style={numberStyle}>{currentCaddie.totalSimulations}</p>
        </div>

        <div style={cardStyle}>
          <h3>Strength</h3>
          <p>{currentCaddie.strength}</p>
        </div>

        <div style={cardStyle}>
          <h3>Focus Area</h3>
          <p>{currentCaddie.improvementArea}</p>
        </div>
      </div>

      {latestResult && (
        <section style={{ marginTop: 32 }}>
          <h2>Latest Simulator Result</h2>

          <div style={cardStyle}>
            <p>Hole: {latestResult.hole}</p>
            <p>Scenario: {latestResult.scenario}</p>
            <p>Score: {latestResult.score}</p>
            <p>Decision Quality: {latestResult.decisionQuality}</p>
            <p>Mistake Pattern: {latestResult.mistakePattern}</p>
            <p>Recommendation: {latestResult.recommendation}</p>
          </div>
        </section>
      )}

      <section style={{ marginTop: 32 }}>
        <h2>Simulation History</h2>

        {myResults.map((result) => (
          <div key={result.id} style={listCardStyle}>
            <h3>{result.scenario}</h3>
            <p>Hole: {result.hole}</p>
            <p>Score: {result.score}</p>
            <p>Decision Quality: {result.decisionQuality}</p>
            <p>Completed At: {result.completedAt}</p>
          </div>
        ))}
      </section>
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

const listCardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginTop: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};