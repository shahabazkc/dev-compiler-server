"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const src_1 = __importDefault(require("./src"));
const config_1 = __importDefault(require("./src/config/config"));
const db_1 = require("./src/config/db");
const logger_1 = require("./src/config/logger");
const DB = new db_1.Database();
const exitHandler = (error) => {
    logger_1.log.info(error);
    process.exit(1);
};
const unexpectedErrorHandler = (err) => {
    exitHandler(err);
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGINT", () => {
    DB.disconnect();
    logger_1.log.info(`${config_1.default.APP_NAME}: Connection to database closed due to nodejs process termination`);
    // eslint-disable-next-line no-process-exit
    process.exit(0);
});
const startServer = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.connect({
        mongoUri: config_1.default.MONGO_URI,
        host: config_1.default.HOST,
        name: config_1.default.APP_NAME,
        port: config_1.default.MONGO_DB_PORT,
        opts: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        replSet: ''
    });
    app.listen(config_1.default.PORT, () => {
        logger_1.log.info(`${config_1.default.APP_NAME} is started on port: ${config_1.default.PORT}`);
    });
});
startServer(src_1.default);
//# sourceMappingURL=app.js.map