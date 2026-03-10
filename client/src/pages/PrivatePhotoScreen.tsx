/*
 * PrivatePhotoScreen - 私密图片查看页
 * 按住查看、松手销毁 / 超过 5s 自动销毁
 * SRS UC-IM-003: 私密图片（按住查看→销毁）
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { THEME, USERS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Lock, Eye, EyeOff, AlertTriangle, Flame } from "lucide-react";

// 模拟私密图片（Demo 用占位图）
const DEMO_PRIVATE_IMAGES = [
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop",
];

const MAX_VIEW_SECONDS = 5;

type ViewState = "idle" | "viewing" | "destroyed";

export default function PrivatePhotoScreen({ gender }: { gender: Gender }) {
  const { navigate, goBack } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const partner = gender === "female" ? USERS.male : USERS.female;

  const [viewState, setViewState] = useState<ViewState>("idle");
  const [countdown, setCountdown] = useState(MAX_VIEW_SECONDS);
  const [progress, setProgress] = useState(0); // 0-100
  const [isPressed, setIsPressed] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const demoImageIndex = useRef(Math.floor(Math.random() * DEMO_PRIVATE_IMAGES.length));

  // 清理定时器
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  // 销毁图片
  const destroyImage = useCallback(() => {
    clearTimers();
    setIsPressed(false);
    setViewState("destroyed");
    setProgress(100);
  }, [clearTimers]);

  // 开始查看（按下）
  const startViewing = useCallback(() => {
    if (viewState === "destroyed") return;
    setViewState("viewing");
    setIsPressed(true);
    startTimeRef.current = Date.now();

    // 倒计时更新（每 100ms）
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, MAX_VIEW_SECONDS - elapsed);
      const prog = Math.min(100, (elapsed / MAX_VIEW_SECONDS) * 100);
      setCountdown(Math.ceil(remaining));
      setProgress(prog);

      if (elapsed >= MAX_VIEW_SECONDS) {
        destroyImage();
      }
    }, 100);
  }, [viewState, destroyImage]);

  // 停止查看（松手）
  const stopViewing = useCallback(() => {
    if (viewState !== "viewing") return;
    clearTimers();
    setIsPressed(false);
    setViewState("destroyed");
  }, [viewState, clearTimers]);

  // 组件卸载时清理
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // 防止 context menu（长按右键）
  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div
      className="h-full flex flex-col select-none"
      style={{ background: "#0d0d0d" }}
      onContextMenu={handleContextMenu}
    >
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-3 z-10 relative">
        <button
          onClick={() => (viewState === "destroyed" ? navigate("chat", gender) : goBack(gender))}
          className="p-2"
        >
          <ArrowLeft size={22} color="white" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Lock size={14} color="#aaa" />
          <span className="text-sm font-bold text-white/80">私密图片</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sender info */}
      <div className="flex items-center gap-2 px-5 pb-3">
        <img
          src={partner.avatar}
          alt={partner.name}
          className="w-7 h-7 rounded-full object-cover border border-white/20"
        />
        <span className="text-xs text-white/60">{partner.name} 发送了一张私密图片</span>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative">
        <AnimatePresence mode="wait">
          {viewState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-5 w-full"
            >
              {/* Placeholder card */}
              <div
                className="w-full aspect-[3/4] max-w-[260px] rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
              >
                {/* Animated stars */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${8 + i * 8}%`,
                      top: `${10 + (i % 4) * 22}%`,
                    }}
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2 + i * 0.3, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `${t.primary}20`, border: `1px solid ${t.primary}40` }}
                >
                  <Eye size={28} color={t.primary} />
                </div>
                <div className="text-center px-4">
                  <p className="text-white font-bold text-base mb-1">私密图片</p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    按住下方按钮查看
                    <br />
                    松手后立即销毁
                  </p>
                </div>
              </div>

              {/* Rules hint */}
              <div className="flex items-start gap-2 bg-white/5 rounded-2xl px-4 py-3 w-full max-w-[260px]">
                <AlertTriangle size={14} color="#FFC800" className="flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/50 leading-relaxed">
                  图片最多可查看 {MAX_VIEW_SECONDS} 秒，松手或超时后自动销毁，不可截图保存。
                </p>
              </div>

              {/* Hold button */}
              <HoldButton
                onStart={startViewing}
                onEnd={stopViewing}
                color={t.primary}
                label="按住查看"
              />
            </motion.div>
          )}

          {viewState === "viewing" && (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              {/* Image with blur-reveal effect */}
              <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-3xl overflow-hidden">
                <img
                  src={DEMO_PRIVATE_IMAGES[demoImageIndex.current]}
                  alt="私密图片"
                  className="w-full h-full object-cover"
                  draggable={false}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                />
                {/* Countdown progress overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    <motion.div
                      className="h-full"
                      style={{
                        width: `${progress}%`,
                        background: progress > 70
                          ? "linear-gradient(90deg, #FF6B35, #e74c3c)"
                          : `linear-gradient(90deg, ${t.accent}, ${t.primary})`,
                      }}
                    />
                  </div>
                </div>
                {/* Countdown badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <Flame size={12} color={countdown <= 2 ? "#e74c3c" : "#FFC800"} />
                  <span
                    className="text-sm font-black"
                    style={{ color: countdown <= 2 ? "#e74c3c" : "white" }}
                  >
                    {countdown}s
                  </span>
                </div>
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <p
                    className="text-white font-black text-2xl rotate-[-30deg] tracking-widest"
                    style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                  >
                    仅限查看
                  </p>
                </div>
              </div>

              {/* Hold button (active state) */}
              <HoldButton
                onStart={startViewing}
                onEnd={stopViewing}
                color={t.primary}
                label="松手销毁"
                isActive
              />
            </motion.div>
          )}

          {viewState === "destroyed" && (
            <motion.div
              key="destroyed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center gap-5"
            >
              {/* Destroyed animation */}
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: "rgba(231,76,60,0.15)", border: "2px solid rgba(231,76,60,0.3)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <EyeOff size={36} color="#e74c3c" />
              </motion.div>

              <div className="text-center">
                <p className="text-white font-black text-xl mb-2">图片已销毁</p>
                <p className="text-white/50 text-sm leading-relaxed">
                  这张私密图片已永久销毁
                  <br />
                  无法再次查看
                </p>
              </div>

              {/* Destroyed particles */}
              <DestroyedParticles />

              <button
                onClick={() => navigate("chat", gender)}
                className="mt-4 px-8 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: `${t.primary}30`, border: `1px solid ${t.primary}50` }}
              >
                返回聊天
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Hold Button Component ─── */
function HoldButton({
  onStart,
  onEnd,
  color,
  label,
  isActive = false,
}: {
  onStart: () => void;
  onEnd: () => void;
  color: string;
  label: string;
  isActive?: boolean;
}) {
  return (
    <motion.button
      className="w-full max-w-[260px] py-5 rounded-3xl font-black text-lg text-white flex items-center justify-center gap-2 relative overflow-hidden select-none"
      style={{
        background: isActive
          ? `linear-gradient(135deg, #e74c3c, #c0392b)`
          : `linear-gradient(135deg, ${color}cc, ${color})`,
        boxShadow: isActive
          ? "0 8px 24px rgba(231,76,60,0.4)"
          : `0 8px 24px ${color}40`,
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
      whileTap={{ scale: 0.96 }}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={(e) => { e.preventDefault(); onStart(); }}
      onTouchEnd={(e) => { e.preventDefault(); onEnd(); }}
      onTouchCancel={(e) => { e.preventDefault(); onEnd(); }}
    >
      {isActive ? (
        <>
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-3xl"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <EyeOff size={20} />
          <span>{label}</span>
        </>
      ) : (
        <>
          <Eye size={20} />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
}

/* ─── Destroyed Particles ─── */
function DestroyedParticles() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    x: (Math.random() - 0.5) * 200,
    y: -(Math.random() * 200 + 50),
    rotate: Math.random() * 360,
    delay: Math.random() * 0.4,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ width: p.size, height: p.size, background: "#e74c3c" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 0.8, 0],
            scale: [1, 0.5, 0],
            rotate: p.rotate,
          }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
