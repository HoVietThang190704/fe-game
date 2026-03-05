"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/src/components/loginpage/login-form";
import { Toaster, toast } from "sonner";
import AuthHeader from "@/src/components/auth-header";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Đăng nhập thành công");
    router.push("/dashboard");
  };

  const handleError = (msg: string) => {
    toast.error(msg || "Đăng nhập thất bại");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Toaster richColors position="bottom-right" />

      <main
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-sm shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <AuthHeader />

        <LoginForm onSuccess={handleSuccess} onError={handleError} />

        <div className="mt-6 text-center text-sm text-white/80">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="underline">
            Đăng ký ngay
          </Link>
        </div>
      </main>
    </div>
  );
}
