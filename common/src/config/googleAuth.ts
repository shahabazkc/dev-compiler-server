import { google } from 'googleapis';

const config = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URL
};

export const oauth2Client = new google.auth.OAuth2(
    config.CLIENT_ID,
    config.CLIENT_SECRET,
    config.REDIRECT_URI
);

