/*
 * Toast - 轻提示组件 (支持双人视角)
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ gender }: { gender?: Gender }) {
  const { femaleState, maleState, activeGender } = useApp();
  const g = gender || activeGender;
  const state = g === "female" ? femaleState : maleState;
  const theme = g === "female" ? THEME.female : THEME.male;

  return (
    <AnimatePresence>
      {state.showToast && (
        <motion.div
          initial={{ y: -40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.9 }}
          className="absolute top-14 left-4 right-4 z-[100] text-center"
        >
          <div
            className="inline-block px-5 py-2.5 rounded-2xl text-white text-sm font-semibold shadow-lg"
            style={{ background: theme.primary }}
          >
            {state.showToast}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
