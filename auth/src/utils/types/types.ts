export interface LOGIN_BODY {
    username: string
    password: string
};

export interface SIGNUP_BODY {
    username: string
    password: string
    name: string
    email: string
    phone_number: number,
    country_code: string
}