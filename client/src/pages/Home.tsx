/*
 * Home - 主入口页面
 * 双手机分屏布局 + 信号飞行动画 + 流程导航面板
 * 女方粉色 / 男方蓝色
 */
import { AppProvider, useApp, Gender, Screen } from "@/contexts/AppContext";
import PhoneFrame from "@/components/PhoneFrame";
import FlowNavigator from "@/components/FlowNavigator";
import Toast from "@/components/Toast";
import SignalAnimation from "@/components/SignalAnimation";
import { MASCOT, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, ChevronUp, Monitor, Smartphone, ArrowLeftRight } from "lucide-react";
import React, { useState } from "react";

/* ─── Flow Navigation Panel ─── */
function FlowPanel() {
  const { navigate, femaleState, maleState, activeGender, viewMode } = useApp();
  const state = femaleState; // Always highlight based on female state for consistency
  const theme = THEME.female; // Flow panel uses a neutral/female theme

  // Navigate both phones simultaneously
  const navigateBoth = (screen: Screen) => {
    navigate(screen, "female");
    navigate(screen, "male");
  };

  const flows: { title: string; color: string; screens: { id: Screen; label: string; emoji: string }[] }[] = [
    {
      title: "A. 登录注册",
      color: theme.primary,
      screens: [
        { id: "splash", label: "启动页", emoji: "🚀" },
        { id: "welcome", label: "欢迎页", emoji: "👋" },
        { id: "login", label: "登录页", emoji: "🔐" },
      ],
    },
    {
      title: "B. 关系绑定",
      color: "#4ECDC4",
      screens: [
        { id: "bind", label: "绑定页", emoji: "🔗" },
        { id: "onboarding", label: "引导设置", emoji: "⚙️" },
      ],
    },
    {
      title: "C. 关心信号",
      color: "#FF6B35",
      screens: [
        { id: "home", label: "首页", emoji: "🏠" },
        { id: "signal-send", label: "发送信号", emoji: "💌" },
        { id: "signal-receive", label: "接收信号", emoji: "📬" },
      ],
    },
    {
      title: "D. 即时通信",
      color: "#FFC800",
      screens: [
        { id: "chat", label: "聊天", emoji: "💬" },
        { id: "topic-cards", label: "话题", emoji: "🎴" },
        { id: "private-photo", label: "私密图片", emoji: "🔒" },
      ],
    },
    {
      title: "E. 纪念日",
      color: "#B8A9C9",
      screens: [{ id: "anniversary", label: "纪念日列表", emoji: "🎂" }],
    },
    {
      title: "F. 收藏馆",
      color: "#58CC02",
      screens: [{ id: "collection", label: "收藏馆", emoji: "⭐" }],
    },
    {
      title: "G. 宇宙来信",
      color: "#9B59B6",
      screens: [{ id: "cosmos-letter", label: "星座运势", emoji: "🌌" }],
    },
    {
      title: "H. 恋爱历程",
      color: "#FF9A9E",
      screens: [
        { id: "timeline", label: "时间轴", emoji: "📅" },
        { id: "diary-create", label: "写日记", emoji: "📝" },
      ],
    },
    {
      title: "I. 相册 & 旅行",
      color: "#4ECDC4",
      screens: [
        { id: "album", label: "相册", emoji: "📸" },
        { id: "travel-map", label: "旅行地图", emoji: "🗺️" },
      ],
    },
    {
      title: "J. 愿望清单",
      color: "#FFC800",
      screens: [{ id: "wishes", label: "愿望清单", emoji: "🌟" }],
    },
    {
      title: "系统",
      color: "#7f8c8d",
      screens: [
        { id: "profile", label: "个人资料", emoji: "👤" },
        { id: "settings", label: "设置", emoji: "⚙️" },
        { id: "end-relationship", label: "结束关系", emoji: "💔" },
      ],
    },
  ];

  return (
    <div className="w-56 bg-white rounded-3xl shadow-lg border overflow-hidden max-h-[812px] flex flex-col" style={{ borderColor: theme.cardBorder }}>
      <div className="flex items-center gap-2 p-3 pb-2 border-b" style={{ borderColor: theme.cardBorder, background: theme.primaryLight }}>
        <motion.img
          src={MASCOT.thinking}
          alt=""
          className="w-8 h-8"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div>
          <h3 className="font-black text-sm" style={{ color: theme.primary, fontFamily: "'Nunito', sans-serif" }}>
            流程导航
          </h3>
          <p className="text-[9px] text-[#7f8c8d]">点击跳转对应页面</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-hide">
        {flows.map((flow) => (
          <div key={flow.title}>
            <p className="text-[9px] font-bold text-[#7f8c8d] uppercase tracking-wider mb-1 px-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: flow.color }} />
              {flow.title}
            </p>
            <div className="space-y-0.5">
              {flow.screens.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => navigateBoth(screen.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                    state.currentScreen === screen.id
                      ? "text-white shadow-sm"
                      : "text-[#2C3E50] hover:bg-gray-50"
                  }`}
                  style={state.currentScreen === screen.id ? { background: flow.color } : undefined}
                >
                  <span className="text-xs">{screen.emoji}</span>
                  {screen.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mobile Flow Bar ─── */
function MobileFlowBar() {
  const { navigate, femaleState, maleState, activeGender, setActiveGender, viewMode, setViewMode } = useApp();
  const state = femaleState;
  const theme = activeGender === "female" ? THEME.female : THEME.male;
  const navigateBoth = (screen: Screen) => {
    navigate(screen, "female");
    navigate(screen, "male");
  };
  const [expanded, setExpanded] = useState(false);

  const allScreens: { id: Screen; label: string }[] = [
    { id: "splash", label: "🚀 启动" },
    { id: "welcome", label: "👋 欢迎" },
    { id: "login", label: "🔐 登录" },
    { id: "home", label: "🏠 首页" },
    { id: "signal-send", label: "💌 信号" },
    { id: "chat", label: "💬 聊天" },
    { id: "private-photo", label: "🔒 私密图" },
    { id: "cosmos-letter", label: "🌌 宇宙来信" },
    { id: "travel-map", label: "🗺️ 旅行" },
    { id: "topic-cards", label: "🎴 话题" },
    { id: "timeline", label: "📅 历程" },
    { id: "collection", label: "⭐ 收藏" },
    { id: "anniversary", label: "🎂 纪念日" },
    { id: "album", label: "📸 相册" },
    { id: "wishes", label: "🌟 愿望" },
    { id: "profile", label: "👤 我的" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md border-t px-3 pt-3 pb-1"
            style={{ borderColor: theme.cardBorder }}
          >
            <div className="grid grid-cols-4 gap-1.5">
              {allScreens.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { navigateBoth(s.id); setExpanded(false); }}
                  className={`px-2 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all text-center ${
                    state.currentScreen === s.id
                      ? "text-white"
                      : "bg-[#F7F3F0] text-[#7f8c8d]"
                  }`}
                  style={state.currentScreen === s.id ? { background: theme.primary } : undefined}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/95 backdrop-blur-md border-t px-3 py-2 flex items-center gap-2" style={{ borderColor: theme.cardBorder }}>
        {/* Gender toggle */}
        <button
          onClick={() => setActiveGender(activeGender === "female" ? "male" : "female")}
          className="flex-shrink-0 px-2 py-1.5 rounded-full text-[11px] font-bold text-white"
          style={{ background: theme.primary }}
        >
          {activeGender === "female" ? "👩 她" : "👨 他"}
        </button>
        <div className="flex overflow-x-auto gap-1 flex-1 scrollbar-hide">
          {allScreens.slice(0, 5).map((s) => (
            <button
              key={s.id}
              onClick={() => navigateBoth(s.id)}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                state.currentScreen === s.id
                  ? "text-white"
                  : "bg-[#F7F3F0] text-[#7f8c8d]"
              }`}
              style={state.currentScreen === s.id ? { background: theme.primary } : undefined}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: theme.primary }}
        >
          {expanded ? <ChevronDown size={16} color="white" /> : <ChevronUp size={16} color="white" />}
        </button>
      </div>
    </div>
  );
}

/* ─── Dual Phone View ─── */
function DualPhoneView() {
  const { viewMode, setViewMode, activeGender, setActiveGender } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] via-[#faf8f5] to-[#f0f4f8] flex flex-col">
      {/* Top control bar */}
      <div className="flex items-center justify-center gap-4 py-4 px-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-[#FF6B8A] to-[#4A90D9] rounded-xl flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart size={20} color="white" fill="white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-black text-[#2C3E50]" style={{ fontFamily: "'Nunito', 'Noto Sans SC', sans-serif" }}>
              恋爱脑 <span className="text-sm font-semibold text-[#7f8c8d]">LoveBrain</span>
            </h1>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 ml-4">
          {/* View mode toggle */}
          <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
            <button
              onClick={() => setViewMode("dual")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "dual" ? "bg-[#2C3E50] text-white" : "text-[#7f8c8d]"
              }`}
            >
              <Monitor size={12} />
              双屏
            </button>
            <button
              onClick={() => setViewMode("single")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "single" ? "bg-[#2C3E50] text-white" : "text-[#7f8c8d]"
              }`}
            >
              <Smartphone size={12} />
              单屏
            </button>
          </div>

          {/* Gender switch (for single mode) */}
          {viewMode === "single" && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setActiveGender(activeGender === "female" ? "male" : "female")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
              style={{
                background: activeGender === "female" ? THEME.female.primary : THEME.male.primary,
              }}
            >
              <ArrowLeftRight size={12} />
              切换到{activeGender === "female" ? "他" : "她"}的视角
            </motion.button>
          )}
        </div>
      </div>

      {/* Phone area */}
      <div className="flex-1 flex items-start justify-center gap-4 px-4 pb-4 pt-0 overflow-hidden">
        {/* Left: Flow panel */}
        <div className="hidden xl:block flex-shrink-0 pt-2">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <FlowPanel />
          </motion.div>
        </div>

        {/* Phones */}
        <div className="flex items-start justify-center gap-2 relative">
          {(viewMode === "dual" || activeGender === "female") && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex flex-col items-center"
            >
              {/* Label */}
              <motion.div
                className="mb-2 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm"
                style={{ background: THEME.female.primary }}
                animate={activeGender === "female" && viewMode === "dual" ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-xs font-bold whitespace-nowrap">👩 小心心（她）</span>
              </motion.div>
              <div
                className={`transition-all duration-300 ${
                  viewMode === "dual" ? "scale-[0.85] origin-top" : ""
                } ${activeGender === "female" && viewMode === "dual" ? "ring-4 ring-[#FF6B8A]/30 rounded-[48px]" : ""}`}
                onClick={() => viewMode === "dual" && setActiveGender("female")}
              >
                <PhoneFrame>
                  <FlowNavigator gender="female" />
                  <Toast gender="female" />
                </PhoneFrame>
              </div>
            </motion.div>
          )}

          {/* Signal animation (between phones in dual mode) */}
          {viewMode === "dual" && <SignalAnimation />}

          {(viewMode === "dual" || activeGender === "male") && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative flex flex-col items-center"
            >
              {/* Label */}
              <motion.div
                className="mb-2 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm"
                style={{ background: THEME.male.primary }}
                animate={activeGender === "male" && viewMode === "dual" ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-xs font-bold whitespace-nowrap">👨 大宝贝（他）</span>
              </motion.div>
              <div
                className={`transition-all duration-300 ${
                  viewMode === "dual" ? "scale-[0.85] origin-top" : ""
                } ${activeGender === "male" && viewMode === "dual" ? "ring-4 ring-[#4A90D9]/30 rounded-[48px]" : ""}`}
                onClick={() => viewMode === "dual" && setActiveGender("male")}
              >
                <PhoneFrame>
                  <FlowNavigator gender="male" />
                  <Toast gender="male" />
                </PhoneFrame>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Info panel */}
        <div className="hidden xl:flex flex-col gap-3 flex-shrink-0 pt-2 max-w-[200px]">
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Signal log */}
            <SignalLog />
          </motion.div>
        </div>
      </div>

      <MobileFlowBar />
    </div>
  );
}

