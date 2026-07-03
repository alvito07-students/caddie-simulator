"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { roleLabels, roleMenus } from "../../lib/roles";

import {
  getAuthSession,
  isRouteAllowedForRole,
  logoutUser,
  type AuthSession,
} from "../../lib/authStorage";

const menuIcons: Record<string, string> = {
  Dashboard: "⌂",
  "Caddie Simulator": "⚑",
  "Evaluasi Turun Hari Ini": "▣",
  "My Learning": "◈",
  "My Performance": "▥",
  "Trainer Review": "◎",
  "Simulator Test Review": "◉",
  "Training Recommendation": "✦",
  "Caddie Evaluation": "☑",
  "Simulator Review": "◉",
  "Operational Performance": "▤",
  "Caddie Development": "◇",
  Reports: "▧",
  "Executive Summary": "◆",
  "Performance Overview": "▥",
  "Strategic Reports": "▨",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [session, setSession] = useState<AuthSession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const activeSession = getAuthSession();

    if (!activeSession) {
      window.location.href = "/";
      return;
    }

    if (!isRouteAllowedForRole(pathname, activeSession.role)) {
      window.location.href = "/dashboard";
      return;
    }

    setSession(activeSession);
    setIsChecking(false);
  }, [pathname]);

  if (isChecking || !session) {
    return (
      <div style={checkingStyle}>
        <div style={checkingCardStyle}>
          <strong>Checking access...</strong>
          <p>Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  const menus = roleMenus[session.role];
  const bottomMenus = menus.slice(0, 5);

  function handleLogout() {
    logoutUser();
    window.location.href = "/";
  }

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">⚑</div>

            <div>
              <div className="brand-name">Caddie</div>
              <div className="brand-sub">Simulator</div>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">{session.fullName[0]}</div>

            <div className="profile-info">
              <strong>{session.fullName}</strong>
              <span>{roleLabels[session.role]}</span>
              <small>⭐ {session.employeeId}</small>
            </div>

            <div className="profile-arrow">›</div>
          </div>

          <nav className="nav">
            <MenuSection
              title="Main"
              menus={menus.filter((menu) =>
                [
                  "Dashboard",
                  "Caddie Simulator",
                  "Evaluasi Turun Hari Ini",
                  "Trainer Review",
                  "Simulator Test Review",
                  "Caddie Evaluation",
                  "Simulator Review",
                ].includes(menu.label)
              )}
              pathname={pathname}
            />

            <MenuSection
              title="Learning"
              menus={menus.filter((menu) =>
                ["My Learning", "Training Recommendation"].includes(menu.label)
              )}
              pathname={pathname}
            />

            <MenuSection
              title="Performance"
              menus={menus.filter((menu) =>
                [
                  "My Performance",
                  "Operational Performance",
                  "Caddie Development",
                  "Reports",
                  "Executive Summary",
                  "Performance Overview",
                  "Strategic Reports",
                ].includes(menu.label)
              )}
              pathname={pathname}
            />
          </nav>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </aside>

        <div className="mobile-topbar">
          <div className="mobile-title">
            <strong>Caddie Simulator</strong>
            <span>{roleLabels[session.role]}</span>
          </div>

          <button onClick={handleLogout} className="mobile-avatar">
            {session.fullName[0]}
          </button>
        </div>

        <main className="main-area">
          <div className="desktop-topbar">
            <div>
              <strong>Good morning, {session.fullName} 👋</strong>
            </div>

            <div className="topbar-actions">
              <div className="streak">
                <span>🔥</span>
                <div>
                  <strong>12</strong>
                  <small>Day Streak</small>
                </div>
              </div>

              <button className="icon-button">🔔</button>

              <button onClick={handleLogout} className="top-avatar">
                {session.fullName[0]}
              </button>
            </div>
          </div>

          {children}
        </main>

        <nav className="mobile-bottom-nav">
          {bottomMenus.map((menu) => {
            const isActive =
              pathname === menu.href ||
              (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

            return (
              <a
                key={menu.href}
                href={menu.href}
                className={isActive ? "bottom-link active" : "bottom-link"}
              >
                <span>{menuIcons[menu.label] ?? "•"}</span>
                <small>{shortenMenuLabel(menu.label)}</small>
              </a>
            );
          })}
        </nav>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: #eef3fb;
          color: #0f172a;
        }

        body {
          overflow-x: hidden;
        }

        .app-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.1),
              transparent 34%
            ),
            linear-gradient(180deg, #f8fafc 0%, #eef3fb 100%);
        }

        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 18px 14px;
          background:
            radial-gradient(
              circle at top left,
              rgba(59, 130, 246, 0.24),
              transparent 34%
            ),
            linear-gradient(180deg, #020617 0%, #071936 58%, #020617 100%);
          color: white;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(148, 163, 184, 0.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 8px 18px;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.3);
          font-size: 23px;
          font-weight: 900;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 950;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .brand-sub {
          margin-top: 4px;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2.4px;
        }

        .profile-card {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.22);
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #60a5fa, #1d4ed8);
          color: white;
          font-size: 18px;
          font-weight: 950;
        }

        .profile-info {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .profile-info strong {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-info span {
          color: #bfdbfe;
          font-size: 12px;
          font-weight: 800;
        }

        .profile-info small {
          width: fit-content;
          margin-top: 4px;
          padding: 3px 7px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.25);
          color: #dbeafe;
          font-size: 10px;
          font-weight: 900;
        }

        .profile-arrow {
          color: #bfdbfe;
          font-size: 24px;
          line-height: 1;
        }

        .nav {
          display: grid;
          gap: 18px;
          padding-bottom: 18px;
        }

        .nav-section {
          display: grid;
          gap: 6px;
        }

        .nav-section:empty {
          display: none;
        }

        .nav-title {
          margin: 0 10px 6px;
          color: #64748b;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 14px;
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          font-weight: 850;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .nav-link.active {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          box-shadow: 0 12px 26px rgba(37, 99, 235, 0.32);
        }

        .nav-icon {
          width: 25px;
          height: 25px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.07);
          flex-shrink: 0;
          font-size: 14px;
        }

        .logout-button {
          margin-top: auto;
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          font-weight: 900;
          cursor: pointer;
        }

        .main-area {
          min-width: 0;
          padding: 0 24px 28px;
        }

        .desktop-topbar {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: rgba(255, 255, 255, 0.82);
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          backdrop-filter: blur(14px);
          margin: 0 -24px 22px;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .streak {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-right: 1px solid #e2e8f0;
        }

        .streak div {
          display: grid;
          line-height: 1.05;
        }

        .streak strong {
          font-size: 14px;
        }

        .streak small {
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
        }

        .icon-button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
          cursor: pointer;
        }

        .top-avatar {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #1d4ed8);
          color: #ffffff;
          font-weight: 950;
          cursor: pointer;
        }

        .mobile-topbar,
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 900px) {
          .app-shell {
            display: block;
            min-height: 100vh;
            padding-top: 68px;
            padding-bottom: 84px;
          }

          .sidebar,
          .desktop-topbar {
            display: none;
          }

          .mobile-topbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            height: 68px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 40px;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            background:
              radial-gradient(
                circle at top right,
                rgba(37, 99, 235, 0.25),
                transparent 34%
              ),
              linear-gradient(135deg, #020617, #0f172a);
            color: #ffffff;
            border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          }

          .mobile-title {
            min-width: 0;
            text-align: center;
            padding-left: 40px;
          }

          .mobile-title strong {
            display: block;
            font-size: 15px;
            line-height: 1.1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-title span {
            display: block;
            margin-top: 3px;
            color: #93c5fd;
            font-size: 11px;
            font-weight: 800;
          }

          .mobile-avatar {
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: #2563eb;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 950;
          }

          .main-area {
            width: 100%;
            min-width: 0;
            padding: 12px;
            overflow-x: hidden;
          }

          .mobile-bottom-nav {
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            z-index: 100;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
            padding: 8px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid rgba(226, 232, 240, 0.95);
            box-shadow: 0 18px 42px rgba(15, 23, 42, 0.2);
            backdrop-filter: blur(16px);
          }

          .bottom-link {
            min-width: 0;
            display: grid;
            justify-items: center;
            gap: 4px;
            color: #64748b;
            text-decoration: none;
            padding: 7px 4px;
            border-radius: 16px;
            font-size: 18px;
            font-weight: 950;
          }

          .bottom-link small {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 10px;
            font-weight: 850;
          }

          .bottom-link.active {
            color: #2563eb;
            background: #eff6ff;
          }
        }
      `}</style>
    </>
  );
}

function MenuSection({
  title,
  menus,
  pathname,
}: {
  title: string;
  menus: { label: string; href: string }[];
  pathname: string;
}) {
  if (menus.length === 0) {
    return null;
  }

  return (
    <div className="nav-section">
      <div className="nav-title">{title}</div>

      {menus.map((menu) => {
        const isActive =
          pathname === menu.href ||
          (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

        return (
          <a
            key={menu.href}
            href={menu.href}
            className={isActive ? "nav-link active" : "nav-link"}
          >
            <span className="nav-icon">{menuIcons[menu.label] ?? "•"}</span>
            <span>{menu.label}</span>
          </a>
        );
      })}
    </div>
  );
}

function shortenMenuLabel(label: string) {
  const map: Record<string, string> = {
    Dashboard: "Home",
    "Caddie Simulator": "Simulator",
    "Evaluasi Turun Hari Ini": "Reflect",
    "My Learning": "Learning",
    "My Performance": "Perf",
    "Trainer Review": "Review",
    "Simulator Test Review": "Test",
    "Training Recommendation": "Training",
    "Caddie Evaluation": "Eval",
    "Simulator Review": "Review",
    "Operational Performance": "Ops",
    "Caddie Development": "Dev",
    Reports: "Reports",
    "Executive Summary": "Exec",
    "Performance Overview": "Perf",
    "Strategic Reports": "Strategy",
  };

  return map[label] ?? label;
}

const checkingStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eef3fb",
};

const checkingCardStyle: CSSProperties = {
  padding: 24,
  borderRadius: 18,
  background: "#fff",
  border: "1px solid #e5e7eb",
  boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
};