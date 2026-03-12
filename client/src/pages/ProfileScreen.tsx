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
          className="love-card flex items-center gap-3 p-4"
        >
          <img src={MASCOT.love} alt="mascot" className="w-12 h-12" />
          <div className="flex-1">
            <p className="font-bold text-[#2C3E50] text-sm">完善你的档案</p>
            <p className="text-xs text-[#7f8c8d]">让 TA 更了解你</p>
          </div>
          <button
            onClick={() => navigate("onboarding", gender)}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all"
            style={{ background: t.primary }}
          >
            去设置
          </button>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={() => navigate(item.screen, gender)}
                className="w-full love-card flex items-center gap-3 p-4 text-left group hover:shadow-lg transition-all"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: item.color }}
                >
                  <Icon size={18} color="white" />
                </div>
                <span className="flex-1 font-semibold text-[#2C3E50]">{item.label}</span>
                <ChevronRight size={18} color="#b0b0b0" />
              </motion.button>
            );
          })}
        </div>

        {/* Tip: Other features in Home More */}
        <div className="mt-6 p-4 bg-[#f5f5f5] rounded-2xl text-center">
          <p className="text-xs text-[#7f8c8d]">
            💡 纪念日、相册、日记、愿望等功能已移至首页「更多」面板
          </p>
        </div>

        {/* End relationship */}
        <button
          onClick={() => navigate("end-relationship", gender)}
          className="w-full mt-4 love-card flex items-center gap-3 border-[#fde2e2]"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50">
            <Heart size={16} color="#FF6B8A" />
          </div>
          <span className="flex-1 font-semibold text-[#FF6B8A]">结束关系</span>
          <ChevronRight size={18} color="#b0b0b0" />
        </button>
      </div>

      {/* TabBar */}
      <TabBar gender={gender} />
    </div>
  );
}
