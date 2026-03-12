import React, { createContext, useContext, useState, useCallback } from "react";

export type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "bind"
  | "bind-confirm"
  | "onboarding"
  | "home"
  | "signal-send"
  | "signal-receive"
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
  | "end-relationship"
  | "cosmos-letter"
  | "travel-map"
  | "topic-cards"
  | "private-photo";

export type Gender = "female" | "male";

// Signal event for cross-phone communication
export interface SignalEvent {
  id: string;
  from: Gender;
  to: Gender;
  type: string;
  emoji: string;
  text: string;
  timestamp: number;
  status: "sending" | "delivered" | "read";
}

interface PhoneState {
  currentScreen: Screen;
  previousScreen: Screen | null;
  isLoggedIn: boolean;
  isBound: boolean;
  activeTab: number;
  showToast: string | null;
}

interface AppContextType {
  // Dual phone states
  femaleState: PhoneState;
  maleState: PhoneState;
  // Current active perspective
  activeGender: Gender;
  setActiveGender: (g: Gender) => void;
  // View mode
  viewMode: "dual" | "single";
  setViewMode: (m: "dual" | "single") => void;
  // Signal events (shared between phones)
  signals: SignalEvent[];
  sendSignal: (signal: Omit<SignalEvent, "id" | "timestamp" | "status">, options?: { skipSenderNavigation?: boolean }) => void;
  markSignalRead: (id: string) => void;
  // Navigation per phone
  navigate: (screen: Screen, gender?: Gender) => void;
  goBack: (gender?: Gender) => void;
  setActiveTab: (tab: number, gender?: Gender) => void;
  login: (gender?: Gender) => void;
  bind: (gender?: Gender) => void;
  toast: (message: string, gender?: Gender) => void;
  // Chat messages (shared)
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "time">) => void;
  // Convenience getters
  currentState: PhoneState;
}

export interface ChatMessage {
  id: number;
  sender: "female" | "male";
  text: string;
  time: string;
  type: "text" | "image" | "signal" | "topic" | "private-photo";
}

const AppContext = createContext<AppContextType | null>(null);

