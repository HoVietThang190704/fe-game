import { Endpoint } from "../shared/constants/endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

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

export type ActiveMatchResponse = {
  matchId: string;
  status: string;
  currentPlayerId?: string;
  playerCount?: number;
};

export type WaitingQueueResponse = {
  id: string;
  userId: string;
  rank: number;
  status: string;
  boardSize?: string;
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

export async function findRandomMatch(accessToken: string, boardSize: "small" | "medium" | "large") {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_FIND}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ boardSize }),
  });

  const body = (await res.json()) as BaseResponse<WaitingQueueResponse>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Find match failed: ${res.status}`);
  }

  return body.data ?? null;
}

export async function cancelRandomMatch(accessToken: string) {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_CANCEL}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<null>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Cancel match failed: ${res.status}`);
  }

  return true;
}

export async function getActiveMatch(accessToken: string) {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_ACTIVE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<ActiveMatchResponse>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Get active match failed: ${res.status}`);
  }

  return body.data ?? null;
}

export async function leaveMatch(matchId: string, accessToken: string) {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_LEAVE}/${matchId}/leave`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<null>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Leave match failed: ${res.status}`);
  }

  return true;
}
