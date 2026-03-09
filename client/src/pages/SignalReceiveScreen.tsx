/*
 * SignalReceiveScreen - 接收到的关心信号
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { USERS, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, CheckCheck } from "lucide-react";

export default function SignalReceiveScreen({ gender }: { gender: Gender }) {
  const { navigate, signals, markSignalRead, toast } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const mySignals = signals.filter((s) => s.to === gender).reverse();
  const partner = gender === "female" ? USERS.male : USERS.female;

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("home", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">收到的信号</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">
        {mySignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <span className="text-5xl mb-4">💌</span>
            <p className="text-[#7f8c8d] text-sm">还没有收到信号</p>
            <p className="text-[#b0b0b0] text-xs mt-1">等待{partner.name}的关心吧~</p>
          </div>
        ) : (
          mySignals.map((sig, i) => (
            <motion.div
              key={sig.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="love-card flex items-center gap-4"
              onClick={() => {
                markSignalRead(sig.id);
                toast("已读", gender);
              }}
            >
              <div className="relative">
                <img src={partner.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: t.primary }} />
                <span className="absolute -bottom-1 -right-1 text-lg">{sig.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#2C3E50] text-sm">{partner.name}</p>
                <p className="text-xs text-[#7f8c8d] mt-0.5">{sig.text}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-[#b0b0b0]">
                  {new Date(sig.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {sig.status === "read" ? (
                  <CheckCheck size={14} color="#58CC02" />
                ) : (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: t.primary }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
