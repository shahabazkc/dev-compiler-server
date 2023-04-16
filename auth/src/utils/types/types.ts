export interface LOGIN_BODY {
    username: string
    password: string
};

export interface SIGNUP_BODY {
    username?: string | null
    password?: string
    name: string
    email?: string
    mobile_number?: number,
    country_code?: string,
    github_id?: string,
    github_data?: any,
    github_access_token?: string,
    avatar?: string,
    google_id?: string,
    google_access_token?: string,
    google_data?: any
}

export type AuthTypes = 'server' | 'github' | 'google';