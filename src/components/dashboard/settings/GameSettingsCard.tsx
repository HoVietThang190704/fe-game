import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { Volume2, Moon, Globe } from "lucide-react";
import React from "react";

interface GameSettingsCardProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  darkModeEnabled: boolean;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export function GameSettingsCard({
  soundEnabled,
  setSoundEnabled,
  darkModeEnabled,
  setTheme,
  language,
  setLanguage,
}: GameSettingsCardProps) {
  return (
    <Card className="border-cyan-400/30 bg-slate-950/40 py-3 text-sky-100 shadow-[0_0_32px_rgba(0,160,255,0.2)] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-300">Cài đặt game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Volume2 className="mt-0.5 h-5 w-5 text-cyan-300" />
            <div>
              <p className="font-semibold">Âm thanh</p>
              <p className="text-sm text-sky-200/70">Bật/tắt hiệu ứng âm thanh</p>
            </div>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Moon className="mt-0.5 h-5 w-5 text-cyan-300" />
            <div>
              <p className="font-semibold">Chế độ tối</p>
              <p className="text-sm text-sky-200/70">Giao diện tối cho mắt</p>
            </div>
          </div>
          <Switch
            checked={darkModeEnabled}
            onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 text-cyan-300" />
            <div>
              <p className="font-semibold">Ngôn ngữ</p>
              <p className="text-sm text-sky-200/70">Chọn ngôn ngữ hiển thị</p>
            </div>
          </div>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-36 border-cyan-500/30 bg-slate-900/50 text-sky-100">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent className="border-cyan-500/30 bg-slate-900 text-sky-100">
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
