/*
 * BindScreen - 关系绑定页
 * 生成邀请码/二维码，等待对方绑定 + 绑定成功确认
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, QrCode, Share2, UserPlus, Heart } from "lucide-react";
import { useState } from "react";

export default function BindScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const me = gender === "female" ? USERS.female : USERS.male;
  const { navigate, bind, toast } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const inviteCode = "LOVE-2026-XOXO";

  const handleBind = () => {
    setShowConfirm(true);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      <AnimatePresence mode="wait">
        {!showConfirm ? (
          <motion.div
            key="invite"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center px-4 pt-12 pb-4">
              <button onClick={() => navigate("login", gender)} className="p-2">
                <ArrowLeft size={24} color="#2C3E50" />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">绑定另一半</h2>
              <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col items-center px-6 pt-2 overflow-y-auto">
              {/* Mascot */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-4"
              >
                <motion.img
                  src={MASCOT.love}
                  alt=""
                  className="w-28 h-28"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-[#7f8c8d] text-center mb-5"
              >
                分享邀请码给你的另一半，开始甜蜜之旅
              </motion.p>

              {/* Invite code card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="love-card w-full text-center py-5 mb-3 relative overflow-hidden"
              >
                <div className="absolute top-2 right-4 text-lg" style={{ color: t.accent, opacity: 0.4 }}>♥</div>
                <div className="absolute bottom-2 left-4 text-sm" style={{ color: t.accent, opacity: 0.3 }}>♥</div>
                <p className="text-xs text-[#7f8c8d] mb-2">你的邀请码</p>
                <p
                  className="text-3xl font-black tracking-widest"
                  style={{ fontFamily: "'Nunito', sans-serif", color: t.primary }}
                >
                  {inviteCode}
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => toast("邀请码已复制", gender)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: t.primaryLight }}
                  >
                    <Copy size={14} color={t.primary} />
                    <span className="text-xs font-semibold" style={{ color: t.primary }}>复制</span>
                  </button>
                  <button
                    onClick={() => toast("分享链接已生成", gender)}
                    className="flex items-center gap-2 bg-[#E8FFF8] px-4 py-2 rounded-full"
                  >
                    <Share2 size={14} color="#4ECDC4" />
                    <span className="text-xs font-semibold text-[#4ECDC4]">分享</span>
                  </button>
                </div>
              </motion.div>

              {/* QR Code placeholder */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="love-card w-full flex flex-col items-center py-5 mb-3"
              >
                <div className="w-32 h-32 bg-[#F7F3F0] rounded-2xl flex items-center justify-center mb-3 border-2 border-dashed" style={{ borderColor: t.cardBorder }}>
                  <div className="text-center">
                    <QrCode size={48} color="#b0b0b0" />
                    <p className="text-[10px] text-[#b0b0b0] mt-1">扫码绑定</p>
                  </div>
                </div>
                <p className="text-xs text-[#7f8c8d]">让TA扫描二维码快速绑定</p>
              </motion.div>

              {/* Or input code */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px" style={{ background: t.cardBorder }} />
                  <span className="text-xs text-[#b0b0b0]">或者</span>
                  <div className="flex-1 h-px" style={{ background: t.cardBorder }} />
                </div>
                <div className="love-card flex items-center gap-3">
                  <UserPlus size={18} color="#7f8c8d" />
                  <input
                    type="text"
                    placeholder="输入对方的邀请码"
                    className="flex-1 bg-transparent outline-none text-[#2C3E50] placeholder-[#b0b0b0] text-sm"
                  />
                  <button
                    onClick={handleBind}
                    className="text-white text-xs font-bold px-4 py-2 rounded-full"
                    style={{ background: t.primary }}
                  >
                    绑定
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Bottom */}
            <div className="px-6 pb-8 space-y-3">
              <button
                className="w-full py-4 text-base rounded-2xl flex items-center justify-center gap-2 text-white font-bold"
                style={{ background: t.primary, boxShadow: `0 5px 0 ${t.primaryDark}` }}
                onClick={() => toast("分享链接已复制", gender)}
              >
                <Share2 size={18} />
                分享给TA
              </button>
              <button
                className="w-full py-3 text-sm rounded-2xl bg-white border-2 font-bold text-[#2C3E50]"
                style={{ borderColor: t.cardBorder, boxShadow: `0 4px 0 ${t.cardBorder}` }}
                onClick={handleBind}
              >
                模拟绑定成功
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="h-full flex flex-col items-center justify-center px-6"
          >
            <motion.img
              src={MASCOT.celebrate}
              alt=""
              className="w-32 h-32 mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            <h2 className="text-2xl font-black text-[#2C3E50] mb-2">绑定成功！</h2>
            <p className="text-[#7f8c8d] text-center mb-6">
              你和 {partner.name} 已成功绑定
            </p>

            <div className="love-card flex items-center gap-4 w-full mb-8">
              <img src={me.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: t.primary }} />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart size={20} color={t.primary} fill={t.primary} />
              </motion.div>
              <img src={partner.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: THEME.shared.mint }} />
              <div className="flex-1 text-right">
                <p className="font-bold text-[#2C3E50] text-sm">{partner.name}</p>
                <p className="text-xs font-semibold" style={{ color: THEME.shared.green }}>已绑定</p>
              </div>
            </div>

            <button
              className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl"
              onClick={() => bind(gender)}
            >
              开始设置
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
