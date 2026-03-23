import { Endpoint } from "../shared/constants/endpoint";
import { BaseResponse } from "../interface/baseresponse";
import { User } from "../interface/user.interface";

export async function getUserProfile(fields?: string): Promise<User> {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No access token found");
    }

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    let url = `${baseUrl}${Endpoint.USER}/profile`;
    if (fields) {
        url += `?fields=${encodeURIComponent(fields)}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch user profile");
    }

    const baseResponse: BaseResponse<User> = await response.json();
    if (!baseResponse.success || !baseResponse.data) {
        throw new Error(baseResponse.message || "Failed to fetch user profile");
    }

    return baseResponse.data;
}
