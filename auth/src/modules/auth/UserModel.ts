import { Bcrypt } from "@dev-compiler/common";
import mongoose from "mongoose";
import * as constants from '../../utils/constants/index';

const userSchema = new mongoose.Schema({
    username: { type: String, required: false, index: true, trim: true },
    password: { type: String, required: false },
    mobile_number: { type: String, required: false, index: true },
    country_code: { type: String, required: false, default: "+91" },
    email_id: { type: String, required: false, index: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, required: false },
    github_id: { type: String, required: false, index: true },
    github_data: { type: Object, required: false ,default: {} },
    github_access_token: { type: String, required: false },
}, {
    autoIndex: false,
    timestamps: true 
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
        try {
            user.password = await Bcrypt.toHash(user.password);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
})

const userModel = mongoose.model(constants.COLLECTIONS.USER_COLLECTION, userSchema);

export default userModel;