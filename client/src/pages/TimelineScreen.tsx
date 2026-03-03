/*
 * TimelineScreen - 恋爱历程时间轴
 * 垂直时间轴 + 里程碑/日记/纪念日 + 天数计数器
 * Jelly Pop 弹性美学
 */
import { useApp } from "@/contexts/AppContext";
import { MOCK_TIMELINE, MOCK_USER, MASCOT } from "@/lib/constants";
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

export default function TimelineScreen() {
  const { navigate } = useApp();

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative">
      {/* Header */}
      <div className="bg-[#FFFBF5] px-4 pt-12 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#2C3E50]">恋爱历程</h1>
        <button
          onClick={() => navigate("diary-create")}
          className="w-10 h-10 bg-[#FF6B8A] rounded-full flex items-center justify-center shadow-md shadow-[#FF6B8A]/30"
        >
          <Plus size={20} color="white" />
        </button>
      </div>

      {/* Days counter */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="love-card bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] border-none text-center py-5 relative overflow-hidden"
        >
          {/* Decorative hearts */}
          <div className="absolute top-2 left-4 text-white/20 text-lg">♥</div>
          <div className="absolute bottom-2 right-6 text-white/15 text-2xl">♥</div>
          <div className="absolute top-4 right-12 text-white/10 text-sm">♥</div>
          <p className="text-white/80 text-sm relative z-10">我们已经在一起</p>
          <div className="flex items-center justify-center gap-2 relative z-10">
            <motion.p
              className="text-white text-5xl font-black mt-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {MOCK_USER.daysInLove}
            </motion.p>
          </div>
          <p className="text-white/80 text-sm relative z-10">天</p>
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart size={16} color="white" fill="white" className="opacity-30" />
          </motion.div>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B8A] via-[#FFC800] to-[#4ECDC4]" />

          {MOCK_TIMELINE.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative mb-6"
            >
              {/* Dot with pulse */}
              <div className="absolute -left-5 top-1">
                <div
                  className="w-4 h-4 rounded-full border-3 border-white relative z-10"
                  style={{ background: typeColors[item.type] || "#FF6B8A" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: typeColors[item.type] }}
                  animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </div>

              {/* Card */}
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

        {/* Write diary prompt */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("diary-create")}
          className="w-full love-card flex items-center gap-3 bg-[#FFF0F3] border-[#FFD4DE] border-dashed border-2 mt-2"
        >
          <BookOpen size={20} color="#FF6B8A" />
          <span className="text-sm font-semibold text-[#FF6B8A]">写一篇恋爱日记...</span>
        </motion.button>

        {/* Mascot */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="love-card bg-[#E8FFF8] border-[#B8F0E4] flex items-center gap-3 mt-4"
        >
          <img src={MASCOT.love} alt="" className="w-12 h-12" />
          <p className="text-xs text-[#2C3E50]">
            <span className="font-bold">每一天都值得记录~</span> 你们的故事正在被书写 ✨
          </p>
        </motion.div>
      </div>

      <TabBar />
    </div>
  );
}
