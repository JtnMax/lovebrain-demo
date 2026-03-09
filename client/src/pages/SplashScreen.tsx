/*
 * SplashScreen - 启动页
 * Jelly Pop 弹性美学 - 吉祥物居中 + APP名称 + 标语 + 心形粒子
 * 参考多邻国启动页设计
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, APP_NAME, APP_SLOGAN, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function HeartParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute text-[#FF6B8A] pointer-events-none"
      style={{ left: `${x}%`, bottom: -20, fontSize: size }}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 0.6, 0], y: -400, x: [0, (Math.random() - 0.5) * 60] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeOut" }}
    >
      ♥
    </motion.div>
  );
}

export default function SplashScreen({ gender }: { gender: Gender }) {
  const { navigate } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    const timer = setTimeout(() => {
      navigate("welcome", gender);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, gender]);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.3,
    x: Math.random() * 100,
    size: 12 + Math.random() * 16,
  }));

  return (
    <div className={`h-full flex flex-col items-center justify-center bg-gradient-to-b ${t.gradientBg} px-8 relative overflow-hidden`}>
      {/* Heart particles */}
      {particles.map((p, i) => (
        <HeartParticle key={i} {...p} />
      ))}

      {/* Mascot */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="mb-6 relative z-10"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={MASCOT.happy}
            alt="恋爱脑吉祥物"
            className="w-44 h-44 drop-shadow-xl"
          />
        </motion.div>
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,107,138,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* App Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl font-black mb-2 relative z-10"
        style={{ fontFamily: "'Nunito', 'Noto Sans SC', sans-serif", color: t.primary }}
      >
        {APP_NAME}
      </motion.h1>

      {/* Slogan */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-base text-[#7f8c8d] relative z-10"
      >
        {APP_SLOGAN}
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 flex gap-2.5 relative z-10"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ background: [t.primary, "#4ECDC4", "#FFC800"][i] }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
