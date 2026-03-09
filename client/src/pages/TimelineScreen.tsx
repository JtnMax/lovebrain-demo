/*
 * TimelineScreen - 恋爱历程时间轴
 * 垂直时间轴 + 里程碑/日记/纪念日 + 天数计数器
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MOCK_TIMELINE, COUPLE_INFO, MASCOT, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import { Plus, BookOpen, Heart } from "lucide-react";

const typeColors: Record<string, string> = {
  milestone: "#FF6B8A",
  anniversary: "#FFC800",
  diary: "#4ECDC4",
};

const typeLabels: Record<string, string> = {
  milestone: "里程碑",
  anniversary: "纪念日",
  diary: "日记",
};

export default function TimelineScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate } = useApp();

  return (
    <div className="h-full flex flex-col relative" style={{ background: t.bg }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#2C3E50]">恋爱历程</h1>
        <button
          onClick={() => navigate("diary-create", gender)}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ background: t.primary, boxShadow: `0 4px 12px ${t.primary}40` }}
        >
          <Plus size={20} color="white" />
        </button>
      </div>

      {/* Days counter */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="love-card border-none text-center py-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }}
        >
          <div className="absolute top-2 left-4 text-white/20 text-lg">♥</div>
          <div className="absolute bottom-2 right-6 text-white/15 text-2xl">♥</div>
          <p className="text-white/80 text-sm relative z-10">我们已经在一起</p>
          <div className="flex items-center justify-center gap-2 relative z-10">
            <motion.p
              className="text-white text-5xl font-black mt-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {COUPLE_INFO.daysInLove}
            </motion.p>
          </div>
          <p className="text-white/80 text-sm relative z-10">天</p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${t.primary}, #FFC800, #4ECDC4)` }} />

          {MOCK_TIMELINE.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative mb-6"
            >
              <div className="absolute -left-5 top-1">
                <div
                  className="w-4 h-4 rounded-full border-3 border-white relative z-10"
                  style={{ background: typeColors[item.type] || t.primary }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: typeColors[item.type] }}
                  animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </div>

              <div className="love-card ml-2">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#2C3E50] text-sm">{item.title}</p>
                    <p className="text-[10px] text-[#7f8c8d] mt-0.5">{item.date}</p>
                    <p className="text-xs text-[#2C3E50] mt-2 leading-relaxed">{item.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white"
                    style={{ background: typeColors[item.type] }}
                  >
                    {typeLabels[item.type]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("diary-create", gender)}
          className="w-full love-card flex items-center gap-3 border-dashed border-2 mt-2"
          style={{ background: t.primaryLight, borderColor: t.accent }}
        >
          <BookOpen size={20} color={t.primary} />
          <span className="text-sm font-semibold" style={{ color: t.primary }}>写一篇恋爱日记...</span>
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="love-card bg-[#E8FFF8] border-[#B8F0E4] flex items-center gap-3 mt-4"
        >
          <img src={MASCOT.love} alt="" className="w-12 h-12" />
          <p className="text-xs text-[#2C3E50]">
            <span className="font-bold">每一天都值得记录~</span> 你们的故事正在被书写
          </p>
        </motion.div>
      </div>

      <TabBar gender={gender} />
    </div>
  );
}
