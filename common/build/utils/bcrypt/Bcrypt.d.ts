export declare class Bcrypt {
    static toHash(text: string): Promise<string>;
    static compare(suppliedText: string, storedText: string): Promise<unknown>;
}
