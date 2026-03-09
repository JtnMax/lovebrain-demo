/*
 * ChatScreen - 即时通信页
 * 共享聊天消息 + 找话题入口 + 双人视角
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { USERS, THEME } from "@/lib/constants";
import { motion } from "framer-motion";
import TabBar from "@/components/TabBar";
import { Image, Smile, Send, Camera, Mic, Phone, Video, MoreHorizontal, CheckCheck, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatScreen({ gender }: { gender: Gender }) {
  const { navigate, toast, chatMessages, addChatMessage } = useApp();
  const [input, setInput] = useState("");
  const t = gender === "female" ? THEME.female : THEME.male;
  const me = gender === "female" ? USERS.female : USERS.male;
  const partner = gender === "female" ? USERS.male : USERS.female;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addChatMessage({
      sender: gender,
      text: input,
      type: "text",
    });
    setInput("");
  };

  return (
    <div className="h-full flex flex-col relative" style={{ background: t.bg }}>
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 border-b flex items-center gap-3" style={{ borderColor: t.cardBorder }}>
        <div className="relative">
          <img
            src={partner.avatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2"
            style={{ borderColor: t.primary }}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#58CC02] rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#2C3E50]">{partner.name}</p>
          <span className="text-[10px] text-[#58CC02] font-semibold">在线</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Topic cards entry */}
          <button
            onClick={() => navigate("topic-cards", gender)}
            className="p-2 rounded-xl"
            style={{ background: `${t.primary}10` }}
          >
            <Lightbulb size={18} color={t.primary} />
          </button>
          <button onClick={() => toast("语音通话", gender)} className="p-2">
            <Phone size={18} color="#7f8c8d" />
          </button>
          <button onClick={() => toast("视频通话", gender)} className="p-2">
            <Video size={18} color="#7f8c8d" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-36">
        <div className="flex items-center justify-center">
          <span className="text-[10px] text-[#b0b0b0] bg-white/60 px-3 py-1 rounded-full">今天</span>
        </div>

        {chatMessages.map((msg, i) => {
          const isMe = msg.sender === gender;
          const senderAvatar = isMe ? me.avatar : partner.avatar;
          return (
            <motion.div
              key={msg.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}
            >
              {!isMe && (
                <img src={senderAvatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />
              )}
              <div className="max-w-[70%]">
                <div
                  className={`px-4 py-2.5 text-sm ${
                    isMe
                      ? `text-white rounded-2xl rounded-br-md shadow-sm`
                      : `bg-white text-[#2C3E50] rounded-2xl rounded-bl-md border shadow-sm`
                  } ${msg.type === "topic" ? "border-2 border-dashed" : ""}`}
                  style={
                    isMe
                      ? { background: `linear-gradient(135deg, ${t.accent}, ${t.primary})`, boxShadow: `0 2px 8px ${t.primary}30` }
                      : msg.type === "topic"
                      ? { borderColor: "#FFC800", background: "#FFFDF0" }
                      : { borderColor: t.cardBorder }
                  }
                >
                  {msg.type === "image" ? (
                    <div className="w-40 h-28 bg-gray-100 rounded-xl flex items-center justify-center">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="absolute bottom-[70px] left-0 right-0 bg-white/95 backdrop-blur-md border-t px-3 py-2 flex items-center gap-2" style={{ borderColor: t.cardBorder }}>
        <button className="p-2" onClick={() => toast("语音功能演示中", gender)}>
          <Mic size={20} color="#7f8c8d" />
        </button>
        <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 flex items-center" style={{ background: `${t.primary}08` }}>
          <input
            type="text"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent outline-none text-sm text-[#2C3E50] placeholder-[#b0b0b0]"
          />
          <button className="ml-2" onClick={() => toast("表情功能演示中", gender)}>
            <Smile size={18} color="#7f8c8d" />
          </button>
        </div>
        <button className="p-2" onClick={() => toast("相机功能演示中", gender)}>
          <Camera size={20} color="#7f8c8d" />
        </button>
        {input ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
            style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.primary})`, boxShadow: `0 2px 8px ${t.primary}30` }}
            onClick={handleSend}
          >
            <Send size={16} color="white" />
          </motion.button>
        ) : null}
      </div>

      <TabBar gender={gender} />
    </div>
  );
}
