/*
 * Home - 主入口页面
 * 包含手机模拟器外壳 + 流程导航 + 侧边流程导航面板
 * Jelly Pop 弹性美学
 */
import { AppProvider, useApp } from "@/contexts/AppContext";
import PhoneFrame from "@/components/PhoneFrame";
import FlowNavigator from "@/components/FlowNavigator";
import Toast from "@/components/Toast";
import { MASCOT } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

// Flow navigation panel
function FlowPanel() {
  const { navigate, currentScreen } = useApp();

  const flows = [
    {
      title: "A. 登录注册",
      color: "#FF6B8A",
      screens: [
        { id: "splash" as const, label: "启动页", emoji: "🚀" },
        { id: "welcome" as const, label: "欢迎页", emoji: "👋" },
        { id: "login" as const, label: "登录页", emoji: "🔐" },
      ],
    },
    {
      title: "B. 关系绑定",
      color: "#4ECDC4",
      screens: [
        { id: "bind" as const, label: "绑定页", emoji: "🔗" },
        { id: "onboarding" as const, label: "引导设置", emoji: "⚙️" },
      ],
    },
    {
      title: "C. 关心信号",
      color: "#FF6B35",
      screens: [
        { id: "home" as const, label: "首页", emoji: "🏠" },
        { id: "signal-send" as const, label: "发送信号", emoji: "💌" },
      ],
    },
    {
      title: "D. 即时通信",
      color: "#FFC800",
      screens: [
        { id: "chat" as const, label: "聊天", emoji: "💬" },
      ],
    },
    {
      title: "E. 纪念日",
      color: "#B8A9C9",
      screens: [
        { id: "anniversary" as const, label: "纪念日列表", emoji: "🎂" },
      ],
    },
    {
      title: "F. 收藏馆",
      color: "#58CC02",
      screens: [
        { id: "collection" as const, label: "收藏馆", emoji: "⭐" },
      ],
    },
    {
      title: "H. 恋爱历程",
      color: "#FF9A9E",
      screens: [
        { id: "timeline" as const, label: "时间轴", emoji: "📅" },
        { id: "diary-create" as const, label: "写日记", emoji: "📝" },
      ],
    },
    {
      title: "I. 相册",
      color: "#4ECDC4",
      screens: [
        { id: "album" as const, label: "相册", emoji: "📸" },
      ],
    },
    {
      title: "J. 愿望清单",
      color: "#FFC800",
      screens: [
        { id: "wishes" as const, label: "愿望清单", emoji: "🌟" },
      ],
    },
    {
      title: "系统",
      color: "#7f8c8d",
      screens: [
        { id: "profile" as const, label: "个人资料", emoji: "👤" },
        { id: "settings" as const, label: "设置", emoji: "⚙️" },
        { id: "end-relationship" as const, label: "结束关系", emoji: "💔" },
        { id: "loading" as const, label: "加载页", emoji: "⏳" },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white rounded-3xl shadow-lg border border-[#f0e6e0] overflow-hidden max-h-[812px] flex flex-col">
      <div className="flex items-center gap-2 p-4 pb-3 border-b border-[#f0e6e0] bg-gradient-to-r from-[#FFF0F3] to-white">
        <motion.img
          src={MASCOT.thinking}
          alt=""
          className="w-9 h-9"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div>
          <h3 className="font-black text-[#FF6B8A] text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
            流程导航
          </h3>
          <p className="text-[10px] text-[#7f8c8d]">点击跳转到对应页面</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
        {flows.map((flow) => (
          <div key={flow.title}>
            <p className="text-[10px] font-bold text-[#7f8c8d] uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: flow.color }} />
              {flow.title}
            </p>
            <div className="space-y-0.5">
              {flow.screens.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => navigate(screen.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    currentScreen === screen.id
                      ? "text-white shadow-sm"
                      : "text-[#2C3E50] hover:bg-[#FFF0F3]"
                  }`}
                  style={currentScreen === screen.id ? { background: flow.color } : undefined}
                >
                  <span className="text-sm">{screen.emoji}</span>
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

function MobileFlowBar() {
  const { navigate, currentScreen } = useApp();
  const [expanded, setExpanded] = useState(false);

  const allScreens = [
    { id: "splash" as const, label: "🚀 启动" },
    { id: "welcome" as const, label: "👋 欢迎" },
    { id: "login" as const, label: "🔐 登录" },
    { id: "bind" as const, label: "🔗 绑定" },
    { id: "onboarding" as const, label: "⚙️ 引导" },
    { id: "home" as const, label: "🏠 首页" },
    { id: "signal-send" as const, label: "💌 信号" },
    { id: "chat" as const, label: "💬 聊天" },
    { id: "timeline" as const, label: "📅 历程" },
    { id: "collection" as const, label: "⭐ 收藏" },
    { id: "anniversary" as const, label: "🎂 纪念日" },
    { id: "album" as const, label: "📸 相册" },
    { id: "wishes" as const, label: "🌟 愿望" },
    { id: "diary-create" as const, label: "📝 日记" },
    { id: "profile" as const, label: "👤 我的" },
    { id: "settings" as const, label: "⚙️ 设置" },
    { id: "end-relationship" as const, label: "💔 结束" },
    { id: "loading" as const, label: "⏳ 加载" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Expanded grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md border-t border-[#f0e6e0] px-3 pt-3 pb-1"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {allScreens.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { navigate(s.id); setExpanded(false); }}
                  className={`px-2 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all text-center ${
                    currentScreen === s.id
                      ? "bg-[#FF6B8A] text-white"
                      : "bg-[#F7F3F0] text-[#7f8c8d]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle bar */}
      <div className="bg-white/95 backdrop-blur-md border-t border-[#f0e6e0] px-3 py-2 flex items-center justify-between">
        <div className="flex overflow-x-auto gap-1 flex-1 scrollbar-hide mr-2">
          {allScreens.slice(0, 6).map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(s.id)}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                currentScreen === s.id
                  ? "bg-[#FF6B8A] text-white"
                  : "bg-[#F7F3F0] text-[#7f8c8d]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 w-8 h-8 bg-[#FF6B8A] rounded-full flex items-center justify-center"
        >
          {expanded ? <ChevronDown size={16} color="white" /> : <ChevronUp size={16} color="white" />}
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFFBF5] to-[#E8FFF8] flex items-center justify-center py-8 px-4 gap-8 pb-16 lg:pb-8">
      {/* Title area - hidden on small screens */}
      <div className="hidden lg:flex flex-col items-end gap-4 max-w-xs">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-right"
        >
          {/* Logo heart */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF6B8A] to-[#FF9A9E] rounded-2xl shadow-lg shadow-[#FF6B8A]/30 mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart size={32} color="white" fill="white" />
          </motion.div>

          <h1
            className="text-5xl font-black text-[#FF6B8A] mb-1"
            style={{ fontFamily: "'Nunito', 'Noto Sans SC', sans-serif" }}
          >
            恋爱脑
          </h1>
          <p className="text-lg text-[#7f8c8d] mb-1 font-semibold">LoveBrain</p>
          <p className="text-sm text-[#b0b0b0]">让爱更有温度</p>

          <div className="mt-6 flex items-center gap-3 justify-end">
            {["#FF6B8A", "#4ECDC4", "#FFC800", "#FF6B35"].map((c, i) => (
              <motion.div
                key={c}
                className="w-3 h-3 rounded-full"
                style={{ background: c }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs text-[#b0b0b0] leading-relaxed text-right">
              APP 演示 Demo
            </p>
            <p className="text-xs text-[#b0b0b0] leading-relaxed text-right">
              参考多邻国设计理念
            </p>
            <p className="text-xs text-[#b0b0b0] leading-relaxed text-right">
              覆盖所有核心业务流程
            </p>
          </div>
        </motion.div>
      </div>

      {/* Phone simulator */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        <PhoneFrame>
          <FlowNavigator />
          <Toast />
        </PhoneFrame>
      </motion.div>

      {/* Flow navigation panel - hidden on small screens */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FlowPanel />
        </motion.div>
      </div>

      {/* Mobile flow bar */}
      <MobileFlowBar />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
