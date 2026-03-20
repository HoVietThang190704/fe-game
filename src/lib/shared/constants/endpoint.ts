export const Endpoint = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    USER: '/api/user',
    USER_PROFILE: '/api/user/profile',
    MATCH_CREATE: '/api/matches/create'
} as const;

export type EndpointKey = keyof typeof Endpoint;