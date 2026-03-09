/*
 * ProfileScreen - 个人资料/我的页面
 * Jelly Pop 弹性美学
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import {
  Settings, Calendar, Image, Heart, BookOpen,
  ChevronRight, Star, Shield, HelpCircle, LogOut, Award
} from "lucide-react";

const menuItems = [
  { icon: Calendar, label: "纪念日管理", screen: "anniversary" as const, color: "#FFC800" },
  { icon: Image, label: "相册", screen: "album" as const, color: "#4ECDC4" },
  { icon: BookOpen, label: "恋爱日记", screen: "diary-create" as const, color: "#FF6B8A" },
  { icon: Star, label: "愿望清单", screen: "wishes" as const, color: "#FF6B35" },
  { icon: Shield, label: "隐私设置", screen: "settings" as const, color: "#B8A9C9" },
  { icon: HelpCircle, label: "帮助与反馈", screen: "settings" as const, color: "#7f8c8d" },
];

export default function ProfileScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const user = gender === "female" ? USERS.female : USERS.male;
  const { navigate, toast } = useApp();

  return (
    <div className="h-full flex flex-col relative" style={{ background: t.bg }}>
      {/* Header with gradient */}
      <div className="pt-12 pb-4 px-4" style={{ background: `linear-gradient(to bottom, ${t.primaryLight}, ${t.bg})` }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#2C3E50]">我的</h1>
          <button onClick={() => navigate("settings", gender)} className="p-2">
            <Settings size={22} color="#2C3E50" />
          </button>
        </div>

        {/* Profile card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="love-card flex items-center gap-4"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-3"
              style={{ borderColor: t.primary }}
            />
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFC800] rounded-full border-2 border-white flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Award size={12} color="white" />
            </motion.div>
          </div>
          <div className="flex-1">
            <p className="font-black text-[#2C3E50] text-lg">{user.name}</p>
            <p className="text-xs text-[#7f8c8d]">@lovebrain · 2025-03-03 加入</p>
          </div>
          <ChevronRight size={20} color="#b0b0b0" />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="love-card"
        >
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: t.cardBorder }}>
            {[
              { value: COUPLE_INFO.daysInLove, label: "在一起天数", color: t.primary },
              { value: 42, label: "关心信号", color: "#FFC800" },
              { value: 18, label: "收藏数", color: "#4ECDC4" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center py-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              >
                <p className="text-2xl font-black" style={{ color: stat.color, fontFamily: "'Nunito', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-[#7f8c8d] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mascot prompt */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="love-card bg-[#E8FFF8] border-[#B8F0E4] flex items-center gap-3"
        >
          <motion.img
            src={MASCOT.waving}
            alt="吉祥物"
            className="w-14 h-14"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="flex-1">
            <p className="font-bold text-[#2C3E50] text-sm">完善你的档案！</p>
            <p className="text-xs text-[#7f8c8d]">还差 1 步就完成啦</p>
          </div>
          <button className="btn-jelly btn-jelly-green px-4 py-2 text-sm rounded-xl">
            继续
          </button>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="love-card p-0 overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => navigate(item.screen, gender)}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 active:bg-[#F7F3F0] transition-colors"
                style={{ borderColor: t.cardBorder }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}20` }}
                >
                  <Icon size={18} color={item.color} />
                </div>
                <span className="flex-1 text-left font-semibold text-[#2C3E50] text-sm">{item.label}</span>
                <ChevronRight size={16} color="#b0b0b0" />
              </motion.button>
            );
          })}
        </div>

        {/* End relationship */}
        <button
          onClick={() => navigate("end-relationship", gender)}
          className="w-full mt-4 love-card flex items-center gap-3 border-[#fde2e2]"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50">
            <LogOut size={18} color="#e74c3c" />
          </div>
          <span className="flex-1 text-left font-semibold text-[#e74c3c] text-sm">结束关系</span>
          <ChevronRight size={16} color="#e74c3c" />
        </button>
      </div>

      <TabBar gender={gender} />
    </div>
  );
}
