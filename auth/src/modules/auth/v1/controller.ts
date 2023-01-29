import { ApiError, Bcrypt, JWT, log } from "@dev-compiler/common";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import * as types from "../../../utils/types/types";
import Service from './service';

export default {
    loginController: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password }: types.LOGIN_BODY = req.body;
            const userExist = await Service.checkUserExist({
                $or: [
                    { username }, { email_id: username }, { mobile_number: username }
                ]
            }
            );
            if (!userExist) {
                return next(new ApiError(httpStatus.BAD_REQUEST, 'User does not exist'));
            };
            try {
                await Bcrypt.compare(password, userExist?.password);
            }
            catch (err) {
                return next(new ApiError(httpStatus.UNAUTHORIZED, 'Credentials are incorrect'));
            }

            const token = await JWT.generateJwtToken(
                {
                    userId: userExist?._id,
                    origin: req.headers?.origin || "dev",
                }
            );
            res.cookie('user-cookie', token, {
                secure: process.env.ENVIRONMENT === "local" ? false : true,
                maxAge: 2 * 24 * 60 * 60 * 1000 /* day * hour * 60 * 60 * 1000  */,
                sameSite: "none",
                path: "/",
            })

            delete userExist.password;
            return res.json({
                status: true,
                message: "Login Success",
                data: userExist
            })
        }
        catch (err) {
            log.debug("Error while login");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    signup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, phone_number }: types.SIGNUP_BODY = req.body;
            const userExist = await Service.checkUserExist({
                $or: [
                    { username }, { email }, { phone_number }
                ]
            });
            if (userExist) {
                return next(new ApiError(httpStatus.BAD_REQUEST, 'User already exist'));
            };

            const user = await Service.createUser(req.body, {});

            return res.send({
                status: true,
                data: user,
                message: "User created successful"
            });

        } catch (err) {
            log.debug("Error while signup");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    verifyAuth: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req;
            const user = await Service.checkUserExist({ _id: userId });
            if (!user) {
                res.clearCookie('user-cookie', {
                    path: '/',
                    secure: true,
                    sameSite: 'none'
                })
                return next(new ApiError(httpStatus.BAD_REQUEST, 'User not found'));
            }
            delete user.password;
            return res.send(user)
        } catch (err) {
            log.debug("Error while verify auth");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('user-cookie', {
                path: '/',
                secure: true,
                sameSite: 'none'
            });
            res.json({
                status: true,
                message: "Logged out succssfully",
            });
        } catch (err) {
            log.debug("Error while logout");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    }
}