import React from "react";
import Image from "next/image";
import { LOGO_SIZE } from "@/src/lib/shared/constants/size";

interface AuthHeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
}

export default function AuthHeader({
  title = "Minesweeper PvP",
  subtitle = "Đăng nhập để bắt đầu chiến đấu",
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center">
        <Image
          src="/images/icon-logo.png"
          alt="logo"
          width={LOGO_SIZE.WIDTH}
          height={LOGO_SIZE.HEIGHT}
          priority
          unoptimized
        />
      </div>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-sm text-white/80">{subtitle}</p>
    </div>
  );
}
