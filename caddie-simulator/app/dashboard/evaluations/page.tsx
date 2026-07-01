import { caddies } from "../../../lib/mockData";

export default function EvaluationsPage() {
  return (
    <div>
      <h1>Caddie Evaluation</h1>
      <p>Caddie performance evaluation and coaching notes.</p>

      <div style={{ marginTop: 24 }}>
        {caddies.map((caddie) => (
          <div
            key={caddie.id}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h3>{caddie.name}</h3>
            <p>ID: {caddie.id}</p>
            <p>Level: {caddie.level}</p>
            <p>Average Score: {caddie.averageScore}</p>
            <p>Strength: {caddie.strength}</p>
            <p>Needs Improvement: {caddie.improvementArea}</p>

            <button
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              View Evaluation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}