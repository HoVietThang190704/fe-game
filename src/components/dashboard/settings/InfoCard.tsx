import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import React from "react";

export function InfoCard() {
  return (
    <Card className="border-cyan-400/30 bg-slate-950/40 py-3 text-sky-100 shadow-[0_0_32px_rgba(0,160,255,0.2)] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-300">Thông tin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-sky-200/75">
        <p>Version: 1.0.0</p>
        <p>© 2026 Minesweeper PvP</p>
        <p>Developed for educational purposes</p>
      </CardContent>
    </Card>
  );
}
