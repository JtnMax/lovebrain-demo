/*
 * LoginScreen - 登录页
 * 参考多邻国登录页：手机号+验证码 + 微信登录 + 协议
 */
import { useApp } from "@/contexts/AppContext";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginScreen() {
  const { navigate, login, toast } = useApp();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleLogin = () => {
    if (!agreed) {
      toast("请先同意服务条款");
      return;
    }
    login();
  };

  const handleGetCode = () => {
    if (!phone) {
      toast("请输入手机号");
      return;
    }
    toast("验证码已发送");
    setCode("8888");
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="h-full flex flex-col bg-[#FFFBF5]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => navigate("welcome")} className="p-2">
          <X size={24} color="#2C3E50" />
        </button>
        <h2 className="text-lg font-bold text-[#2C3E50]">输入你的信息</h2>
        <div className="w-10" />
      </div>

      {/* Form */}
      <div className="px-6 mt-4 space-y-3">
        {/* Phone input */}
        <div className="bg-[#F7F3F0] rounded-2xl overflow-hidden border border-[#f0e6e0]">
          <div className="flex items-center px-4 py-3.5 border-b border-[#f0e6e0]">
            <span className="text-[#2C3E50] font-semibold mr-3 pr-3 border-r border-[#e0d8d0]">+86</span>
            <input
              type="tel"
              placeholder="电话号码"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#2C3E50] placeholder-[#b0b0b0]"
            />
            <button
              onClick={handleGetCode}
              className="text-[#FF6B8A] font-semibold text-sm whitespace-nowrap"
            >
              获取验证码
            </button>
          </div>
          <div className="flex items-center px-4 py-3.5">
            <input
              type="text"
              placeholder="验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#2C3E50] placeholder-[#b0b0b0]"
            />
          </div>
        </div>

        {/* Login button */}
        <button
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${
            phone && code
              ? "btn-jelly btn-jelly-pink"
              : "bg-[#e8e8e8] text-[#b0b0b0]"
          }`}
          onClick={handleLogin}
        >
          登录
        </button>

        {/* Agreement */}
        <div className="flex items-start gap-3 mt-4">
          <button
            onClick={() => setAgreed(!agreed)}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
              agreed ? "bg-[#FF6B8A] border-[#FF6B8A]" : "border-[#d0d0d0] bg-white"
            }`}
          >
            {agreed && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <p className="text-xs text-[#7f8c8d] leading-relaxed">
            我已阅读并同意<span className="text-[#FF6B8A]">服务条款</span>、
            <span className="text-[#FF6B8A]">隐私政策</span>，以及
            <span className="text-[#FF6B8A]">跨境数据传输协议</span>
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Social login */}
      <div className="px-6 pb-12 space-y-3">
        <button
          className="btn-jelly btn-jelly-outline w-full py-4 rounded-2xl flex items-center justify-center gap-3"
          onClick={handleLogin}
        >
          <div className="w-6 h-6 rounded-full bg-[#07C160] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
              <path d="M23.96 14.789c0-3.29-3.211-5.966-7.036-5.966-3.94 0-7.035 2.675-7.035 5.966 0 3.289 3.096 5.964 7.035 5.964.772 0 1.523-.13 2.233-.335a.72.72 0 0 1 .59.083l1.563.916a.271.271 0 0 0 .138.045c.133 0 .24-.108.24-.243 0-.058-.024-.118-.04-.176l-.324-1.216a.488.488 0 0 1 .176-.546C22.93 18.417 23.96 16.717 23.96 14.789zm-9.586-1.29a.944.944 0 0 1-.938-.952c0-.526.42-.952.938-.952.52 0 .94.426.94.952a.944.944 0 0 1-.94.951zm5.101 0a.944.944 0 0 1-.94-.952c0-.526.42-.952.94-.952.518 0 .938.426.938.952a.944.944 0 0 1-.938.951z"/>
            </svg>
          </div>
          <span className="font-bold text-[#2C3E50]">使用微信登录</span>
        </button>
      </div>
    </motion.div>
  );
}
