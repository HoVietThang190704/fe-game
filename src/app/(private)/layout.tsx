import type { Metadata } from "next";
import "@/src/app/globals.css";

export const metadata: Metadata = {
  title: "Minesweeper PvP Dashboard",
  description: "Player dashboard in private area",
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-slate-950 text-sky-100">
      {children}
    </section>
  );
}
