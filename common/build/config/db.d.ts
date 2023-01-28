export declare class Database {
    private mongoose;
    connect({ mongoUri, port, host, name, opts, replSet }: {
        mongoUri: string;
        port: number;
        host: string;
        name: string;
        opts: any;
        replSet: string;
    }): Promise<void>;
    disconnect(): Promise<void>;
}
