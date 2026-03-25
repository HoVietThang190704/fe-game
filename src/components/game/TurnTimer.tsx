"use client";

import React, { useEffect, useState, useCallback } from "react";

interface TurnTimerProps {
  isActive: boolean;
  onTimeout?: () => void;
  duration?: number;
}

export const TurnTimer: React.FC<TurnTimerProps> = ({
  isActive,
  onTimeout,
  duration = 60,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeout?.();
          return duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, duration, onTimeout]);

  const isWarning = timeLeft <= 10;

  return (
    <div
      className={`flex items-center justify-center px-8 py-6 rounded-lg transition-all duration-300 ${
        isWarning
          ? "bg-red-900/40 border border-red-500/50"
          : "bg-sky-900/40 border border-sky-500/50"
      }`}
    >
      <span
        className={`font-bold text-4xl ${
          isWarning ? "text-red-300" : "text-sky-300"
        }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
};
