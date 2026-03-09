/*
 * TabBar - 底部导航栏
 * 支持双人主题色
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { THEME } from "@/lib/constants";
import { Home, MessageCircle, Clock, Star, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "首页", screen: "home" as const },
  { icon: MessageCircle, label: "聊天", screen: "chat" as const },
  { icon: Clock, label: "历程", screen: "timeline" as const },
  { icon: Star, label: "收藏", screen: "collection" as const },
  { icon: User, label: "我的", screen: "profile" as const },
];

export default function TabBar({ gender }: { gender?: Gender }) {
  const { femaleState, maleState, activeGender, setActiveTab } = useApp();
  const g = gender || activeGender;
  const state = g === "female" ? femaleState : maleState;
  const theme = g === "female" ? THEME.female : THEME.male;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-white border-t flex items-center justify-around px-2 z-40" style={{ borderColor: theme.cardBorder }}>
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = state.activeTab === index;
        return (
          <button
            key={index}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            onClick={() => setActiveTab(index, g)}
          >
            <motion.div
              animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="relative"
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? theme.primary : "none"}
                color={isActive ? theme.primary : "#b0b0b0"}
              />
              {isActive && (
                <motion.div
                  layoutId={`tab-indicator-${g}`}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: theme.primary }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
            <span
              className="text-[10px] font-semibold mt-0.5"
              style={{ color: isActive ? theme.primary : "#b0b0b0" }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
