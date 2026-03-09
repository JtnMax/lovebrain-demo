/*
 * TopicCardsScreen - 找话题（AI话题卡）
 * 三类话题卡（轻松/走心/行动）+ 一键发送到聊天
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { TOPIC_CARDS, THEME, USERS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shuffle, Send, MessageCircle, Lightbulb, Heart, Zap } from "lucide-react";
import { useState } from "react";

type Category = "light" | "deep" | "action";

export default function TopicCardsScreen({ gender }: { gender: Gender }) {
  const { navigate, toast, addChatMessage } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const [category, setCategory] = useState<Category>("light");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sent, setSent] = useState(false);

  const cards = TOPIC_CARDS[category];
  const currentCard = cards[currentIndex % cards.length];

  const categories: { key: Category; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { key: "light", label: "轻松", icon: Lightbulb, color: "#FFC800" },
    { key: "deep", label: "走心", icon: Heart, color: "#FF6B8A" },
    { key: "action", label: "行动", icon: Zap, color: "#58CC02" },
  ];

  const handleShuffle = () => {
    setCurrentIndex((prev) => prev + 1);
    setSent(false);
  };

  const handleSend = () => {
    addChatMessage({
      sender: gender,
      text: `🎴 话题卡：${currentCard.text}`,
      type: "topic",
    });
    setSent(true);
    toast("已发送到聊天！", gender);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-3">
        <button onClick={() => navigate("chat", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">找话题</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col px-4 pb-8">
        {/* Category tabs */}
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => { setCategory(cat.key); setCurrentIndex(0); setSent(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                  category === cat.key ? "text-white shadow-md" : "bg-white text-[#7f8c8d] border"
                }`}
                style={category === cat.key ? {
                  background: cat.color,
                  boxShadow: `0 4px 0 ${cat.color}80`,
                } : { borderColor: t.cardBorder }}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${currentIndex}`}
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-[280px] aspect-[3/4] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${categories.find((c) => c.key === category)?.color}20, ${categories.find((c) => c.key === category)?.color}05)`,
                border: `2px solid ${categories.find((c) => c.key === category)?.color}30`,
              }}
            >
              <div className="absolute top-4 right-4 text-4xl opacity-20">{currentCard.emoji}</div>
              <span className="text-5xl mb-6">{currentCard.emoji}</span>
              <p className="text-[#2C3E50] font-bold text-lg leading-relaxed">{currentCard.text}</p>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-[10px] text-[#b0b0b0] bg-white/50 px-3 py-1 rounded-full">
                  {categories.find((c) => c.key === category)?.label}话题
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-4">
          <div className="flex gap-3">
            <button
              onClick={handleShuffle}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold bg-white border-2 text-[#2C3E50]"
              style={{ borderColor: t.cardBorder, boxShadow: `0 4px 0 ${t.cardBorder}` }}
            >
              <Shuffle size={18} />
              换一个
            </button>
            <button
              onClick={handleSend}
              disabled={sent}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold text-white transition-all ${
                sent ? "opacity-50" : ""
              }`}
              style={{
                background: t.primary,
                boxShadow: `0 4px 0 ${t.primaryDark}`,
              }}
            >
              <Send size={18} />
              {sent ? "已发送" : "发到聊天"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
