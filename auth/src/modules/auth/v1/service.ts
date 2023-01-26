import { DBService } from "../../../utils/dbService/dbService"

const DB = new DBService();

import * as constants from '../../../utils/constants/index';

export default {
    checkUserExist: async (query: any) => {
        return await DB.getOneByQuery(constants.COLLECTIONS.USER_COLLECTION, query, {
            noErr: true
        })
    }
}