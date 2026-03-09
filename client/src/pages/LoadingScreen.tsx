/*
 * LoadingScreen - 加载页
 * 参考多邻国加载页：吉祥物 + 加载提示 + 进度条
 * Jelly Pop 弹性美学
 */
import { Gender } from "@/contexts/AppContext";
import { MASCOT, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const tips = [
  "每天一个关心信号，感情升温不止一点点~",
  "记录每一个甜蜜瞬间，让回忆永不褪色",
  "愿望清单里还有梦想等着你们一起实现",
  "纪念日快到了，准备一个小惊喜吧！",
  "爱情需要经营，每一天都值得用心~",
];

export default function LoadingScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(tipTimer);
  }, []);

  useEffect(() => {
    const progTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 15;
      });
    }, 500);
    return () => clearInterval(progTimer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-8" style={{ background: `linear-gradient(to bottom, ${t.primaryLight}, ${t.bg})` }}>
      {/* Mascot with bounce */}
      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={MASCOT.happy}
          alt="加载中"
          className="w-32 h-32 drop-shadow-lg"
        />
        {/* Shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/10 rounded-full"
          animate={{ scaleX: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 mb-6">
        <div className="h-3 bg-[#e8e8e8] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, ${t.primary}, ${t.accent})` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 95)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[#7f8c8d] text-sm mb-6 font-semibold"
      >
        加载中...
      </motion.p>

      {/* Tip with animation */}
      <motion.div
        key={tipIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="love-card max-w-[280px]"
        style={{ background: t.primaryLight, borderColor: t.accent }}
      >
        <p className="text-[#2C3E50] text-sm text-center leading-relaxed">
          💡 {tips[tipIndex]}
        </p>
      </motion.div>

      {/* Decorative dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: ["#FF6B8A", "#4ECDC4", "#FFC800"][i] }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
