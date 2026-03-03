/*
 * Toast - 轻提示组件
 */
import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { showToast } = useApp();

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-[60] bg-[#2C3E50] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg"
        >
          {showToast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
