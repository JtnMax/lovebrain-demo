/*
 * CosmosLetterScreen - 宇宙来信（星座运势）
 * 我/TA 切换 + 今日运势 + 相处建议 + 匹配度
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { COSMOS_DATA, USERS, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Heart, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function CosmosLetterScreen({ gender }: { gender: Gender }) {
  const { navigate } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const [viewTarget, setViewTarget] = useState<"me" | "partner">("me");
  const [activeSection, setActiveSection] = useState<"today" | "week" | "match">("today");

  const meData = gender === "female" ? COSMOS_DATA.female : COSMOS_DATA.male;
  const partnerData = gender === "female" ? COSMOS_DATA.male : COSMOS_DATA.female;
  const currentData = viewTarget === "me" ? meData : partnerData;
  const me = gender === "female" ? USERS.female : USERS.male;
  const partner = gender === "female" ? USERS.male : USERS.female;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0f0c29] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-3 relative z-10">
        <button onClick={() => navigate("home", gender)} className="p-2">
          <ArrowLeft size={24} color="white" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-white">宇宙来信</h2>
        <div className="w-10" />
      </div>

      {/* Me / Partner toggle */}
      <div className="px-4 mb-4 relative z-10">
        <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <button
            onClick={() => setViewTarget("me")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewTarget === "me" ? "bg-white/20 text-white" : "text-white/50"
            }`}
          >
            <img src={me.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
            我（{me.zodiac}）
          </button>
          <button
            onClick={() => setViewTarget("partner")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewTarget === "partner" ? "bg-white/20 text-white" : "text-white/50"
            }`}
          >
            <img src={partner.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
            TA（{partner.zodiac}）
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 relative z-10 space-y-4">
        {/* Zodiac card */}
        <motion.div
          key={viewTarget}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-center"
        >
          <motion.div
            className="text-5xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {currentData.emoji}
          </motion.div>
          <h3 className="text-white font-black text-xl">{currentData.zodiac}</h3>
          <p className="text-white/50 text-xs mt-1">{currentData.element}星座</p>

          {/* Scores */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Heart size={14} color="#FF6B8A" fill="#FF6B8A" />
                <span className="text-white font-black text-lg" style={{ fontFamily: "'Nunito'" }}>{currentData.loveScore}</span>
              </div>
              <p className="text-white/40 text-[10px]">恋爱指数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Sparkles size={14} color="#FFC800" />
                <span className="text-white font-black text-lg" style={{ fontFamily: "'Nunito'" }}>{currentData.moodScore}</span>
              </div>
              <p className="text-white/40 text-[10px]">心情指数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star size={14} color="#4ECDC4" fill="#4ECDC4" />
                <span className="text-white font-black text-lg" style={{ fontFamily: "'Nunito'" }}>{currentData.luckyNumber}</span>
              </div>
              <p className="text-white/40 text-[10px]">幸运数字</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs text-white/60">幸运色</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white font-semibold">{currentData.luckyColor}</span>
          </div>
        </motion.div>

        {/* Section tabs */}
        <div className="flex gap-2">
          {[
            { key: "today" as const, label: "今日运势", icon: Star },
            { key: "week" as const, label: "本周预测", icon: TrendingUp },
            { key: "match" as const, label: "匹配度", icon: Heart },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeSection === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/40"
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeSection === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <Sparkles size={14} color="#FFC800" /> 今日运势
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">{currentData.todayFortune}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <Heart size={14} color="#FF6B8A" /> 相处建议
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">{currentData.coupleAdvice}</p>
              </div>
            </motion.div>
          )}

          {activeSection === "week" && (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <TrendingUp size={14} color="#4ECDC4" /> 本周预测
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">{currentData.weekFortune}</p>
              </div>
            </motion.div>
          )}

          {activeSection === "match" && (
            <motion.div
              key="match"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="text-center">
                    <img src={me.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/30 mx-auto" />
                    <p className="text-white/60 text-[10px] mt-1">{me.zodiac}</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart size={24} color="#FF6B8A" fill="#FF6B8A" />
                  </motion.div>
                  <div className="text-center">
                    <img src={partner.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/30 mx-auto" />
                    <p className="text-white/60 text-[10px] mt-1">{partner.zodiac}</p>
                  </div>
                </div>
                <p className="text-4xl font-black text-white" style={{ fontFamily: "'Nunito'" }}>
                  {COSMOS_DATA.compatibility.score}%
                </p>
                <p className="text-white/60 text-xs mt-1">{COSMOS_DATA.compatibility.summary}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-white/80 text-sm leading-relaxed mb-3">{COSMOS_DATA.compatibility.detail}</p>
                <div className="space-y-2">
                  {COSMOS_DATA.compatibility.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#FFC800] text-xs mt-0.5">✦</span>
                      <p className="text-white/70 text-xs">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
