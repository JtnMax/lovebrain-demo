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

/* ─── 用户头像 ─── */
const USER_AVATARS = {
  female: "/avatars/female_avatar.png",
  male:   "/avatars/male_avatar.png",
};

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

      {/* ── 成就卡片弹窗 ── */}
      <AnimatePresence>
        {achievementType && (
          <AchievementCard
            type={achievementType}
            value={achievementType === "days" ? COUPLE_INFO.daysInLove : 7}
            onClose={() => setAchievementType(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* ── 信号详情弹窗 ── */}
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

      {/* ── 顶部状态栏 ── */}
      <div className="pt-10 px-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* 桃心 + 天数 */}
          <button
            onClick={() => setAchievementType(achievementType === "days" ? null : "days")}
            className="flex items-center gap-1.5 active:scale-90 transition-transform"
          >
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Heart size={18} fill={t.primary} color={t.primary} />
            </motion.div>
            <span className="font-black text-sm" style={{ color: t.primary }}>{COUPLE_INFO.daysInLove}</span>
          </button>

          {/* 火苗 + 连续天数 */}
          <button
            onClick={() => setAchievementType(achievementType === "streak" ? null : "streak")}
            className="flex items-center gap-1.5 active:scale-90 transition-transform"
          >
            <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Flame size={18} color="#FF6B35" fill="#FF6B35" />
            </motion.div>
            <span className="font-black text-sm text-[#FF6B35]">7</span>
          </button>

          {/* 更多功能入口（多邻国风格） */}
          <button
            onClick={() => setShowMorePanel(!showMorePanel)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all"
            style={{ background: showMorePanel ? t.primary : `${t.primary}15` }}
          >
            <MoreHorizontal size={16} color={showMorePanel ? "white" : t.primary} />
            <span className="text-xs font-bold" style={{ color: showMorePanel ? "white" : t.primary }}>更多</span>
          </button>

          {/* 回执偏好快速切换 */}
          <div className="flex items-center gap-0.5 bg-white/80 rounded-full px-2 py-1.5 border" style={{ borderColor: t.cardBorder }}>
            {NOTIFY_MODES.map((mode) => {
              const ModeIcon = mode.icon;
              const isActive = notifyMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => handleNotifySwitch(mode.id as typeof notifyMode)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ background: isActive ? mode.color : "transparent" }}
                  whileTap={{ scale: 0.85 }}
                >
                  <ModeIcon size={13} color={isActive ? "white" : "#b0b0b0"} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 更多功能展开面板 */}
        <AnimatePresence>
          {showMorePanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-2"
            >
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {MORE_MODULES.map((mod, i) => {
                  const ModIcon = mod.icon;
                  return (
                    <motion.button
                      key={mod.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 400 }}
                      onClick={() => { navigate(mod.screen, gender); setShowMorePanel(false); }}
                      className="flex-shrink-0 flex flex-col items-center gap-1 w-16"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ background: mod.bg }}
                      >
                        <ModIcon size={22} color={mod.color} />
                      </div>
                      <span className="text-[10px] font-semibold text-[#7f8c8d]">{mod.label}</span>
                    </motion.button>
                  );
                })}
                {/* 编辑导航栏按钮（虚线框+工字钉） */}
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: MORE_MODULES.length * 0.04, type: "spring" }}
                  onClick={() => { setShowMorePanel(false); setShowTabEdit(true); }}
                  className="flex-shrink-0 flex flex-col items-center gap-1 w-16"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-dashed border-[#d0d0d0]">
                    <span className="text-lg">📌</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#b0b0b0]">编辑</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 space-y-3">

        {/* 伴侣卡 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="love-card flex items-center gap-4"
        >
          <div className="relative">
            <img
              src={USER_AVATARS[gender]}
              alt={me.name}
              className="w-14 h-14 rounded-full object-cover border-3"
              style={{ borderColor: t.primary }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#58CC02] rounded-full border-2 border-white flex items-center justify-center">
              <motion.div className="w-2 h-2 rounded-full bg-white" animate={{ scale: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#2C3E50]">{partner.name}</p>
            <p className="text-xs text-[#7f8c8d]">
              在一起第 <span className="font-black" style={{ color: t.primary }}>{COUPLE_INFO.daysInLove}</span> 天
            </p>
          </div>
          {/* 我的状态 */}
          <button
            onClick={() => setShowStatusPicker(!showStatusPicker)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-semibold"
            style={{ borderColor: t.cardBorder, background: t.primaryLight, color: t.primary }}
          >
            {selectedStatus ? <span>{selectedStatus}</span> : <span>设置状态</span>}
          </button>
        </motion.div>

        {/* 状态选择器 */}
        <AnimatePresence>
          {showStatusPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="love-card">
                <p className="text-xs font-bold text-[#7f8c8d] mb-2">选择你的状态</p>
                <div className="grid grid-cols-4 gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        setSelectedStatus(`${s.emoji} ${s.label}`);
                        setShowStatusPicker(false);
                        toast(`状态已更新：${s.emoji} ${s.label}`, gender);
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[#f5f5f5] transition-colors"
                    >
                      <span className="text-xl">{s.emoji}</span>
                      <span className="text-[10px] text-[#7f8c8d]">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ 关心信号区 ══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="love-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#2C3E50] text-base">关心一下</h3>
            <button onClick={() => navigate("signal-send", gender)} className="text-xs font-semibold" style={{ color: t.primary }}>
              历史记录 →
            </button>
          </div>

          {/* 1. 戳一下大按钮 */}
          <motion.button
            onClick={handlePoke}
            whileTap={{ scale: 0.92 }}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`,
              boxShadow: `0 6px 0 ${t.primaryDark}, 0 8px 15px ${t.primary}40`,
            }}
          >
            {pokeCount >= 3 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.5 }}
                style={{ background: "white" }}
              />
            )}
            <motion.span
              className="text-3xl"
              animate={pokeCount >= 3 ? { rotate: [0, -15, 15, -15, 0], scale: [1, 1.4, 1] } : { scale: [1, 1.05, 1] }}
              transition={{ duration: pokeCount >= 3 ? 0.5 : 2, repeat: Infinity }}
            >
              {pokeCount >= 3 ? "💥" : "👆"}
            </motion.span>
            <div className="text-left">
              <p className="text-white font-black text-base">
                {pokeCount >= 3 ? "疯狂戳！！！" : "戳一下 TA"}
              </p>
              <p className="text-white/80 text-xs">点一次 TA 就收到一次信号</p>
            </div>
            {pokeCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-3 bg-white/30 rounded-full w-7 h-7 flex items-center justify-center"
              >
                <span className="text-white text-xs font-black">×{pokeCount}</span>
              </motion.div>
            )}
          </motion.button>

          {/* 2. 快捷信号 */}
          <div>
            <p className="text-xs font-bold text-[#7f8c8d] mb-2">快捷信号</p>
            <div className="grid grid-cols-4 gap-2">
              {CARE_SIGNALS.slice(0, 8).map((signal, i) => (
                <motion.button
                  key={signal.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05 * i, type: "spring" }}
                  onClick={() => handleQuickSignal(signal)}
                  className="love-card flex flex-col items-center py-2.5 gap-1 active:scale-95 transition-transform p-2"
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xl">{signal.emoji}</span>
                  <span className="text-[9px] font-semibold text-[#2C3E50] text-center leading-tight">{signal.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 3. 自定义信号 */}
          <div>
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center gap-2 text-xs font-bold mb-2"
              style={{ color: t.primary }}
            >
              <span>✏️</span>
              <span>自定义信号</span>
              <ChevronRight size={12} color={t.primary} className={`transition-transform ${showCustomInput ? "rotate-90" : ""}`} />
            </button>
            <AnimatePresence>
              {showCustomInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mb-2">
                    <input
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="说点什么..."
                      className="flex-1 bg-[#f5f5f5] rounded-2xl px-4 py-2.5 text-sm outline-none text-[#2C3E50]"
                      onKeyDown={(e) => e.key === "Enter" && handleCustomSend()}
                    />
                    <button
                      onClick={handleCustomSend}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: customText ? t.primary : "#e0e0e0" }}
                    >
                      <Send size={16} color="white" />
                    </button>
                  </div>
                  {/* 媒体附件按钮 */}
                  <div className="flex gap-2">
                    {[
                      { icon: Image, label: "图片", emoji: "🖼️" },
                      { icon: Mic,   label: "语音", emoji: "🎤" },
                      { icon: MapPin,label: "位置", emoji: "📍" },
                      { icon: Smile, label: "表情", emoji: "😊" },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => toast(`${btn.emoji} ${btn.label}功能开发中`, gender)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#f5f5f5] text-[10px] text-[#7f8c8d] font-semibold"
                      >
                        <span>{btn.emoji}</span>
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── 历史信号（近5条） ── */}
        {recentSignals.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#2C3E50] text-sm">TA 发来的信号</h3>
              <button onClick={() => navigate("signal-send", gender)} className="text-xs font-semibold" style={{ color: t.primary }}>
                查看全部
              </button>
            </div>
            <div className="space-y-2">
              {recentSignals.map((sig) => (
                <motion.button
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  onContextMenu={(e) => { e.preventDefault(); toast("已收藏该信号 ⭐", gender); }}
                  className="w-full love-card flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-2xl">{sig.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#2C3E50] text-sm">{sig.text}</p>
                    <p className="text-[10px] text-[#b0b0b0]">
                      {new Date(sig.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {sig.status === "read" ? (
                      <CheckCheck size={14} color="#58CC02" />
                    ) : sig.status === "delivered" ? (
                      <Check size={14} color="#b0b0b0" />
                    ) : null}
                    <ChevronRight size={14} color="#b0b0b0" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 宇宙来信入口 ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <button
            onClick={() => navigate("cosmos-letter", gender)}
            className="w-full love-card flex items-center gap-3 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-none text-white overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
              ))}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center relative z-10">
              <Sparkles size={22} color="#FFC800" />
            </div>
            <div className="flex-1 relative z-10">
              <p className="font-bold text-sm">宇宙来信</p>
              <p className="text-xs text-white/70">今日{me.zodiac}运势 · 恋爱指数 {gender === "female" ? "92" : "85"}%</p>
            </div>
            <ChevronRight size={18} color="white" className="relative z-10 opacity-60" />
          </button>
        </motion.div>

        {/* ── 即将到来的纪念日 ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#2C3E50] text-sm">即将到来</h3>
            <button onClick={() => navigate("anniversary", gender)} className="text-xs font-semibold" style={{ color: t.primary }}>
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_ANNIVERSARIES.filter((a) => !a.isPast).slice(0, 2).map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="love-card flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("anniversary", gender)}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: t.primaryLight }}>
                  {ann.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#2C3E50] text-sm">{ann.title}</p>
                  <p className="text-xs text-[#7f8c8d]">{ann.date}</p>
                </div>
                {ann.daysLeft > 0 ? (
                  <div className="bg-[#FFC800] px-3 py-1 rounded-full">
                    <span className="text-xs font-black text-white">{ann.daysLeft}天</span>
                  </div>
                ) : (
                  <motion.div className="bg-[#58CC02] px-3 py-1 rounded-full" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <span className="text-xs font-black text-white">今天!</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 吉祥物鼓励 ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="love-card flex items-center gap-4"
          style={{ background: t.primaryLight, borderColor: `${t.primary}30` }}
        >
          <motion.img
            src={MASCOT.happy}
            alt="吉祥物"
            className="w-14 h-14"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: t.primary }}>今日小贴士</p>
            <p className="text-xs text-[#2C3E50] mt-1 leading-relaxed">
              连续互动 7 天了！记得给{partner.name}发一个关心信号哦~
            </p>
          </div>
        </motion.div>
      </div>

      <TabBar gender={gender} externalEditOpen={showTabEdit} onExternalEditClose={() => setShowTabEdit(false)} />
    </div>
  );
}
