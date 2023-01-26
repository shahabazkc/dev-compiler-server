import dotenv from 'dotenv';
dotenv.config();
import app from "./src";
import config from "./src/config/config";
import { Database } from './src/config/db';
import { log } from "./src/config/logger";
const DB = new Database()

const exitHandler = (error: any) => {
    log.info(error);
    process.exit(1);
};

const unexpectedErrorHandler = (err: any) => {
    exitHandler(err);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGINT", () => {
    DB.disconnect();
    log.info(
        `${config.APP_NAME}: Connection to database closed due to nodejs process termination`
    );
    // eslint-disable-next-line no-process-exit
    process.exit(0);
});

const startServer = async (app: any) => {
    await DB.connect(
        {
            mongoUri: config.MONGO_URI,
            host: config.HOST,
            name: config.APP_NAME,
            port:  config.MONGO_DB_PORT,
            opts: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            replSet: ''
        }
    );
    app.listen(config.PORT, () => {
        log.info(`${config.APP_NAME} is started on port: ${config.PORT}`)
    })
};


startServer(app);