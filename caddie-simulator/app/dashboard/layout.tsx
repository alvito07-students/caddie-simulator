import { currentUser, roleLabels, roleMenus } from "../../lib/roles";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menus = roleMenus[currentUser.role];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 260,
          padding: 20,
          background: "#0f172a",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Caddie System</h2>

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <p style={{ margin: 0 }}>{currentUser.name}</p>
          <small>Role: {roleLabels[currentUser.role]}</small>
        </div>

        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menus.map((menu) => (
              <li key={menu.href} style={{ marginBottom: 12 }}>
                <a
                  href={menu.href}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {menu.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24, background: "#f8fafc" }}>
        {children}
      </main>
    </div>
  );
}