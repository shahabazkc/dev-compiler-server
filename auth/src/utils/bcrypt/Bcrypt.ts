import bcrypt from 'bcryptjs'

export class Bcrypt {
    static async toHash(text: string) {
        let hashedPass = await bcrypt.hash(text, 10);
        return hashedPass;
    }

    static async compare(suppliedText: string, storedText: string) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(suppliedText, storedText, (err: any, res: any) => {
                if (err) {
                    reject(false);
                } else if (res) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
    }
}