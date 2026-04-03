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

export type MatchPlayer = {
  userId: string;
  displayName: string;
  avatar: string;
  rank: number;
  isReady: boolean;
  playerNumber: number;
  health: number;
  isHost?: boolean; // UI helper property
};

export type MatchStateResponse = {
  matchId: string | null;
  pinCode: string;
  status: string;
  hostId: string; // Add this line
  gameBoard: Record<string, unknown>;
  players: MatchPlayer[];
  boardState: {
    player1Revealed: Array<{ x: number; y: number }>;
    player2Revealed: Array<{ x: number; y: number }>;
    player1Flags: Array<{ x: number; y: number }>;
    player2Flags: Array<{ x: number; y: number }>;
  };
  currentTurn: string | null;
  turnStartTime: string | null;
  turnTimeLimit: number;
};

export type ActiveMatchResponse = {
  matchId: string | null;
  status: string;
  currentPlayerId?: string | null;
  playerCount?: number;
};

export type WaitingQueueResponse = {
  id: string;
  userId: string;
  rank: number;
  status: string;
  boardSize?: string;
  matched?: boolean;
  matchId?: string;
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

export async function findRandomMatch(accessToken: string): Promise<WaitingQueueResponse> {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_FIND}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<WaitingQueueResponse>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `Find random match failed: ${res.status}`);
  }

  return body.data;
}

export async function cancelRandomMatch(accessToken: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_CANCEL}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<null>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Cancel random match failed: ${res.status}`);
  }

  return;
}

export async function getActiveMatch(accessToken: string): Promise<ActiveMatchResponse> {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_ACTIVE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<ActiveMatchResponse>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `Get active match failed: ${res.status}`);
  }

  return body.data;
}

export async function getMatchState(matchId: string, accessToken: string): Promise<MatchStateResponse> {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_STATE.replace(":id", matchId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<MatchStateResponse>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `Get match state failed: ${res.status}`);
  }

  return body.data;
}

export async function joinPrivateMatch(
  pinCode: string,
  accessToken: string,
): Promise<CreatePrivateMatchResponse> {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_JOIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ pinCode }),
  });

  const body = (await res.json()) as BaseResponse<CreatePrivateMatchResponse>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `Join match failed: ${res.status}`);
  }

  return body.data;
}

export async function leaveMatch(matchId: string, accessToken: string) {
  const res = await fetch(
    `${BASE_URL}${Endpoint.MATCH_LEAVE}/${matchId}/leave`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const body = (await res.json()) as BaseResponse<null>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Leave match failed: ${res.status}`);
  }

  return true;
}

export async function startMatch(matchId: string, accessToken: string) {
  const res = await fetch(`${BASE_URL}/api/matches/${matchId}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = (await res.json()) as BaseResponse<Record<string, unknown>>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Start match failed: ${res.status}`);
  }

  return body.data;
}
