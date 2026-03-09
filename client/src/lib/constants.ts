// 恋爱脑 LoveBrain - 常量配置
// Jelly Pop 弹性美学 - 多邻国风格 - 双人视角

export const MASCOT = {
  happy: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-happy-RNKBz7VAxSdvZuPLNRGMRX.webp",
  love: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-love-EmZW2sDMpu5Bd33dfAnuQj.webp",
  thinking: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-thinking-Wj5LvmxGZD82XNr2ewwGfj.webp",
  waving: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-waving-mnaMLDFm3hpsh42PhEJpn5.webp",
  celebrate: "https://d2xsxph8kpxj0f.cloudfront.net/310519663396792170/KSmiRUXhwhDPoqMSgYEJVa/mascot-celebrate-Vac7MvyoC87rpvVp97SAbn.webp",
} as const;

export const APP_NAME = "恋爱脑";
export const APP_SLOGAN = "让爱更有温度";

// 双人用户数据
export const USERS = {
  female: {
    name: "小心心",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    zodiac: "双鱼座",
    zodiacEmoji: "♓",
  },
  male: {
    name: "大宝贝",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    zodiac: "狮子座",
    zodiacEmoji: "♌",
  },
} as const;

export const COUPLE_INFO = {
  daysInLove: 365,
  startDate: "2025-03-03",
};

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

