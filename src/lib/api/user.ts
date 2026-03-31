import { Endpoint } from "../shared/constants/endpoint";
import { BaseResponse } from "../interface/baseresponse";
import { User } from "../interface/user.interface";
import { refreshToken } from "./auth";

async function fetchUserProfileWithToken(token: string, fields?: string): Promise<Response> {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    let url = `${baseUrl}${Endpoint.USER}/profile`;
    if (fields) {
        url += `?fields=${encodeURIComponent(fields)}`;
    }

    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

export async function getUserProfile(fields?: string): Promise<User> {
    let token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No access token found");
    }

    let response = await fetchUserProfileWithToken(token, fields);

    if (response.status === 401) {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (storedRefreshToken) {
            try {
                const refreshed = await refreshToken(storedRefreshToken);
                localStorage.setItem("accessToken", refreshed.accessToken);
                localStorage.setItem("refreshToken", refreshed.refreshToken);
                token = refreshed.accessToken;
                response = await fetchUserProfileWithToken(token, fields);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }
    }

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
