/*
 * PhoneFrame - 手机模拟器外壳
 * Jelly Pop 弹性美学 - 模拟真实手机体验
 */
import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-frame">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[28px] bg-[#1a1a1a] rounded-b-[20px] z-50 flex items-center justify-center">
        <div className="w-[60px] h-[4px] bg-[#333] rounded-full mt-1" />
      </div>
      {/* Content */}
      <div className="phone-content">
        {children}
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black/20 rounded-full z-50" />
    </div>
  );
}
