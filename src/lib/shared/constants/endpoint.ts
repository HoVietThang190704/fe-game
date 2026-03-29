export const Endpoint = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  REFRESH: "/api/auth/refresh",
  LOGOUT: "/api/auth/logout",
  USER: "/api/user",
  USER_PROFILE: "/api/user/profile",
  MATCH_CREATE: "/api/matches/create",
  MATCH_JOIN: "/api/matches/join",
  MATCH_FIND: "/api/match/find",
  MATCH_CANCEL: "/api/match/cancel",
  MATCH_ACTIVE: "/api/match/active",
  MATCH_STATE: "/api/matches/:id",
  MATCH_LEAVE: "/api/matches",
} as const;

export type EndpointKey = keyof typeof Endpoint;
