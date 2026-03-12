/*
 * OnboardingScreen - 首次引导页
 * 步骤：纪念日 → 自己的生日 → 兴趣爱好 → 通知偏好（三模式）
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Calendar, Sparkles, Bell, ChevronRight, Check, Volume2, EyeOff, MoonStar } from "lucide-react";

/* ─── 兴趣爱好数据 ─── */
const HOBBIES = [
  { id: "music",    emoji: "🎵", label: "音乐" },
  { id: "movie",    emoji: "🎬", label: "电影" },
  { id: "game",     emoji: "🎮", label: "游戏" },
  { id: "travel",   emoji: "✈️", label: "旅行" },
  { id: "food",     emoji: "🍜", label: "美食" },
  { id: "fitness",  emoji: "🏃", label: "健身" },
  { id: "reading",  emoji: "📚", label: "阅读" },
  { id: "photo",    emoji: "📸", label: "摄影" },
  { id: "pet",      emoji: "🐾", label: "宠物" },
  { id: "art",      emoji: "🎨", label: "绘画" },
  { id: "cook",     emoji: "👨‍🍳", label: "烹饪" },
  { id: "dance",    emoji: "💃", label: "舞蹈" },
  { id: "outdoor",  emoji: "⛺", label: "户外" },
  { id: "anime",    emoji: "🌸", label: "动漫" },
  { id: "shopping", emoji: "🛍️", label: "购物" },
  { id: "coffee",   emoji: "☕", label: "咖啡" },
];

/* ─── 通知偏好数据 ─── */
const NOTIFY_MODES = [
  {
    id: "normal",
    icon: Volume2,
    emoji: "🔔",
    label: "常规模式",
    desc: "展示互动内容，如「小心心提醒你记得带伞」",
    color: "#FF6B8A",
    bgColor: "#FFF0F3",
    animEmoji: ["💌", "📍", "☂️"],
    hint: "内容完整展示，默认带震动",
  },
  {
    id: "private",
    icon: EyeOff,
    emoji: "🔒",
    label: "隐私模式",
    desc: "仅展示通知类型，如「收到一条关心信号」",
    color: "#4A90D9",
    bgColor: "#EBF3FC",
    animEmoji: ["📩", "💬", "🔔"],
    hint: "内容不预览，默认带震动",
  },
  {
    id: "dnd",
    icon: MoonStar,
    emoji: "🌙",
    label: "勿扰模式",
    desc: "拒收系统提示外的所有通知，错过的动态会标记",
    color: "#B8A9C9",
    bgColor: "#F5F0FF",
    animEmoji: ["😴", "🌙", "⭐"],
    hint: "不打扰，不震动，错过内容有标记",
  },
];

/* ─── 步骤配置 ─── */
const STEPS = [
  { key: "anniversary", title: "你们的纪念日", subtitle: "记录你们在一起的日子", icon: Heart,    color: "#FF6B8A", mascot: "love"     as const, emoji: "💕" },
  { key: "birthday",    title: "你的生日",     subtitle: "让TA提前为你准备惊喜", icon: Calendar, color: "#FFC800", mascot: "celebrate" as const, emoji: "🎂" },
  { key: "hobbies",     title: "你的兴趣爱好", subtitle: "帮助AI更懂你们，最多选8个", icon: Sparkles, color: "#4ECDC4", mascot: "happy"    as const, emoji: "✨" },
  { key: "notify",      title: "通知偏好",     subtitle: "选择你希望收到通知的方式", icon: Bell,    color: "#4A90D9", mascot: "thinking" as const, emoji: "💌" },
];

/* ─── 震动开关小组件 ─── */
function VibrateToggle({ value, onChange, color }: { value: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
      style={{
        borderColor: value ? color : "#e0e0e0",
        background: value ? `${color}15` : "white",
        color: value ? color : "#b0b0b0",
      }}
    >
      <span>{value ? "📳" : "🔕"}</span>
      <span>{value ? "震动已开启" : "震动已关闭"}</span>
    </button>
  );
}

