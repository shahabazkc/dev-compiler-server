import { JWT } from "@dev-compiler/common";
import { Request, Response } from "express";
import { AuthTypes } from "../types/types";
import * as constants from "../constants";

export const createTokenAndSetCookie = async (
    req: Request,
    res: Response,
    authMode: AuthTypes,
    userData?: any
) => {
    const token = await JWT.generateJwtToken(
        {
            userId: userData?._id,
            origin: req.headers?.origin || "dev",
            authMode,
            ...(userData && { userData })
        }
    );

    res.cookie('user-cookie', token, {
        secure: constants.APP_CONFIG.SECURE,
        maxAge: constants.APP_CONFIG.USER_COOKIE_AGE,
        sameSite: "none",
        path: constants.APP_CONFIG.USER_COOKIE_PATH,
    })

    return token;

}

export const clearCookie = (res: Response) => {
    res.clearCookie(constants.APP_CONFIG.USER_COOKIE_NAME, {
        path: constants.APP_CONFIG.USER_COOKIE_PATH,
        secure: constants.APP_CONFIG.SECURE,
        sameSite: 'none'
    })
}
