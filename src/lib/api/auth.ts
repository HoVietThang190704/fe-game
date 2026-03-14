import { Endpoint } from "../shared/constants/endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type BaseResponse<T> = {
  response: number;
  message: string;
  success: boolean;
  data?: T | null;
};

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name?: string; username?: string; email: string; password: string };

export async function login(payload: LoginPayload) {
  const res = await fetch(`${BASE_URL}${Endpoint.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await res.json()) as BaseResponse<{ accessToken: string; refreshToken: string }>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Login failed: ${res.status}`);
  }

  return body.data!;
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${BASE_URL}${Endpoint.REGISTER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await res.json()) as BaseResponse<unknown>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Register failed: ${res.status}`);
  }

  return body;
}

export async function refreshToken(refreshToken: string) {
  const res = await fetch(`${BASE_URL}${Endpoint.REFRESH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const body = (await res.json()) as BaseResponse<{ accessToken: string; refreshToken: string }>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Refresh failed: ${res.status}`);
  }

  return body.data!;
}

export async function logout(refreshToken: string) {
  const res = await fetch(`${BASE_URL}${Endpoint.LOGOUT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const body = (await res.json()) as BaseResponse<null>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Logout failed: ${res.status}`);
  }

  return body;
}
