/*
 * SignalSendScreen - 关心信号发送页
 * 支持双人视角 - 发送后对方手机会收到通知
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, CARE_SIGNALS, USERS, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useState } from "react";

function CelebrationParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 300 - 150,
    y: -(Math.random() * 400 + 100),
    rotate: Math.random() * 360,
    delay: Math.random() * 0.5,
    size: 10 + Math.random() * 14,
    emoji: ["💕", "❤️", "💗", "✨", "🎉", "💖"][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{ fontSize: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x, y: p.y,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.5],
            rotate: p.rotate,
          }}
          transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default function SignalSendScreen({ gender }: { gender: Gender }) {
  const { navigate, toast, sendSignal } = useApp();
  const [selected, setSelected] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [custom, setCustom] = useState("");
  const t = gender === "female" ? THEME.female : THEME.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const targetGender: Gender = gender === "female" ? "male" : "female";

  const handleSend = () => {
    const signal = selected ? CARE_SIGNALS.find((s) => s.id === selected) : null;
    const text = signal ? signal.text : custom;
    const emoji = signal ? signal.emoji : "💌";

    sendSignal({
      from: gender,
      to: targetGender,
      type: "care",
      emoji,
      text,
    });

    setSent(true);
    // 发送成功后展示 2.5s 庆祝动画，然后自动返回首页
    // AppContext.sendSignal 已处理接收方自动跳转到 signal-receive
    // 这里只需处理发送方的后续提示
    setTimeout(() => {
      toast("💌 关心已送达！", gender);
    }, 1500);
    // AppContext.sendSignal 内部已在 300ms 后自动导航发送方回首页
    // 无需在此重复调用 navigate，避免二次跳转
  };

  return (
    <div className="h-full flex flex-col relative" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("home", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">发送关心信号</h2>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="select"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col px-4"
          >
            {/* Target */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-sm text-[#7f8c8d]">发送给</span>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border" style={{ borderColor: t.cardBorder }}>
                <img src={partner.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="font-bold text-[#2C3E50] text-sm">{partner.name}</span>
              </div>
            </div>

            {/* Signal grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {CARE_SIGNALS.map((signal, i) => (
                <motion.button
                  key={signal.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(signal.id)}
                  className={`love-card flex items-center gap-3 py-4 transition-all ${
                    selected === signal.id ? "border-2 shadow-md scale-[1.02]" : ""
                  }`}
                  style={{
                    borderColor: selected === signal.id ? t.primary : undefined,
                    background: selected === signal.id ? `${t.primary}10` : undefined,
                  }}
                >
                  <motion.span
                    className="text-3xl"
                    animate={selected === signal.id ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {signal.emoji}
                  </motion.span>
                  <span className="font-bold text-[#2C3E50] text-sm">{signal.text}</span>
                </motion.button>
              ))}
            </div>

            {/* Custom input */}
            <div className="love-card mb-4">
              <input
                type="text"
                placeholder="或者自定义一条..."
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                className="w-full bg-transparent outline-none text-[#2C3E50] placeholder-[#b0b0b0]"
              />
            </div>

            <div className="flex-1" />

            {/* Send button */}
            <div className="pb-8">
              <button
                className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  selected || custom
                    ? "text-white shadow-lg"
                    : "bg-[#e8e8e8] text-[#b0b0b0]"
                }`}
                style={selected || custom ? {
                  background: t.primary,
                  boxShadow: `0 5px 0 ${t.primaryDark}, 0 6px 8px rgba(0,0,0,0.15)`,
                } : undefined}
                onClick={handleSend}
                disabled={!selected && !custom}
              >
                <Send size={20} />
                发送
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex-1 flex flex-col items-center justify-center px-8 relative"
          >
            <CelebrationParticles />
            <motion.img
              src={MASCOT.celebrate}
              alt="庆祝"
              className="w-40 h-40 mb-6 relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative z-10"
            >
              <Sparkles size={32} color="#FFC800" className="mb-4 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-black mb-2 relative z-10" style={{ color: t.primary }}>发送成功！</h2>
            <p className="text-[#7f8c8d] text-center relative z-10">
              你的关心已经送达 {partner.name} 啦~
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
