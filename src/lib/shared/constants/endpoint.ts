export const Endpoint = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER: '/user'
} as const;

export type EndpointKey = keyof typeof Endpoint;