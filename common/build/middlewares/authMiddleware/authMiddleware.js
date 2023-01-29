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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ApiError_1 = require("../../errorHandler/ApiError");
const Jwt_1 = require("../../utils/jwt/Jwt");
;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cookie = req === null || req === void 0 ? void 0 : req.cookies['user-cookie'];
        let jwtData = yield Jwt_1.JWT.verifyJwtToken(cookie);
        if (cookie && jwtData) {
            req['jwtData'] = jwtData;
            req['userId'] = jwtData['userId'];
            next();
        }
        else {
            return next(new ApiError_1.ApiError(401, "Not Authorized"));
        }
    }
    catch (error) {
        if (error.message == "jwt expired") {
            return next(new ApiError_1.ApiError(401, "Not Authorized"));
        }
        else {
            return next(new ApiError_1.ApiError(401, "Not Authorized"));
        }
    }
});
exports.authMiddleware = authMiddleware;
