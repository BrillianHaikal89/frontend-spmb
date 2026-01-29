// app/store/useAuthStore.ts
import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: any | null;
  isAuthReady: boolean;

  setAuth: (token: string, user: any, remember: boolean) => void;
  loadFromStorage: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthReady: false,

  setAuth: (token, user, remember) => {
    if (remember) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    set({
      token,
      user,
      isAuthReady: true,
    });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const user =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    set({
      token,
      user: user ? JSON.parse(user) : null,
      isAuthReady: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthReady: true,
    });
  },
}));