/* ─── 通知效果小动画 ─── */
function NotifyPreview({ mode, active }: { mode: typeof NOTIFY_MODES[0]; active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="mt-3 rounded-xl p-3 flex items-center gap-2"
          style={{ background: mode.bgColor }}
        >
          <div className="flex gap-1">
            {mode.animEmoji.map((e, i) => (
              <motion.span
                key={i}
                className="text-base"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </div>
          <p className="text-xs flex-1" style={{ color: mode.color }}>{mode.hint}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function OnboardingScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, toast } = useApp();
  const [step, setStep] = useState(0);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [notifyMode, setNotifyMode] = useState("normal");
  const [vibrateMap, setVibrateMap] = useState<Record<string, boolean>>({
    normal: true, private: true, dnd: false,
  });

  const toggleHobby = (id: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(id)
        ? prev.filter((h) => h !== id)
        : prev.length < 8 ? [...prev, id] : prev
    );
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      toast("设置完成，开始你们的甜蜜之旅！", gender);
      setTimeout(() => navigate("home", gender), 800);
    }
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Progress bar */}
      <div className="px-6 pt-14 pb-2">
        <div className="h-3 bg-[#e8e8e8] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${current.color}, ${current.color}80)` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#b0b0b0]">步骤 {step + 1} / {STEPS.length}</span>
          <button
            onClick={() => { toast("已跳过引导", gender); navigate("home", gender); }}
            className="text-[10px] font-semibold"
            style={{ color: t.primary }}
          >
            跳过
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="flex-1 flex flex-col items-center px-6 pt-4 overflow-y-auto pb-4"
        >
          {/* Mascot */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mb-3"
          >
            <img src={MASCOT[current.mascot]} alt="" className="w-24 h-24 drop-shadow-lg" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-5"
          >
            <span className="text-3xl mb-1 block">{current.emoji}</span>
            <h2 className="text-2xl font-black text-[#2C3E50] mb-1">{current.title}</h2>
            <p className="text-sm text-[#7f8c8d]">{current.subtitle}</p>
          </motion.div>

          {/* ── Step 0: 纪念日 ── */}
          {step === 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full love-card flex items-center gap-3"
            >
              <span className="text-2xl">📅</span>
              <input
                type="date"
                defaultValue="2024-02-14"
                className="flex-1 bg-[#F7F3F0] rounded-xl px-4 py-3.5 text-[#2C3E50] outline-none font-semibold"
              />
            </motion.div>
          )}

          {/* ── Step 1: 自己的生日 ── */}
          {step === 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full space-y-3"
            >
              <div className="love-card flex items-center gap-3">
                <span className="text-2xl">🎂</span>
                <input
                  type="date"
                  defaultValue="2000-06-15"
                  className="flex-1 bg-[#F7F3F0] rounded-xl px-4 py-3.5 text-[#2C3E50] outline-none font-semibold"
                />
              </div>
              <div className="love-card flex items-start gap-3 bg-[#FFFBF0]" style={{ borderColor: "#FFC80030" }}>
                <span className="text-xl mt-0.5">💡</span>
                <p className="text-xs text-[#7f8c8d] leading-relaxed">
                  填写你自己的生日，TA 会在你生日前收到提醒，提前为你准备惊喜。
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: 兴趣爱好 ── */}
          {step === 2 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full"
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {HOBBIES.map((hobby, i) => {
                  const selected = selectedHobbies.includes(hobby.id);
                  return (
                    <motion.button
                      key={hobby.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 * i, type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => toggleHobby(hobby.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 transition-all font-semibold text-sm ${
                        selected ? "text-white shadow-md" : "bg-white text-[#7f8c8d] border-[#e8e8e8]"
                      }`}
                      style={selected ? { background: t.primary, borderColor: t.primary } : undefined}
                    >
                      <span className="text-base">{hobby.emoji}</span>
                      <span>{hobby.label}</span>
                      {selected && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check size={12} color="white" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-[#b0b0b0]">
                  已选 {selectedHobbies.length}/8 · 供 AI 找话题和礼品推荐参考
                </span>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: 通知偏好 ── */}
          {step === 3 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full space-y-3"
            >
              {NOTIFY_MODES.map((mode, i) => {
                const ModeIcon = mode.icon;
                const isSelected = notifyMode === mode.id;
                return (
                  <motion.div
                    key={mode.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.1 }}
                  >
                    <button
                      onClick={() => setNotifyMode(mode.id)}
                      className={`w-full love-card flex items-center gap-4 transition-all text-left ${
                        isSelected ? "border-2 shadow-md" : ""
                      }`}
                      style={{
                        borderColor: isSelected ? mode.color : undefined,
                        background: isSelected ? mode.bgColor : undefined,
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: isSelected ? mode.color : "#f0f0f0" }}
                      >
                        <ModeIcon size={22} color={isSelected ? "white" : "#b0b0b0"} />
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{mode.emoji}</span>
                          <p className="font-black text-[#2C3E50] text-sm">{mode.label}</p>
                        </div>
                        <p className="text-xs text-[#7f8c8d] mt-0.5 leading-relaxed">{mode.desc}</p>
                      </div>
                      {/* Check */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: mode.color }}
                        >
                          <Check size={12} color="white" />
                        </motion.div>
                      )}
                    </button>

                    {/* 效果预览动画 + 震动开关 */}
                    {isSelected && (
                      <div className="px-1">
                        <NotifyPreview mode={mode} active={isSelected} />
                        {mode.id !== "dnd" && (
                          <VibrateToggle
                            value={vibrateMap[mode.id]}
                            onChange={(v) => setVibrateMap((prev) => ({ ...prev, [mode.id]: v }))}
                            color={mode.color}
                          />
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-2 flex-shrink-0">
        <button
          className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl flex items-center justify-center gap-2"
          onClick={handleNext}
        >
          {step < STEPS.length - 1 ? "继续" : "开始使用 🎉"}
          <ChevronRight size={20} />
        </button>
        {step < STEPS.length - 1 && (
          <button
            className="w-full py-3 text-[#7f8c8d] text-sm mt-1"
            onClick={handleNext}
          >
            稍后设置
          </button>
        )}
      </div>
    </div>
  );
}
