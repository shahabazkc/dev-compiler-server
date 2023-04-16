import { ApiError, Bcrypt, JWT, log,oauth2Client } from "@dev-compiler/common";
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
            const { username, email, mobile_number }: types.SIGNUP_BODY = req.body;
            const userExist = await Service.checkUserExist({
                $or: [
                    { username }, { email_id: email }, { mobile_number: mobile_number }
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
            let getUser = await Service.checkUserExist({ github_id: githubData.id });
            if (!getUser) {
                const userNameExist = await Service.checkUserExist({ username: githubData.login });
                let username = !userNameExist ? githubData.login : null;
                const user = await Service.createUser({
                    username: username,
                    github_id: githubData.id,
                    github_access_token: access_token,
                    github_data: githubData,
                    mobile_number: githubData.phone,
                    email: githubData.email,
                    avatar: githubData.avatar_url,
                    name: githubData.name,
                    // password: githubData.id,
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
                getUser = await Service.updateUser({ _id: getUser._id }, {
                    github_access_token: access_token,
                    github_data: githubData,
                    ...(githubData.avatar_url?.length > 0 && { avatar: githubData?.avatar_url })
                });
                await createTokenAndSetCookie(
                    req, res,
                    constants.APP_CONFIG.AUTH_MODES.GITHUB as types.AuthTypes,
                    {
                        _id: getUser._id,
                        username: getUser.username,
                        email: getUser.email,
                    }
                );
                const userData = normalizeUserObject(getUser);
                return res.json({
                    status: true,
                    message: "Login Success",
                    data: userData
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
            const { code } = req.body;
            const { tokens } = await oauth2Client.getToken(code);

            // Decrypt google id_token
            const ticket = await oauth2Client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            let getUser = await Service.checkUserExist({
                $or: [
                    { google_id: payload?.sub },
                    { email_id: payload.email }
                ]
            });
            if (!getUser) {
                const user = await Service.createUser({
                    username: null,
                    google_id: payload.sub,
                    google_access_token: tokens.access_token,
                    google_data: payload,
                    email: payload.email,
                    avatar: payload.picture,
                    name: payload.name
                }, {});

                await createTokenAndSetCookie(
                    req, res,
                    constants.APP_CONFIG.AUTH_MODES.GOOGLE as types.AuthTypes,
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
            } else {
                getUser = await Service.updateUser({ _id: getUser._id }, {
                    google_id: payload.sub,
                    google_access_token: tokens.access_token,
                    google_data: payload,
                    ...(payload.picture?.length > 0 && { avatar: payload.picture })
                });

                await createTokenAndSetCookie(
                    req, res,
                    constants.APP_CONFIG.AUTH_MODES.GOOGLE as types.AuthTypes,
                    {
                        _id: getUser._id,
                        username: getUser.username,
                        email: getUser.email,
                    }
                );
                const userData = normalizeUserObject(getUser);
                return res.json({
                    status: true,
                    message: "Login Success",
                    data: userData
                })
            }
        }
        catch (err) {
            const error = err as AxiosError;
            log.error("Error while signin with google");
            log.error(error?.response?.data || error);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    getGoogleSignInUrl: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const scopes = [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/user.phonenumbers.read'
            ];
            const url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
            });

            return res.json({
                status: true,
                data: url
            })
        }
        catch (err) {
            const error = err as AxiosError;
            log.error("Error while accessing getGoogleSignInUrl()");
            log.error(error?.response?.data || error);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    }
}