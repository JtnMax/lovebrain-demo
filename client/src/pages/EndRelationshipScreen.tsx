/*
 * EndRelationshipScreen - 结束关系页
 * 冷静期说明 + 确认流程 + 吉祥物安慰
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle, Clock, Shield, Heart } from "lucide-react";
import { useState } from "react";

export default function EndRelationshipScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, toast } = useApp();
  const [step, setStep] = useState(0); // 0: info, 1: confirm, 2: cooling

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("profile", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">结束关系</h2>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            {/* Mascot */}
            <div className="flex flex-col items-center mb-6">
              <motion.img
                src={MASCOT.thinking}
                alt=""
                className="w-28 h-28 mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-xl font-black text-[#2C3E50] mb-2">确定要结束吗？</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed">
                我们理解你的决定，但希望你能再想想
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-3 mb-6">
              <div className="love-card flex items-start gap-3 bg-[#FFF8E1] border-[#FFE082]">
                <Clock size={20} color="#FFC800" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2C3E50] text-sm">72小时冷静期</p>
                  <p className="text-xs text-[#7f8c8d] mt-1 leading-relaxed">
                    提交申请后，将进入72小时冷静期。期间双方均可撤回申请。
                  </p>
                </div>
              </div>
              <div className="love-card flex items-start gap-3 bg-[#E8FFF8] border-[#B8F0E4]">
                <Shield size={20} color="#4ECDC4" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2C3E50] text-sm">数据保护</p>
                  <p className="text-xs text-[#7f8c8d] mt-1 leading-relaxed">
                    你的个人数据将被安全保留。共享内容将按照隐私政策处理。
                  </p>
                </div>
              </div>
              <div className="love-card flex items-start gap-3 bg-[#FFF0F3] border-[#FFD4DE]">
                <Heart size={20} color="#FF6B8A" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2C3E50] text-sm">回忆保存</p>
                  <p className="text-xs text-[#7f8c8d] mt-1 leading-relaxed">
                    你可以选择导出所有恋爱日记和照片，珍贵回忆不会丢失。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <div className="space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl text-lg font-bold border-2 border-[#e74c3c] text-[#e74c3c] bg-white"
              >
                我想好了
              </button>
              <button
                onClick={() => navigate("home", gender)}
                className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl"
              >
                再想想 💕
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={36} color="#e74c3c" />
              </div>
              <h3 className="text-xl font-black text-[#2C3E50] mb-2">最终确认</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed">
                点击确认后将进入72小时冷静期
              </p>
            </div>

            {/* Current partner */}
            <div className="love-card flex items-center gap-3 mb-4">
              <img
                src={USERS.male.avatar}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-[#2C3E50] text-sm">{USERS.male.name}</p>
                <p className="text-xs text-[#7f8c8d]">在一起 {COUPLE_INFO.daysInLove} 天</p>
              </div>
            </div>

            {/* Reason selection */}
            <div className="space-y-2 mb-6">
              <p className="text-sm font-bold text-[#2C3E50] mb-2">请选择原因（可选）</p>
              {["感情淡了", "距离太远", "性格不合", "其他原因"].map((reason) => (
                <button
                  key={reason}
                  className="w-full love-card text-left text-sm text-[#2C3E50] active:bg-[#FFF0F3] transition-colors"
                  onClick={() => toast(`已选择: ${reason}`)}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <div className="space-y-3">
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl text-lg font-bold bg-[#e74c3c] text-white"
              >
                确认提交
              </button>
              <button
                onClick={() => setStep(0)}
                className="w-full py-3 text-[#7f8c8d] font-semibold"
              >
                返回
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="cooling"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <motion.img
              src={MASCOT.love}
              alt=""
              className="w-28 h-28 mb-6"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h3 className="text-xl font-black text-[#2C3E50] mb-2">冷静期已开始</h3>
            <p className="text-sm text-[#7f8c8d] text-center mb-6 leading-relaxed">
              72小时后如双方未撤回，关系将正式结束
            </p>

            {/* Timer */}
            <div className="love-card bg-[#FFF0F3] border-[#FFD4DE] w-full text-center py-6">
              <p className="text-4xl font-black text-[#FF6B8A]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                71:59:59
              </p>
              <p className="text-xs text-[#7f8c8d] mt-2">剩余冷静时间</p>
            </div>

            <button
              onClick={() => {
                toast("已撤回申请！", gender);
                setTimeout(() => navigate("home", gender), 1000);
              }}
              className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl mt-6"
            >
              撤回申请 💕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
