/*
 * SettingsScreen - 设置页
 */
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Shield, Moon, Globe, Info, ChevronRight } from "lucide-react";

const settings = [
  { icon: Bell, label: "通知设置", desc: "管理推送和提醒", color: "#FFC800" },
  { icon: Shield, label: "隐私与安全", desc: "密码、生物识别", color: "#4ECDC4" },
  { icon: Moon, label: "勿扰模式", desc: "设置免打扰时间", color: "#B8A9C9" },
  { icon: Globe, label: "语言", desc: "简体中文", color: "#FF6B35" },
  { icon: Info, label: "关于恋爱脑", desc: "版本 1.0.0", color: "#7f8c8d" },
];

export default function SettingsScreen() {
  const { navigate, toast } = useApp();

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("profile")} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">设置</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="love-card p-0 overflow-hidden">
          {settings.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toast(`${item.label}功能演示中`)}
                className="w-full flex items-center gap-3 px-4 py-4 border-b border-[#f0e6e0] last:border-b-0 active:bg-[#F7F3F0] transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}20` }}
                >
                  <Icon size={18} color={item.color} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[#2C3E50] text-sm">{item.label}</p>
                  <p className="text-[10px] text-[#7f8c8d]">{item.desc}</p>
                </div>
                <ChevronRight size={16} color="#b0b0b0" />
              </motion.button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            toast("已退出登录");
            setTimeout(() => navigate("welcome"), 1000);
          }}
          className="w-full mt-6 py-3.5 rounded-2xl border-2 border-[#e74c3c] text-[#e74c3c] font-bold text-sm"
        >
          退出登录
        </button>

        <p className="text-center text-[10px] text-[#b0b0b0] mt-6">
          恋爱脑 LoveBrain v1.0.0
        </p>
      </div>
    </div>
  );
}
