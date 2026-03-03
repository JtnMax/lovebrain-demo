/*
 * TabBar - 底部导航栏
 * Jelly Pop 弹性美学 - 多邻国风格Tab切换
 */
import { useApp } from "@/contexts/AppContext";
import { Home, MessageCircle, Clock, Star, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "首页", screen: "home" as const },
  { icon: MessageCircle, label: "聊天", screen: "chat" as const },
  { icon: Clock, label: "历程", screen: "timeline" as const },
  { icon: Star, label: "收藏", screen: "collection" as const },
  { icon: User, label: "我的", screen: "profile" as const },
];

export default function TabBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="tab-bar">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === index;
        return (
          <button
            key={index}
            className={`tab-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            <motion.div
              animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="relative"
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "#FF6B8A" : "none"}
                color={isActive ? "#FF6B8A" : "#b0b0b0"}
              />
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF6B8A]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
            <span
              className="text-[10px] font-semibold mt-0.5"
              style={{ color: isActive ? "#FF6B8A" : "#b0b0b0" }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
