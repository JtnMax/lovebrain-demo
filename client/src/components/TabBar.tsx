/*
 * TabBar - 底部导航栏（可配置版）
 * - 默认仅保留：首页、历程、我的
 * - 用户可通过「更多」面板中的「编辑」按钮配置其他功能模块
 * - 固定项（首页/历程/我的）不可移除
 * - 最少 3 项，最多 6 项
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { THEME } from "@/lib/constants";
import { Home, Clock, User, MessageCircle, Star, Image, Gift, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ─── 所有可用模块定义 ─── */
export const ALL_TAB_MODULES = [
  { id: "home",        icon: Home,          label: "首页",   screen: "home"          as const, fixed: true  },
  { id: "timeline",    icon: Clock,         label: "历程",   screen: "timeline"      as const, fixed: true  },
  { id: "profile",     icon: User,          label: "我的",   screen: "profile"       as const, fixed: true  },
  { id: "chat",        icon: MessageCircle, label: "聊天",   screen: "chat"          as const, fixed: false },
  { id: "collection",  icon: Star,          label: "收藏",   screen: "collection"    as const, fixed: false },
  { id: "album",       icon: Image,         label: "相册",   screen: "album"         as const, fixed: false },
  { id: "wishes",      icon: Gift,          label: "愿望",   screen: "wishes"        as const, fixed: false },
  { id: "diary",       icon: BookOpen,      label: "日记",   screen: "diary-create"  as const, fixed: false },
  { id: "cosmos",      icon: Sparkles,      label: "星座",   screen: "cosmos-letter" as const, fixed: false },
] as const;

type TabModuleId = typeof ALL_TAB_MODULES[number]["id"];

/* ─── 默认激活的导航项（固定3项） ─── */
const DEFAULT_ACTIVE_IDS: TabModuleId[] = ["home", "timeline", "profile"];

/* ─── 导航栏编辑弹窗 ─── */
function TabEditModal({
  activeIds,
  onSave,
  onClose,
  t,
}: {
  activeIds: TabModuleId[];
  onSave: (ids: TabModuleId[]) => void;
  onClose: () => void;
  t: typeof THEME.female;
}) {
  const [selected, setSelected] = useState<TabModuleId[]>(activeIds);

  const toggle = (id: TabModuleId) => {
    const mod = ALL_TAB_MODULES.find((m) => m.id === id)!;
    if (mod.fixed) return; // 固定项不可操作
    if (selected.includes(id)) {
      if (selected.length <= 3) return; // 最少3项
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= 6) return; // 最多6项
      setSelected([...selected, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28 }}
        className="w-full bg-white rounded-t-3xl p-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-4" />
        <h3 className="font-black text-[#2C3E50] text-lg mb-1">编辑导航栏</h3>
        <p className="text-xs text-[#7f8c8d] mb-4">
          已选 {selected.length}/6 · 最少 3 项 · 首页/历程/我的不可移除
        </p>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {ALL_TAB_MODULES.map((mod) => {
            const ModIcon = mod.icon;
            const isSelected = selected.includes(mod.id);
            const isFixed = mod.fixed;
            return (
              <motion.button
                key={mod.id}
                onClick={() => toggle(mod.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all relative ${
                  isFixed ? "opacity-70 cursor-default" : "cursor-pointer"
                }`}
                style={{
                  borderColor: isSelected ? t.primary : "#e8e8e8",
                  background: isSelected ? `${t.primary}12` : "white",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: isSelected ? t.primary : "#f5f5f5" }}
                >
                  <ModIcon size={20} color={isSelected ? "white" : "#b0b0b0"} />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: isSelected ? t.primary : "#7f8c8d" }}>
                  {mod.label}
                </span>
                {isFixed && (
                  <div className="absolute -top-1 -right-1 bg-[#FFC800] rounded-full w-4 h-4 flex items-center justify-center">
                    <span className="text-[8px] text-white font-black">固</span>
                  </div>
                )}
                {isSelected && !isFixed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: t.primary }}
                  >
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={() => { onSave(selected); onClose(); }}
          className="w-full py-4 rounded-2xl text-white font-black text-base"
          style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }}
        >
          保存配置
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function TabBar({ gender, onEditTabs, externalEditOpen, onExternalEditClose }: { gender?: Gender; onEditTabs?: () => void; externalEditOpen?: boolean; onExternalEditClose?: () => void }) {
  const { femaleState, maleState, activeGender, navigate, setActiveTab } = useApp();
  const g = gender || activeGender;
  const state = g === "female" ? femaleState : maleState;
  const theme = g === "female" ? THEME.female : THEME.male;

  const [activeTabIds, setActiveTabIds] = useState<TabModuleId[]>(DEFAULT_ACTIVE_IDS);
  const [_showEditModal, _setShowEditModal] = useState(false);
  const showEditModal = externalEditOpen !== undefined ? externalEditOpen : _showEditModal;
  const setShowEditModal = (v: boolean) => {
    _setShowEditModal(v);
    if (!v && onExternalEditClose) onExternalEditClose();
  };

  const activeTabs = activeTabIds
    .map((id) => ALL_TAB_MODULES.find((m) => m.id === id)!)
    .filter(Boolean);

  const handleTabPress = (tab: typeof ALL_TAB_MODULES[number], index: number) => {
    setActiveTab(index, g);
    navigate(tab.screen, g);
  };

  const isTabActive = (tab: typeof ALL_TAB_MODULES[number]) => {
    return state.currentScreen === tab.screen;
  };

  return (
    <>
      <AnimatePresence>
        {showEditModal && (
          <TabEditModal
            activeIds={activeTabIds}
            onSave={(ids) => setActiveTabIds(ids)}
            onClose={() => setShowEditModal(false)}
            t={theme}
          />
        )}
      </AnimatePresence>

      <div
        className="absolute bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around px-2 z-40"
        style={{ borderColor: theme.cardBorder, height: "70px" }}
      >
        {activeTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab);
          return (
            <button
              key={tab.id}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              onClick={() => handleTabPress(tab, index)}
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

        {/* 编辑按钮（如果导航项少于6个，显示一个+号） */}
        {activeTabIds.length < 6 && (
          <button
            onClick={() => setShowEditModal(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          >
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#d0d0d0] flex items-center justify-center">
              <span className="text-[#b0b0b0] text-sm font-bold leading-none">+</span>
            </div>
            <span className="text-[10px] font-semibold text-[#d0d0d0]">更多</span>
          </button>
        )}
      </div>
    </>
  );
}
