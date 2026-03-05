export const Endpoint = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    USER: '/api/user'
} as const;

export type EndpointKey = keyof typeof Endpoint;