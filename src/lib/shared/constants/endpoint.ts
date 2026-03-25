export const Endpoint = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    USER: '/api/user',
    USER_PROFILE: '/api/user/profile',
    MATCH_CREATE: '/api/matches/create',
<<<<<<< HEAD
    MATCH_FIND: '/api/match/find',
    MATCH_CANCEL: '/api/match/cancel',
    MATCH_ACTIVE: '/api/match/active'
=======
    MATCH_LEAVE: '/api/matches'
>>>>>>> 92351ceb455663d673efb7d47dce9ac8bb3e4db4
} as const;

export type EndpointKey = keyof typeof Endpoint;