import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { UserCog, Lock, ChevronRight } from "lucide-react";
import React from "react";

export function AccountSettingsCard() {
  return (
    <Card className="border-cyan-400/30 bg-slate-950/40 py-3 text-sky-100 shadow-[0_0_32px_rgba(0,160,255,0.2)] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-300">Tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-cyan-400/30 bg-slate-900/40 px-4 py-3 text-left hover:bg-cyan-500/10"
        >
          <span className="inline-flex items-center gap-3 font-medium">
            <UserCog className="h-4 w-4 text-cyan-300" />
            Chỉnh sửa hồ sơ
          </span>
          <ChevronRight className="h-4 w-4 text-sky-200/70" />
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-cyan-400/30 bg-slate-900/40 px-4 py-3 text-left hover:bg-cyan-500/10"
        >
          <span className="inline-flex items-center gap-3 font-medium">
            <Lock className="h-4 w-4 text-cyan-300" />
            Đổi mật khẩu
          </span>
          <ChevronRight className="h-4 w-4 text-sky-200/70" />
        </button>
      </CardContent>
    </Card>
  );
}
