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
export type ProfileResponse = {
  _id: string;
  username: string;
  email: string;
  name?: string;
};

export async function login(payload: LoginPayload) {
  try {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Failed to fetch")) {
      throw new Error(`Không thể kết nối tới server. Kiểm tra xem backend có chạy trên ${BASE_URL} không`);
    }
    throw err;
  }
}

export async function register(payload: RegisterPayload) {
  try {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Failed to fetch")) {
      throw new Error(`Không thể kết nối tới server. Kiểm tra xem backend có chạy trên ${BASE_URL} không`);
    }
    throw err;
  }
}

export async function refreshToken(refreshToken: string) {
  try {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Failed to fetch")) {
      throw new Error(`Không thể kết nối tới server. Kiểm tra xem backend có chạy trên ${BASE_URL} không`);
    }
    throw err;
  }
}

export async function logout(refreshToken: string) {
  try {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Failed to fetch")) {
      throw new Error(`Không thể kết nối tới server. Kiểm tra xem backend có chạy trên ${BASE_URL} không`);
    }
    throw err;
  }
}

export async function getMyProfile(accessToken: string) {
  try {
    const res = await fetch(`${BASE_URL}${Endpoint.USER_PROFILE}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const body = (await res.json()) as BaseResponse<ProfileResponse>;
    if (!res.ok || !body.success || !body.data) {
      throw new Error(body.message || `Get profile failed: ${res.status}`);
    }

    return body.data;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Failed to fetch")) {
      throw new Error(`Không thể kết nối tới server. Kiểm tra xem backend có chạy trên ${BASE_URL} không`);
    }
    throw err;
  }
}
