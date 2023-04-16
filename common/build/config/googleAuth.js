"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
const config = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URL
};
exports.oauth2Client = new googleapis_1.google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI);
