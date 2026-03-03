// 恋爱脑 LoveBrain - 常量配置
// Jelly Pop 弹性美学 - 多邻国风格

export const MASCOT = {
  happy: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-happy-RNKBz7VAxSdvZuPLNRGMRX.webp",
  love: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-love-EmZW2sDMpu5Bd33dfAnuQj.webp",
  thinking: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-thinking-Wj5LvmxGZD82XNr2ewwGfj.webp",
  waving: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-waving-mnaMLDFm3hpsh42PhEJpn5.webp",
  celebrate: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-celebrate-Vac7MvyoC87rpvVp97SAbn.webp",
} as const;

export const APP_NAME = "恋爱脑";
export const APP_SLOGAN = "让爱更有温度";

// 预设关心信号
export const CARE_SIGNALS = [
  { id: 1, emoji: "🤗", text: "想你了", color: "#FF6B8A" },
  { id: 2, emoji: "😘", text: "想抱抱", color: "#FF9A9E" },
  { id: 3, emoji: "🍽️", text: "记得吃饭", color: "#FF6B35" },
  { id: 4, emoji: "😴", text: "早点休息", color: "#B8A9C9" },
  { id: 5, emoji: "💪", text: "加油打气", color: "#58CC02" },
  { id: 6, emoji: "🌧️", text: "记得带伞", color: "#4ECDC4" },
  { id: 7, emoji: "❤️", text: "我爱你", color: "#FF6B8A" },
  { id: 8, emoji: "🎉", text: "有好消息", color: "#FFC800" },
] as const;

// 模拟用户数据
export const MOCK_USER = {
  name: "小心心",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  partnerId: "partner_001",
  partnerName: "大宝贝",
  partnerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  daysInLove: 365,
  joinDate: "2025-03-03",
};

// 模拟纪念日数据
export const MOCK_ANNIVERSARIES = [
  { id: 1, title: "在一起纪念日", date: "2025-03-03", emoji: "💕", daysLeft: 0, isPast: false },
  { id: 2, title: "TA的生日", date: "2025-06-15", emoji: "🎂", daysLeft: 104, isPast: false },
  { id: 3, title: "第一次约会", date: "2025-02-14", emoji: "🌹", daysLeft: -17, isPast: true },
  { id: 4, title: "第一次旅行", date: "2025-05-01", emoji: "✈️", daysLeft: 59, isPast: false },
];

// 模拟聊天消息
export const MOCK_MESSAGES = [
  { id: 1, sender: "me", text: "今天天气真好，想出去走走", time: "09:30", type: "text" as const },
  { id: 2, sender: "partner", text: "好呀！去哪里？", time: "09:31", type: "text" as const },
  { id: 3, sender: "me", text: "去公园吧，听说樱花开了", time: "09:32", type: "text" as const },
  { id: 4, sender: "partner", text: "太棒了！我马上准备", time: "09:33", type: "text" as const },
  { id: 5, sender: "me", text: "[图片]", time: "09:35", type: "image" as const },
  { id: 6, sender: "partner", text: "好美啊！等我到了一起拍照", time: "09:36", type: "text" as const },
];

// 模拟时间轴数据
export const MOCK_TIMELINE = [
  { id: 1, date: "2025-03-03", title: "我们在一起了", content: "在星巴克的那个下午，你说了那句话...", emoji: "💕", type: "milestone" },
  { id: 2, date: "2025-03-14", title: "白色情人节", content: "你送了我一束白玫瑰", emoji: "🌹", type: "anniversary" },
  { id: 3, date: "2025-04-05", title: "第一次做饭", content: "虽然有点糊了，但是很开心", emoji: "🍳", type: "diary" },
  { id: 4, date: "2025-05-01", title: "第一次旅行", content: "去了厦门，海风很舒服", emoji: "✈️", type: "milestone" },
  { id: 5, date: "2025-06-15", title: "你的生日", content: "偷偷准备了惊喜派对", emoji: "🎂", type: "anniversary" },
  { id: 6, date: "2025-08-07", title: "七夕节", content: "在摩天轮上看了日落", emoji: "🎡", type: "milestone" },
];

// 模拟收藏数据
export const MOCK_COLLECTIONS = [
  { id: 1, type: "photo", title: "樱花树下", date: "2025-03-20", thumbnail: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=300&fit=crop" },
  { id: 2, type: "note", title: "给你的第一封信", date: "2025-03-03", content: "亲爱的，从今天起..." },
  { id: 3, type: "photo", title: "海边日落", date: "2025-05-02", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop" },
  { id: 4, type: "voice", title: "生日祝福", date: "2025-06-15", duration: "0:32" },
  { id: 5, type: "photo", title: "摩天轮", date: "2025-08-07", thumbnail: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300&h=300&fit=crop" },
  { id: 6, type: "note", title: "100天纪念", date: "2025-06-11", content: "不知不觉已经100天了..." },
];

// 模拟愿望/计划数据
export const MOCK_WISHES = [
  { id: 1, title: "一起看一次极光", done: false, emoji: "🌌" },
  { id: 2, title: "学做一道对方爱吃的菜", done: true, emoji: "🍳" },
  { id: 3, title: "一起养一只猫", done: false, emoji: "🐱" },
  { id: 4, title: "去迪士尼乐园", done: false, emoji: "🏰" },
  { id: 5, title: "一起跑一次马拉松", done: false, emoji: "🏃" },
  { id: 6, title: "拍一组情侣写真", done: true, emoji: "📸" },
];