const defaultState: PhoneState = {
  currentScreen: "splash",
  previousScreen: null,
  isLoggedIn: false,
  isBound: false,
  activeTab: 0,
  showToast: null,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [femaleState, setFemaleState] = useState<PhoneState>({ ...defaultState });
  const [maleState, setMaleState] = useState<PhoneState>({ ...defaultState });
  const [activeGender, setActiveGender] = useState<Gender>("female");
  const [viewMode, setViewMode] = useState<"dual" | "single">("dual");
  const [signals, setSignals] = useState<SignalEvent[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "female", text: "今天天气真好，想出去走走", time: "09:30", type: "text" },
    { id: 2, sender: "male", text: "好呀！去哪里？", time: "09:31", type: "text" },
    { id: 3, sender: "female", text: "去公园吧，听说樱花开了", time: "09:32", type: "text" },
    { id: 4, sender: "male", text: "太棒了！我马上准备", time: "09:33", type: "text" },
  ]);

  const getSetState = (gender?: Gender) => {
    const g = gender || activeGender;
    return g === "female" ? setFemaleState : setMaleState;
  };

  const navigate = useCallback((screen: Screen, gender?: Gender) => {
    const setState = gender === "male" ? setMaleState : gender === "female" ? setFemaleState : (activeGender === "male" ? setMaleState : setFemaleState);
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
    }));
  }, [activeGender]);

  const goBack = useCallback((gender?: Gender) => {
    const setState = gender === "male" ? setMaleState : gender === "female" ? setFemaleState : (activeGender === "male" ? setMaleState : setFemaleState);
    setState((prev) => ({
      ...prev,
      currentScreen: prev.previousScreen || "home",
      previousScreen: null,
    }));
  }, [activeGender]);

  const setActiveTab = useCallback((tab: number, gender?: Gender) => {
    const tabScreens: Screen[] = ["home", "chat", "timeline", "collection", "profile"];
    const setState = gender === "male" ? setMaleState : gender === "female" ? setFemaleState : (activeGender === "male" ? setMaleState : setFemaleState);
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      previousScreen: prev.currentScreen,
      currentScreen: tabScreens[tab] || "home",
    }));
  }, [activeGender]);

  const login = useCallback((gender?: Gender) => {
    const setState = gender === "male" ? setMaleState : gender === "female" ? setFemaleState : (activeGender === "male" ? setMaleState : setFemaleState);
    setState((prev) => ({
      ...prev,
      isLoggedIn: true,
      previousScreen: prev.currentScreen,
      currentScreen: "bind",
    }));
  }, [activeGender]);

  const bind = useCallback((gender?: Gender) => {
    const setState = gender === "male" ? setMaleState : gender === "female" ? setFemaleState : (activeGender === "male" ? setMaleState : setFemaleState);
    setState((prev) => ({
      ...prev,
      isBound: true,
      previousScreen: prev.currentScreen,
      currentScreen: "onboarding",
    }));
  }, [activeGender]);

  const toast = useCallback((message: string, gender?: Gender) => {
    const setState = gender === "male" ? setMaleState : gender === "female" ? setFemaleState : (activeGender === "male" ? setMaleState : setFemaleState);
    setState((prev) => ({ ...prev, showToast: message }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, showToast: null }));
    }, 2000);
  }, [activeGender]);

  const sendSignal = useCallback((signal: Omit<SignalEvent, "id" | "timestamp" | "status">, options?: { skipSenderNavigation?: boolean }) => {
    const newSignal: SignalEvent = {
      ...signal,
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      status: "sending",
    };
    setSignals((prev) => [...prev, newSignal]);

    // Step 1: After 800ms, mark as delivered and navigate receiver to signal-receive
    const receiverSet = signal.to === "female" ? setFemaleState : setMaleState;
    const senderSet = signal.from === "female" ? setFemaleState : setMaleState;

    // Navigate sender back to home (unless called from home directly)
    if (!options?.skipSenderNavigation) {
      setTimeout(() => {
        senderSet((prev) => ({
          ...prev,
          previousScreen: prev.currentScreen,
          currentScreen: "home",
        }));
      }, 300);
    }

    // Simulate delivery + navigate receiver to signal-receive
    setTimeout(() => {
      setSignals((prev) =>
        prev.map((s) => (s.id === newSignal.id ? { ...s, status: "delivered" } : s))
      );
      receiverSet((prev) => ({
        ...prev,
        previousScreen: prev.currentScreen,
        currentScreen: "signal-receive",
        showToast: `收到${signal.from === "female" ? "小心心" : "大宝贝"}的关心: ${signal.emoji} ${signal.text}`,
      }));
      setTimeout(() => {
        receiverSet((prev) => ({ ...prev, showToast: null }));
      }, 3000);
    }, 1200);

    // Step 2: After 5s, mark as read
    setTimeout(() => {
      setSignals((prev) =>
        prev.map((s) => (s.id === newSignal.id ? { ...s, status: "read" } : s))
      );
    }, 5000);
  }, []);

  const markSignalRead = useCallback((id: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "read" } : s))
    );
  }, []);

  const addChatMessage = useCallback((msg: Omit<ChatMessage, "id" | "time">) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now(),
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  }, []);

  const currentState = activeGender === "female" ? femaleState : maleState;

  return (
    <AppContext.Provider
      value={{
        femaleState,
        maleState,
        activeGender,
        setActiveGender,
        viewMode,
        setViewMode,
        signals,
        sendSignal,
        markSignalRead,
        navigate,
        goBack,
        setActiveTab,
        login,
        bind,
        toast,
        chatMessages,
        addChatMessage,
        currentState,
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
