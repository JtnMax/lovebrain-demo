/*
 * AlbumScreen - 相册列表
 */
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Lock } from "lucide-react";

const albums = [
  {
    id: 1,
    title: "日常",
    count: 24,
    cover: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=300&fit=crop",
    isPrivate: false,
  },
  {
    id: 2,
    title: "旅行",
    count: 18,
    cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop",
    isPrivate: false,
  },
  {
    id: 3,
    title: "美食",
    count: 12,
    cover: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop",
    isPrivate: false,
  },
  {
    id: 4,
    title: "私密相册",
    count: 6,
    cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop",
    isPrivate: true,
  },
];

export default function AlbumScreen() {
  const { navigate, toast } = useApp();

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate("profile")} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">相册</h2>
        <button
          onClick={() => toast("创建相册")}
          className="w-9 h-9 bg-[#4ECDC4] rounded-full flex items-center justify-center"
        >
          <Plus size={18} color="white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {albums.map((album, i) => (
            <motion.button
              key={album.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => toast("查看相册详情")}
              className="love-card p-0 overflow-hidden text-left"
            >
              <div className="aspect-square relative">
                <img
                  src={album.cover}
                  alt={album.title}
                  className={`w-full h-full object-cover ${album.isPrivate ? "blur-sm" : ""}`}
                />
                {album.isPrivate && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Lock size={32} color="white" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-bold text-[#2C3E50] text-sm">{album.title}</p>
                <p className="text-xs text-[#7f8c8d]">{album.count} 张照片</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
