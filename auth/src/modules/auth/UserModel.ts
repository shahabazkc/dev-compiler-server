import mongoose from "mongoose";
import * as constants from '../../utils/constants/index';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});


const userModel = mongoose.model(constants.COLLECTIONS.USER_COLLECTION, userSchema);

export default userModel;