/*
 * TimelineScreen - 恋爱历程时间轴
 * 竖向倒序时间轴 · 左右双人动态 · 信号合并 · Jelly Pop 美学
 */
import { useApp, Gender, SignalEvent } from "@/contexts/AppContext";
import {
  MOCK_TIMELINE, COUPLE_INFO, MASCOT, THEME, USERS, MOCK_WISHES, MOCK_COLLECTIONS,
} from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import TabBar from "@/components/TabBar";
import {
  Plus, BookOpen, Gift, Image as ImageIcon, MessageCircle,
  Heart, Star, ChevronDown, ChevronUp, X
} from "lucide-react";
import { useState, useMemo } from "react";

/* ─── 类型 ─── */
type ActivityType = "diary" | "wish" | "photo" | "signal" | "signal-group" | "anniversary" | "milestone";

interface Activity {
  id: string;
  type: ActivityType;
  gender: Gender;
  timestamp: number;
  emoji: string;
  title: string;
  content?: string;
  count?: number;
  signals?: SignalEvent[];
}

/* ─── 工具 ─── */
const pad = (n: number) => String(n).padStart(2, "0");

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yest = new Date(today); yest.setDate(yest.getDate() - 1);
  const dn = new Date(d); dn.setHours(0, 0, 0, 0);
  if (dn.getTime() === today.getTime()) return "今天";
  if (dn.getTime() === yest.getTime()) return "昨天";
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ─── 信号合并（同一天同一发送者 → 合并） ─── */
function mergeSignalsByDay(sigs: SignalEvent[]): Activity[] {
  const map: Record<string, SignalEvent[]> = {};
  sigs.forEach((s) => {
    const key = `${formatDate(s.timestamp)}_${s.from}`;
    if (!map[key]) map[key] = [];
    map[key].push(s);
  });
  return Object.entries(map).map(([key, group]) => {
    if (group.length === 1) {
      const s = group[0];
      return {
        id: s.id,
        type: "signal" as const,
        gender: s.from,
        timestamp: s.timestamp,
        emoji: s.emoji,
        title: s.text,
        content: s.reply ? `TA 回复了：${s.reply.text || s.reply.emoji || ""}` : undefined,
      };
    }
    return {
      id: `grp_${key}`,
      type: "signal-group" as const,
      gender: group[0].from,
      timestamp: Math.max(...group.map((s) => s.timestamp)),
      emoji: "💌",
      title: `发送了 ${group.length} 条关心信号`,
      count: group.length,
      signals: group,
    };
  });
}

/* ─── 类型配置 ─── */
const TYPE_CONFIG: Record<ActivityType, { label: string; icon: React.ElementType; color: string }> = {
  diary:        { label: "日记",   icon: BookOpen,       color: "#4ECDC4" },
  wish:         { label: "愿望",   icon: Gift,           color: "#FF6B35" },
  photo:        { label: "图片",   icon: ImageIcon,      color: "#4A90D9" },
  signal:       { label: "信号",   icon: MessageCircle,  color: "#FF6B8A" },
  "signal-group":{ label: "信号",  icon: MessageCircle,  color: "#FF6B8A" },
  anniversary:  { label: "纪念日", icon: Heart,          color: "#FFC800" },
  milestone:    { label: "里程碑", icon: Star,           color: "#B8A9C9" },
};

