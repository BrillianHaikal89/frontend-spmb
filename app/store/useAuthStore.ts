import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  rememberMe: false,
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
      rememberMe: remember,
      isAuthReady: true,
    });
  },

  loadFromStorage: () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const user =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthReady: true,
      });
    } else {
      set({ isAuthReady: true });
    }
  },

  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    set({
      token: null,
      user: null,
      isAuthReady: true,
    });
  },
}));
