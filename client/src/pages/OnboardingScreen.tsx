/*
 * OnboardingScreen - 首次引导页
 * 设置纪念日、生日等基本信息
 * 参考多邻国引导页设计 - 多步骤表单
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Calendar, Bell, ChevronRight } from "lucide-react";

const steps = [
  {
    title: "你们的纪念日",
    subtitle: "记录你们在一起的日子",
    icon: Heart,
    color: "#FF6B8A",
    mascot: "love" as const,
    emoji: "💕",
  },
  {
    title: "TA的生日",
    subtitle: "我们会提前提醒你准备惊喜",
    icon: Calendar,
    color: "#FFC800",
    mascot: "celebrate" as const,
    emoji: "🎂",
  },
  {
    title: "回执偏好",
    subtitle: "选择你希望收到关心信号的方式",
    icon: Bell,
    color: "#4ECDC4",
    mascot: "thinking" as const,
    emoji: "💌",
  },
];

const preferences = [
  { id: "vibrate", label: "振动 + 通知", desc: "收到信号时振动提醒", emoji: "📳", color: "#FF6B8A" },
  { id: "notify", label: "仅通知", desc: "静默推送通知", emoji: "🔔", color: "#FFC800" },
  { id: "silent", label: "静默接收", desc: "不打扰，自行查看", emoji: "🕊️", color: "#4ECDC4" },
];

export default function OnboardingScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, toast } = useApp();
  const [step, setStep] = useState(0);
  const [selectedPref, setSelectedPref] = useState("vibrate");

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      toast("设置完成！", gender);
      setTimeout(() => navigate("home", gender), 800);
    }
  };

  const current = steps[step];
  const Icon = current.icon;
  const progress = ((step + 1) / steps.length) * 100;

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
          <span className="text-[10px] text-[#b0b0b0]">步骤 {step + 1}/{steps.length}</span>
          <button
            onClick={() => {
              toast("已跳过引导", gender);
              navigate("home", gender);
            }}
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
          className="flex-1 flex flex-col items-center px-6 pt-6"
        >
          {/* Mascot */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mb-4"
          >
            <img src={MASCOT[current.mascot]} alt="" className="w-28 h-28 drop-shadow-lg" />
          </motion.div>

          {/* Emoji + Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-6"
          >
            <span className="text-3xl mb-2 block">{current.emoji}</span>
            <h2 className="text-2xl font-black text-[#2C3E50] mb-2">{current.title}</h2>
            <p className="text-sm text-[#7f8c8d]">{current.subtitle}</p>
          </motion.div>

          {/* Input area */}
          {step === 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
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
          {step === 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full love-card flex items-center gap-3"
            >
              <span className="text-2xl">🎂</span>
              <input
                type="date"
                defaultValue="2000-06-15"
                className="flex-1 bg-[#F7F3F0] rounded-xl px-4 py-3.5 text-[#2C3E50] outline-none font-semibold"
              />
            </motion.div>
          )}
          {step === 2 && (
            <div className="w-full space-y-3">
              {preferences.map((pref, i) => (
                <motion.button
                  key={pref.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => setSelectedPref(pref.id)}
                  className={`w-full love-card flex items-center gap-4 transition-all ${
                    selectedPref === pref.id
                      ? "border-2 shadow-md"
                      : ""
                  }`}
                  style={{
                    borderColor: selectedPref === pref.id ? pref.color : undefined,
                    background: selectedPref === pref.id ? `${pref.color}10` : undefined,
                  }}
                >
                  <span className="text-2xl">{pref.emoji}</span>
                  <div className="text-left flex-1">
                    <p className="font-bold text-[#2C3E50] text-sm">{pref.label}</p>
                    <p className="text-xs text-[#7f8c8d]">{pref.desc}</p>
                  </div>
                  {selectedPref === pref.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: pref.color }}
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom */}
      <div className="px-6 pb-10">
        <button
          className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl flex items-center justify-center gap-2"
          onClick={handleNext}
        >
          {step < steps.length - 1 ? "继续" : "开始使用 🎉"}
          <ChevronRight size={20} />
        </button>
        {step < steps.length - 1 && (
          <button
            className="w-full py-3 text-[#7f8c8d] text-sm mt-2"
            onClick={handleNext}
          >
            稍后设置
          </button>
        )}
      </div>
    </div>
  );
}
