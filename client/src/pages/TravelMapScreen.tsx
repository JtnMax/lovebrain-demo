/*
 * TravelMapScreen - 旅行地图
 * 国家/城市双层级 + 点亮效果 + 照片统计
 */
import { useApp, Gender } from "@/contexts/AppContext";
import { TRAVEL_MAP_DATA, THEME } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Camera, Globe, ChevronRight, Plane, Star } from "lucide-react";
import { useState } from "react";

export default function TravelMapScreen({ gender }: { gender: Gender }) {
  const { navigate, toast } = useApp();
  const t = gender === "female" ? THEME.female : THEME.male;
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { countries, stats } = TRAVEL_MAP_DATA;

  const country = selectedCountry ? countries.find((c) => c.code === selectedCountry) : null;

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-3">
        <button onClick={() => selectedCountry ? setSelectedCountry(null) : navigate("home", gender)} className="p-2">
          <ArrowLeft size={24} color="#2C3E50" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-[#2C3E50]">
          {selectedCountry ? country?.name : "旅行地图"}
        </h2>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {!selectedCountry ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-4 pb-8 space-y-4"
          >
            {/* Stats card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="love-card bg-gradient-to-r from-[#667eea] to-[#764ba2] border-none text-white p-5 relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Globe size={24} color="white" />
                </div>
                <div>
                  <p className="font-black text-lg">我们的足迹</p>
                  <p className="text-white/70 text-xs">一起走过的每一步</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="text-center bg-white/10 rounded-xl py-2">
                  <p className="font-black text-xl" style={{ fontFamily: "'Nunito'" }}>{stats.countriesVisited}</p>
                  <p className="text-white/60 text-[10px]">国家</p>
                </div>
                <div className="text-center bg-white/10 rounded-xl py-2">
                  <p className="font-black text-xl" style={{ fontFamily: "'Nunito'" }}>{stats.citiesVisited}</p>
                  <p className="text-white/60 text-[10px]">城市</p>
                </div>
                <div className="text-center bg-white/10 rounded-xl py-2">
                  <p className="font-black text-xl" style={{ fontFamily: "'Nunito'" }}>{stats.totalPhotos}</p>
                  <p className="text-white/60 text-[10px]">照片</p>
                </div>
              </div>
            </motion.div>

            {/* Visual map */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="love-card p-4"
            >
              <h3 className="font-bold text-[#2C3E50] text-sm mb-3 flex items-center gap-2">
                <Plane size={14} color={t.primary} />
                足迹地图
              </h3>
              {/* Simplified visual map */}
              <div className="relative w-full h-48 bg-gradient-to-b from-[#e8f4f8] to-[#d4e8f0] rounded-2xl overflow-hidden">
                {/* Simplified world outline */}
                <svg viewBox="0 0 400 200" className="w-full h-full opacity-20">
                  <path d="M50,80 Q100,40 150,70 T250,60 T350,80" fill="none" stroke="#2C3E50" strokeWidth="1" />
                  <path d="M80,100 Q130,80 180,100 T280,90 T380,100" fill="none" stroke="#2C3E50" strokeWidth="1" />
                  <path d="M60,130 Q110,110 160,130 T260,120 T360,130" fill="none" stroke="#2C3E50" strokeWidth="1" />
                </svg>
                {/* City dots */}
                {countries.flatMap((c) =>
                  c.cities.filter((city) => city.visited).map((city) => {
                    // Normalize coordinates to SVG space
                    const x = ((city.lng + 180) / 360) * 100;
                    const y = ((90 - city.lat) / 180) * 100;
                    return (
                      <motion.div
                        key={`${c.code}-${city.name}`}
                        className="absolute"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + Math.random() * 0.5, type: "spring" }}
                      >
                        <motion.div
                          className="w-3 h-3 rounded-full border-2 border-white shadow-md"
                          style={{ background: t.primary }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                        />
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#2C3E50] whitespace-nowrap">
                          {city.name}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Country list */}
            <div>
              <h3 className="font-bold text-[#2C3E50] text-sm mb-3">国家列表</h3>
              <div className="space-y-2">
                {countries.map((c, i) => (
                  <motion.button
                    key={c.code}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => setSelectedCountry(c.code)}
                    className="w-full love-card flex items-center gap-3"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: c.visited ? `${t.primary}15` : "#f0f0f0" }}
                    >
                      {c.visited ? (
                        <MapPin size={22} color={t.primary} />
                      ) : (
                        <MapPin size={22} color="#ccc" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${c.visited ? "text-[#2C3E50]" : "text-[#b0b0b0]"}`}>
                        {c.name}
                        {c.visited && <Star size={12} color="#FFC800" fill="#FFC800" className="inline ml-1" />}
                      </p>
                      <p className="text-xs text-[#7f8c8d]">
                        {c.cities.filter((ci) => ci.visited).length}/{c.cities.length} 城市 ·{" "}
                        {c.cities.reduce((sum, ci) => sum + ci.photos, 0)} 张照片
                      </p>
                    </div>
                    <ChevronRight size={18} color="#b0b0b0" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cities"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto px-4 pb-8 space-y-3"
          >
            {country?.cities.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="love-card flex items-center gap-3"
                onClick={() => city.visited && toast(`查看${city.name}的 ${city.photos} 张照片`, gender)}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    city.visited ? "" : "opacity-40"
                  }`}
                  style={{ background: city.visited ? `${t.primary}15` : "#f0f0f0" }}
                >
                  {city.visited ? (
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <MapPin size={24} color={t.primary} />
                    </motion.div>
                  ) : (
                    <MapPin size={24} color="#ccc" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${city.visited ? "text-[#2C3E50]" : "text-[#b0b0b0]"}`}>
                    {city.name}
                  </p>
                  {city.visited ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Camera size={10} color="#7f8c8d" />
                      <span className="text-xs text-[#7f8c8d]">{city.photos} 张照片</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#b0b0b0]">尚未解锁</p>
                  )}
                </div>
                {city.visited && (
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: t.primary }}>
                    已点亮
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
