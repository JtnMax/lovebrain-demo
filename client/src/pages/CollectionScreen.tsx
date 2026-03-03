/*
 * CollectionScreen - 收藏馆
 * 混排展示照片/笔记/语音等收藏内容
 * Jelly Pop 弹性美学
 */
import { useApp } from "@/contexts/AppContext";
import { MOCK_COLLECTIONS, MASCOT } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import { Image, FileText, Mic, Play } from "lucide-react";
import { useState } from "react";

const filters = ["全部", "照片", "笔记", "语音"];
const filterMap: Record<string, string> = { "照片": "photo", "笔记": "note", "语音": "voice" };
const filterColors: Record<string, string> = {
  "全部": "#FF6B8A", "照片": "#4ECDC4", "笔记": "#FFC800", "语音": "#58CC02"
};

export default function CollectionScreen() {
  const { toast } = useApp();
  const [activeFilter, setActiveFilter] = useState("全部");

  const filtered = activeFilter === "全部"
    ? MOCK_COLLECTIONS
    : MOCK_COLLECTIONS.filter((c) => c.type === filterMap[activeFilter]);

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative">
      {/* Header */}
      <div className="bg-[#FFFBF5] px-4 pt-12 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#2C3E50]">收藏馆</h1>
        <div className="flex items-center gap-1 bg-[#FFF0F3] px-3 py-1 rounded-full">
          <span className="text-sm">💝</span>
          <span className="text-xs font-bold text-[#FF6B8A]">{MOCK_COLLECTIONS.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-3 flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeFilter === f
                ? "text-white shadow-sm"
                : "bg-white text-[#7f8c8d] border border-[#f0e6e0]"
            }`}
            style={activeFilter === f ? { background: filterColors[f] } : undefined}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Collection grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="love-card overflow-hidden p-0 active:scale-[0.98] transition-transform"
              onClick={() => toast("查看详情")}
            >
              {item.type === "photo" && item.thumbnail && (
                <div className="aspect-square relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-xs font-bold">{item.title}</p>
                    <p className="text-white/70 text-[10px]">{item.date}</p>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Image size={12} color="#4ECDC4" />
                  </div>
                </div>
              )}
              {item.type === "note" && (
                <div className="p-4 bg-gradient-to-br from-[#FFF0F3] to-[#FFF8E1] aspect-square flex flex-col">
                  <div className="w-8 h-8 bg-[#FFC800]/20 rounded-lg flex items-center justify-center mb-2">
                    <FileText size={16} color="#FFC800" />
                  </div>
                  <p className="font-bold text-[#2C3E50] text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-[#7f8c8d] flex-1 line-clamp-3 leading-relaxed">{item.content}</p>
                  <p className="text-[10px] text-[#b0b0b0] mt-2">{item.date}</p>
                </div>
              )}
              {item.type === "voice" && (
                <div className="p-4 bg-gradient-to-br from-[#E8FFF8] to-[#F0FFF4] aspect-square flex flex-col items-center justify-center">
                  <motion.div
                    className="w-14 h-14 bg-[#58CC02] rounded-full flex items-center justify-center mb-3 shadow-md shadow-[#58CC02]/30"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play size={22} color="white" fill="white" className="ml-0.5" />
                  </motion.div>
                  <p className="font-bold text-[#2C3E50] text-sm">{item.title}</p>
                  <p className="text-xs text-[#7f8c8d] mt-1">{item.duration}</p>
                  <p className="text-[10px] text-[#b0b0b0] mt-2">{item.date}</p>
                  {/* Waveform decoration */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: 12 }, (_, j) => (
                      <motion.div
                        key={j}
                        className="w-1 bg-[#58CC02] rounded-full"
                        style={{ height: 4 + Math.random() * 12 }}
                        animate={{ height: [4 + Math.random() * 12, 4 + Math.random() * 12] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: j * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mascot */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="love-card bg-[#FFF0F3] border-[#FFD4DE] flex items-center gap-3 mt-4"
        >
          <img src={MASCOT.celebrate} alt="" className="w-12 h-12" />
          <p className="text-xs text-[#2C3E50]">
            <span className="font-bold">收藏了 {MOCK_COLLECTIONS.length} 个甜蜜回忆~</span> 继续记录吧！
          </p>
        </motion.div>
      </div>

      <TabBar />
    </div>
  );
}
