export type UserRole =
  | "caddie"
  | "caddieTrainer"
  | "caddieMaster"
  | "golfOperationManager"
  | "gm";

export const currentUser: {
  name: string;
  role: UserRole;
  caddieId?: string;
} = {
  name: "Puspa",
  role: "caddie",
  caddieId: "CAD-001",
};

export const roleLabels: Record<UserRole, string> = {
  caddie: "Caddie",
  caddieTrainer: "Caddie Trainer",
  caddieMaster: "Caddie Master",
  golfOperationManager: "Golf Operation Manager",
  gm: "General Manager",
};

export const roleMenus: Record<UserRole, { label: string; href: string }[]> = {
  caddie: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Caddie Simulator", href: "/dashboard/simulator" },
    { label: "Evaluasi Turun Hari Ini", href: "/dashboard/daily-reflection" },
    { label: "My Learning", href: "/dashboard/learning" },
    { label: "My Performance", href: "/dashboard/my-performance" },
  ],

  caddieTrainer: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Trainer Review", href: "/dashboard/trainer-review" },
    { label: "Simulator Test Review", href: "/dashboard/simulator-review" },
    {
      label: "Training Recommendation",
      href: "/dashboard/training-recommendation",
    },
  ],

  caddieMaster: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Caddie Evaluation", href: "/dashboard/evaluations" },
    { label: "Simulator Review", href: "/dashboard/simulator-review" },
    {
      label: "Training Recommendation",
      href: "/dashboard/training-recommendation",
    },
  ],

  golfOperationManager: [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: "Operational Performance",
      href: "/dashboard/operational-performance",
    },
    { label: "Caddie Development", href: "/dashboard/caddie-development" },
    { label: "Reports", href: "/dashboard/reports" },
  ],

  gm: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Executive Summary", href: "/dashboard/executive-summary" },
    { label: "Performance Overview", href: "/dashboard/performance-overview" },
    { label: "Strategic Reports", href: "/dashboard/strategic-reports" },
  ],
};