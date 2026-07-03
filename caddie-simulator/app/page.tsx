"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import type { UserRole } from "../lib/roles";

import {
  TEST_ACCESS_CODE,
  getAuthSession,
  getRegisteredUsers,
  loginUser,
  registerUser,
  type AuthUser,
} from "../lib/authStorage";

const roleOptions: { label: string; value: UserRole }[] = [
  { label: "Caddie", value: "caddie" },
  { label: "Caddie Master", value: "caddieMaster" },
  { label: "Caddie Trainer", value: "caddieTrainer" },
];

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState<UserRole>("caddie");
  const [pin, setPin] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const [message, setMessage] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>([]);

  useEffect(() => {
    const session = getAuthSession();

    if (session) {
      window.location.href = "/dashboard";
      return;
    }

    setRegisteredUsers(getRegisteredUsers());
  }, []);

  function handleRegister() {
    const result = registerUser({
      fullName,
      employeeId,
      role,
      pin,
      accessCode,
    });

    setMessage(result.message);

    if (result.success) {
      setRegisteredUsers(getRegisteredUsers());
      setMode("login");
      setFullName("");
      setRole("caddie");
      setAccessCode("");
    }
  }

  function handleLogin() {
    const result = loginUser({
      employeeId,
      pin,
    });

    setMessage(result.message);

    if (result.success) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main style={pageStyle}>
      <section style={loginShellStyle}>
        <div style={leftPanelStyle}>
          <div style={brandRowStyle}>
            <div style={brandMarkStyle}>⚑</div>

            <div>
              <div style={brandTitleStyle}>Caddie</div>
              <div style={brandSubtitleStyle}>Simulator</div>
            </div>
          </div>

          <div>
            <div style={eyebrowStyle}>Private Testing Access</div>

            <h1 style={heroTitleStyle}>
              Training LMS
              <br />
              for Caddie
              <br />
              Decision Making.
            </h1>

            <p style={heroTextStyle}>
              Register sebagai caddie, caddie master, atau caddie trainer untuk
              mencoba prototype full app. Dashboard dan fitur internal hanya
              bisa dibuka setelah login.
            </p>

            <div style={featureGridStyle}>
              <FeatureItem
                icon="⚑"
                title="Simulator"
                description="Latih keputusan club, target, hazard, dan landing zone."
              />

              <FeatureItem
                icon="▣"
                title="Reflection"
                description="Evaluasi turun harian untuk membaca kebutuhan training."
              />

              <FeatureItem
                icon="◎"
                title="Trainer Review"
                description="Trainer memberi coaching note berdasarkan data."
              />

              <FeatureItem
                icon="☑"
                title="Role Access"
                description="Menu dashboard mengikuti role masing-masing user."
              />
            </div>
          </div>

          <div style={footerNoteStyle}>
            Access Code testing: <strong>{TEST_ACCESS_CODE}</strong>
          </div>
        </div>

        <div style={rightPanelStyle}>
          <div style={loginCardStyle}>
            <div style={mobileBrandStyle}>
              <div style={brandMarkSmallStyle}>⚑</div>
              <strong>Caddie Simulator</strong>
            </div>

            <div style={modeTabsStyle}>
              <button
                onClick={() => setMode("login")}
                style={{
                  ...modeTabStyle,
                  ...(mode === "login" ? activeModeTabStyle : {}),
                }}
              >
                Login
              </button>

              <button
                onClick={() => setMode("register")}
                style={{
                  ...modeTabStyle,
                  ...(mode === "register" ? activeModeTabStyle : {}),
                }}
              >
                Register
              </button>
            </div>

            {mode === "register" && (
              <div style={formStyle}>
                <div>
                  <div style={loginBadgeStyle}>New Tester</div>
                  <h2 style={loginTitleStyle}>Register Akun Testing</h2>
                  <p style={loginDescriptionStyle}>
                    Setiap tester daftar sendiri dulu sesuai role masing-masing.
                  </p>
                </div>

                <FormField
                  label="Nama Lengkap"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Contoh: Puspa"
                />

                <FormField
                  label="Employee ID"
                  value={employeeId}
                  onChange={(value) => setEmployeeId(value.toUpperCase())}
                  placeholder="Contoh: CAD-001"
                />

                <div style={fieldStyle}>
                  <label style={labelStyle}>Role</label>
                  <select
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as UserRole)
                    }
                    style={inputStyle}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <FormField
                  label="PIN"
                  value={pin}
                  onChange={setPin}
                  placeholder="Minimal 4 digit/karakter"
                  type="password"
                />

                <FormField
                  label="Access Code"
                  value={accessCode}
                  onChange={setAccessCode}
                  placeholder="Masukkan kode testing"
                  type="password"
                />

                <button onClick={handleRegister} style={primaryButtonStyle}>
                  Register Tester
                </button>
              </div>
            )}

            {mode === "login" && (
              <div style={formStyle}>
                <div>
                  <div style={loginBadgeStyle}>Testing Access</div>
                  <h2 style={loginTitleStyle}>Login ke Prototype</h2>
                  <p style={loginDescriptionStyle}>
                    Masuk pakai Employee ID dan PIN yang sudah didaftarkan.
                  </p>
                </div>

                <FormField
                  label="Employee ID"
                  value={employeeId}
                  onChange={(value) => setEmployeeId(value.toUpperCase())}
                  placeholder="Contoh: CAD-001"
                />

                <FormField
                  label="PIN"
                  value={pin}
                  onChange={setPin}
                  placeholder="PIN akun testing"
                  type="password"
                />

                <button onClick={handleLogin} style={primaryButtonStyle}>
                  Login to Dashboard
                </button>
              </div>
            )}

            {message && <div style={messageBoxStyle}>{message}</div>}

            <div style={registeredBoxStyle}>
              <strong>Registered Testers</strong>

              {registeredUsers.length === 0 && (
                <p>Belum ada tester terdaftar.</p>
              )}

              {registeredUsers.map((user) => (
                <div key={user.id} style={registeredUserStyle}>
                  <div>
                    <strong>{user.fullName}</strong>
                    <small>
                      {user.employeeId} · {formatRole(user.role)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        style={inputStyle}
      />
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div style={featureItemStyle}>
      <div style={featureIconStyle}>{icon}</div>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

function formatRole(role: UserRole) {
  const labels: Record<UserRole, string> = {
    caddie: "Caddie",
    caddieMaster: "Caddie Master",
    caddieTrainer: "Caddie Trainer",
    golfOperationManager: "Golf Operation Manager",
    gm: "General Manager",
  };

  return labels[role];
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "clamp(14px, 3vw, 28px)",
  background:
    "radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(14,165,233,0.12), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef3fb 100%)",
  color: "#0f172a",
};

const loginShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1320,
  minHeight: "calc(100vh - 56px)",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
  gap: 22,
  alignItems: "stretch",
};

const leftPanelStyle: CSSProperties = {
  borderRadius: 30,
  padding: "clamp(24px, 5vw, 44px)",
  background:
    "linear-gradient(135deg, #020617 0%, #06142f 42%, #1d4ed8 100%)",
  color: "#fff",
  boxShadow: "0 24px 70px rgba(15,23,42,0.22)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 36,
};

const brandRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const brandMarkStyle: CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: 18,
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  fontWeight: 900,
};

const brandTitleStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: 2,
  lineHeight: 1,
};

const brandSubtitleStyle: CSSProperties = {
  marginTop: 5,
  color: "#93c5fd",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: 2.8,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "7px 11px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.24)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

const heroTitleStyle: CSSProperties = {
  margin: "18px 0 12px",
  fontSize: "clamp(38px, 8vw, 66px)",
  lineHeight: 0.98,
  letterSpacing: -1.2,
};

const heroTextStyle: CSSProperties = {
  maxWidth: 720,
  margin: 0,
  color: "#dbeafe",
  lineHeight: 1.7,
  fontSize: "clamp(15px, 3vw, 17px)",
};

const featureGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: 12,
  marginTop: 28,
};

const featureItemStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  padding: 14,
  borderRadius: 18,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.16)",
};

const featureIconStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 13,
  background: "rgba(255,255,255,0.14)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontWeight: 900,
};

const footerNoteStyle: CSSProperties = {
  color: "#bfdbfe",
  fontSize: 13,
  fontWeight: 800,
};

const rightPanelStyle: CSSProperties = {
  display: "grid",
  alignContent: "center",
};

const loginCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(226,232,240,0.95)",
  borderRadius: 28,
  padding: "clamp(20px, 5vw, 32px)",
  boxShadow: "0 24px 70px rgba(15,23,42,0.14)",
  backdropFilter: "blur(16px)",
};

const mobileBrandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 22,
};

const brandMarkSmallStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 13,
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

const modeTabsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
  padding: 6,
  borderRadius: 16,
  background: "#f1f5f9",
  marginBottom: 18,
};

const modeTabStyle: CSSProperties = {
  padding: 11,
  borderRadius: 12,
  border: "none",
  background: "transparent",
  color: "#64748b",
  fontWeight: 900,
  cursor: "pointer",
};

const activeModeTabStyle: CSSProperties = {
  background: "#fff",
  color: "#1d4ed8",
  boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const loginBadgeStyle: CSSProperties = {
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
};

const loginTitleStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "clamp(28px, 6vw, 38px)",
  lineHeight: 1.1,
};

const loginDescriptionStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  lineHeight: 1.65,
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 7,
};

const labelStyle: CSSProperties = {
  fontWeight: 900,
  color: "#334155",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: 13,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#fff",
  fontWeight: 800,
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: 4,
  padding: "15px 16px",
  borderRadius: 16,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};

const messageBoxStyle: CSSProperties = {
  marginTop: 14,
  padding: 13,
  borderRadius: 14,
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  fontWeight: 800,
};

const registeredBoxStyle: CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const registeredUserStyle: CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: 14,
  background: "#fff",
  border: "1px solid #e5e7eb",
  display: "grid",
};