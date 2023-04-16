export default Object.freeze({
    USER_COOKIE_AGE: 2 * 24 * 60 * 60 * 1000 /* day * hour * 60 * 60 * 1000  */,
    USER_COOKIE_NAME: 'user-cookie',
    USER_COOKIE_PATH: '/',
    SECURE: process.env.ENVIRONMENT === "local" ? false : true,
    AUTH_MODES: {
        GITHUB: 'github',
        GOOGLE: 'google',
        SERVER: 'server'
    }
});