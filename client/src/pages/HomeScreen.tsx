/*
 * HomeScreen - 首页（全面重构版）
 * - 顶部：成就卡片（桃心/火苗点击展示）、回执偏好快速切换
 * - 伴侣卡：中国人头像、状态设置
 * - 关心信号区：戳一下大按钮 + 快捷信号 + 自定义信号
 * - 历史信号：近5条 + 详情弹窗
 * - 更多功能扩展面板（多邻国风格）
 * - 宇宙来信入口
 * - 纪念日提醒
 */
import { useApp, Gender, SignalEvent } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, CARE_SIGNALS, MOCK_ANNIVERSARIES, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import TabBar from "@/components/TabBar";
import {
  Heart, Flame, ChevronRight, Sparkles, Send, MessageCircle,
  Star, Clock, Image, BookOpen, Gift, Volume2, EyeOff, MoonStar,
  X, Mic, MapPin, Smile, Check, CheckCheck, Zap, MoreHorizontal
} from "lucide-react";
import { useState, useRef } from "react";

/* ─── 回执偏好模式 ─── */
const NOTIFY_MODES = [
  { id: "normal",  icon: Volume2,  emoji: "🔔", label: "常规", color: "#FF6B8A" },
  { id: "private", icon: EyeOff,   emoji: "🔒", label: "隐私", color: "#4A90D9" },
  { id: "dnd",     icon: MoonStar, emoji: "🌙", label: "勿扰", color: "#B8A9C9" },
] as const;

/* ─── 更多功能模块 ─── */
const MORE_MODULES = [
  { id: "chat",        icon: MessageCircle, label: "聊天",   screen: "chat"        as const, color: "#4A90D9", bg: "#EBF3FC" },
  { id: "collection",  icon: Star,          label: "收藏",   screen: "collection"  as const, color: "#FFC800", bg: "#FFFBEA" },
  { id: "anniversary", icon: Heart,         label: "纪念日", screen: "anniversary" as const, color: "#FF6B8A", bg: "#FFF0F3" },
  { id: "album",       icon: Image,         label: "相册",   screen: "album"       as const, color: "#4ECDC4", bg: "#E8FFFC" },
  { id: "wishes",      icon: Gift,          label: "愿望",   screen: "wishes"      as const, color: "#FF6B35", bg: "#FFF4EE" },
  { id: "diary",       icon: BookOpen,      label: "日记",   screen: "diary-create" as const, color: "#58CC02", bg: "#F0FFF0" },
  { id: "timeline",    icon: Clock,         label: "历程",   screen: "timeline"    as const, color: "#B8A9C9", bg: "#F5F0FF" },
  { id: "cosmos",      icon: Sparkles,      label: "星座",   screen: "cosmos-letter" as const, color: "#FFC800", bg: "#FFFBEA" },
];

/* ─── 状态选项 ─── */
const STATUS_OPTIONS = [
  { emoji: "😊", label: "开心" },
  { emoji: "😴", label: "困了" },
  { emoji: "😤", label: "忙碌" },
  { emoji: "🥺", label: "想你" },
  { emoji: "😎", label: "出门" },
  { emoji: "🏠", label: "到家" },
  { emoji: "😋", label: "吃饭" },
  { emoji: "💪", label: "加油" },
];

