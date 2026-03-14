"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { extractFormAndPrevent } from '@/src/lib/utils';
import { login } from '../../../../lib/api/auth';
import useFormAction from '../../../../lib/hooks/useFormAction';
import { isValidEmail } from '@/src/lib/utils';
import AuthCard from '@/src/components/auth/AuthCard';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';

type LoginState = {
    error: string | null;
    success: boolean;
};

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    async function actionHandler(formData: FormData): Promise<LoginState & Partial<Tokens>> {
        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        if (!isValidEmail(email)) {
            return { error: "Email không hợp lệ", success: false };
        }

        try {
            const tokens: Tokens = await login({ email, password });
            return { error: null, success: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            return { error: message, success: false };
        }
    }

    const onSuccess = (result: LoginState & Partial<Tokens>) => {
        if (result.accessToken && result.refreshToken) {
            try {
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken);
            } catch (e) {
                
            }
            router.push("/");
        }
    };

    const [state, formAction, isPending] = useFormAction(actionHandler, { error: null, success: false }, { onSuccess });

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        const v = e.target.value;
        setFieldErrors(prev => ({ ...prev, email: v && !isValidEmail(v) ? 'Email không hợp lệ' : undefined }));
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const v = e.target.value;
        setFieldErrors(prev => ({ ...prev, password: v ? undefined : prev.password }));
    }

    function handleSubmit(e: unknown) {
        const extracted = extractFormAndPrevent(e);
        if (!extracted) return;
        const { form, preventDefault } = extracted;
        const fd = new FormData(form);
        const email = fd.get("email")?.toString() ?? "";
        const password = fd.get("password")?.toString() ?? "";
        const errors: { email?: string; password?: string } = {};

        if (!isValidEmail(email)) {
            errors.email = "Email không hợp lệ";
        }
        if (!password) {
            errors.password = "Vui lòng nhập mật khẩu";
        }

        if (Object.keys(errors).length) {
            preventDefault();
            setFieldErrors(errors);
        } else {
            setFieldErrors({});
        }
    }

    return (
        <AuthCard title={"Minesweeper PvP"} description={"Đăng nhập để bắt đầu chiến đấu"}>
            <form action={formAction} className="grid gap-4" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="email-input">Email</Label>
                    <Input id="email-input" name="email" type="email" placeholder="user@example.com" required onChange={handleEmailChange} />
                    {fieldErrors.email && <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                    <Label htmlFor="password-input">Mật khẩu</Label>
                    <Input id="password-input" name="password" type="password" placeholder="••••••••" required onChange={handlePasswordChange} />
                    {fieldErrors.password && <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>}
                </div>

                {state.error && <div className="text-sm text-destructive">{state.error}</div>}

                <Button type="submit" className="mt-2" disabled={isPending}>
                    {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <div className="text-center text-sm text-muted-foreground mt-4">
                    Chưa có tài khoản? <a className="text-primary underline" href="/auth/register">Đăng ký ngay</a>
                </div>
            </form>
        </AuthCard>
    );
}
