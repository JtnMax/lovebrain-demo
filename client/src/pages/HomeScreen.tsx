/*
 * HomeScreen - 首页
 * 支持双人主题色 - 关心信号入口 + 宇宙来信入口 + 今日提醒
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, CARE_SIGNALS, MOCK_ANNIVERSARIES, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import { Heart, Bell, Moon, Send, ChevronRight, Flame, Zap, Sparkles, MapPin } from "lucide-react";

export default function HomeScreen({ gender }: { gender: Gender }) {
  const { navigate, toast, signals } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const me = gender === "female" ? USERS.female : USERS.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const unreadSignals = signals.filter((s) => s.to === gender && s.status !== "read").length;

  return (
    <div className="h-full flex flex-col relative" style={{ background: t.bg }}>
      {/* Status bar area */}
      <div className="pt-10 px-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart size={18} fill={t.primary} color={t.primary} />
            <span className="font-black" style={{ color: t.primary, fontFamily: "'Nunito', sans-serif" }}>
              {COUPLE_INFO.daysInLove}
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
            <Bell size={18} color={t.primary} />
            {unreadSignals > 0 && (
              <div className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-[#e74c3c] rounded-full border border-white flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">{unreadSignals}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => toast("勿扰模式已开启", gender)}
            className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full"
          >
            <Moon size={14} color="#B8A9C9" />
            <span className="text-xs font-semibold text-[#7f8c8d]">勿扰</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 space-y-3">
        {/* Partner card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="love-card flex items-center gap-4"
        >
          <div className="relative">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-14 h-14 rounded-full object-cover border-3"
              style={{ borderColor: t.primary }}
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
            <p className="font-bold text-[#2C3E50]">{partner.name}</p>
            <p className="text-xs text-[#7f8c8d]">在一起第 <span className="font-black" style={{ color: t.primary }}>{COUPLE_INFO.daysInLove}</span> 天</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-[#58CC02]">
              <div className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
              <span className="text-xs font-semibold">在线</span>
            </div>
          </div>
        </motion.div>

        {/* Care signal - Big CTA */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <button
            onClick={() => navigate("signal-send", gender)}
            className={`w-full bg-gradient-to-r ${t.gradient} rounded-3xl p-5 flex items-center gap-4 shadow-lg relative overflow-hidden`}
            style={{ boxShadow: `0 10px 25px -5px ${t.primary}40` }}
          >
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
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <h3 className="font-bold text-[#2C3E50] mb-2 text-sm">快捷信号</h3>
          <div className="grid grid-cols-4 gap-2">
            {CARE_SIGNALS.slice(0, 4).map((signal, i) => (
              <motion.button
                key={signal.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
                onClick={() => toast(`已发送"${signal.text}"`, gender)}
                className="love-card flex flex-col items-center py-3 gap-1.5 active:scale-95 transition-transform"
              >
                <span className="text-2xl">{signal.emoji}</span>
                <span className="text-[10px] font-semibold text-[#2C3E50]">{signal.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cosmos letter entry */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
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

        {/* Travel map entry */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <button
            onClick={() => navigate("travel-map", gender)}
            className="w-full love-card flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${t.primary}15` }}>
              <MapPin size={22} color={t.primary} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#2C3E50] text-sm">旅行地图</p>
              <p className="text-xs text-[#7f8c8d]">已点亮 2 个国家 · 6 座城市</p>
            </div>
            <ChevronRight size={18} color="#b0b0b0" />
          </button>
        </motion.div>

        {/* Upcoming anniversaries */}
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
                className="love-card flex items-center gap-3"
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
              连续签到 7 天了！记得给{partner.name}发一个关心信号哦~
            </p>
          </div>
        </motion.div>
      </div>

      <TabBar gender={gender} />
    </div>
  );
}
