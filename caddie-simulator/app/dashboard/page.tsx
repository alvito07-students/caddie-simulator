import type { CSSProperties } from "react";

import { currentUser, roleLabels } from "../../lib/roles";
import { caddies, simulatorResults } from "../../lib/mockData";

export default function DashboardPage() {
  if (currentUser.role === "caddie") {
    const currentCaddie = caddies.find(
      (caddie) => caddie.id === currentUser.caddieId
    );

    const mySimulatorResults = simulatorResults.filter(
      (result) => result.caddieId === currentUser.caddieId
    );

    return (
      <div style={pageStyle}>
        <section style={welcomeHeroStyle}>
          <div style={heroContentStyle}>
            <div style={eyebrowStyle}>Caddie Learning Dashboard</div>

            <h1 style={heroTitleStyle}>Welcome back, {currentUser.name}</h1>

            <p style={heroTextStyle}>
              Continue your learning journey through simulator practice, daily
              field reflection, and performance development.
            </p>

            <div style={heroActionsStyle}>
              <a href="/dashboard/simulator" style={primaryHeroButtonStyle}>
                Start Simulator
              </a>

              <a
                href="/dashboard/daily-reflection"
                style={secondaryHeroButtonStyle}
              >
                Submit Daily Reflection
              </a>
            </div>
          </div>

          <div style={heroStatsPanelStyle}>
            <div style={heroStatItemStyle}>
              <span>Average Score</span>
              <strong>{currentCaddie?.averageScore ?? 0}</strong>
            </div>

            <div style={heroStatItemStyle}>
              <span>Total Simulations</span>
              <strong>{currentCaddie?.totalSimulations ?? 0}</strong>
            </div>

            <div style={heroStatItemStyle}>
              <span>Level</span>
              <strong>{currentCaddie?.level ?? "N/A"}</strong>
            </div>
          </div>
        </section>

        <section style={metricGridStyle}>
          <MetricCard
            label="Simulator Practice"
            value={String(currentCaddie?.totalSimulations ?? 0)}
            description="Completed training scenarios"
            icon="⚑"
            tone="blue"
          />

          <MetricCard
            label="Average Score"
            value={String(currentCaddie?.averageScore ?? 0)}
            description="Current simulator performance"
            icon="▥"
            tone="green"
          />

          <MetricCard
            label="Strength"
            value={currentCaddie?.strength ?? "-"}
            description="Most consistent capability"
            icon="✦"
            tone="purple"
          />

          <MetricCard
            label="Focus Area"
            value={currentCaddie?.improvementArea ?? "-"}
            description="Recommended development area"
            icon="◎"
            tone="orange"
          />
        </section>

        <section style={contentGridStyle}>
          <div style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <div style={sectionLabelStyle}>Learning Path</div>
                <h2 style={sectionTitleStyle}>Recommended Next Actions</h2>
              </div>

              <span style={statusBadgeStyle}>Active</span>
            </div>

            <div style={actionListStyle}>
              <ActionItem
                title="Run one simulator scenario"
                description="Practice club selection and target recommendation using random player profile."
                href="/dashboard/simulator"
                buttonLabel="Start"
                icon="⚑"
              />

              <ActionItem
                title="Submit field reflection"
                description="Record what happened during today's field duty and what you want to improve."
                href="/dashboard/daily-reflection"
                buttonLabel="Reflect"
                icon="▣"
              />

              <ActionItem
                title="Review your performance"
                description="Check score pattern, decision quality, and training focus."
                href="/dashboard/my-performance"
                buttonLabel="Review"
                icon="▥"
              />
            </div>
          </div>

          <div style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <div style={sectionLabelStyle}>Recent Simulator Signals</div>
                <h2 style={sectionTitleStyle}>Latest Practice Results</h2>
              </div>
            </div>

            {mySimulatorResults.length === 0 && (
              <div style={emptyStateStyle}>
                No simulator data yet. Start a simulator session to generate
                training insight.
              </div>
            )}

            {mySimulatorResults.slice(0, 4).map((result) => (
              <div key={result.id} style={resultItemStyle}>
                <div style={resultTextStyle}>
                  <strong>Hole {result.hole}</strong>
                  <p>{result.scenario}</p>
                  <small>{result.mistakePattern}</small>
                </div>

                <div style={scorePillStyle}>{result.score}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={contentGridStyle}>
          <div style={panelCardStyle}>
            <div style={sectionLabelStyle}>Kolb Learning Cycle</div>
            <h2 style={sectionTitleStyle}>How This LMS Develops Caddies</h2>

            <div style={cycleGridStyle}>
              <CycleItem
                step="1"
                title="Experience"
                description="Caddie practices through simulator scenario or actual field duty."
              />

              <CycleItem
                step="2"
                title="Observation"
                description="System captures score, mistake pattern, reflection, and decision quality."
              />

              <CycleItem
                step="3"
                title="Concept"
                description="Trainer identifies learning focus such as hazard reading, club selection, or communication."
              />

              <CycleItem
                step="4"
                title="Experiment"
                description="Caddie repeats better decisions in the next simulation or field duty."
              />
            </div>
          </div>

          <div style={panelCardStyle}>
            <div style={sectionLabelStyle}>Demo Flow</div>
            <h2 style={sectionTitleStyle}>Prototype Presentation Route</h2>

            <ol style={demoListStyle}>
              <li>Open caddie dashboard and explain LMS concept.</li>
              <li>Start simulator and show random player assignment.</li>
              <li>Choose club and target, then submit recommendation.</li>
              <li>Show landing zone, score, mistake pattern, and reflection.</li>
              <li>Save simulation result.</li>
              <li>Submit daily field reflection.</li>
              <li>Switch to Caddie Trainer role and review progress.</li>
            </ol>
          </div>
        </section>
      </div>
    );
  }

  if (currentUser.role === "caddieTrainer") {
    return <TrainerDashboard />;
  }

  return <ManagementDashboard />;
}

function TrainerDashboard() {
  return (
    <div style={pageStyle}>
      <section style={welcomeHeroStyle}>
        <div style={heroContentStyle}>
          <div style={eyebrowStyle}>Trainer Workspace</div>

          <h1 style={heroTitleStyle}>Caddie Trainer Dashboard</h1>

          <p style={heroTextStyle}>
            Review simulator tests, daily field reflections, coaching notes, and
            recommended training priorities for caddie development.
          </p>

          <div style={heroActionsStyle}>
            <a href="/dashboard/trainer-review" style={primaryHeroButtonStyle}>
              Open Trainer Review
            </a>

            <a
              href="/dashboard/training-recommendation"
              style={secondaryHeroButtonStyle}
            >
              Training Recommendation
            </a>
          </div>
        </div>

        <div style={heroStatsPanelStyle}>
          <div style={heroStatItemStyle}>
            <span>Training Role</span>
            <strong>Trainer</strong>
          </div>

          <div style={heroStatItemStyle}>
            <span>Focus</span>
            <strong>Coaching</strong>
          </div>

          <div style={heroStatItemStyle}>
            <span>Mode</span>
            <strong>LMS</strong>
          </div>
        </div>
      </section>

      <section style={metricGridStyle}>
        <MetricCard
          label="Caddies"
          value={String(caddies.length)}
          description="Available training participants"
          icon="◎"
          tone="blue"
        />

        <MetricCard
          label="Simulator Results"
          value={String(simulatorResults.length)}
          description="Mock + saved scenario results"
          icon="⚑"
          tone="green"
        />

        <MetricCard
          label="Training Need"
          value="Auto"
          description="Generated from mistake patterns"
          icon="✦"
          tone="purple"
        />

        <MetricCard
          label="Coaching Notes"
          value="Ready"
          description="Trainer can add notes"
          icon="▣"
          tone="orange"
        />
      </section>

      <section style={contentGridStyle}>
        <div style={panelCardStyle}>
          <div style={sectionLabelStyle}>Trainer Actions</div>
          <h2 style={sectionTitleStyle}>What to Review</h2>

          <div style={actionListStyle}>
            <ActionItem
              title="Review daily reflections"
              description="Read caddie self-evaluation from today's field duty."
              href="/dashboard/trainer-review"
              buttonLabel="Review"
              icon="▣"
            />

            <ActionItem
              title="Review simulator test signals"
              description="See score, risk level, mistake pattern, and recommendation."
              href="/dashboard/simulator-review"
              buttonLabel="Open"
              icon="⚑"
            />

            <ActionItem
              title="Check training recommendation"
              description="Cluster repeated mistake patterns into training priorities."
              href="/dashboard/training-recommendation"
              buttonLabel="Check"
              icon="✦"
            />
          </div>
        </div>

        <div style={panelCardStyle}>
          <div style={sectionLabelStyle}>Trainer Role</div>
          <h2 style={sectionTitleStyle}>Purpose in the LMS</h2>

          <p style={paragraphStyle}>
            The Caddie Trainer focuses on learning quality, not daily operation.
            This role reviews self-reflection, simulator test outcomes, and
            coaching notes to help caddies improve decision making.
          </p>

          <div style={roleSplitStyle}>
            <div>
              <strong>Caddie Trainer</strong>
              <span>Training, coaching, testing, learning progress</span>
            </div>

            <div>
              <strong>Caddie Master</strong>
              <span>Operational supervision and field performance</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ManagementDashboard() {
  const averageScore = Math.round(
    caddies.reduce((total, caddie) => total + caddie.averageScore, 0) /
      caddies.length
  );

  return (
    <div style={pageStyle}>
      <section style={welcomeHeroStyle}>
        <div style={heroContentStyle}>
          <div style={eyebrowStyle}>{roleLabels[currentUser.role]}</div>

          <h1 style={heroTitleStyle}>Management Dashboard</h1>

          <p style={heroTextStyle}>
            Monitor caddie learning performance, simulator signals, and
            development priorities from a broader operational view.
          </p>
        </div>

        <div style={heroStatsPanelStyle}>
          <div style={heroStatItemStyle}>
            <span>Total Caddies</span>
            <strong>{caddies.length}</strong>
          </div>

          <div style={heroStatItemStyle}>
            <span>Average Score</span>
            <strong>{averageScore}</strong>
          </div>

          <div style={heroStatItemStyle}>
            <span>Simulator Results</span>
            <strong>{simulatorResults.length}</strong>
          </div>
        </div>
      </section>

      <section style={metricGridStyle}>
        <MetricCard
          label="Total Caddies"
          value={String(caddies.length)}
          description="Registered prototype caddies"
          icon="◎"
          tone="blue"
        />

        <MetricCard
          label="Average Score"
          value={String(averageScore)}
          description="Team simulator average"
          icon="▥"
          tone="green"
        />

        <MetricCard
          label="Need Attention"
          value="2"
          description="Caddies with lower performance"
          icon="!"
          tone="orange"
        />

        <MetricCard
          label="LMS Status"
          value="Active"
          description="Training prototype is running"
          icon="✦"
          tone="purple"
        />
      </section>

      <section style={panelCardStyle}>
        <div style={sectionLabelStyle}>Team Development</div>
        <h2 style={sectionTitleStyle}>Caddie Overview</h2>

        <div style={tableStyle}>
          {caddies.map((caddie) => (
            <div key={caddie.id} style={tableRowStyle}>
              <div style={tableCellStyle}>
                <strong>{caddie.name}</strong>
                <small>{caddie.id}</small>
              </div>

              <div style={tableCellStyle}>{caddie.level}</div>
              <div style={tableCellStyle}>
                {caddie.totalSimulations} simulations
              </div>
              <div style={scorePillStyle}>{caddie.averageScore}</div>
              <div style={tableCellStyle}>{caddie.improvementArea}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: "blue" | "green" | "purple" | "orange";
}) {
  const toneStyle = toneMap[tone];

  return (
    <div style={metricCardStyle}>
      <div style={{ ...metricIconStyle, ...toneStyle }}>{icon}</div>

      <div style={metricContentStyle}>
        <span style={metricLabelStyle}>{label}</span>
        <strong style={metricValueStyle}>{value}</strong>
        <p style={metricDescriptionStyle}>{description}</p>
      </div>
    </div>
  );
}

function ActionItem({
  title,
  description,
  href,
  buttonLabel,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  icon: string;
}) {
  return (
    <div style={actionItemStyle}>
      <div style={actionIconStyle}>{icon}</div>

      <div style={actionTextStyle}>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <a href={href} style={actionButtonStyle}>
        {buttonLabel}
      </a>
    </div>
  );
}

function CycleItem({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div style={cycleItemStyle}>
      <div style={cycleNumberStyle}>{step}</div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

const toneMap: Record<string, CSSProperties> = {
  blue: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
  },
  green: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },
  purple: {
    background: "#faf5ff",
    color: "#9333ea",
    border: "1px solid #d8b4fe",
  },
  orange: {
    background: "#fff7ed",
    color: "#ea580c",
    border: "1px solid #fed7aa",
  },
};

const pageStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  display: "grid",
  gap: 18,
  paddingBottom: 24,
};

const welcomeHeroStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 24,
  padding: "clamp(18px, 4vw, 28px)",
  color: "#fff",
  background:
    "linear-gradient(135deg, #06142f 0%, #0b2a63 52%, #1d4ed8 100%)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: 22,
  alignItems: "center",
};

const heroContentStyle: CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  maxWidth: "100%",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  lineHeight: 1.2,
};

const heroTitleStyle: CSSProperties = {
  margin: "14px 0 8px",
  fontSize: "clamp(30px, 8vw, 36px)",
  lineHeight: 1.1,
  wordBreak: "normal",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
  color: "#dbeafe",
  lineHeight: 1.65,
  fontSize: "clamp(15px, 4vw, 16px)",
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 22,
  flexWrap: "wrap",
};

const primaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderRadius: 12,
  background: "#fff",
  color: "#1d4ed8",
  textDecoration: "none",
  fontWeight: 900,
  lineHeight: 1.2,
};

const secondaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.24)",
  textDecoration: "none",
  fontWeight: 900,
  lineHeight: 1.2,
};

const heroStatsPanelStyle: CSSProperties = {
  minWidth: 0,
  width: "100%",
  background: "rgba(2,6,23,0.28)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 20,
  padding: 16,
  display: "grid",
  gap: 10,
};

const heroStatItemStyle: CSSProperties = {
  minWidth: 0,
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,0.1)",
  display: "grid",
  gap: 4,
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
  gap: 14,
};

const metricCardStyle: CSSProperties = {
  minWidth: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
};

const metricIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: 20,
  flexShrink: 0,
};

