import { IAuthService } from "./auth.service";
import { Endpoint } from "@/src/lib/shared/constants/endpoint";
import { LoginPayload, LoginResponse } from "@/src/lib/interface/login";

const normalizeBase = (v?: string) => {
  if (!v) return undefined;
  return v.endsWith("/") ? v.slice(0, -1) : v;
};

const API_BASE =
  normalizeBase(process.env.NEXT_PUBLIC_SERVER_URL) ||
  normalizeBase(process.env.NEXT_PUBLIC_API_URL) ||
  normalizeBase(process.env.NEXT_PUBLIC_BASE_URL) ||
  "http://localhost:5000";

export const AuthService: IAuthService = {
  async login(payload: LoginPayload) {
    const url = `${API_BASE}${Endpoint.LOGIN}`;
    console.debug("AuthService.login -> API_BASE", API_BASE, "url", url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let body: LoginResponse | null = null;
      try {
        body = await res.json();
      } catch (e) {
        body = null;
      }

      try {
        if (body?.data?.accessToken) {
          document.cookie = `access_token=${body.data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
        if (body?.data?.refreshToken) {
          document.cookie = `refresh_token=${body.data.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }
      } catch (e) {
      }

      return { statusCode: res.status, body };
    } catch (err: unknown) {
      console.error("AuthService.login fetch failed", err);
      throw err;
    }
  },
};

export default AuthService;
