/*
 * WelcomeScreen - 欢迎页
 * 参考多邻国首页：吉祥物 + 马上开始 + 已有账户
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, APP_NAME, APP_SLOGAN, THEME } from "@/lib/constants";
import { motion } from "framer-motion";

function FloatingHeart({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute text-[#FFD4DE] pointer-events-none select-none"
      style={{ left: x, top: y, fontSize: size }}
      animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      ♥
    </motion.div>
  );
}

export default function WelcomeScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate } = useApp();

  return (
    <div className={`h-full flex flex-col bg-gradient-to-b ${t.gradientBg} relative overflow-hidden`}>
      {/* Floating hearts background */}
      <FloatingHeart delay={0} x="10%" y="15%" size={20} />
      <FloatingHeart delay={0.5} x="80%" y="10%" size={14} />
      <FloatingHeart delay={1} x="65%" y="25%" size={18} />
      <FloatingHeart delay={1.5} x="20%" y="35%" size={12} />
      <FloatingHeart delay={2} x="85%" y="40%" size={16} />

      {/* Top spacer */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* Mascot with speech bubble */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-4 relative"
        >
          {/* Speech bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            className="absolute -top-10 -right-8 bg-white rounded-2xl px-4 py-2 shadow-md border border-[#f0e6e0]"
          >
            <span className="text-sm font-bold text-[#2C3E50]">Hi~ 👋</span>
            <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-white border-b border-r border-[#f0e6e0] rotate-45" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={MASCOT.waving}
              alt="恋爱脑吉祥物"
              className="w-48 h-48 drop-shadow-lg"
            />
          </motion.div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black mb-2"
          style={{ fontFamily: "'Nunito', 'Noto Sans SC', sans-serif", color: t.primary }}
        >
          {APP_NAME}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#7f8c8d] text-lg mb-2"
        >
          {APP_SLOGAN}
        </motion.p>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
          {["💕 关心信号", "📅 纪念日", "📝 恋爱日记", "🎯 愿望清单"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
              className="bg-white/80 backdrop-blur-sm text-[#2C3E50] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#f0e6e0] shadow-sm"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom buttons */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="px-6 pb-12 space-y-3 relative z-10"
      >
        <button
          className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl"
          onClick={() => navigate("login", gender)}
        >
          马上开始
        </button>
        <button
          className="btn-jelly btn-jelly-outline w-full py-4 text-lg rounded-2xl"
          onClick={() => navigate("login", gender)}
        >
          已有账户
        </button>
      </motion.div>
    </div>
  );
}
