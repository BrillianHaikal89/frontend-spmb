// app/store/useAuthStore.ts
import { create } from "zustand";

type User = {
  username: string;
  role: "admin" | "operator" | "kabupaten" | "kota";
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthReady: boolean;

  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthReady: false,

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isAuthReady: true,
    });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    let user: User | null = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      user = null;
    }

    set({
      token,
      user,
      isAuthReady: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthReady: true,
    });
  },
}));
