export const Endpoint = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    USER: '/api/user'
} as const;

export type EndpointKey = keyof typeof Endpoint;