import { BaseResponse } from "./baseresponse";

export interface EncryptResponse {
    iv: string;
    ciphertext: string;
    tag: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResult {
    isSuccess: boolean;
    isFirstLogin: boolean;
    accessToken: string;
    refreshToken: string;
    message: string;
}

type LoginResponse = BaseResponse<LoginResult>;

export type { LoginPayload, LoginResponse };