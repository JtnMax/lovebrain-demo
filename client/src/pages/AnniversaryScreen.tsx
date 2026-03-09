/*
 * AnniversaryScreen - 纪念日管理
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MOCK_ANNIVERSARIES, MASCOT, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Calendar, Bell, Gift } from "lucide-react";

export default function AnniversaryScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, toast } = useApp();

  const upcoming = MOCK_ANNIVERSARIES.filter((a) => !a.isPast);
  const past = MOCK_ANNIVERSARIES.filter((a) => a.isPast);

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("home", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">纪念日</h2>
        <button
          onClick={() => toast("添加纪念日", gender)}
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
          style={{ background: t.primary, boxShadow: `0 4px 12px ${t.primary}40` }}
        >
          <Plus size={18} color="white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Next anniversary highlight */}
        {upcoming.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="love-card border-none mb-4 text-center py-6 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }}
          >
            <div className="absolute top-2 left-4 text-white/20 text-lg">♥</div>
            <div className="absolute bottom-2 right-6 text-white/15 text-2xl">♥</div>
            <span className="text-4xl mb-2 block">{upcoming[0].emoji}</span>
            <p className="text-white font-black text-lg">{upcoming[0].title}</p>
            <p className="text-white/80 text-sm mt-1">{upcoming[0].date}</p>
            {upcoming[0].daysLeft > 0 ? (
              <div className="mt-3 inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-black text-2xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {upcoming[0].daysLeft}
                </span>
                <span className="text-white/90 text-sm">天后</span>
              </div>
            ) : (
              <motion.div
                className="mt-3 inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Gift size={16} color="white" />
                <span className="text-white font-black">就是今天!</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Upcoming */}
        {upcoming.length > 1 && (
          <>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-3 flex items-center gap-2">
              <Bell size={14} color="#FFC800" />
              即将到来
            </h3>
            <div className="space-y-2 mb-6">
              {upcoming.slice(1).map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="love-card flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: t.primaryLight }}>
                    {ann.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2C3E50] text-sm">{ann.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar size={10} color="#7f8c8d" />
                      <span className="text-xs text-[#7f8c8d]">{ann.date}</span>
                    </div>
                  </div>
                  <div className="bg-[#FFC800] px-3 py-1 rounded-full">
                    <span className="text-xs font-black text-white">{ann.daysLeft}天</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-3 flex items-center gap-2">
              <Gift size={14} color="#B8A9C9" />
              已过纪念日
            </h3>
            <div className="space-y-2 mb-6">
              {past.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="love-card flex items-center gap-3 opacity-70"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-[#F7F3F0]">
                    {ann.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2C3E50] text-sm">{ann.title}</p>
                    <span className="text-xs text-[#7f8c8d]">{ann.date}</span>
                  </div>
                  <button
                    onClick={() => toast("查看回顾", gender)}
                    className="text-xs font-semibold"
                    style={{ color: t.primary }}
                  >
                    回顾
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Add new prompt */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => toast("创建纪念日", gender)}
          className="w-full love-card flex items-center gap-3 border-dashed border-2"
          style={{ background: t.primaryLight, borderColor: t.accent }}
        >
          <Plus size={20} color={t.primary} />
          <span className="text-sm font-semibold" style={{ color: t.primary }}>添加新的纪念日...</span>
        </motion.button>

        {/* Mascot */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="love-card bg-[#FFF8E1] border-[#FFE082] flex items-center gap-3 mt-4"
        >
          <img src={MASCOT.thinking} alt="" className="w-12 h-12" />
          <p className="text-xs text-[#2C3E50]">
            <span className="font-bold">小提示</span> 添加更多纪念日，我会提前提醒你哦~
          </p>
        </motion.div>
      </div>
    </div>
  );
}
