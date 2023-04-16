import { ApiError, Bcrypt, JWT, log } from "@dev-compiler/common";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import * as types from "../../../utils/types/types";
import Service from './service';
import Github from "../../../utils/github";
import { AxiosError } from "axios";
import { clearCookie, createTokenAndSetCookie } from "../../../utils/cookie/setCookie";
import * as constants from "../../../utils/constants";
import { normalizeUserObject } from "../../../utils/util";

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

            await createTokenAndSetCookie(req, res, constants.APP_CONFIG.AUTH_MODES.GITHUB as types.AuthTypes, {
                _id: userExist._id,
                username: userExist.username,
                email: userExist.email,
            });
            let userData = normalizeUserObject(userExist);
            return res.json({
                status: true,
                message: "Login Success",
                data: userData
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

            await Service.createUser(req.body, {});

            return res.send({
                status: true,
                data: {},
                message: "User created successfully"
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
                clearCookie(res);
                return next(new ApiError(httpStatus.BAD_REQUEST, 'User not found'));
            }
            let userData = normalizeUserObject(user);
            return res.send(userData)
        } catch (err) {
            log.debug("Error while verify auth");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            clearCookie(res);
            res.json({
                status: true,
                message: "Logged out succssfully",
            });
        } catch (err) {
            log.debug("Error while logout");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    signInWithGithub: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.body;
            const data = await Github.getAccessToken(code);
            const params = new URLSearchParams(data)
            const access_token = params.get('access_token');
            const error = params.get('error');
            if (error || !access_token) {
                return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
            }
            const githubData = await Github.getUserData(access_token);
            const getUser = await Service.checkUserExist({ github_id: githubData.id });
            if (!getUser) {
                const userNameExist = await Service.checkUserExist({ username: githubData.login });
                let username = !userNameExist ? githubData.login : null;
                const user = await Service.createUser({
                    username: username,
                    github_id: githubData.id,
                    github_access_token: access_token,
                    github_data: githubData,
                    phone_number: githubData.phone,
                    email: githubData.email,
                    avatar: githubData.avatar_url,
                    name: githubData.name,
                    password: githubData.id,
                    country_code: githubData.country_code,
                }, {});

                await createTokenAndSetCookie(
                    req, res,
                    constants.APP_CONFIG.AUTH_MODES.GITHUB as types.AuthTypes,
                    {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                    }
                );

                let userData = normalizeUserObject(user);

                return res.json({
                    status: true,
                    message: "Login Success",
                    data: userData
                })
            }
            else {
                await createTokenAndSetCookie(
                    req, res,
                    constants.APP_CONFIG.AUTH_MODES.GITHUB as types.AuthTypes,
                    {
                        _id: getUser._id,
                        username: getUser.username,
                        email: getUser.email,
                    }
                );
                delete getUser.password;
                return res.json({
                    status: true,
                    message: "Login Success",
                    data: getUser
                })
            }
        }
        catch (err) {
            const error = err as AxiosError;
            log.error("Error while signin with github");
            log.error(error?.response?.data);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    signInWithGoogle: async (req: Request, res: Response, next: NextFunction) => {
        try {
        }
        catch (err) {
        }
    }
}