const metricContentStyle: CSSProperties = {
  minWidth: 0,
};

const metricLabelStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  lineHeight: 1.2,
};

const metricValueStyle: CSSProperties = {
  display: "block",
  marginTop: 4,
  fontSize: 22,
  color: "#0f172a",
  lineHeight: 1.15,
  wordBreak: "break-word",
};

const metricDescriptionStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  lineHeight: 1.4,
};

const contentGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: 14,
};

const panelCardStyle: CSSProperties = {
  minWidth: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: "clamp(16px, 4vw, 20px)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

const panelHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: 14,
};

const sectionLabelStyle: CSSProperties = {
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  lineHeight: 1.2,
};

const sectionTitleStyle: CSSProperties = {
  margin: "5px 0 0",
  fontSize: "clamp(18px, 5vw, 20px)",
  lineHeight: 1.2,
};

const statusBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  fontSize: 12,
  fontWeight: 900,
};

const actionListStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const actionItemStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "44px minmax(0, 1fr)",
  gap: 12,
  alignItems: "center",
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const actionIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  background: "#eff6ff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  flexShrink: 0,
};

const actionTextStyle: CSSProperties = {
  minWidth: 0,
};

const actionButtonStyle: CSSProperties = {
  gridColumn: "1 / -1",
  width: "fit-content",
  padding: "9px 12px",
  borderRadius: 10,
  background: "#1d4ed8",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
};

const emptyStateStyle: CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#64748b",
  lineHeight: 1.5,
};

const resultItemStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 52px",
  gap: 12,
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  marginBottom: 10,
  alignItems: "center",
};

const resultTextStyle: CSSProperties = {
  minWidth: 0,
};

const scorePillStyle: CSSProperties = {
  minWidth: 48,
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "#1d4ed8",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

const cycleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
  gap: 12,
  marginTop: 14,
};

const cycleItemStyle: CSSProperties = {
  minWidth: 0,
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const cycleNumberStyle: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "#1d4ed8",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  marginBottom: 10,
};

const demoListStyle: CSSProperties = {
  marginTop: 14,
  lineHeight: 1.85,
  color: "#334155",
  paddingLeft: 22,
};

const paragraphStyle: CSSProperties = {
  color: "#475569",
  lineHeight: 1.7,
};

const roleSplitStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 16,
};

const tableStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  marginTop: 14,
  overflowX: "hidden",
};

const tableRowStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
  gap: 12,
  alignItems: "center",
  padding: 14,
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const tableCellStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gap: 4,
};