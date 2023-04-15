import * as constants from '../../../utils/constants/index';
import UserModel from "../UserModel";
import * as types from '../../../utils/types/types';
import { DBService } from '@dev-compiler/common';
const DB = new DBService();

export default {
    checkUserExist: async (query: any) => {
        return await DB.getOneByQuery(constants.COLLECTIONS.USER_COLLECTION, query, {
            noErr: true,
            projections: { __v: 0 }
        })
    },
    getAllUsers: async () => {
        return await UserModel.find();
    },
    createUser: async (userData: types.SIGNUP_BODY, opts: any) => {
        const user = await DB.insertOne(constants.COLLECTIONS.USER_COLLECTION, {
            username: userData.username,
            password: userData.password,
            mobile_number: userData.phone_number,
            email_id: userData.email,
            ...(userData.country_code &&{country_code: userData.country_code}),
            name: userData.name
        }, opts);
        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;
        delete user.__v;
        return DB.normalizeObject(user);
    }
}