import React, { createContext, useContext, useState, useCallback } from "react";

type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "bind"
  | "bind-confirm"
  | "onboarding"
  | "home"
  | "signal-send"
  | "chat"
  | "chat-detail"
  | "anniversary"
  | "anniversary-create"
  | "anniversary-review"
  | "collection"
  | "timeline"
  | "diary-create"
  | "album"
  | "album-detail"
  | "wishes"
  | "wish-create"
  | "profile"
  | "settings"
  | "loading"
  | "end-relationship";

interface AppState {
  currentScreen: Screen;
  previousScreen: Screen | null;
  isLoggedIn: boolean;
  isBound: boolean;
  activeTab: number;
  showToast: string | null;
}

interface AppContextType extends AppState {
  navigate: (screen: Screen) => void;
  goBack: () => void;
  setActiveTab: (tab: number) => void;
  login: () => void;
  bind: () => void;
  toast: (message: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentScreen: "splash",
    previousScreen: null,
    isLoggedIn: false,
    isBound: false,
    activeTab: 0,
    showToast: null,
  });

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: prev.previousScreen || "home",
      previousScreen: null,
    }));
  }, []);

  const setActiveTab = useCallback((tab: number) => {
    const tabScreens: Screen[] = ["home", "chat", "timeline", "collection", "profile"];
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      previousScreen: prev.currentScreen,
      currentScreen: tabScreens[tab] || "home",
    }));
  }, []);

  const login = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoggedIn: true,
      previousScreen: prev.currentScreen,
      currentScreen: "bind",
    }));
  }, []);

  const bind = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isBound: true,
      previousScreen: prev.currentScreen,
      currentScreen: "onboarding",
    }));
  }, []);

  const toast = useCallback((message: string) => {
    setState((prev) => ({ ...prev, showToast: message }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, showToast: null }));
    }, 2000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        goBack,
        setActiveTab,
        login,
        bind,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
