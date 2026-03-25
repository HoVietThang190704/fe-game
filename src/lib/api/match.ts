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

  // Check if response is ok before parsing JSON
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create match error response:", errorText);
    throw new Error(
      `Create match failed: ${res.status} - ${errorText || res.statusText}`,
    );
  }

  // Check if response has content
  const responseText = await res.text();
  if (!responseText) {
    throw new Error("Create match failed: Empty response from server");
  }

  let body: BaseResponse<CreatePrivateMatchResponse>;
  try {
    body = JSON.parse(responseText) as BaseResponse<CreatePrivateMatchResponse>;
  } catch (e) {
    console.error("Failed to parse JSON response:", responseText);
    throw new Error(
      `Invalid JSON response from server: ${responseText.substring(0, 100)}`,
    );
  }

  if (!body.success || !body.data) {
    throw new Error(body.message || `Create match failed: ${res.status}`);
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

  // Check if response is ok before parsing JSON
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Join match error response:", errorText);
    throw new Error(
      `Join match failed: ${res.status} - ${errorText || res.statusText}`,
    );
  }

  // Check if response has content
  const responseText = await res.text();
  if (!responseText) {
    throw new Error("Join match failed: Empty response from server");
  }

  let body: BaseResponse<CreatePrivateMatchResponse>;
  try {
    body = JSON.parse(responseText) as BaseResponse<CreatePrivateMatchResponse>;
  } catch (e) {
    console.error("Failed to parse JSON response:", responseText);
    throw new Error(
      `Invalid JSON response from server: ${responseText.substring(0, 100)}`,
    );
  }

  if (!body.success || !body.data) {
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

  // Check if response is ok before parsing JSON
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Leave match error response:", errorText);
    throw new Error(
      `Leave match failed: ${res.status} - ${errorText || res.statusText}`,
    );
  }

  // Check if response has content
  const responseText = await res.text();
  if (!responseText) {
    throw new Error("Leave match failed: Empty response from server");
  }

  let body: BaseResponse<null>;
  try {
    body = JSON.parse(responseText) as BaseResponse<null>;
  } catch (e) {
    console.error("Failed to parse JSON response:", responseText);
    throw new Error(
      `Invalid JSON response from server: ${responseText.substring(0, 100)}`,
    );
  }

  if (!body.success) {
    throw new Error(body.message || `Leave match failed: ${res.status}`);
  }

  return true;
}
