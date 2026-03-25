"use client";

import React from "react";
import { logout } from "@/src/lib/api/auth";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, LogOut } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { SettingsHeaderCard } from "@/components/dashboard/settings/SettingsHeaderCard";
import { GameSettingsCard } from "@/components/dashboard/settings/GameSettingsCard";
import { AccountSettingsCard } from "@/components/dashboard/settings/AccountSettingsCard";
import { InfoCard } from "@/components/dashboard/settings/InfoCard";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [language, setLanguage] = React.useState("vi");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const darkModeEnabled = mounted ? theme !== "light" : true;

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      await logout(refreshToken);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng xuất thất bại";
      alert(message);
    }
  };

  return (
    <main className="justify-center py-10 px-4">
      <div className="max-w-2xl mx-auto w-full gap-2 flex flex-col">
        <Button
          asChild
          variant="outline"
          className="w-fit border-cyan-500/30 bg-slate-900/50 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100"
        >
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>

        <SettingsHeaderCard />
        <GameSettingsCard
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          darkModeEnabled={darkModeEnabled}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
        />
        <AccountSettingsCard />
        <InfoCard />

        <Button
          variant="destructive"
          className="mt-1 h-10 w-full border border-red-400/40 bg-red-600/90 text-sm font-semibold text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </main>
  );
}