/* ─── Signal Log Panel ─── */
function SignalLog() {
  const { signals } = useApp();
  const recentSignals = signals.slice(-8).reverse();

  return (
    <div className="w-52 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-[#FFF0F3] to-[#EBF3FC]">
        <h3 className="font-black text-sm text-[#2C3E50]" style={{ fontFamily: "'Nunito', sans-serif" }}>
          💕 信号记录
        </h3>
        <p className="text-[9px] text-[#7f8c8d]">实时查看心动信号收发</p>
      </div>
      <div className="p-2 max-h-[400px] overflow-y-auto space-y-1.5">
        {recentSignals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">💌</p>
            <p className="text-xs text-[#b0b0b0]">还没有信号记录</p>
            <p className="text-[10px] text-[#b0b0b0]">发送一个关心信号试试</p>
          </div>
        ) : (
          recentSignals.map((sig) => (
            <motion.div
              key={sig.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 p-2 rounded-xl bg-gray-50"
            >
              <span className="text-lg">{sig.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#2C3E50] truncate">
                  {sig.from === "female" ? "👩她" : "👨他"} → {sig.to === "female" ? "👩她" : "👨他"}
                </p>
                <p className="text-[9px] text-[#7f8c8d] truncate">{sig.text}</p>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${
                sig.status === "read" ? "bg-[#58CC02]" : sig.status === "delivered" ? "bg-[#4ECDC4]" : "bg-[#FFC800]"
              }`} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── App Content ─── */
function AppContent() {
  return <DualPhoneView />;
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
