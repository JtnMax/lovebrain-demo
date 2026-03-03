/*
 * HomeScreen - 首页
 * Jelly Pop 弹性美学 - 关心信号入口 + 状态 + 今日提醒
 * 参考多邻国首页的卡片式布局
 */
import { useApp } from "@/contexts/AppContext";
import { MASCOT, MOCK_USER, MOCK_ANNIVERSARIES, CARE_SIGNALS } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import { Heart, Bell, Moon, Send, ChevronRight, Flame, Zap } from "lucide-react";

export default function HomeScreen() {
  const { navigate, toast } = useApp();

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative">
      {/* Status bar area */}
      <div className="pt-10 px-4 pb-2">
        {/* Top stats bar - Duolingo style */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart size={18} fill="#FF6B8A" color="#FF6B8A" />
            <span className="font-black text-[#FF6B8A]" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {MOCK_USER.daysInLove}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={18} color="#FF6B35" fill="#FF6B35" />
            <span className="font-black text-[#FF6B35]" style={{ fontFamily: "'Nunito', sans-serif" }}>7</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={18} color="#FFC800" fill="#FFC800" />
            <span className="font-black text-[#FFC800]" style={{ fontFamily: "'Nunito', sans-serif" }}>42</span>
          </div>
          <div className="flex items-center gap-1.5 relative">
            <Bell size={18} color="#4ECDC4" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF6B8A] rounded-full border border-white" />
          </div>
          <button
            onClick={() => toast("勿扰模式已开启")}
            className="flex items-center gap-1.5 bg-[#F7F3F0] px-3 py-1.5 rounded-full"
          >
            <Moon size={14} color="#B8A9C9" />
            <span className="text-xs font-semibold text-[#7f8c8d]">勿扰</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 space-y-4">
        {/* Partner card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="love-card flex items-center gap-4"
        >
          <div className="relative">
            <img
              src={MOCK_USER.partnerAvatar}
              alt={MOCK_USER.partnerName}
              className="w-14 h-14 rounded-full object-cover border-3 border-[#FF6B8A]"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#58CC02] rounded-full border-2 border-white flex items-center justify-center">
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#2C3E50]">{MOCK_USER.partnerName}</p>
            <p className="text-xs text-[#7f8c8d]">在一起第 <span className="font-black text-[#FF6B8A]">{MOCK_USER.daysInLove}</span> 天</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-[#58CC02]">
              <div className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
              <span className="text-xs font-semibold">在线</span>
            </div>
          </div>
        </motion.div>

        {/* Care signal - Big CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => navigate("signal-send")}
            className="w-full bg-gradient-to-r from-[#FF9A9E] to-[#FF6B8A] rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-[#FF6B8A]/20 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
            <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center backdrop-blur-sm relative z-10">
              <Send size={24} color="white" />
            </div>
            <div className="text-left flex-1 relative z-10">
              <p className="text-white font-black text-lg">发送关心信号</p>
              <p className="text-white/80 text-sm">让TA知道你在想TA</p>
            </div>
            <ChevronRight size={24} color="white" className="relative z-10" />
          </button>
        </motion.div>

        {/* Quick signals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-[#2C3E50] mb-3 text-sm">快捷信号</h3>
          <div className="grid grid-cols-4 gap-2">
            {CARE_SIGNALS.slice(0, 4).map((signal, i) => (
              <motion.button
                key={signal.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                onClick={() => toast(`已发送"${signal.text}"`)}
                className="love-card flex flex-col items-center py-3 gap-1.5 active:scale-95 transition-transform"
              >
                <span className="text-2xl">{signal.emoji}</span>
                <span className="text-[10px] font-semibold text-[#2C3E50]">{signal.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Upcoming anniversaries */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#2C3E50] text-sm">即将到来</h3>
            <button
              onClick={() => navigate("anniversary")}
              className="text-xs text-[#FF6B8A] font-semibold"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_ANNIVERSARIES.filter((a) => !a.isPast).slice(0, 2).map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="love-card flex items-center gap-3"
                onClick={() => navigate("anniversary")}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-[#FFF0F3]">
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
                  <motion.div
                    className="bg-[#58CC02] px-3 py-1 rounded-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-xs font-black text-white">今天!</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mascot encouragement */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="love-card bg-[#FFF0F3] border-[#FFD4DE] flex items-center gap-4"
        >
          <motion.img
            src={MASCOT.happy}
            alt="吉祥物"
            className="w-16 h-16"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex-1">
            <p className="font-bold text-[#FF6B8A] text-sm">今日小贴士 💡</p>
            <p className="text-xs text-[#2C3E50] mt-1 leading-relaxed">
              连续签到 7 天了！记得给TA发一个关心信号哦~
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tab bar */}
      <TabBar />
    </div>
  );
}
