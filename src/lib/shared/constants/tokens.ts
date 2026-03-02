export const TOKEN = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export type TokenType = typeof TOKEN.ACCESS_TOKEN | typeof TOKEN.REFRESH_TOKEN;
