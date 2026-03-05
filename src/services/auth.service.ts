import { LoginPayload, LoginResponse } from "@/src/lib/interface/login";

export interface IAuthService {
  login: (payload: LoginPayload) => Promise<{ statusCode: number; body?: LoginResponse | null }>;
}
