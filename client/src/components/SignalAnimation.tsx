/*
 * SignalAnimation - 双手机之间的信号飞行动画
 * 显示心动信号从一部手机飞向另一部手机
 */
import { useApp, SignalEvent } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FlyingSignal {
  id: string;
  emoji: string;
  text: string;
  direction: "left-to-right" | "right-to-left";
}

export default function SignalAnimation() {
  const { signals } = useApp();
  const [flyingSignals, setFlyingSignals] = useState<FlyingSignal[]>([]);

  useEffect(() => {
    const latest = signals[signals.length - 1];
    if (!latest || latest.status !== "sending") return;

    const flying: FlyingSignal = {
      id: latest.id,
      emoji: latest.emoji,
      text: latest.text,
      direction: latest.from === "female" ? "left-to-right" : "right-to-left",
    };
    setFlyingSignals((prev) => [...prev, flying]);

    setTimeout(() => {
      setFlyingSignals((prev) => prev.filter((s) => s.id !== flying.id));
    }, 2000);
  }, [signals]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {flyingSignals.map((sig) => (
          <motion.div
            key={sig.id}
            className="absolute top-1/2 flex flex-col items-center gap-1"
            initial={{
              x: sig.direction === "left-to-right" ? "10%" : "90%",
              y: "-50%",
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              x: sig.direction === "left-to-right" ? "90%" : "10%",
              y: ["-50%", "-80%", "-50%"],
              scale: [0.5, 1.5, 1],
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          >
            <span className="text-4xl drop-shadow-lg">{sig.emoji}</span>
            <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
              {sig.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
