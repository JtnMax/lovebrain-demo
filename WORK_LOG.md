# 恋爱脑 LoveBrain 项目工作记录 (WORK_LOG)

## 1. 项目概览 (Project Overview)

### 1.1 项目目的
"恋爱脑"是一款面向情侣的"情绪价值优先"情感互动产品。其核心目标是在不制造压力和焦虑的前提下，让双方在日常生活中持续、低成本地感知到"被在乎"和"被记得"。

### 1.2 核心愿景
*   **低压交互**：通过"关心信号"而非繁重的文字聊天来传递情感。
*   **双人视角**：产品设计强调"对称性"，确保双方在互动中的体验是平等且同步的。
*   **情感沉淀**：通过纪念日、恋爱历程、收藏馆等模块，记录和固化双方的情感点滴。

---

## 2. 逻辑规则与设计 (Logic & Design Rules)

### 2.1 双人视角交互规则
*   **分屏演示模式**：在 Demo 阶段，采用"左右双手机"布局。左侧固定为女方视角（粉色系），右侧固定为男方视角（蓝色系）。
*   **同步导航**：流程导航面板的操作会同时驱动两部手机跳转到对应页面，以便直观展示双向交互逻辑。
*   **心动信号连线**：当一方发送信号时，屏幕中间会出现飞向另一方的动画。

### 2.2 配色与视觉系统
*   **性别差异化配色**：
    *   **女方 (Female)**：以 `#FF6B8A` (Primary Pink) 为核心，搭配温暖的米白色背景。
    *   **男方 (Male)**：以 `#4A90D9` (Primary Blue) 为核心，搭配淡蓝色的中性背景。
*   **设计风格**：采用 **Jelly Pop (弹性美学)**，借鉴多邻国 (Duolingo) 的圆润感和动态反馈。

### 2.3 核心业务逻辑
*   **关心信号 (Care Signal)**：
    *   发送方选择 Emoji + 预设文本 -> 点击发送。
    *   接收方手机自动跳转至"接收信号"页面，并弹出 Toast 提示。
    *   全局"信号记录"面板实时更新。
*   **即时通信 (Chat)**：
    *   共享消息列表，但气泡颜色和左右位置根据当前视角自动翻转。
*   **私密图片 (Private Photo)**：
    *   发送方在聊天页点击相机图标 → 选择"私密图片" → 发送占位气泡。
    *   接收方点击占位气泡 → 进入 `PrivatePhotoScreen`。
    *   按住按钮查看图片，松手立即销毁；超过 5s 自动销毁。
*   **宇宙来信 (Cosmos Letter)**：
    *   基于双方星座提供每日运势和匹配度建议，增强趣味性。
*   **旅行地图 (Travel Map)**：
    *   记录共同去过的国家和城市，以足迹点亮的形式展示。

---

## 3. 技术架构 (Technical Architecture)

### 3.1 前端堆栈
*   **框架**：React + Vite + TypeScript
*   **样式**：TailwindCSS + Framer Motion (用于所有弹性动画)
*   **图标**：Lucide React
*   **状态管理**：React Context (AppContext.tsx)，负责管理双手机的独立状态、导航逻辑及共享的信号/消息数据。

### 3.2 核心组件说明
*   `AppContext.tsx`：项目的"大脑"，定义了 `femaleState` 和 `maleState`。
*   `Home.tsx`：主入口，实现了双屏布局、导航面板和信号记录面板。
*   `FlowNavigator.tsx`：路由分发器，根据 Context 状态动态渲染当前页面。
*   `useGenderTheme.ts`：自定义 Hook，根据当前操作的性别自动注入对应的色值和配置。

---

## 4. 开发进度 (Development Progress)

### 4.1 已完成 (Completed)
- [x] **双屏框架**：实现左右分屏及单双屏切换逻辑。
- [x] **配色系统**：完成女粉男蓝的差异化主题配置。
- [x] **流程导航**：实现可控制双端同步跳转的导航面板。
- [x] **核心流程演示**：
    - [x] 启动/欢迎/登录/绑定/引导流程。
    - [x] 关心信号发送与接收全流程（含飞行动画）。
    - [x] 宇宙来信（星座运势）功能实现。
    - [x] 旅行地图功能实现。
    - [x] AI 话题卡（找话题）功能实现。
    - [x] 即时通信（聊天）双视角适配。
    - [x] 纪念日、时间轴、相册、愿望清单等 18+ 个功能页面的主题适配。

### 4.2 进行中 → 已完成 (Completed in This Session)
- [x] **代码清理**：
    - 为 `CollectionScreen.tsx` 中的 `filterColors` 添加语义化注释，说明与 THEME 的对应关系。
    - 扩展 `AppContext.tsx` 的 `ChatMessage.type` 联合类型，加入 `"private-photo"` 以消除 `as any` 强制转换。
- [x] **交互微调**：
    - 优化 `SignalSendScreen.tsx` 中信号发送后的逻辑注释，明确 `AppContext.sendSignal` 已在 300ms 后自动导航发送方回首页，避免重复调用 `navigate`。
    - 改进 Toast 提示文案（加入 💌 emoji，更有温度）。

### 4.3 待完成 → 已完成 (Completed in This Session)
- [x] **私密图片** (`PrivatePhotoScreen.tsx` 新增)：
    - 实现"按住查看、松手销毁"完整交互逻辑（SRS D3）。
    - 按住时展示图片 + 倒计时进度条；松手后立即进入"已销毁"状态。
    - 超过 5s 自动销毁，带粒子爆炸动画。
    - 图片上叠加水印"仅限查看"防截图提示。
    - 聊天页（`ChatScreen.tsx`）新增额外面板（相机按钮展开），包含"私密图片"入口。
    - 聊天消息列表新增私密图片占位气泡（发送方显示"已发送"，接收方显示"点击查看·看完即焚"）。
    - `FlowNavigator.tsx` 注册 `private-photo` 路由；`Home.tsx` 流程导航面板添加入口。
- [x] **结束关系** (`EndRelationshipScreen.tsx` 重写)：
    - **Step 0**：信息说明页（冷静期规则、可恢复、数据保护、再绑定限制四张卡片）。
    - **Step 1**：最终确认（选择原因 + 伴侣信息卡）。
    - **Step 2**：冷静期倒计时（实时倒计时 + 进度条；发起方可直接撤回；非发起方可提交恢复申请；演示跳过按钮）。
    - **Step 3**：正式结束二次确认（归档/限制/导出说明）。
    - **Step 4**：数据导出模拟（导出内容清单 + 邮箱输入 + 打包动画 + 成功状态）。
    - **Step 5**：归档完成（保留期说明 + 爱情银行延长入口 + 返回首页）。

### 4.4 待完成 (Remaining Backlog)
- [ ] **后端集成**：目前均为 Mock 数据，demo 不集成后端。

---

## 5. 交接说明 (Handover Notes)

### 5.1 如何继续开发
1.  **新增页面**：在 `pages/` 创建组件，并在 `FlowNavigator.tsx` 的 `screenMap` 中注册。
2.  **修改主题**：在 `lib/constants.ts` 的 `THEME` 对象中调整全局色值。
3.  **调试交互**：利用左侧"流程导航"快速切换场景，观察两部手机的同步状态。

### 5.2 核心文件位置
*   逻辑中心：`client/src/contexts/AppContext.tsx`
*   样式定义：`client/src/lib/constants.ts`
*   主页面：`client/src/pages/Home.tsx`
*   私密图片：`client/src/pages/PrivatePhotoScreen.tsx`（新增）
*   结束关系：`client/src/pages/EndRelationshipScreen.tsx`（重写）
