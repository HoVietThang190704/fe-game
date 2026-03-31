import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pinCode: string) => Promise<void>;
}

export function JoinRoomModal({
  isOpen,
  onClose,
  onSubmit,
}: JoinRoomModalProps) {
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPinCode("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPinCode(value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 4) return;

    setIsLoading(true);
    try {
      await onSubmit(pinCode);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tham gia phòng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && pinCode.length === 4 && !isLoading) {
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isSubmitDisabled = pinCode.length !== 4 || isLoading;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm transform rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/95 to-slate-950/95 p-8 shadow-[0_0_64px_rgba(34,211,238,0.2)] transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-widest text-cyan-300">
              NHẬP MÃ PHÒNG
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-sky-200/70 transition-all hover:bg-sky-200/10 hover:text-cyan-300 active:scale-95"
              aria-label="Close modal"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input */}
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-sky-200">
                Mã PIN (4 chữ số)
              </label>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={pinCode}
                onChange={handlePinChange}
                onKeyDown={handleKeyDown}
                placeholder="0000"
                maxLength={4}
                className={`w-full rounded-lg border-2 bg-slate-950/40 px-4 py-3 text-center text-3xl font-bold tracking-[0.5em] transition-all ${
                  error
                    ? "border-red-400/50 text-red-300"
                    : "border-cyan-400/30 text-cyan-300 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                }`}
                disabled={isLoading}
                autoComplete="off"
              />
              {error && (
                <p className="mt-2 text-sm font-semibold text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Info text */}
            <p className="text-xs text-sky-200/50 text-center">
              Nhập mã 4 chữ số của phòng mà bạn muốn tham gia
            </p>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg border border-sky-200/30 bg-slate-800/40 px-4 py-3 font-bold uppercase tracking-widest text-sky-200 transition-all hover:bg-slate-700/40 hover:border-sky-200/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`flex-1 rounded-lg px-4 py-3 font-bold uppercase tracking-widest transition-all active:scale-95 ${
                  isSubmitDisabled
                    ? "border border-cyan-400/20 bg-slate-900/30 text-cyan-300/40 cursor-not-allowed"
                    : "border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30"
                }`}
              >
                {isLoading ? "Đang tham gia..." : "Tham gia"}
              </button>
            </div>
          </form>

          {/* Decorative corner glow */}
          <div className="absolute -right-12 -top-12 h-32 w-32 bg-cyan-400/5 blur-3xl pointer-events-none" />
        </div>
      </div>
    </>
  );
}
