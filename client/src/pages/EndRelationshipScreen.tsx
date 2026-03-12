/*
 * EndRelationshipScreen - 结束关系页 (绝情版 2.0)
 * 强化视觉冲击力：色彩由暖转冷、破碎动画、沉重文案
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { MASCOT, USERS, COUPLE_INFO, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, AlertTriangle, Clock, Shield, Heart,
  Download, Mail, CheckCircle2, RotateCcw, ChevronRight,
  Archive, Trash2, Lock, FileText, X, HeartOff, Ghost,
  CloudRain, Wind, ZapOff
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// 冷静期总时长（Demo 用 72 小时）
const COOLING_TOTAL_SECONDS = 72 * 3600;
const DEMO_REMAINING = 71 * 3600 + 59 * 60 + 47;

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

  // 冷静期倒计时
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
  const partner = gender === "female" ? USERS.male : USERS.female;

  const handleExport = () => {
    if (!email.trim()) { toast("请填写邮箱地址", gender); return; }
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);
    }, 2500);
  };

  // 绝情背景色：随着步骤深入，颜色从暖色调变为冰冷的深灰色/黑色
  const getBgColor = () => {
    switch(step) {
      case 0: return "#FDFCFB"; // 初始
      case 1: return "#F5F5F5"; // 确认
      case 2: return "#E2E8F0"; // 冷静期 (冷灰)
      case 3: return "#2D3748"; // 正式结束 (深灰)
      case 4: return "#1A202C"; // 导出 (近黑)
      case 5: return "#000000"; // 归档 (纯黑)
      default: return t.bg;
    }
  };

  const getTextColor = () => {
    return step >= 3 ? "#FFFFFF" : "#2C3E50";
  };

  const getSubTextColor = () => {
    return step >= 3 ? "#A0AEC0" : "#7f8c8d";
  };

  return (
    <div className="h-full flex flex-col transition-colors duration-1000 relative overflow-hidden" style={{ background: getBgColor() }}>
      {/* Rain/Dust Particles for "Cold" feeling */}
      {step >= 2 && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div
            animate={{ y: [0, 1000] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 z-10">
        <button
          onClick={() => step === 0 ? navigate("profile", gender) : setStep((step - 1) as Step)}
          className="p-2"
        >
          <ArrowLeft size={24} color={getTextColor()} />
        </button>
        <h2 className="flex-1 text-center text-lg font-black tracking-widest" style={{ color: getTextColor() }}>
          {step < 2 ? "结束关系" : step === 2 ? "冷静期" : step === 3 ? "正式结束" : step === 4 ? "数据导出" : "归档完成"}
        </h2>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {/* ─── Step 0: 绝情预警 ─── */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col px-6 pb-8"
          >
            <div className="flex flex-col items-center mb-10 mt-4">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 0.95, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative mb-6"
              >
                <HeartOff size={80} color="#e74c3c" strokeWidth={1.5} />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full h-0.5 bg-[#e74c3c] rotate-45" />
                </motion.div>
              </motion.div>
              <h3 className="text-2xl font-black text-[#2C3E50] mb-3">真的要切断吗？</h3>
              <p className="text-sm text-[#7f8c8d] text-center leading-relaxed px-4">
                一旦开始，你们之间所有的「关心信号」、「恋爱日记」和「共同回忆」都将进入不可逆的销毁倒计时。
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-white rounded-3xl border-2 border-[#f5f5f5] shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <ZapOff size={20} color="#e74c3c" />
                </div>
                <div>
                  <p className="font-black text-[#2C3E50] text-sm">即刻断联</p>
                  <p className="text-xs text-[#7f8c8d] mt-1">提交后，所有互动功能将立即禁用，你们将无法再向对方发送任何信号。</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-3xl border-2 border-[#f5f5f5] shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Ghost size={20} color="#718096" />
                </div>
                <div>
                  <p className="font-black text-[#2C3E50] text-sm">身份抹除</p>
                  <p className="text-xs text-[#7f8c8d] mt-1">冷静期满后，对方的头像和名字将从你的世界彻底消失，变为「已注销用户」。</p>
                </div>
              </div>
            </div>

            <div className="flex-1" />
            <div className="space-y-4">
              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl text-lg font-black border-2 border-[#e74c3c] text-[#e74c3c] active:bg-red-50 transition-all"
              >
                我想好了，开始断开
              </button>
              <button
                onClick={() => navigate("home", gender)}
                className="w-full py-4 rounded-2xl text-lg font-black bg-[#2C3E50] text-white shadow-lg active:scale-95 transition-all"
              >
                再留恋一下
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 1: 最终确认 (破碎感) ─── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col px-6 pb-8"
          >
            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="w-24 h-24 relative mb-6">
                <img src={partner.avatar} className="w-full h-full rounded-full object-cover grayscale opacity-60" alt="" />
                <div className="absolute inset-0 border-4 border-dashed border-red-500 rounded-full animate-spin-slow" />
                <X className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={48} color="#e74c3c" />
              </div>
              <h3 className="text-2xl font-black text-[#2C3E50] mb-2">最后一次确认</h3>
              <p className="text-sm text-[#7f8c8d] text-center">
                你确定要放弃与 <span className="font-black text-[#2C3E50]">{partner.name}</span> 的这段关系吗？
              </p>
            </div>

            <div className="bg-white rounded-[32px] p-6 border-2 border-[#f5f5f5] mb-8">
              <p className="text-xs font-black text-[#7f8c8d] mb-4 uppercase tracking-widest">请选择断开的原因</p>
              <div className="space-y-3">
                {["感情已逝", "无法逾越的距离", "性格极度不合", "对方让我失望", "不再爱了"].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold transition-all flex items-center justify-between ${
                      selectedReason === reason ? "bg-red-50 border-2 border-red-200 text-red-600" : "bg-[#f9f9f9] border-2 border-transparent text-[#4A5568]"
                    }`}
                  >
                    {reason}
                    {selectedReason === reason && <CheckCircle2 size={18} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1" />
            <button
              onClick={() => setStep(2)}
              disabled={!selectedReason}
              className={`w-full py-5 rounded-3xl text-xl font-black transition-all shadow-xl ${
                selectedReason ? "bg-[#e74c3c] text-white active:scale-95" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              提交申请，进入冷静期
            </button>
          </motion.div>
        )}

        {/* ─── Step 2: 冷静期 (冰冷感) ─── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col px-6 pb-8"
          >
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-4 mb-8 flex items-center gap-3 border border-white/50">
              <Wind size={20} color="#718096" />
              <p className="text-xs font-bold text-[#4A5568]">
                关系冻结中 · 剩余时间将决定最终的走向
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                {/* Countdown Circle */}
                <svg className="w-full h-full -rotate-90">
                  <circle cx="128" cy="128" r="120" fill="none" stroke="#EDF2F7" strokeWidth="8" />
                  <motion.circle
                    cx="128" cy="128" r="120" fill="none" stroke="#718096" strokeWidth="8"
                    strokeDasharray="754"
                    animate={{ strokeDashoffset: 754 * (1 - progressPercent / 100) }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-black text-[#718096] uppercase tracking-[0.2em] mb-2">冷静期倒计时</p>
                  <p className="text-4xl font-black text-[#2D3748] font-mono">{formatTime(remaining)}</p>
                  <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full">
                    <CloudRain size={12} color="#718096" />
                    <span className="text-[10px] font-bold text-[#718096]">感情正在冷却</span>
                  </div>
                </div>
              </div>

              <div className="text-center px-6">
                <h4 className="text-lg font-black text-[#2D3748] mb-2">世界正在变灰</h4>
                <p className="text-xs text-[#718096] leading-relaxed">
                  在这段时间里，你们无法查看对方的动态。如果倒计时结束前没有撤回，这段关系将永久尘封。
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <button
                onClick={() => { toast("申请已撤回，关系恢复 ❤️", gender); navigate("home", gender); }}
                className="w-full py-4 rounded-2xl text-lg font-black bg-white text-[#2D3748] border-2 border-[#2D3748] active:scale-95 transition-all"
              >
                我后悔了，撤回申请
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full py-4 text-xs font-bold text-[#718096] underline"
              >
                跳过冷静期 (仅限演示)
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: 正式结束 (深渊感) ─── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col px-8 pb-8 text-white"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8"
              >
                <HeartOff size={100} color="#e74c3c" strokeWidth={1} />
              </motion.div>
              <h3 className="text-3xl font-black mb-4">终局已至</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                冷静期已结束。点击下方按钮，你们在 LoveBrain 的所有数据将被打包并从服务器彻底抹除。
              </p>
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Archive size={20} className="text-gray-500" />
                  <div className="text-left">
                    <p className="text-sm font-bold">回忆归档</p>
                    <p className="text-[10px] text-gray-500">所有照片和日记将转为只读离线包</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Trash2 size={20} className="text-red-900" />
                  <div className="text-left">
                    <p className="text-sm font-bold">身份注销</p>
                    <p className="text-[10px] text-gray-500">你们的绑定关系将从全网抹除</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full py-5 rounded-3xl bg-white text-black font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
            >
              彻底终结
            </button>
          </motion.div>
        )}

        {/* ─── Step 4: 数据导出 (黑客/工业感) ─── */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col px-8 pb-8 text-white"
          >
            <div className="mt-12 mb-10">
              <h3 className="text-2xl font-black mb-2">遗物打包</h3>
              <p className="text-xs text-gray-500">输入邮箱，接收你们这段关系的最后遗物</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-white/30 transition-all font-mono text-sm"
                />
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">导出清单</p>
                <div className="space-y-3">
                  {[
                    { label: "1,242 条聊天记录", size: "2.4MB" },
                    { label: "86 张珍贵相片", size: "142MB" },
                    { label: "12 篇恋爱日记", size: "45KB" },
                    { label: "5 个共同愿望", size: "12KB" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{item.label}</span>
                      <span className="font-mono text-gray-600">{item.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1" />
            
            <button
              onClick={handleExport}
              disabled={exporting || exportDone}
              className="w-full py-5 rounded-3xl bg-red-600 text-white font-black text-xl relative overflow-hidden group"
            >
              {exporting ? (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5 }}
                  className="absolute inset-0 bg-red-800"
                />
              ) : null}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {exporting ? "正在粉碎并打包..." : exportDone ? "已发送至邮箱" : "确认导出并销毁"}
                {!exporting && !exportDone && <Download size={20} />}
                {exportDone && <CheckCircle2 size={20} />}
              </span>
            </button>

            {exportDone && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setStep(5)}
                className="w-full py-4 text-sm font-bold text-gray-400 mt-4"
              >
                继续
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ─── Step 5: 归档完成 (虚无感) ─── */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-10 text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8"
            >
              <Ghost size={48} color="white" className="opacity-20" />
            </motion.div>
            <h3 className="text-3xl font-black mb-4">再见，{partner.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-12">
              你们的关系已正式归档。从这一刻起，LoveBrain 将不再保留关于你们的任何实时数据。
            </p>
            
            <div className="w-full p-6 bg-white/5 rounded-[32px] border border-white/10 mb-12">
              <p className="text-xs text-gray-400 mb-2">根据《恋爱脑保护协议》</p>
              <p className="text-sm font-bold text-gray-200">
                你在 90 天内无法建立新的关系
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-sm border border-white/20 active:scale-95 transition-all"
            >
              回到现实世界
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
