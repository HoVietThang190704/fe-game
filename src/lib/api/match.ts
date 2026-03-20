import { Endpoint } from "../shared/constants/endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type BaseResponse<T> = {
  response: number;
  message: string;
  success: boolean;
  data?: T | null;
};

export type CreatePrivateMatchResponse = {
  matchId: string | null;
  pinCode: string;
};

export async function createPrivateMatch(accessToken: string) {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_CREATE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<CreatePrivateMatchResponse>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `Create match failed: ${res.status}`);
  }

  return body.data;
}