// 模拟纪念日数据
export const MOCK_ANNIVERSARIES = [
  { id: 1, title: "在一起纪念日", date: "2025-03-03", emoji: "💕", daysLeft: 0, isPast: false },
  { id: 2, title: "TA的生日", date: "2025-06-15", emoji: "🎂", daysLeft: 104, isPast: false },
  { id: 3, title: "第一次约会", date: "2025-02-14", emoji: "🌹", daysLeft: -17, isPast: true },
  { id: 4, title: "第一次旅行", date: "2025-05-01", emoji: "✈️", daysLeft: 59, isPast: false },
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

// 宇宙来信 - 星座运势数据
export const COSMOS_DATA = {
  female: {
    zodiac: "双鱼座",
    emoji: "♓",
    element: "水象",
    loveScore: 92,
    moodScore: 88,
    luckyColor: "薰衣草紫",
    luckyNumber: 7,
    todayFortune: "今天的你散发着温柔的光芒，适合向TA表达内心的感受。下午时分可能会收到一个小惊喜，保持期待吧！",
    coupleAdvice: "今天适合一起做些安静的事情，比如看一部电影或者散步。避免在小事上较真，多一些包容会让关系更甜蜜。",
    weekFortune: "本周感情运势上升，周三是表白或深谈的好时机。周末适合一起出游，会有意想不到的浪漫时刻。",
  },
  male: {
    zodiac: "狮子座",
    emoji: "♌",
    element: "火象",
    loveScore: 85,
    moodScore: 90,
    luckyColor: "琥珀金",
    luckyNumber: 3,
    todayFortune: "今天充满行动力，适合主动为TA做一些事情。你的热情会感染到对方，让TA感受到被重视。",
    coupleAdvice: "今天可以主动策划一个小约会，不需要太隆重，一杯奶茶一次散步就够了。记得多倾听TA的想法。",
    weekFortune: "本周事业和感情都有好运，但要注意平衡。周四可能会有小摩擦，保持冷静是关键。周末是修复和升温的好时机。",
  },
  compatibility: {
    score: 89,
    summary: "水火交融，互补共生",
    detail: "双鱼的温柔恰好能融化狮子的骄傲，而狮子的勇敢则给了双鱼安全感。你们是互补型的绝佳搭配！",
    tips: ["多给对方独处的空间", "用行动代替言语表达爱", "每周至少一次深度对话"],
  },
};

// 旅行地图数据
export const TRAVEL_MAP_DATA = {
  countries: [
    {
      name: "中国",
      code: "CN",
      visited: true,
      cities: [
        { name: "北京", visited: true, photos: 12, lat: 39.9, lng: 116.4 },
        { name: "上海", visited: true, photos: 8, lat: 31.2, lng: 121.5 },
        { name: "厦门", visited: true, photos: 24, lat: 24.5, lng: 118.1 },
        { name: "成都", visited: true, photos: 6, lat: 30.6, lng: 104.1 },
        { name: "三亚", visited: false, photos: 0, lat: 18.3, lng: 109.5 },
      ],
    },
    {
      name: "日本",
      code: "JP",
      visited: true,
      cities: [
        { name: "东京", visited: true, photos: 18, lat: 35.7, lng: 139.7 },
        { name: "京都", visited: true, photos: 15, lat: 35.0, lng: 135.8 },
        { name: "大阪", visited: false, photos: 0, lat: 34.7, lng: 135.5 },
      ],
    },
    {
      name: "泰国",
      code: "TH",
      visited: false,
      cities: [
        { name: "曼谷", visited: false, photos: 0, lat: 13.8, lng: 100.5 },
        { name: "清迈", visited: false, photos: 0, lat: 18.8, lng: 99.0 },
      ],
    },
  ],
  stats: {
    countriesVisited: 2,
    citiesVisited: 6,
    totalPhotos: 83,
    totalCountries: 3,
    totalCities: 10,
  },
};

// 找话题 - AI话题卡数据
export const TOPIC_CARDS = {
  light: [
    { id: 1, text: "如果我们可以交换一天的身体，你最想做什么？", emoji: "🔄" },
    { id: 2, text: "你觉得我最可爱的瞬间是什么时候？", emoji: "😊" },
    { id: 3, text: "如果我们是一对动物CP，你觉得会是什么？", emoji: "🐾" },
    { id: 4, text: "你手机里最舍不得删的我的照片是哪张？", emoji: "📱" },
  ],
  deep: [
    { id: 5, text: "你觉得我们之间最需要改善的一件事是什么？", emoji: "💭" },
    { id: 6, text: "十年后你希望我们的生活是什么样的？", emoji: "🏡" },
    { id: 7, text: "你最感谢我为你做过的一件事是什么？", emoji: "🙏" },
    { id: 8, text: "有没有什么话你一直想对我说但没说出口？", emoji: "💌" },
  ],
  action: [
    { id: 9, text: "今天一起做一道新菜吧！选一个你们都没试过的菜谱", emoji: "👨‍🍳" },
    { id: 10, text: "互相写一封手写信，明天交换", emoji: "✉️" },
    { id: 11, text: "一起去一个你们都没去过的地方散步", emoji: "🚶" },
    { id: 12, text: "给对方拍10张今天的照片，晚上一起选最好的", emoji: "📸" },
  ],
};

// 配色方案
export const THEME = {
  female: {
    primary: "#FF6B8A",
    primaryDark: "#e0526e",
    primaryLight: "#FFF0F3",
    gradient: "from-[#FF9A9E] to-[#FF6B8A]",
    gradientBg: "from-[#FFF0F3] via-[#FFFBF5] to-[#FFE8EE]",
    accent: "#FF9A9E",
    bg: "#FFFBF5",
    cardBorder: "#f0e6e0",
    label: "她",
    name: "小心心",
  },
  male: {
    primary: "#4A90D9",
    primaryDark: "#3670B0",
    primaryLight: "#EBF3FC",
    gradient: "from-[#74B9FF] to-[#4A90D9]",
    gradientBg: "from-[#EBF3FC] via-[#F5F9FF] to-[#E0ECFA]",
    accent: "#74B9FF",
    bg: "#F5F9FF",
    cardBorder: "#dce6f0",
    label: "他",
    name: "大宝贝",
  },
  shared: {
    text: "#2C3E50",
    textSecondary: "#7f8c8d",
    textMuted: "#b0b0b0",
    green: "#58CC02",
    greenDark: "#46a302",
    orange: "#FF6B35",
    yellow: "#FFC800",
    purple: "#B8A9C9",
    mint: "#4ECDC4",
    cream: "#FFFBF5",
  },
} as const;
