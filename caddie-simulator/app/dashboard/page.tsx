import type { CSSProperties } from "react";
import { currentUser } from "../../lib/roles";
import { caddies } from "../../lib/mockData";

export default function Dashboard() {
  const currentCaddie = caddies.find(
    (caddie) => caddie.id === currentUser.caddieId
  );

  if (currentUser.role === "caddie") {
    return <CaddieDashboard caddie={currentCaddie} />;
  }

  if (currentUser.role === "caddieMaster") {
    return (
      <ManagementDashboard
        title="Caddie Master Dashboard"
        subtitle="Coaching, evaluation, and simulator review overview."
      />
    );
  }

  if (currentUser.role === "golfOperationManager") {
    return (
      <ManagementDashboard
        title="Golf Operation Manager Dashboard"
        subtitle="Operational visibility across caddie readiness and performance."
      />
    );
  }

  return (
    <ManagementDashboard
      title="General Manager Dashboard"
      subtitle="Strategic overview for policy and long-term development decisions."
    />
  );
}

function CaddieDashboard({
  caddie,
}: {
  caddie: (typeof caddies)[number] | undefined;
}) {
  if (!caddie) {
    return (
      <div>
        <h1>My Dashboard</h1>
        <p>Caddie profile not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Dashboard</h1>
      <p>Personal learning and simulator progress.</p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>My Score</h3>
          <p style={numberStyle}>{caddie.averageScore}</p>
        </div>

        <div style={cardStyle}>
          <h3>My Simulations</h3>
          <p style={numberStyle}>{caddie.totalSimulations}</p>
        </div>

        <div style={cardStyle}>
          <h3>Strength</h3>
          <p>{caddie.strength}</p>
        </div>

        <div style={cardStyle}>
          <h3>Focus Area</h3>
          <p>{caddie.improvementArea}</p>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Reflection</h2>
        <div style={cardStyle}>
          <p>
            Based on your latest simulator pattern, focus on improving{" "}
            <strong>{caddie.improvementArea}</strong>.
          </p>
          <p>
            Next step: repeat simulator cases that challenge this specific skill.
          </p>
        </div>
      </section>
    </div>
  );
}

function ManagementDashboard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const totalCaddies = caddies.length;

  const totalSimulations = caddies.reduce(
    (sum, caddie) => sum + caddie.totalSimulations,
    0
  );

  const averageScore = Math.round(
    caddies.reduce((sum, caddie) => sum + caddie.averageScore, 0) /
      caddies.length
  );

  const needsImprovement = caddies.filter(
    (caddie) => caddie.averageScore < 75
  ).length;

  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>Total Caddies</h3>
          <p style={numberStyle}>{totalCaddies}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Simulations</h3>
          <p style={numberStyle}>{totalSimulations}</p>
        </div>

        <div style={cardStyle}>
          <h3>Average Score</h3>
          <p style={numberStyle}>{averageScore}</p>
        </div>

        <div style={cardStyle}>
          <h3>Need Coaching</h3>
          <p style={numberStyle}>{needsImprovement}</p>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Caddie Performance Snapshot</h2>

        <div style={{ marginTop: 16 }}>
          {caddies.map((caddie) => (
            <div key={caddie.id} style={listCardStyle}>
              <h3>{caddie.name}</h3>
              <p>Level: {caddie.level}</p>
              <p>Average Score: {caddie.averageScore}</p>
              <p>Strength: {caddie.strength}</p>
              <p>Improvement Area: {caddie.improvementArea}</p>
            </div>
          ))}
        </div>
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
  marginBottom: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};