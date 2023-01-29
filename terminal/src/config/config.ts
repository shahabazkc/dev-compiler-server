export default Object.freeze({
    "APP_NAME": process.env.APP_NAME || 'TERMINAL_SERVER',
    "PORT": process.env.APP_PORT || 3002,
    "MONGO_URI": process.env.MONGO_URI || `mongodb://localhost:27017/${process.env.APP_NAME || 'TERMINAL_SERVER'}`,
    "MONGO_DB_PORT": Number(process.env.MONGO_DB_PORT) || 27017,
    "HOST": process.env.NODE_ENV === "DEVELOPMENT" ? "localhost" : ""
});