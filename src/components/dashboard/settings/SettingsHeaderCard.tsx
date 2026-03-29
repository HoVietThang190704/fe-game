import { Card, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import React from "react";

export function SettingsHeaderCard() {
  return (
    <Card className="border-cyan-400/30 bg-slate-950/40 py-3 text-sky-100 shadow-[0_0_32px_rgba(0,160,255,0.2)] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-4xl font-bold tracking-wide text-cyan-300">Cài đặt</CardTitle>
        <CardDescription className="text-sky-200/75">
          Tùy chỉnh trải nghiệm của bạn
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
