import React from "react";
import { getLoginSchema } from "@/src/lib/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "@/src/providers/auth-provider";
import { LoginPayload } from "@/src/lib/interface/login";
import { HttpStatusCode } from "@/src/lib/shared/constants/http-response";
import z from "zod";

type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSubmitting?: (submitting: boolean) => void;
}

export default function LoginForm({ onSuccess, onError, onSubmitting }: LoginFormProps) {
  const { login, isLoading } = useAuthContext();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(getLoginSchema()) });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setSubmitError(null);
    onSubmitting?.(true);
    try {
      const payload: LoginPayload = {
        email: data.email,
        password: data.password,
      };

      const response = await login(payload);

      if (response.statusCode === HttpStatusCode.OK || response.body?.success) {
        onSuccess?.();
      } else {
        const msg = response.body?.message || "Đăng nhập thất bại";
        setSubmitError(msg);
        onError?.(msg);
      }
    } catch (e: unknown) {
      let msg = "Đã có lỗi";
      if (e instanceof Error) msg = e.message;
      else if (typeof e === "string") msg = e;
      setSubmitError(msg);
      onError?.(msg);
    } finally {
      onSubmitting?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Email</label>
        <input {...register("email")} className="w-full rounded-md px-3 py-2 bg-[color:var(--input)] text-foreground" />
        {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Mật khẩu</label>
        <input {...register("password")} type="password" className="w-full rounded-md px-3 py-2 bg-[color:var(--input)] text-foreground" />
        {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
      </div>

      {submitError && <div className="text-sm text-rose-400">{submitError}</div>}

      <button type="submit" disabled={isLoading || isSubmitting} className="w-full py-2 rounded-md bg-primary text-primary-foreground">
        {isLoading || isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  );
}