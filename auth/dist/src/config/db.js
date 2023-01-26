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
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
class Database {
    constructor() {
        this.mongoose = mongoose_1.default;
    }
    connect({ mongoUri = '', port, host, name, opts, replSet = '' }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let db;
                mongoose_1.default.set("strictQuery", false);
                if (mongoUri) {
                    logger_1.log.info('connecting to database');
                    db = yield this.mongoose.connect(mongoUri, opts);
                }
                else {
                    db = yield this.mongoose.connect(`mongodb://${host}:${port}/${name}`, opts);
                }
                logger_1.log.info(`Connected to database - ${(_a = db.connections[0]) === null || _a === void 0 ? void 0 : _a.host}/${(_b = db.connections[0]) === null || _b === void 0 ? void 0 : _b.name} successfully'`);
            }
            catch (err) {
                logger_1.log.info('failed to connect with database');
                logger_1.log.error(err);
                throw new Error('failed to connect to database');
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoose_1.default.disconnect();
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=db.js.map