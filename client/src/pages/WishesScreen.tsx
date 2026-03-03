/*
 * WishesScreen - 愿望清单/约定
 */
import { useApp } from "@/contexts/AppContext";
import { MOCK_WISHES, MASCOT } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { useState } from "react";

export default function WishesScreen() {
  const { navigate, toast } = useApp();
  const [wishes, setWishes] = useState(MOCK_WISHES);

  const toggleWish = (id: number) => {
    setWishes(wishes.map((w) =>
      w.id === id ? { ...w, done: !w.done } : w
    ));
  };

  const done = wishes.filter((w) => w.done);
  const todo = wishes.filter((w) => !w.done);
  const progress = Math.round((done.length / wishes.length) * 100);

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("profile")} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">愿望清单</h2>
        <button
          onClick={() => toast("添加愿望")}
          className="w-9 h-9 bg-[#FF6B35] rounded-full flex items-center justify-center"
        >
          <Plus size={18} color="white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Progress */}
        <div className="love-card mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-[#2C3E50]">完成进度</span>
            <span className="text-sm font-black text-[#FF6B35]" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {progress}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ background: "linear-gradient(90deg, #FF6B35, #FFC800)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
          <p className="text-xs text-[#7f8c8d] mt-2">{done.length}/{wishes.length} 个愿望已实现</p>
        </div>

        {/* Todo */}
        <h3 className="font-bold text-[#2C3E50] text-sm mb-3">待实现</h3>
        <div className="space-y-2 mb-6">
          {todo.map((wish, i) => (
            <motion.div
              key={wish.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="love-card flex items-center gap-3"
            >
              <button
                onClick={() => toggleWish(wish.id)}
                className="w-7 h-7 rounded-lg border-2 border-[#d0d0d0] flex items-center justify-center flex-shrink-0"
              />
              <span className="text-xl">{wish.emoji}</span>
              <span className="font-semibold text-[#2C3E50] text-sm flex-1">{wish.title}</span>
            </motion.div>
          ))}
        </div>

        {/* Done */}
        {done.length > 0 && (
          <>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-3">已实现</h3>
            <div className="space-y-2 mb-6">
              {done.map((wish, i) => (
                <motion.div
                  key={wish.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="love-card flex items-center gap-3 opacity-60"
                >
                  <button
                    onClick={() => toggleWish(wish.id)}
                    className="w-7 h-7 rounded-lg bg-[#58CC02] flex items-center justify-center flex-shrink-0"
                  >
                    <Check size={14} color="white" strokeWidth={3} />
                  </button>
                  <span className="text-xl">{wish.emoji}</span>
                  <span className="font-semibold text-[#2C3E50] text-sm flex-1 line-through">{wish.title}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Mascot */}
        <div className="love-card bg-[#FFF0F3] border-[#FFD4DE] flex items-center gap-3">
          <img src={MASCOT.celebrate} alt="" className="w-12 h-12" />
          <p className="text-xs text-[#2C3E50]">
            <span className="font-bold">加油！</span> 一起实现更多甜蜜愿望吧~
          </p>
        </div>
      </div>
    </div>
  );
}
