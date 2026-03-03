export const LOGO_SIZE = {
  WIDTH: 150,
  HEIGHT: 80,
  TITLE: 14,
  SUB: 12,
} as const;

export const ICON_SS = {
  WIDTH: 10,
  HEIGHT: 10,
} as const;

export const ICON_S = {
  WIDTH: 15,
  HEIGHT: 15,
} as const;

export const ICON_L = {
  WIDTH: 20,
  HEIGHT: 20,
} as const;

export const ICON_XL = {
  WIDTH: 26,
  HEIGHT: 26,
} as const;

export const ICON_XXL = {
  WIDTH: 30,
  HEIGHT: 30,
} as const;

export const ICON_XXXL = {
  WIDTH: 36,
  HEIGHT: 36,
} as const;

export const INPUT = {
  HINT: 14,
} as const;

export const ICON_MENU = {
  WIDTH: 18,
  HEIGHT: 16,
} as const;

export const AVATAR = {
  WIDTH: 62,
  HEIGHT: 66,
} as const;

export const AVATAR_USER_POST = {
  WIDTH: 52,
  HEIGHT: 56,
} as const;

export const AVATAR_USER_PROFILE = {
  WIDTH: 90,
  HEIGHT: 90,
} as const;

export const AVATAR_EDIT = {
  WIDTH: 300,
  HEIGHT: 300,
} as const;

export const POST_THUMBNAIL = {
  WIDTH: 210,
  HEIGHT: 226,
} as const;

export const MEDIA_ITEM = {
  WIDTH: 20,
  HEIGHT: 20,
} as const;

export const ICON_TOOL_BAR = {
  HEIGHT: 18,
  WIDTH: 18,
} as const;

export const QR_CODE = {
  WIDTH: 200,
  HEIGHT: 200,
} as const;

export type SizeNums =
  | (typeof LOGO_SIZE)[keyof typeof LOGO_SIZE]
  | (typeof ICON_SS)[keyof typeof ICON_SS]
  | (typeof ICON_S)[keyof typeof ICON_S]
  | (typeof ICON_L)[keyof typeof ICON_L]
  | (typeof ICON_XL)[keyof typeof ICON_XL]
  | (typeof ICON_XXL)[keyof typeof ICON_XXL]
  | (typeof ICON_XXXL)[keyof typeof ICON_XXXL]
  | (typeof INPUT)[keyof typeof INPUT]
  | (typeof ICON_MENU)[keyof typeof ICON_MENU]
  | (typeof AVATAR)[keyof typeof AVATAR]
  | (typeof AVATAR_USER_POST)[keyof typeof AVATAR_USER_POST]
  | (typeof AVATAR_USER_PROFILE)[keyof typeof AVATAR_USER_PROFILE]
  | (typeof AVATAR_EDIT)[keyof typeof AVATAR_EDIT]
  | (typeof POST_THUMBNAIL)[keyof typeof POST_THUMBNAIL]
  | (typeof MEDIA_ITEM)[keyof typeof MEDIA_ITEM]
  | (typeof ICON_TOOL_BAR)[keyof typeof ICON_TOOL_BAR]
  | (typeof QR_CODE)[keyof typeof QR_CODE];
