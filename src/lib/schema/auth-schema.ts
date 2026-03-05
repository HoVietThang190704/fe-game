import { use } from "react";
import { email, z } from "zod";

export const getLoginSchema = () =>
  z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

export const getOtpSchema = () =>
  z.object({
    otp: z.string().min(1, "OTP is required"),
  });
