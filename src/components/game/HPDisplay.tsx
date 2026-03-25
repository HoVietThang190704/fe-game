"use client";

import React from "react";
import { Heart } from "lucide-react";

interface HPDisplayProps {
  hp: number;
  maxHP?: number;
}

export const HPDisplay: React.FC<HPDisplayProps> = ({ hp, maxHP = 3 }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      {Array.from({ length: maxHP }).map((_, index) => (
        <Heart
          key={index}
          className={`w-6 h-6 transition-all duration-300 ${
            index < hp
              ? "fill-red-500 text-red-500"
              : "fill-gray-400 text-gray-400"
          }`}
        />
      ))}
      <span className="text-sm font-bold text-sky-200 ml-2">
        {hp}/{maxHP}
      </span>
    </div>
  );
};
