/*
 * ChatScreen - 即时通信页
 * 聊天消息列表 + 发送栏 + 已读回执
 * Jelly Pop 弹性美学
 */
import { useApp } from "@/contexts/AppContext";
import { MOCK_USER, MOCK_MESSAGES } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import { Image, Smile, Send, Camera, Mic, Phone, Video, MoreHorizontal, CheckCheck } from "lucide-react";
import { useState } from "react";

export default function ChatScreen() {
  const { toast } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      text: input,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
    };
    setMessages([...messages, newMsg]);
    setInput("");
    // Simulate partner reply
    setTimeout(() => {
      const replies = ["好的呀~", "嗯嗯 💕", "想你了", "哈哈哈", "❤️"];
      const reply = {
        id: messages.length + 2,
        sender: "partner",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        type: "text" as const,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 border-b border-[#f0e6e0] flex items-center gap-3">
        <div className="relative">
          <img
            src={MOCK_USER.partnerAvatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-[#FF6B8A]"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#58CC02] rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#2C3E50]">{MOCK_USER.partnerName}</p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#58CC02] font-semibold">在线</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => toast("语音通话")} className="p-2">
            <Phone size={18} color="#7f8c8d" />
          </button>
          <button onClick={() => toast("视频通话")} className="p-2">
            <Video size={18} color="#7f8c8d" />
          </button>
          <button onClick={() => toast("更多功能")} className="p-2">
            <MoreHorizontal size={18} color="#7f8c8d" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-36">
        {/* Date divider */}
        <div className="flex items-center justify-center">
          <span className="text-[10px] text-[#b0b0b0] bg-[#F7F3F0] px-3 py-1 rounded-full">今天</span>
        </div>

        {messages.map((msg, i) => {
          const isMe = msg.sender === "me";
          return (
            <motion.div
              key={msg.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}
            >
              {!isMe && (
                <img
                  src={MOCK_USER.partnerAvatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                />
              )}
              <div className={`max-w-[70%]`}>
                <div
                  className={`px-4 py-2.5 text-sm ${
                    isMe
                      ? "bg-gradient-to-br from-[#FF6B8A] to-[#FF9A9E] text-white rounded-2xl rounded-br-md shadow-sm shadow-[#FF6B8A]/20"
                      : "bg-white text-[#2C3E50] rounded-2xl rounded-bl-md border border-[#f0e6e0] shadow-sm"
                  }`}
                >
                  {msg.type === "image" ? (
                    <div className="w-40 h-28 bg-[#F7F3F0] rounded-xl flex items-center justify-center">
                      <Image size={24} color="#b0b0b0" />
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                  <p className="text-[10px] text-[#b0b0b0]">{msg.time}</p>
                  {isMe && <CheckCheck size={12} color="#4ECDC4" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="absolute bottom-[70px] left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#f0e6e0] px-3 py-2 flex items-center gap-2">
        <button className="p-2" onClick={() => toast("语音功能演示中")}>
          <Mic size={20} color="#7f8c8d" />
        </button>
        <div className="flex-1 bg-[#F7F3F0] rounded-full px-4 py-2.5 flex items-center">
          <input
            type="text"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent outline-none text-sm text-[#2C3E50] placeholder-[#b0b0b0]"
          />
          <button className="ml-2" onClick={() => toast("表情功能演示中")}>
            <Smile size={18} color="#7f8c8d" />
          </button>
        </div>
        <button className="p-2" onClick={() => toast("相机功能演示中")}>
          <Camera size={20} color="#7f8c8d" />
        </button>
        {input ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-9 h-9 bg-gradient-to-br from-[#FF6B8A] to-[#FF9A9E] rounded-full flex items-center justify-center shadow-md shadow-[#FF6B8A]/30"
            onClick={handleSend}
          >
            <Send size={16} color="white" />
          </motion.button>
        ) : null}
      </div>

      <TabBar />
    </div>
  );
}
