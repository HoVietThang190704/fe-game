import { Copy } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface RoomPinSectionProps {
  roomPin: string;
  isCreatingRoom: boolean;
  roomError: string | null;
  copyStatus: string | null;
  onCopyPin: () => void;
}

export function RoomPinSection({ roomPin, isCreatingRoom, roomError, copyStatus, onCopyPin }: RoomPinSectionProps) {
  return (
    <section className="mb-6 rounded-2xl border border-sky-300/20 bg-slate-900/40 p-5 md:p-6">
      <p className="mb-3 text-center text-sm font-semibold tracking-widest text-cyan-200/80">MÃ PIN PHÒNG</p>
      <div className="flex items-center justify-center gap-2">
        <div className="rounded-xl bg-slate-950/70 px-4 py-2 text-3xl font-extrabold tracking-[0.35em] text-cyan-100 md:text-4xl">
          {roomPin}
        </div>
        <Button
          type="button"
          size="icon"
          onClick={onCopyPin}
          aria-label="Copy room pin"
          disabled={isCreatingRoom || roomPin === "----"}
          className="h-10 w-10 rounded-lg border border-cyan-300/40 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/35"
        >
          <Copy className="size-5" />
        </Button>
      </div>

      {isCreatingRoom && <p className="mt-3 text-center text-sm text-sky-100/70">Đang tạo phòng...</p>}
      {roomError && <p className="mt-3 text-center text-sm text-red-300">{roomError}</p>}
      {copyStatus && <p className="mt-3 text-center text-sm text-emerald-300">{copyStatus}</p>}
    </section>
  );
}
