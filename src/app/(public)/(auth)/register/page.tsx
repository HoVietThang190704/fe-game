"use client";

import { useRouter } from "next/navigation";
import { register } from '../../../../lib/api/auth';
import useFormAction from '../../../../lib/hooks/useFormAction';
import { isValidEmail } from '@/src/lib/utils';
import React, { useState } from 'react';
import { extractFormAndPrevent, passwordStrength } from '@/src/lib/utils';
import AuthCard from '@/src/components/auth/AuthCard';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';

type RegisterState = {
	error: string | null;
	success: boolean;
};

export default function RegisterPage() {
	const router = useRouter();
	const [fieldErrors, setFieldErrors] = useState<{ name?: string; username?: string; email?: string; password?: string; confirmPassword?: string }>({});
	const [formValues, setFormValues] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
	const [pwStrength, setPwStrength] = useState<{ score: number; label: string; color: string } | null>(null);

	async function actionHandler(formData: FormData): Promise<RegisterState> {
		const name = formData.get("name")?.toString() ?? "";
		const username = formData.get("username")?.toString() ?? "";
		const email = formData.get("email")?.toString() ?? "";
		const password = formData.get("password")?.toString() ?? "";
		const confirm = formData.get("confirmPassword")?.toString() ?? "";

		if (!isValidEmail(email)) {
			return { error: "Email không hợp lệ", success: false };
		}

		if (password !== confirm) {
			return { error: "Mật khẩu không khớp", success: false };
		}

		try {
			await register({ name, username, email, password });
			return { error: null, success: true };
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Register failed";
			return { error: message, success: false };
		}
	}

	const onSuccess = () => {
		router.push('/login');
	};

	const [state, formAction, isPending] = useFormAction(actionHandler, { error: null, success: false }, { onSuccess });

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		const v = e.target.value
		setFormValues(prev => ({ ...prev, name: v }))
		setFieldErrors(prev => ({ ...prev, name: v ? undefined : prev.name }))
	}

	function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
		const v = e.target.value
		setFormValues(prev => ({ ...prev, username: v }))
		setFieldErrors(prev => ({ ...prev, username: v ? undefined : prev.username }))
	}

	function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		const v = e.target.value
		setFormValues(prev => ({ ...prev, email: v }))
		setFieldErrors(prev => ({ ...prev, email: v && !isValidEmail(v) ? 'Email không hợp lệ' : undefined }))
	}

	function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
		const v = e.target.value
		setFormValues(prev => ({ ...prev, password: v }))
		setFieldErrors(prev => ({ ...prev, password: v ? undefined : prev.password }))
		setPwStrength(passwordStrength(v))
	}

	function handleConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
		const v = e.target.value
		setFormValues(prev => ({ ...prev, confirmPassword: v }))
		setFieldErrors(prev => ({ ...prev, confirmPassword: v ? undefined : prev.confirmPassword }))
	}

	const isFormValid =
		!!formValues.name &&
		!!formValues.username &&
		!!formValues.email &&
		isValidEmail(formValues.email) &&
		!!formValues.password &&
		formValues.password === formValues.confirmPassword


	function handleSubmit(e: unknown) {
		const extracted = extractFormAndPrevent(e);
		if (!extracted) return;
		const { form, preventDefault } = extracted;
		const fd = new FormData(form);
		const name = fd.get('name')?.toString() ?? '';
		const username = fd.get('username')?.toString() ?? '';
		const email = fd.get('email')?.toString() ?? '';
		const password = fd.get('password')?.toString() ?? '';
		const confirm = fd.get('confirmPassword')?.toString() ?? '';
		const errors: {
			name?: string
			username?: string
			email?: string
			password?: string
			confirmPassword?: string
		} = {}

		if (!name) errors.name = 'Vui lòng nhập tên'
		if (!username) errors.username = 'Vui lòng nhập username'
		if (!isValidEmail(email)) errors.email = 'Email không hợp lệ'
		if (!password) errors.password = 'Vui lòng nhập mật khẩu'
		if (password !== confirm) errors.confirmPassword = 'Mật khẩu không khớp'

		if (Object.keys(errors).length) {
			preventDefault()
			setFieldErrors(errors)
		} else {
			setFieldErrors({})
		}
	}

	return (
		<AuthCard title={"Create account"} description={"Tạo tài khoản mới"}>
			<form action={formAction} className="grid gap-4" onSubmit={handleSubmit}>
				<div>
					<Label htmlFor="name-input">Name</Label>
					<Input id="name-input" name="name" type="text" required onChange={handleNameChange} />
					{fieldErrors.name && <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>}
				</div>

				<div>
					<Label htmlFor="username-input">Username</Label>
					<Input id="username-input" name="username" type="text" required onChange={handleUsernameChange} />
					{fieldErrors.username && <p className="text-sm text-destructive mt-1">{fieldErrors.username}</p>}
				</div>

				<div>
					<Label htmlFor="email-input">Email</Label>
					<Input id="email-input" name="email" type="email" required onChange={handleEmailChange} />
					{fieldErrors.email && <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>}
				</div>

				<div>
					<Label htmlFor="password-input">Password</Label>
					<Input id="password-input" name="password" type="password" required onChange={handlePasswordChange} />
					{fieldErrors.password && <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>}
					{pwStrength && (
						<p className={`text-sm mt-1 ${pwStrength.color}`}>{pwStrength.label}</p>
					)}
				</div>

				<div>
					<Label htmlFor="confirm-password-input">Confirm password</Label>
					<Input id="confirm-password-input" name="confirmPassword" type="password" required onChange={handleConfirmChange} />
					{fieldErrors.confirmPassword && <p className="text-sm text-destructive mt-1">{fieldErrors.confirmPassword}</p>}
				</div>

				{state.error && <div className="text-sm text-destructive">{state.error}</div>}

				<Button type="submit" disabled={!isFormValid || isPending} className={`${!isFormValid ? 'opacity-50 pointer-events-none' : ''}`}>
					{isPending ? 'Đang đăng ký...' : 'Đăng ký'}
				</Button>
			</form>
		</AuthCard>
	);
}
