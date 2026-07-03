import type { UserRole } from "./roles";

export const TEST_ACCESS_CODE = "CADDIE-TEST-2026";

export type AuthUser = {
  id: string;
  fullName: string;
  employeeId: string;
  role: UserRole;
  pin: string;
  createdAt: string;
};

export type AuthSession = {
  userId: string;
  fullName: string;
  employeeId: string;
  role: UserRole;
  loginAt: string;
};

export type RegisterInput = {
  fullName: string;
  employeeId: string;
  role: UserRole;
  pin: string;
  accessCode: string;
};

export type LoginInput = {
  employeeId: string;
  pin: string;
};

const USERS_KEY = "caddie-auth-users";
const SESSION_KEY = "caddie-auth-session";

export function getRegisteredUsers(): AuthUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as AuthUser[];
  } catch {
    return [];
  }
}

export function registerUser(input: RegisterInput) {
  if (typeof window === "undefined") {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const fullName = input.fullName.trim();
  const employeeId = input.employeeId.trim().toUpperCase();
  const pin = input.pin.trim();
  const accessCode = input.accessCode.trim();

  if (!fullName || !employeeId || !pin || !accessCode) {
    return {
      success: false,
      message: "Nama, Employee ID, PIN, dan Access Code wajib diisi.",
    };
  }

  if (accessCode !== TEST_ACCESS_CODE) {
    return {
      success: false,
      message: "Access Code salah.",
    };
  }

  if (pin.length < 4) {
    return {
      success: false,
      message: "PIN minimal 4 digit/karakter.",
    };
  }

  const existingUsers = getRegisteredUsers();

  const alreadyExists = existingUsers.some(
    (user) => user.employeeId === employeeId
  );

  if (alreadyExists) {
    return {
      success: false,
      message: "Employee ID sudah terdaftar. Silakan login.",
    };
  }

  const newUser: AuthUser = {
    id: `USER-${Date.now()}`,
    fullName,
    employeeId,
    role: input.role,
    pin,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...existingUsers];

  window.localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  return {
    success: true,
    message: "Registrasi berhasil. Silakan login.",
    user: newUser,
  };
}

export function loginUser(input: LoginInput) {
  if (typeof window === "undefined") {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const employeeId = input.employeeId.trim().toUpperCase();
  const pin = input.pin.trim();

  const users = getRegisteredUsers();

  const matchedUser = users.find(
    (user) => user.employeeId === employeeId && user.pin === pin
  );

  if (!matchedUser) {
    return {
      success: false,
      message: "Employee ID atau PIN salah.",
    };
  }

  const session: AuthSession = {
    userId: matchedUser.id,
    fullName: matchedUser.fullName,
    employeeId: matchedUser.employeeId,
    role: matchedUser.role,
    loginAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return {
    success: true,
    message: "Login berhasil.",
    session,
  };
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function clearAllAuthData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USERS_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}

export function isRouteAllowedForRole(pathname: string, role: UserRole) {
  const allowedRoutes: Record<UserRole, string[]> = {
    caddie: [
      "/dashboard",
      "/dashboard/simulator",
      "/dashboard/daily-reflection",
      "/dashboard/learning",
      "/dashboard/my-performance",
    ],

    caddieTrainer: [
      "/dashboard",
      "/dashboard/trainer-review",
      "/dashboard/simulator-review",
      "/dashboard/training-recommendation",
    ],

    caddieMaster: [
      "/dashboard",
      "/dashboard/evaluations",
      "/dashboard/simulator-review",
      "/dashboard/training-recommendation",
    ],

    golfOperationManager: [
      "/dashboard",
      "/dashboard/operational-performance",
      "/dashboard/caddie-development",
      "/dashboard/reports",
    ],

    gm: [
      "/dashboard",
      "/dashboard/executive-summary",
      "/dashboard/performance-overview",
      "/dashboard/strategic-reports",
    ],
  };

  const allowed = allowedRoutes[role];

  return allowed.some((route) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });
}