/*
 * DiaryCreateScreen - 写恋爱日记
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowLeft, Image, Smile, MapPin, Tag } from "lucide-react";
import { useState } from "react";

const moods = ["😊", "😍", "🥰", "😢", "😤", "🤗", "😴", "🎉"];

export default function DiaryCreateScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, toast } = useApp();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleSave = () => {
    toast("日记已保存！", gender);
    setTimeout(() => navigate("timeline", gender), 800);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("timeline", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">写日记</h2>
        <button
          onClick={handleSave}
          className="font-bold text-sm"
          style={{ color: t.primary }}
        >
          保存
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Date */}
        <p className="text-xs text-[#7f8c8d] mb-4">
          {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </p>

        {/* Mood selector */}
        <div className="mb-4">
          <p className="text-sm font-bold text-[#2C3E50] mb-2">今天的心情</p>
          <div className="flex gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                  selectedMood === mood
                    ? "scale-110 shadow-md"
                    : "bg-white border border-[#f0e6e0]"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="给今天起个标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-bold text-[#2C3E50] placeholder-[#d0d0d0] outline-none mb-4 bg-transparent"
        />

        {/* Content */}
        <textarea
          placeholder="记录今天的甜蜜时刻..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 text-sm text-[#2C3E50] placeholder-[#d0d0d0] outline-none bg-transparent resize-none leading-relaxed"
        />

        {/* Toolbar */}
        <div className="flex items-center gap-4 py-3 border-t border-[#f0e6e0]">
          <button onClick={() => toast("添加图片", gender)} className="p-2">
            <Image size={20} color="#7f8c8d" />
          </button>
          <button onClick={() => toast("添加表情", gender)} className="p-2">
            <Smile size={20} color="#7f8c8d" />
          </button>
          <button onClick={() => toast("添加位置", gender)} className="p-2">
            <MapPin size={20} color="#7f8c8d" />
          </button>
          <button onClick={() => toast("添加标签", gender)} className="p-2">
            <Tag size={20} color="#7f8c8d" />
          </button>
        </div>

        {/* Mascot tip */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="love-card flex items-center gap-3 mt-4"
          style={{ background: t.primaryLight, borderColor: t.accent }}
        >
          <img src={MASCOT.love} alt="" className="w-10 h-10" />
          <p className="text-xs text-[#2C3E50]">
            记录每一个甜蜜瞬间，让回忆永不褪色~
          </p>
        </motion.div>
      </div>
    </div>
  );
}
