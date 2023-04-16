
export const normalizeUserObject = (user: any) => {
    const { _id, username, name, email_id, mobile_number, avatar } = user;
    return {
        _id,
        username,
        name,
        email_id,
        mobile_number,
        avatar
    }
}