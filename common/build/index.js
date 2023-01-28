"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
// Configs
__exportStar(require("./config/db"), exports);
var logger_1 = require("./config/logger");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return logger_1.log; } });
// Error handlers
__exportStar(require("./errorHandler/ApiError"), exports);
__exportStar(require("./errorHandler/error-converter"), exports);
__exportStar(require("./errorHandler/error-handler"), exports);
// Common DBLayer
__exportStar(require("./utils/dbService/dbService"), exports);
// Common Utilis
__exportStar(require("./utils/bcrypt/Bcrypt"), exports);
__exportStar(require("./utils/jwt/Jwt"), exports);
