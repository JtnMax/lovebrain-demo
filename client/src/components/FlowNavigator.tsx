/*
 * FlowNavigator - 页面流程导航器
 * 根据AppContext的currentScreen渲染对应页面
 */
import { useApp } from "@/contexts/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "@/pages/SplashScreen";
import WelcomeScreen from "@/pages/WelcomeScreen";
import LoginScreen from "@/pages/LoginScreen";
import BindScreen from "@/pages/BindScreen";
import OnboardingScreen from "@/pages/OnboardingScreen";
import HomeScreen from "@/pages/HomeScreen";
import SignalSendScreen from "@/pages/SignalSendScreen";
import ChatScreen from "@/pages/ChatScreen";
import TimelineScreen from "@/pages/TimelineScreen";
import CollectionScreen from "@/pages/CollectionScreen";
import ProfileScreen from "@/pages/ProfileScreen";
import AnniversaryScreen from "@/pages/AnniversaryScreen";
import WishesScreen from "@/pages/WishesScreen";
import DiaryCreateScreen from "@/pages/DiaryCreateScreen";
import AlbumScreen from "@/pages/AlbumScreen";
import SettingsScreen from "@/pages/SettingsScreen";
import EndRelationshipScreen from "@/pages/EndRelationshipScreen";
import LoadingScreen from "@/pages/LoadingScreen";

const screenMap: Record<string, React.ComponentType> = {
  splash: SplashScreen,
  welcome: WelcomeScreen,
  login: LoginScreen,
  bind: BindScreen,
  "bind-confirm": BindScreen,
  onboarding: OnboardingScreen,
  home: HomeScreen,
  "signal-send": SignalSendScreen,
  chat: ChatScreen,
  "chat-detail": ChatScreen,
  timeline: TimelineScreen,
  collection: CollectionScreen,
  profile: ProfileScreen,
  anniversary: AnniversaryScreen,
  "anniversary-create": AnniversaryScreen,
  "anniversary-review": AnniversaryScreen,
  wishes: WishesScreen,
  "wish-create": WishesScreen,
  "diary-create": DiaryCreateScreen,
  album: AlbumScreen,
  "album-detail": AlbumScreen,
  settings: SettingsScreen,
  "end-relationship": EndRelationshipScreen,
  loading: LoadingScreen,
};

export default function FlowNavigator() {
  const { currentScreen } = useApp();
  const Screen = screenMap[currentScreen] || HomeScreen;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
