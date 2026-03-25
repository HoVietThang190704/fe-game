"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Zap, Shield, Eye } from "lucide-react";

interface PowerButtonsProps {
  onPower1?: () => void;
  onPower2?: () => void;
  onPower3?: () => void;
  disabled?: boolean;
}

export const PowerButtons: React.FC<PowerButtonsProps> = ({
  onPower1,
  onPower2,
  onPower3,
  disabled = false,
}) => {
  return (
    <div className="flex gap-8 justify-center flex-wrap">
      <Button
        onClick={onPower1}
        disabled={disabled}
        className="w-24 h-24 rounded-full p-0 flex items-center justify-center bg-yellow-600/40 hover:bg-yellow-600/60 border-yellow-500/50 text-yellow-300 hover:text-yellow-200 transition-all duration-200 hover:scale-110"
        variant="outline"
        title="Power 1"
      >
        <Zap className="w-10 h-10" />
      </Button>

      <Button
        onClick={onPower2}
        disabled={disabled}
        className="w-24 h-24 rounded-full p-0 flex items-center justify-center bg-blue-600/40 hover:bg-blue-600/60 border-blue-500/50 text-blue-300 hover:text-blue-200 transition-all duration-200 hover:scale-110"
        variant="outline"
        title="Power 2"
      >
        <Shield className="w-10 h-10" />
      </Button>

      <Button
        onClick={onPower3}
        disabled={disabled}
        className="w-24 h-24 rounded-full p-0 flex items-center justify-center bg-purple-600/40 hover:bg-purple-600/60 border-purple-500/50 text-purple-300 hover:text-purple-200 transition-all duration-200 hover:scale-110"
        variant="outline"
        title="Power 3"
      >
        <Eye className="w-10 h-10" />
      </Button>
    </div>
  );
};
