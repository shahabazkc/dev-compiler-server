import mongoose from 'mongoose';
import { log } from './logger';

export class Database {
    private mongoose = mongoose;

    async connect(
        {
            mongoUri = '',
            port,
            host,
            name,
            opts,
            replSet = ''
        }: {
            mongoUri: string,
            port: number,
            host: string,
            name: string,
            opts: any,
            replSet: string
        }
    ) {
        try {
            let db: any;
            mongoose.set("strictQuery", false);
            if (mongoUri) {
                log.info('connecting to database');
                db = await this.mongoose.connect(mongoUri, opts);
            } else {
                db = await this.mongoose.connect(
                    `mongodb://${host}:${port}/${name}`,
                    opts
                )
            }
            log.info(`Connected to database - ${db.connections[0]?.host}/${db.connections[0]?.name} successfully'`);
        }
        catch (err) {
            log.info('failed to connect with database');
            log.error(err);
            throw new Error('failed to connect to database');
        }
    }

    async disconnect() {
        return await mongoose.disconnect();
    }
}