/*
 * ProfileScreen - 个人资料/我的页面
 * Jelly Pop 弹性美学 - 2.0 升级版
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import {
  Settings, ChevronRight, Shield, HelpCircle, Heart, Award,
  Sparkles, Zap, Star, Clock, UserPlus, HeartOff
} from "lucide-react";

const menuItems = [
  { icon: Shield, label: "隐私与安全", screen: "settings" as const, color: "#4A90D9", bg: "#EBF3FC" },
  { icon: HelpCircle, label: "帮助与反馈", screen: "settings" as const, color: "#7f8c8d", bg: "#f5f5f5" },
];

export default function ProfileScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const user = gender === "female" ? USERS.female : USERS.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const { navigate } = useApp();

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: t.bg }}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: t.primary }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute -top-10 -left-20 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: t.accent }}
        />
      </div>

      {/* Header */}
      <div className="pt-12 pb-6 px-6 z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">个人中心</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("settings", gender)}
            className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-white"
          >
            <Settings size={20} color="#2C3E50" />
          </motion.button>
        </div>

        {/* Profile Card 2.0 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 shadow-xl border-2 border-white relative overflow-hidden"
        >
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-40" style={{ background: t.primary }} />
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white relative z-10"
              />
              <motion.div
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FFC800] rounded-full border-2 border-white flex items-center justify-center z-20 shadow-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award size={14} color="white" />
              </motion.div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-[#2C3E50] text-xl">{user.name}</p>
                <span className="px-2 py-0.5 bg-[#f0f0f0] rounded-full text-[10px] font-bold text-[#7f8c8d]">LV.12</span>
              </div>
              <p className="text-xs text-[#7f8c8d] font-medium">爱意值: 999+ · 守护者</p>
            </div>
            <ChevronRight size={20} color="#b0b0b0" />
          </div>

          {/* Couple Mini Info */}
          <div className="mt-6 pt-5 border-t border-dashed border-[#eee] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="" />
                <img src={partner.avatar} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="" />
              </div>
              <p className="text-xs font-bold text-[#2C3E50]">与 {partner.name} 绑定中</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] rounded-full">
              <Heart size={10} fill={t.primary} color={t.primary} />
              <span className="text-[10px] font-black text-[#2C3E50]">{COUPLE_INFO.daysInLove}天</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap, value: "42", label: "关心信号", color: "#FFC800", bg: "#FFFBEA" },
            { icon: Star, value: "18", label: "收藏足迹", color: "#4ECDC4", bg: "#E8FFFC" },
            { icon: Clock, value: "12", label: "连续互动", color: "#FF6B8A", bg: "#FFF0F3" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-3xl p-3 text-center border-2 border-white shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: stat.bg }}>
                <stat.icon size={16} color={stat.color} />
              </div>
              <p className="text-lg font-black text-[#2C3E50]">{stat.value}</p>
              <p className="text-[10px] font-bold text-[#7f8c8d]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Menu Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        {/* Profile Completion Card - Active Style */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="btn-jelly btn-jelly-green rounded-[28px] p-5 mb-6 relative overflow-hidden shadow-lg flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Sparkles size={24} color="white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-[#2C3E50] text-base">完善你的档案！</p>
            <p className="text-xs text-[#7f8c8d]">还差 1 步就完成啦</p>
          </div>
          <button
            onClick={() => navigate("onboarding", gender)}
            className="btn-jelly btn-jelly-green px-4 py-2 text-sm rounded-xl"
          >
            继续
          </button>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-black text-[#7f8c8d] px-2 uppercase tracking-widest mb-2">系统设置</p>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                onClick={() => navigate(item.screen, gender)}
                className="w-full bg-white rounded-2xl flex items-center gap-4 p-4 text-left shadow-sm border-2 border-white active:scale-[0.98] transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <Icon size={18} color={item.color} />
                </div>
                <span className="flex-1 font-bold text-[#2C3E50]">{item.label}</span>
                <ChevronRight size={18} color="#b0b0b0" />
              </motion.button>
            );
          })}
        </div>

        {/* Info Tip */}
        <div className="p-4 bg-[#f5f5f5] rounded-2xl text-center mb-6">
          <p className="text-[10px] font-bold text-[#7f8c8d] leading-relaxed">
            💡 纪念日、相册、日记、愿望等功能已移至首页「更多」面板，保持你的个人中心简洁清爽。
          </p>
        </div>

        {/* End Relationship - Cold/Heartless Style */}
        <button
          onClick={() => navigate("end-relationship", gender)}
          className="w-full py-4 px-6 rounded-2xl flex items-center gap-3 border-2 border-dashed border-[#d0d0d0] group active:bg-gray-50 transition-all"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors">
            <HeartOff size={16} color="#a0a0a0" className="group-hover:scale-90 transition-transform" />
          </div>
          <span className="flex-1 font-bold text-[#a0a0a0] text-sm">结束关系</span>
          <ChevronRight size={16} color="#a0a0a0" className="opacity-40" />
        </button>
        
        <p className="text-center text-[10px] text-[#b0b0b0] mt-8 mb-4 font-medium">
          LoveBrain v1.2.0 · 让爱更有温度
        </p>
      </div>

      {/* TabBar */}
      <TabBar gender={gender} />
    </div>
  );
}