/* ─── 成就卡片弹窗 ─── */
function AchievementCard({
  type, value, onClose, t
}: {
  type: "days" | "streak";
  value: number;
  onClose: () => void;
  t: typeof THEME.female;
}) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute top-16 left-4 right-4 z-50 rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: type === "days" ? `linear-gradient(135deg, ${t.primary}, ${t.accent})` : "linear-gradient(135deg, #FF6B35, #FFC800)" }}
    >
      <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
        <X size={14} color="white" />
      </button>
      <div className="p-5 text-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-5xl mb-3"
        >
          {type === "days" ? "💕" : "🔥"}
        </motion.div>
        <p className="text-white/80 text-sm font-semibold mb-1">
          {type === "days" ? "在一起" : "连续互动"}
        </p>
        <p className="text-white font-black text-4xl mb-1">{value}</p>
        <p className="text-white/80 text-sm">天</p>
        {type === "days" && (
          <div className="mt-3 bg-white/20 rounded-2xl px-4 py-2">
            <p className="text-white text-xs">🎉 每一天都是甜蜜的记录</p>
          </div>
        )}
        {type === "streak" && (
          <div className="mt-3 bg-white/20 rounded-2xl px-4 py-2">
            <p className="text-white text-xs">⚡ 你们的心意相通指数 MAX！</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── 信号已读状态图标 ─── */
function SignalStatus({ signal, myGender, t }: { signal?: SignalEvent; myGender: Gender; t: typeof THEME.female }) {
  if (!signal) return null;
  const partnerColor = myGender === "female" ? THEME.male.primary : THEME.female.primary;
  const isRead = signal.status === "read";
  const isDelivered = signal.status === "delivered" || isRead;

  return (
    <div className="flex items-center gap-0.5">
      {/* 发送方桃心 */}
      <Heart size={10} fill={t.primary} color={t.primary} />
      {/* 闪电连线 */}
      <Zap size={10} color={isDelivered ? "#FFC800" : "#e0e0e0"} fill={isDelivered ? "#FFC800" : "none"} />
      {/* 接收方桃心 */}
      <Heart size={10} fill={isRead ? partnerColor : "none"} color={isRead ? partnerColor : "#e0e0e0"} />
    </div>
  );
}

/* ─── 信号详情弹窗 ─── */
function SignalDetailModal({
  signal, myGender, onClose, t
}: {
  signal: SignalEvent;
  myGender: Gender;
  onClose: () => void;
  t: typeof THEME.female;
}) {
  const [replyText, setReplyText] = useState("");
  const { toast } = useApp();
  const isMine = signal.from === myGender;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/40 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full bg-white rounded-t-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{signal.emoji}</span>
          <div>
            <p className="font-black text-[#2C3E50] text-lg">{signal.text}</p>
            <p className="text-xs text-[#7f8c8d]">
              {isMine ? "我发送的" : "TA发给你的"} · {new Date(signal.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="ml-auto">
            <SignalStatus signal={signal} myGender={myGender} t={t} />
          </div>
        </div>
        {!isMine && (
          <div className="mt-2">
            <p className="text-xs text-[#7f8c8d] mb-2 font-semibold">回复（仅限一次）</p>
            <div className="flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="说点什么..."
                className="flex-1 bg-[#f5f5f5] rounded-2xl px-4 py-2.5 text-sm outline-none text-[#2C3E50]"
              />
              <button
                onClick={() => { if (replyText) { toast("回复已发送 💌", myGender); onClose(); } }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: t.primary }}
              >
                <Send size={16} color="white" />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              {["❤️", "😊", "🥺", "👍", "😘"].map((e) => (
                <button key={e} onClick={() => setReplyText(e)} className="text-xl p-1">{e}</button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function HomeScreen({ gender }: { gender: Gender }) {
  const { navigate, toast, signals, sendSignal, addChatMessage } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const me = gender === "female" ? USERS.female : USERS.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const targetGender: Gender = gender === "female" ? "male" : "female";

  /* ── 状态 ── */
  const [achievementType, setAchievementType] = useState<"days" | "streak" | null>(null);
  const [notifyMode, setNotifyMode] = useState<"normal" | "private" | "dnd">("normal");
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<SignalEvent | null>(null);
  const [customText, setCustomText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showTabEdit, setShowTabEdit] = useState(false);

  /* ── 近5条对方发来的信号 ── */
  const recentSignals = signals
    .filter((s) => s.from === targetGender)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  /* ── 戳一下处理 ── */
  const handlePoke = () => {
    const newCount = pokeCount + 1;
    setPokeCount(newCount);
    sendSignal({ from: gender, to: targetGender, type: "poke", emoji: "👆", text: newCount >= 3 ? "疯狂戳你！！！" : "戳一下" }, { skipSenderNavigation: true });
    if (pokeTimer.current) clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPokeCount(0), 3000);
  };

  /* ── 快捷信号发送 ── */
  const handleQuickSignal = (signal: typeof CARE_SIGNALS[0]) => {
    sendSignal({ from: gender, to: targetGender, type: "care", emoji: signal.emoji, text: signal.text }, { skipSenderNavigation: true });
    toast(`${signal.emoji} 已发送「${signal.text}」`, gender);
  };

  /* ── 自定义信号发送 ── */
  const handleCustomSend = () => {
    if (!customText.trim()) return;
    sendSignal({ from: gender, to: targetGender, type: "custom", emoji: "💌", text: customText }, { skipSenderNavigation: true });
    toast("💌 自定义信号已发送", gender);
    setCustomText("");
    setShowCustomInput(false);
  };

  /* ── 回执偏好切换 ── */
  const handleNotifySwitch = (mode: typeof notifyMode) => {
    setNotifyMode(mode);
    const labels = { normal: "🔔 常规模式已开启", private: "🔒 隐私模式已开启", dnd: "🌙 勿扰模式已开启" };
    toast(labels[mode], gender);
  };

  const currentNotify = NOTIFY_MODES.find((m) => m.id === notifyMode)!;

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: t.bg }}>
      {/* Header */}
      <div className="pt-12 pb-4 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAchievementType("days")}
            className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white"
          >
            <Heart size={16} fill={t.primary} color={t.primary} />
            <span className="text-sm font-black text-[#2C3E50]">{COUPLE_INFO.daysInLove}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAchievementType("streak")}
            className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white"
          >
            <Flame size={16} fill="#FF6B35" color="#FF6B35" />
            <span className="text-sm font-black text-[#2C3E50]">12</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {/* Notify Mode Quick Switch */}
          <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm border border-white">
            {NOTIFY_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleNotifySwitch(m.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: notifyMode === m.id ? m.color : "transparent" }}
              >
                <m.icon size={14} color={notifyMode === m.id ? "white" : "#b0b0b0"} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowMorePanel(!showMorePanel)}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white"
          >
            <MoreHorizontal size={20} color="#2C3E50" />
          </button>
        </div>
      </div>

      {/* Achievement Modal */}
      <AnimatePresence>
        {achievementType && (
          <AchievementCard
            type={achievementType}
            value={achievementType === "days" ? COUPLE_INFO.daysInLove : 12}
            onClose={() => setAchievementType(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* More Panel (Duolingo Style) */}
      <AnimatePresence>
        {showMorePanel && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-24 left-4 right-4 z-40 bg-white rounded-3xl shadow-xl p-4 border-2"
            style={{ borderColor: t.cardBorder }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-[#2C3E50] text-sm">更多功能</h4>
              <button onClick={() => setShowMorePanel(false)}><X size={16} color="#b0b0b0" /></button>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
              {MORE_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => { navigate(mod.screen, gender); setShowMorePanel(false); }}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all"
                    style={{ background: mod.bg, borderColor: `${mod.color}40` }}
                  >
                    <mod.icon size={24} color={mod.color} />
                  </div>
                  <span className="text-[10px] font-bold text-[#7f8c8d]">{mod.label}</span>
                </button>
              ))}
              {/* Edit TabBar Button */}
              <button
                onClick={() => { setShowTabEdit(true); setShowMorePanel(false); }}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#d0d0d0] flex items-center justify-center">
                  <MapPin size={20} color="#b0b0b0" />
                </div>
                <span className="text-[10px] font-bold text-[#b0b0b0]">📌 编辑</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        {/* Partner Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="love-card mb-6 mt-2"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-16 h-16 rounded-full object-cover border-3"
                style={{ borderColor: gender === "female" ? THEME.male.primary : THEME.female.primary }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-[#2C3E50] text-lg">{partner.name}</h3>
                <span className="text-[10px] px-2 py-0.5 bg-[#f0f0f0] rounded-full text-[#7f8c8d] font-bold">
                  {selectedStatus || "在线"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#7f8c8d]">
                <SignalStatus signal={signals[0]} myGender={gender} t={t} />
                <span className="ml-1">心意联通中...</span>
              </div>
            </div>
            <button
              onClick={() => setShowStatusPicker(true)}
              className="w-10 h-10 rounded-2xl bg-[#f5f5f5] flex items-center justify-center active:scale-95 transition-all"
            >
              <Smile size={20} color="#7f8c8d" />
            </button>
          </div>
        </motion.div>

        {/* Status Picker */}
        <AnimatePresence>
          {showStatusPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="love-card mb-4 grid grid-cols-4 gap-2 p-3"
            >
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => { setSelectedStatus(`${opt.emoji} ${opt.label}`); setShowStatusPicker(false); }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[#f5f5f5] transition-all"
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-[10px] font-bold text-[#7f8c8d]">{opt.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Care Signal Area */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-black text-[#2C3E50]">关心信号</h4>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#7f8c8d]">
              {currentNotify.emoji} {currentNotify.label}模式
            </div>
          </div>

          {/* Poke Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePoke}
            className="w-full h-24 rounded-3xl mb-4 flex flex-col items-center justify-center relative overflow-hidden shadow-lg group"
            style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }}
          >
            <motion.div
              animate={pokeCount > 0 ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
              className="text-3xl mb-1"
            >
              👆
            </motion.div>
            <span className="text-white font-black text-lg">戳一下 TA</span>
            {pokeCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-2 right-4 bg-white/30 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-black"
              >
                x{pokeCount}
              </motion.div>
            )}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* Quick Signals Grid */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {CARE_SIGNALS.map((s) => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuickSignal(s)}
                className="love-card p-3 flex flex-col items-center gap-1 active:shadow-inner transition-all"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-[10px] font-bold text-[#7f8c8d] whitespace-nowrap">{s.text}</span>
              </motion.button>
            ))}
          </div>

          {/* Custom Signal Input */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-[#d0d0d0] text-[#b0b0b0] text-sm font-bold flex items-center justify-center gap-2"
            >
              <Plus size={16} /> 自定义关心信号
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="love-card p-3"
            >
              <div className="flex gap-2 mb-2">
                <input
                  autoFocus
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="输入想对 TA 说的话..."
                  className="flex-1 bg-[#f5f5f5] rounded-xl px-4 py-2 text-sm outline-none text-[#2C3E50]"
                />
                <button
                  onClick={handleCustomSend}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: t.primary }}
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="p-1"><Mic size={18} color="#b0b0b0" /></button>
                  <button className="p-1"><Image size={18} color="#b0b0b0" /></button>
                  <button className="p-1"><MapPin size={18} color="#b0b0b0" /></button>
                </div>
                <button onClick={() => setShowCustomInput(false)} className="text-xs text-[#7f8c8d] font-bold">取消</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Recent Signals (History) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-black text-[#2C3E50]">信号记录</h4>
            <button onClick={() => navigate("timeline", gender)} className="text-xs font-bold text-[#7f8c8d] flex items-center">
              全部 <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {recentSignals.length > 0 ? (
              recentSignals.map((s) => (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.98 }}
                  onContextMenu={(e) => { e.preventDefault(); toast("已收藏该信号 ⭐", gender); }}
                  onClick={() => setSelectedSignal(s)}
                  className="w-full love-card p-3 flex items-center gap-3 text-left"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#2C3E50] text-sm truncate">{s.text}</p>
                    <p className="text-[10px] text-[#b0b0b0]">
                      {new Date(s.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <SignalStatus signal={s} myGender={gender} t={t} />
                </motion.button>
              ))
            ) : (
              <div className="love-card p-8 text-center">
                <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send size={20} color="#d0d0d0" />
                </div>
                <p className="text-xs text-[#b0b0b0]">还没有信号记录，发送一个关心信号试试</p>
              </div>
            )}
          </div>
        </div>

        {/* Anniversary Reminder */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("anniversary", gender)}
          className="love-card p-4 mb-6 flex items-center gap-4 border-l-4"
          style={{ borderLeftColor: "#FFC800" }}
        >
          <div className="w-12 h-12 bg-[#FFFBEA] rounded-2xl flex items-center justify-center flex-shrink-0">
            <Calendar size={24} color="#FFC800" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#FFC800] uppercase tracking-wider">即将到来</p>
            <p className="font-black text-[#2C3E50]">{MOCK_ANNIVERSARIES[0].title}</p>
            <p className="text-xs text-[#7f8c8d]">还有 {MOCK_ANNIVERSARIES[0].daysLeft} 天</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-[#2C3E50]">03-25</p>
          </div>
        </motion.div>

        {/* Cosmos Letter Entrance */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("cosmos-letter", gender)}
          className="w-full h-32 rounded-3xl mb-6 relative overflow-hidden shadow-lg group"
        >
          <img
            src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=500&h=300&fit=crop"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="cosmos"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} color="#FFC800" />
              <span className="text-white font-black text-lg">宇宙来信</span>
            </div>
            <p className="text-white/80 text-xs">写给未来的 TA，在星辰中永恒...</p>
          </div>
        </motion.button>
      </div>

      {/* Signal Detail Modal */}
      <AnimatePresence>
        {selectedSignal && (
          <SignalDetailModal
            signal={selectedSignal}
            myGender={gender}
            onClose={() => setSelectedSignal(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* TabBar */}
      <TabBar
        gender={gender}
        externalEditOpen={showTabEdit}
        onExternalEditClose={() => setShowTabEdit(false)}
      />
    </div>
  );
}

/* ─── 辅助组件 ─── */
function Plus({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function Calendar({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
