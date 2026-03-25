"use client";

import { useRouter } from "next/navigation";
import { ResultScreen } from "@/src/components/game/ResultScreen";

export default function ResultPage() {
  const router = useRouter();

  // Mock data - thay đổi các giá trị để test
  const mockPlayerResult = {
    name: "Player123",
    eloChange: 35,
    newRank: 1285,
    isWinner: true,
  };

  const mockMatchStats = {
    duration: "5:32",
    moves: 28,
    bombsStepped: 2,
  };

  return (
    <ResultScreen
      playerResult={mockPlayerResult}
      matchStats={mockMatchStats}
      onBackHome={() => {
        console.log("Trở về dashboard");
        router.push("/dashboard");
      }}
      onPlayAgain={() => {
        console.log("Chơi ván mới");
        router.push("/dashboard/waiting-room");
      }}
    />
  );
}
