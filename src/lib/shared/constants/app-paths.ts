import { Flatten } from "@/src/types/global.type";

export const APP_PATHS = {
    MAIN: "/",
    LOGIN: "/login",
    REDIRECT: "redirect",
    REGISTER: "/register",
    OTP: "/otp",
} as const;

export type AppPaths = Flatten<typeof APP_PATHS>;
