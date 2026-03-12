/*
 * SignalReceiveScreen - 信号历史列表页
 * - 默认展示当天所有收到/发送的信号
 * - 可按日期筛选某一天的信号
 * - 可只展示收到或发送的信号
 * - 支持按回复时间和发送时间排序
 * - 有回复的信号有图标注明
 * - 点击信号可查看详情及回复（接收方最多回复1次）
 */
import { useApp, Gender, SignalEvent, SignalReply } from "@/contexts/AppContext";
import { USERS, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Send, Filter, Calendar,
  ChevronDown, X, Clock, CheckCheck, Reply
} from "lucide-react";
import { useState, useMemo } from "react";

/* ─── 工具函数 ─── */
function isSameDay(ts: number, dateStr: string): boolean {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}` === dateStr;
}

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${formatTime(ts)}`;
}

/* ─── 信号详情弹窗 ─── */
function SignalDetailModal({
  signal, myGender, onClose, t
}: {
  signal: SignalEvent;
  myGender: Gender;
  onClose: () => void;
  t: typeof THEME.female;
}) {
  const [replyText, setReplyText] = useState("");
  const [replyMediaType, setReplyMediaType] = useState<SignalReply["mediaType"]>("text");
  const { toast, replyToSignal } = useApp();
  const isMine = signal.from === myGender;
  const hasReplied = !!signal.reply;
  const partner = myGender === "female" ? USERS.male : USERS.female;
  const partnerGender: Gender = myGender === "female" ? "male" : "female";

  const handleReply = () => {
    if (!replyText.trim()) return;
    replyToSignal(signal.id, { text: replyText, mediaType: replyMediaType });
    toast("回复已发送 💌", myGender);
    onClose();
  };

  const handleMediaReply = (type: SignalReply["mediaType"], label: string) => {
    replyToSignal(signal.id, { mediaType: type, text: label });
    toast(`${label}已发送`, myGender);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-4" />

        {/* 信号基本信息 */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-4xl">{signal.emoji}</span>
          <div className="flex-1">
            <p className="font-black text-[#2C3E50] text-lg">{signal.text}</p>
            <p className="text-xs text-[#7f8c8d] mt-0.5">
              {isMine ? "我发送的" : `${partner.name}发给你的`} · {formatDate(signal.timestamp)}
            </p>
          </div>
          <button onClick={onClose} className="p-1">
            <X size={18} color="#b0b0b0" />
          </button>
        </div>

        {/* 已有回复展示 */}
        {signal.reply && (
          <div className="mb-4 p-3 rounded-2xl" style={{ background: `${t.primary}12` }}>
            <div className="flex items-center gap-1 mb-1">
              <Reply size={12} color={t.primary} />
              <p className="text-xs font-bold" style={{ color: t.primary }}>
                {isMine ? `${partner.name}的回复` : "我的回复"}
              </p>
              <span className="text-[10px] text-[#b0b0b0] ml-auto">{formatTime(signal.reply.timestamp)}</span>
            </div>
            <p className="text-sm text-[#2C3E50]">
              {signal.reply.mediaType === "image" ? "📷 图片" :
               signal.reply.mediaType === "voice" ? "🎤 语音" :
               signal.reply.mediaType === "location" ? "📍 位置" :
               signal.reply.text || ""}
            </p>
          </div>
        )}

        {/* 回复区域（接收方且未回复过） */}
        {!isMine && !hasReplied && (
          <div className="mt-2">
            <p className="text-xs text-[#7f8c8d] mb-2 font-semibold">回复（每条信号仅限回复一次）</p>

            {/* 文本输入 */}
            <div className="flex gap-2 mb-2">
              <input
                value={replyText}
                onChange={(e) => { setReplyText(e.target.value); setReplyMediaType("text"); }}
                placeholder="说点什么..."
                className="flex-1 bg-[#f5f5f5] rounded-2xl px-4 py-2.5 text-sm outline-none text-[#2C3E50]"
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
              />
              <button
                onClick={handleReply}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
                style={{ background: replyText.trim() ? t.primary : "#e0e0e0" }}
              >
                <Send size={16} color="white" />
              </button>
            </div>

            {/* 表情快捷回复 */}
            <div className="flex gap-2 mb-3">
              {["❤️", "😊", "🥺", "👍", "😘", "🎉"].map((e) => (
                <button
                  key={e}
                  onClick={() => { setReplyText(e); setReplyMediaType("emoji"); }}
                  className={`text-xl p-1.5 rounded-xl transition-all ${replyText === e ? "bg-gray-100 scale-110" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>

            {/* 媒体类型回复 */}
            <div className="flex gap-2">
              {[
                { type: "image" as const, emoji: "🖼️", label: "图片" },
                { type: "voice" as const, emoji: "🎤", label: "语音" },
                { type: "location" as const, emoji: "📍", label: "位置" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleMediaReply(btn.type, `${btn.emoji} ${btn.label}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f5f5f5] text-[11px] text-[#7f8c8d] font-semibold active:scale-95 transition-transform"
                >
                  <span>{btn.emoji}</span>
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!isMine && hasReplied && (
          <p className="text-xs text-[#b0b0b0] text-center mt-2">已回复过该信号</p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── 信号列表项 ─── */
function SignalItem({
  signal, myGender, t, onClick
}: {
  signal: SignalEvent;
  myGender: Gender;
  t: typeof THEME.female;
  onClick: () => void;
}) {
  const isMine = signal.from === myGender;
  const partner = myGender === "female" ? USERS.male : USERS.female;
  const me = myGender === "female" ? USERS.female : USERS.male;
  const senderName = isMine ? "我" : partner.name;
  const sortTime = signal.reply ? signal.reply.timestamp : signal.timestamp;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="love-card flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      {/* 方向指示 */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: isMine ? `${t.primary}20` : `${t.primary}40` }}
      >
        <span className="text-lg">{signal.emoji}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-bold text-[#2C3E50]">{senderName}</span>
          {isMine ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full text-white" style={{ background: t.primary }}>发出</span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full text-white bg-[#7f8c8d]">收到</span>
          )}
          {signal.reply && (
            <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[#58CC02]/20 text-[#58CC02] font-semibold">
              <Reply size={8} />已回复
            </span>
          )}
        </div>
        <p className="text-xs text-[#7f8c8d] truncate">{signal.text}</p>
      </div>

      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <span className="text-[10px] text-[#b0b0b0]">{formatTime(sortTime)}</span>
        {signal.status === "read" ? (
          <CheckCheck size={12} color="#58CC02" />
        ) : signal.status === "delivered" ? (
          <CheckCheck size={12} color="#b0b0b0" />
        ) : (
          <Clock size={12} color="#b0b0b0" />
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function SignalReceiveScreen({ gender }: { gender: Gender }) {
  const { navigate, signals, markSignalRead } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const partnerGender: Gender = gender === "female" ? "male" : "female";

  /* ── 筛选状态 ── */
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [direction, setDirection] = useState<"all" | "received" | "sent">("all");
  const [sortBy, setSortBy] = useState<"reply" | "send">("reply");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<SignalEvent | null>(null);

  /* ── 筛选 & 排序逻辑 ── */
  const filteredSignals = useMemo(() => {
    let list = signals.filter((s) => {
      // 日期筛选
      if (!isSameDay(s.timestamp, selectedDate)) return false;
      // 收发筛选
      if (direction === "received" && s.to !== gender) return false;
      if (direction === "sent" && s.from !== gender) return false;
      return true;
    });

    // 排序
    list = [...list].sort((a, b) => {
      if (sortBy === "reply") {
        const aTime = a.reply ? a.reply.timestamp : a.timestamp;
        const bTime = b.reply ? b.reply.timestamp : b.timestamp;
        return bTime - aTime;
      } else {
        return b.timestamp - a.timestamp;
      }
    });

    return list;
  }, [signals, selectedDate, direction, sortBy, gender]);

  /* ── 获取有信号的日期列表（用于日期选择器提示） ── */
  const datesWithSignals = useMemo(() => {
    const set = new Set<string>();
    signals.forEach((s) => {
      const d = new Date(s.timestamp);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      set.add(str);
    });
    return set;
  }, [signals]);

  const handleSignalClick = (sig: SignalEvent) => {
    markSignalRead(sig.id);
    setSelectedSignal(sig);
  };

  const directionLabels = { all: "全部", received: "收到", sent: "发出" };
  const sortLabels = { reply: "回复时间", send: "发送时间" };

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* ── Header ── */}
      <div className="flex items-center px-4 pt-12 pb-3">
        <button onClick={() => navigate("home", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">信号历史</h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="p-2 relative"
        >
          <Filter size={20} color={showFilter ? t.primary : "#7f8c8d"} />
          {(direction !== "all" || sortBy !== "reply") && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: t.primary }} />
          )}
        </button>
      </div>

      {/* ── 筛选面板 ── */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-3 p-3 bg-white rounded-2xl shadow-sm border" style={{ borderColor: t.cardBorder }}>
              {/* 日期选择 */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} color={t.primary} />
                <span className="text-xs font-bold text-[#2C3E50]">日期</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="ml-auto text-xs border rounded-lg px-2 py-1 outline-none"
                  style={{ borderColor: t.cardBorder, color: t.primary }}
                  max={todayStr()}
                />
              </div>

              {/* 收发筛选 */}
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={14} color={t.primary} />
                <span className="text-xs font-bold text-[#2C3E50]">类型</span>
                <div className="ml-auto flex gap-1">
                  {(["all", "received", "sent"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDirection(d)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                      style={direction === d ? { background: t.primary, color: "white" } : { background: "#f5f5f5", color: "#7f8c8d" }}
                    >
                      {directionLabels[d]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 排序方式 */}
              <div className="flex items-center gap-2">
                <Clock size={14} color={t.primary} />
                <span className="text-xs font-bold text-[#2C3E50]">排序</span>
                <div className="ml-auto flex gap-1">
                  {(["reply", "send"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                      style={sortBy === s ? { background: t.primary, color: "white" } : { background: "#f5f5f5", color: "#7f8c8d" }}
                    >
                      {sortLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 当前筛选状态摘要 ── */}
      <div className="flex items-center gap-2 px-4 mb-2">
        <span className="text-[11px] text-[#7f8c8d]">
          {selectedDate === todayStr() ? "今天" : selectedDate} · {directionLabels[direction]} · 按{sortLabels[sortBy]}排序
        </span>
        <span className="text-[11px] font-bold ml-auto" style={{ color: t.primary }}>
          {filteredSignals.length} 条
        </span>
      </div>

      {/* ── 信号列表 ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
        {filteredSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <span className="text-5xl mb-4">💌</span>
            <p className="text-[#7f8c8d] text-sm">
              {selectedDate === todayStr() ? "今天还没有信号记录" : `${selectedDate} 没有信号记录`}
            </p>
            <p className="text-[#b0b0b0] text-xs mt-1">
              {direction !== "all" ? `切换到「全部」可查看更多` : "去发送一条关心信号吧~"}
            </p>
          </div>
        ) : (
          filteredSignals.map((sig, i) => (
            <motion.div
              key={sig.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <SignalItem
                signal={sig}
                myGender={gender}
                t={t}
                onClick={() => handleSignalClick(sig)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* ── 信号详情弹窗 ── */}
      <AnimatePresence>
        {selectedSignal && (
          <SignalDetailModal
            signal={selectedSignal}
            myGender={gender}
            onClose={() => setSelectedSignal(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