/* ─── 活动卡片 ─── */
function ActivityCard({ activity, isLeft, primaryColor }: {
  activity: Activity;
  isLeft: boolean;
  primaryColor: string;
}) {
  const [open, setOpen] = useState(false);
  const cfg = TYPE_CONFIG[activity.type];
  const Icon = cfg.icon;
  const canExpand = activity.type === "signal-group" && (activity.signals?.length ?? 0) > 0;

  return (
    <div className={`flex ${isLeft ? "flex-row" : "flex-row-reverse"} items-start gap-2 mb-5`}>
      {/* 卡片 */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-[44%] love-card p-0 overflow-hidden"
        style={{ boxShadow: `0 3px 12px ${cfg.color}22` }}
      >
        {/* 顶部色条 */}
        <div className="h-1 w-full" style={{ background: cfg.color }} />

        <div className="p-3">
          {/* 标题行 */}
          <div className="flex items-start gap-2">
            <span className="text-xl leading-none mt-0.5">{activity.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#2C3E50] text-[13px] leading-tight">{activity.title}</p>
              {activity.content && (
                <p className="text-[11px] text-[#7f8c8d] mt-1 line-clamp-2 leading-relaxed">{activity.content}</p>
              )}
            </div>
          </div>

          {/* 底部：时间 + 标签 */}
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] text-[#b0b0b0]">{formatTime(activity.timestamp)}</span>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>

          {/* 展开按钮（仅信号组） */}
          {canExpand && (
            <button
              onClick={() => setOpen(!open)}
              className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded-xl"
              style={{ background: `${cfg.color}18`, color: cfg.color }}
            >
              {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {open ? "收起" : "查看详情"}
            </button>
          )}

          {/* 信号组展开列表 */}
          <AnimatePresence>
            {open && activity.signals && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 pt-2 border-t border-[#f0e6e0] space-y-1.5">
                  {activity.signals.map((sig) => (
                    <div key={sig.id} className="flex items-center justify-between">
                      <span className="text-[11px] text-[#2C3E50]">{sig.emoji} {sig.text}</span>
                      <span className="text-[9px] text-[#b0b0b0]">{formatTime(sig.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 中轴节点占位 */}
      <div className="w-[12%]" />
    </div>
  );
}

/* ─── 时间轴节点（中间圆点） ─── */
function TimelineNode({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
      <div className="w-3 h-3 rounded-full border-2 border-white" style={{ background: color, boxShadow: `0 0 0 3px ${color}33` }} />
      {pulse && (
        <motion.div
          className="absolute w-3 h-3 rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}

/* ─── 日期标签 ─── */
function DateLabel({ date, t }: { date: string; t: typeof THEME.female }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center justify-center my-5"
    >
      <div className="absolute left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${t.primary}40, transparent)` }} />
      <span
        className="relative z-10 text-[11px] font-bold px-3 py-1 rounded-full text-white"
        style={{ background: `linear-gradient(90deg, ${t.primary}, ${t.accent})` }}
      >
        {date}
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function TimelineScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, signals } = useApp();

  /* ── 整合全部动态 ── */
  const allActivities = useMemo<Activity[]>(() => {
    const list: Activity[] = [];
    const now = Date.now();

    // 里程碑 & 纪念日（MOCK_TIMELINE）
    MOCK_TIMELINE.forEach((item, i) => {
      list.push({
        id: `tl_${item.id}`,
        type: item.type as "milestone" | "anniversary",
        gender: i % 2 === 0 ? "female" : "male",
        timestamp: new Date(item.date).getTime(),
        emoji: item.emoji,
        title: item.title,
        content: item.content,
      });
    });

    // 模拟日记
    list.push({
      id: "diary_f1",
      type: "diary",
      gender: "female",
      timestamp: now - 2 * 86400000,
      emoji: "📝",
      title: "今天天气真好",
      content: "和你一起散步的时光最美好，风吹过来都是甜的",
    });
    list.push({
      id: "diary_m1",
      type: "diary",
      gender: "male",
      timestamp: now - 86400000,
      emoji: "📝",
      title: "想起你的笑容",
      content: "每次看到你笑，我都觉得世界变亮了",
    });

    // 已完成愿望
    MOCK_WISHES.filter((w) => w.done).forEach((w, i) => {
      list.push({
        id: `wish_${w.id}`,
        type: "wish",
        gender: i % 2 === 0 ? "female" : "male",
        timestamp: now - (12 - i) * 86400000,
        emoji: w.emoji,
        title: `完成了愿望：${w.title}`,
      });
    });

    // 相册图片
    MOCK_COLLECTIONS.filter((c) => c.type === "photo").forEach((p, i) => {
      list.push({
        id: `photo_${p.id}`,
        type: "photo",
        gender: i % 2 === 0 ? "female" : "male",
        timestamp: new Date(p.date).getTime(),
        emoji: "📸",
        title: p.title,
      });
    });

    // 信号（合并处理）
    const femSigs = signals.filter((s) => s.from === "female");
    const malSigs = signals.filter((s) => s.from === "male");
    list.push(...mergeSignalsByDay(femSigs), ...mergeSignalsByDay(malSigs));

    // 倒序
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [signals]);

  /* ── 按日期分组 ── */
  const groups = useMemo(() => {
    const map: Record<string, Activity[]> = {};
    allActivities.forEach((a) => {
      const key = formatDate(a.timestamp);
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    // 按最新时间戳排序 key
    return Object.entries(map).sort((a, b) => {
      const ta = a[1][0]?.timestamp ?? 0;
      const tb = b[1][0]?.timestamp ?? 0;
      return tb - ta;
    });
  }, [allActivities]);

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* ── Header ── */}
      <div
        className="px-4 pt-12 pb-3 flex items-center justify-between"
        style={{ background: t.bg }}
      >
        <div>
          <h1 className="text-2xl font-black text-[#2C3E50]">恋爱历程</h1>
          <p className="text-xs text-[#b0b0b0] mt-0.5">我们在一起 <span className="font-bold" style={{ color: t.primary }}>{COUPLE_INFO.daysInLove}</span> 天了 💕</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("diary-create", gender)}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`, boxShadow: `0 4px 14px ${t.primary}50` }}
        >
          <Plus size={20} color="white" />
        </motion.button>
      </div>

      {/* ── 双人头像横幅 ── */}
      <div className="px-4 mb-3">
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="love-card py-3 px-4 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${t.primary}18, ${t.accent}12)` }}
        >
          {/* 她 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: THEME.female.primary }}>
              <img src="/avatars/female_avatar.png" alt="小心心" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold" style={{ color: THEME.female.primary }}>小心心</span>
          </div>

          {/* 中间爱心 */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart size={22} fill={t.primary} color={t.primary} />
          </motion.div>

          {/* 他 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: THEME.male.primary }}>
              <img src="/avatars/male_avatar.png" alt="大宝贝" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold" style={{ color: THEME.male.primary }}>大宝贝</span>
          </div>
        </motion.div>
      </div>

      {/* ── 时间轴列标题 ── */}
      <div className="px-4 mb-1 flex justify-between text-[11px] font-bold">
        <span style={{ color: THEME.female.primary }}>♀ 小心心</span>
        <span style={{ color: THEME.male.primary }}>大宝贝 ♂</span>
      </div>

      {/* ── 时间轴主体 ── */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="relative px-4">
          {/* 中心竖线 */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: "50%",
              background: `linear-gradient(to bottom, ${t.primary}80, ${t.accent}80)`,
            }}
          />

          {/* 顶部"现在"标记 */}
          <div className="relative flex justify-center mb-4">
            <TimelineNode color={t.primary} pulse />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: t.primary, color: "white" }}
            >
              现在
            </motion.span>
          </div>

          {/* 按日期分组渲染 */}
          {groups.map(([dateKey, activities], gi) => (
            <div key={dateKey}>
              <DateLabel date={dateKey} t={t} />

              {activities.map((activity, ai) => {
                const isLeft = activity.gender === "female";
                return (
                  <div key={activity.id} className="relative">
                    {/* 中轴节点 */}
                    <div className="absolute top-3" style={{ left: "50%", transform: "translateX(-50%)" }}>
                      <div
                        className="w-2.5 h-2.5 rounded-full border-2 border-white"
                        style={{ background: TYPE_CONFIG[activity.type].color }}
                      />
                    </div>

                    {/* 卡片（左侧 female / 右侧 male） */}
                    <div className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-4`}>
                      <ActivityCard
                        activity={activity}
                        isLeft={isLeft}
                        primaryColor={t.primary}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* 空状态 */}
          {allActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center pt-24 gap-3"
            >
              <span className="text-5xl">💕</span>
              <p className="text-[#7f8c8d] text-sm font-semibold">还没有任何动态</p>
              <p className="text-[#b0b0b0] text-xs">一起创造更多美好回忆吧~</p>
            </motion.div>
          )}

          {/* 底部吉祥物 */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="love-card flex items-center gap-3 mt-6 mb-4"
            style={{ background: "#E8FFF8", borderColor: "#B8F0E4" }}
          >
            <img src={MASCOT.love} alt="" className="w-12 h-12" />
            <p className="text-xs text-[#2C3E50] leading-relaxed">
              <span className="font-bold">每一天都值得记录~</span><br />你们的故事正在被书写 ✨
            </p>
          </motion.div>
        </div>
      </div>

      <TabBar gender={gender} />
    </div>
  );
}
