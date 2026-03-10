/*
 * EndRelationshipScreen - 结束关系页
 * 完整流程：
 *   Step 0 - 信息说明（后果 + 规则）
 *   Step 1 - 最终确认（选原因）
 *   Step 2 - 冷静期倒计时（可撤回 / 非发起方恢复申请）
 *   Step 3 - 正式结束二次确认（冷静期满后）
 *   Step 4 - 数据导出模拟（填邮箱 + 导出）
 *   Step 5 - 完成归档
 *
 * SRS 流程 G: 结束关系（冷静期 → 正式结束 → 归档 → 导出）
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, AlertTriangle, Clock, Shield, Heart,
  Download, Mail, CheckCircle2, RotateCcw, ChevronRight,
  Archive, Trash2, Lock, FileText
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// 冷静期总时长（Demo 用 72 小时，以秒展示倒计时；实际演示用缩短的时间）
const COOLING_TOTAL_SECONDS = 72 * 3600; // 72小时
// Demo 展示的初始剩余时间（模拟已过去一段时间）
const DEMO_REMAINING = 71 * 3600 + 59 * 60 + 47; // 71:59:47

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function EndRelationshipScreen({ gender }: { gender: Gender }) {
  const t = gender === "female" ? THEME.female : THEME.male;
  const { navigate, toast } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(DEMO_REMAINING);
  const [email, setEmail] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [restoreRequested, setRestoreRequested] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 冷静期倒计时（step 2 时启动）
  useEffect(() => {
    if (step === 2) {
      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const progressPercent = ((COOLING_TOTAL_SECONDS - remaining) / COOLING_TOTAL_SECONDS) * 100;
  const isInitiator = true; // Demo 中当前用户是发起方

  const handleExport = () => {
    if (!email.trim()) { toast("请填写邮箱地址", gender); return; }
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button
          onClick={() => step === 0 ? navigate("profile", gender) : setStep((step - 1) as Step)}
          className="p-2"
        >
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">
          {step < 2 ? "结束关系" : step === 2 ? "冷静期" : step === 3 ? "正式结束" : step === 4 ? "数据导出" : "归档完成"}
        </h2>
        <div className="w-10" />
      </div>

      {/* Progress indicator */}
      {step > 0 && step < 5 && (
        <div className="px-6 pb-3">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all duration-500"
                style={{ background: s <= step ? "#e74c3c" : "#f0e6e0" }}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ─── Step 0: 信息说明 ─── */}
        {step === 0 && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            <div className="flex flex-col items-center mb-6">
              <motion.img
                src={MASCOT.thinking}
                alt=""
                className="w-28 h-28 mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-xl font-black text-[#2C3E50] mb-2">确定要结束吗？</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed">
                我们理解你的决定，但希望你能再想想
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <InfoCard
                icon={<Clock size={20} color="#FFC800" />}
                bg="#FFF8E1"
                border="#FFE082"
                title="1个月冷静期"
                desc="提交申请后，双方同时进入1个月冷静期。期间新增操作禁用，但可随时撤回。"
              />
              <InfoCard
                icon={<RotateCcw size={20} color="#4ECDC4" />}
                bg="#E8FFF8"
                border="#B8F0E4"
                title="可恢复关系"
                desc="冷静期内任意一方可发起恢复申请，发起方可直接恢复；非发起方需对方同意。"
              />
              <InfoCard
                icon={<Shield size={20} color="#4A90D9" />}
                bg="#EBF3FC"
                border="#B8D4F0"
                title="数据保护"
                desc="冷静期满后正式结束，可申请全量数据导出。归档数据默认保留7天。"
              />
              <InfoCard
                icon={<Heart size={20} color="#FF6B8A" />}
                bg="#FFF0F3"
                border="#FFD4DE"
                title="再绑定限制"
                desc="正式结束后3个月内不可再次建立新关系（可付费解除）。"
              />
            </div>

            <div className="flex-1" />
            <div className="space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl text-lg font-bold border-2 border-[#e74c3c] text-[#e74c3c] bg-white"
              >
                我想好了
              </button>
              <button
                onClick={() => navigate("home", gender)}
                className="btn-jelly btn-jelly-green w-full py-4 text-lg rounded-2xl"
              >
                再想想 💕
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 1: 最终确认 ─── */}
        {step === 1 && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            <div className="flex flex-col items-center mb-6 mt-2">
              <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={36} color="#e74c3c" />
              </div>
              <h3 className="text-xl font-black text-[#2C3E50] mb-2">最终确认</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed">
                点击确认后双方同时进入1个月冷静期
              </p>
            </div>

            {/* Partner card */}
            <div className="love-card flex items-center gap-3 mb-4">
              <img
                src={gender === "female" ? USERS.male.avatar : USERS.female.avatar}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-[#2C3E50] text-sm">
                  {gender === "female" ? USERS.male.name : USERS.female.name}
                </p>
                <p className="text-xs text-[#7f8c8d]">在一起 {COUPLE_INFO.daysInLove} 天</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#e74c3c]">即将分开</p>
              </div>
            </div>

            {/* Reason selection */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[#2C3E50] mb-2">请选择原因（可选）</p>
              <div className="space-y-2">
                {["感情淡了", "距离太远", "性格不合", "发展方向不同", "其他原因"].map((reason) => (
                  <button
                    key={reason}
                    className={`w-full love-card text-left text-sm transition-all flex items-center justify-between ${
                      selectedReason === reason ? "border-[#e74c3c] bg-[#FFF0F3]" : ""
                    }`}
                    style={selectedReason === reason ? { borderColor: "#e74c3c" } : undefined}
                    onClick={() => setSelectedReason(selectedReason === reason ? null : reason)}
                  >
                    <span className="text-[#2C3E50]">{reason}</span>
                    {selectedReason === reason && (
                      <CheckCircle2 size={16} color="#e74c3c" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1" />
            <div className="space-y-3">
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl text-lg font-bold bg-[#e74c3c] text-white"
              >
                确认提交，进入冷静期
              </button>
              <button
                onClick={() => setStep(0)}
                className="w-full py-3 text-[#7f8c8d] font-semibold"
              >
                返回
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 2: 冷静期 ─── */}
        {step === 2 && (
          <motion.div
            key="cooling"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            {/* Top banner */}
            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl px-4 py-3 mb-4 flex items-center gap-2">
              <Clock size={16} color="#FFC800" />
              <p className="text-xs text-[#7f8c8d] flex-1">
                <span className="font-bold text-[#2C3E50]">冷静期进行中</span>
                {" · "}由{gender === "female" ? "你" : "你"}发起
              </p>
            </div>

            {/* Mascot */}
            <div className="flex flex-col items-center mb-5">
              <motion.img
                src={MASCOT.thinking}
                alt=""
                className="w-24 h-24 mb-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <h3 className="text-lg font-black text-[#2C3E50] mb-1">冷静期已开始</h3>
              <p className="text-xs text-[#7f8c8d] text-center leading-relaxed">
                1个月内可随时撤回申请恢复关系
              </p>
            </div>

            {/* Countdown */}
            <div className="love-card bg-[#FFF0F3] border-[#FFD4DE] mb-4">
              <div className="text-center py-3">
                <p className="text-[10px] text-[#7f8c8d] mb-2 font-semibold uppercase tracking-wider">剩余冷静时间</p>
                <motion.p
                  className="text-4xl font-black text-[#e74c3c] mb-2"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {remaining === 0 ? "00:00:00" : formatTime(remaining)}
                </motion.p>
                {/* Progress bar */}
                <div className="h-2 bg-[#FFD4DE] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#e74c3c] rounded-full"
                    style={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-[10px] text-[#7f8c8d] mt-1.5">
                  已过 {Math.round(progressPercent)}%
                </p>
              </div>
            </div>

            {/* Cooling period rules */}
            <div className="love-card mb-4 space-y-2">
              <p className="text-xs font-bold text-[#2C3E50] mb-1">冷静期规则</p>
              {[
                { icon: "🚫", text: "新增信号/消息/纪念日等操作已暂停" },
                { icon: "✅", text: "查看、修改、删除、导出仍可使用" },
                { icon: "💕", text: "任意一方可发起恢复申请" },
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm">{rule.icon}</span>
                  <p className="text-xs text-[#7f8c8d] leading-relaxed">{rule.text}</p>
                </div>
              ))}
            </div>

            {/* Restore request section */}
            {!isInitiator && !restoreRequested && (
              <div className="love-card bg-[#E8FFF8] border-[#B8F0E4] mb-4">
                <p className="text-xs text-[#7f8c8d] mb-2">
                  对方发起了结束申请，你可以请求恢复关系
                </p>
                <button
                  onClick={() => { setRestoreRequested(true); toast("恢复申请已发送，等待对方确认", gender); }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: "#4ECDC4" }}
                >
                  申请恢复关系
                </button>
              </div>
            )}
            {restoreRequested && (
              <div className="love-card bg-[#E8FFF8] border-[#B8F0E4] mb-4 flex items-center gap-2">
                <Clock size={16} color="#4ECDC4" />
                <p className="text-xs text-[#7f8c8d]">恢复申请已发送，等待对方确认...</p>
              </div>
            )}

            <div className="flex-1" />
            <div className="space-y-3">
              {/* 发起方可直接撤回 */}
              {isInitiator && (
                <button
                  onClick={() => {
                    toast("已撤回申请，关系已恢复！💕", gender);
                    setTimeout(() => navigate("home", gender), 1200);
                  }}
                  className="btn-jelly btn-jelly-green w-full py-4 text-base rounded-2xl"
                >
                  撤回申请，恢复关系 💕
                </button>
              )}
              {/* 冷静期满后可进入正式结束 */}
              {remaining === 0 && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-4 rounded-2xl text-base font-bold bg-[#e74c3c] text-white"
                >
                  冷静期已满，正式结束关系
                </button>
              )}
              {/* Demo: 跳过冷静期 */}
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 text-[#b0b0b0] text-xs font-semibold"
              >
                [演示] 跳过冷静期 →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: 正式结束二次确认 ─── */}
        {step === 3 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            <div className="flex flex-col items-center mb-6 mt-2">
              <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mb-4">
                <Trash2 size={36} color="#e74c3c" />
              </div>
              <h3 className="text-xl font-black text-[#2C3E50] mb-2">正式结束关系</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed">
                此操作不可逆，关系将正式结束并进入归档
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <InfoCard
                icon={<Archive size={18} color="#7f8c8d" />}
                bg="#F7F3F0"
                border="#e8e0d8"
                title="数据归档"
                desc="关系数据进入归档态，默认保留7天，期间可申请全量导出。"
              />
              <InfoCard
                icon={<Lock size={18} color="#FF6B35" />}
                bg="#FFF4EE"
                border="#FFD4B8"
                title="再绑定限制"
                desc="正式结束后3个月内不可再次建立新关系（可付费解除）。"
              />
              <InfoCard
                icon={<FileText size={18} color="#4A90D9" />}
                bg="#EBF3FC"
                border="#B8D4F0"
                title="数据导出"
                desc="可在归档期内申请全量数据导出，包含日记、相册、信号等所有内容。"
              />
            </div>

            <div className="flex-1" />
            <div className="space-y-3">
              <button
                onClick={() => setStep(4)}
                className="w-full py-4 rounded-2xl text-lg font-bold bg-[#e74c3c] text-white"
              >
                确认正式结束关系
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 text-[#7f8c8d] font-semibold"
              >
                返回冷静期
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 4: 数据导出 ─── */}
        {step === 4 && (
          <motion.div
            key="export"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-4 pb-8 overflow-y-auto"
          >
            <div className="flex flex-col items-center mb-6 mt-2">
              <motion.div
                className="w-20 h-20 bg-[#EBF3FC] rounded-full flex items-center justify-center mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Download size={36} color="#4A90D9" />
              </motion.div>
              <h3 className="text-xl font-black text-[#2C3E50] mb-2">导出你的回忆</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed">
                我们将打包你的全部数据，通过邮件发送下载链接
              </p>
            </div>

            {/* Export contents */}
            <div className="love-card mb-4">
              <p className="text-xs font-bold text-[#2C3E50] mb-3">导出内容包含</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: "💌", label: "关心信号记录" },
                  { emoji: "💬", label: "聊天记录" },
                  { emoji: "📸", label: "相册与照片" },
                  { emoji: "📝", label: "恋爱日记" },
                  { emoji: "🎂", label: "纪念日记录" },
                  { emoji: "🌟", label: "愿望清单" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 py-1">
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-xs text-[#7f8c8d]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Email input */}
            {!exportDone ? (
              <>
                <div className="love-card mb-4">
                  <p className="text-xs font-bold text-[#2C3E50] mb-2">接收邮箱</p>
                  <div className="flex items-center gap-2">
                    <Mail size={16} color="#7f8c8d" className="flex-shrink-0" />
                    <input
                      type="email"
                      placeholder="输入你的邮箱地址..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-[#2C3E50] placeholder-[#b0b0b0]"
                    />
                  </div>
                </div>

                <div className="flex-1" />
                <div className="space-y-3">
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full py-4 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: exporting ? "#b0b0b0" : "#4A90D9" }}
                  >
                    {exporting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        打包中...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        申请导出全量数据
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="w-full py-3 text-[#7f8c8d] font-semibold text-sm"
                  >
                    跳过，直接完成归档
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center gap-4"
              >
                <CheckCircle2 size={56} color="#58CC02" />
                <div className="text-center">
                  <p className="font-black text-[#2C3E50] text-lg mb-1">导出申请已提交</p>
                  <p className="text-sm text-[#7f8c8d] leading-relaxed">
                    数据包将在 24 小时内发送至
                    <br />
                    <span className="font-bold text-[#4A90D9]">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setStep(5)}
                  className="mt-4 w-full py-4 rounded-2xl text-lg font-bold text-white"
                  style={{ background: "#58CC02" }}
                >
                  完成归档
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── Step 5: 归档完成 ─── */}
        {step === 5 && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex-1 flex flex-col items-center justify-center px-6 gap-5"
          >
            <motion.img
              src={MASCOT.love}
              alt=""
              className="w-32 h-32"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div className="text-center">
              <h3 className="text-2xl font-black text-[#2C3E50] mb-2">关系已归档</h3>
              <p className="text-sm text-[#7f8c8d] leading-relaxed">
                感谢你们曾经在一起的每一天
                <br />
                美好的回忆将永远留存
              </p>
            </div>

            {/* Archive info */}
            <div className="love-card w-full bg-[#F7F3F0] border-[#e8e0d8]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7f8c8d]">归档数据保留至</span>
                  <span className="text-xs font-bold text-[#2C3E50]">7天后自动删除</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7f8c8d]">再绑定限制</span>
                  <span className="text-xs font-bold text-[#e74c3c]">3个月后解除</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7f8c8d]">延长保存</span>
                  <button
                    onClick={() => toast("爱情银行功能即将上线", gender)}
                    className="text-xs font-bold flex items-center gap-1"
                    style={{ color: "#FFC800" }}
                  >
                    爱情银行 <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("home", gender)}
              className="w-full py-4 rounded-2xl text-base font-bold text-white"
              style={{ background: "#7f8c8d" }}
            >
              返回首页
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Info Card Component ─── */
function InfoCard({
  icon, bg, border, title, desc,
}: {
  icon: React.ReactNode;
  bg: string;
  border: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="love-card flex items-start gap-3"
      style={{ background: bg, borderColor: border }}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-bold text-[#2C3E50] text-sm">{title}</p>
        <p className="text-xs text-[#7f8c8d] mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
