import mongoose from "mongoose";
/**
 * Common db class
 * all common functions can be defined here
 * pass the modelname as mandatory parameter
 */
export declare class DBService {
    private mongoose;
    constructor();
    /**
     * [getModelInstance description]
     *
     * @param   {[string]}  modelName  mongoose model's name
     *
     * @return  {[Mongoose Model instance]}
     */
    getModelInstance(modelName: string): mongoose.Model<any, unknown, unknown, unknown, any>;
    getCreateModelInstance(modelName: string): mongoose.Collection<mongoose.AnyObject>;
    normalizeObject(obj: any): any;
    updateById(modelName: string, id: string, updRec: any, opts: any): Promise<any>;
    updateOne(modelName: string, query: any, updRec: any, opts: any): Promise<any>;
    /**
     * @param modelName model name
     * @param id _id of the schema
     * @param opts additional options
     *
     * @returns object
     */
    getById(modelName: string, id: string, { noErr, populate }: {
        noErr?: boolean | undefined;
        populate?: never[] | undefined;
    }): Promise<any>;
    /**
     * @param modelName model name
     * @param query db query
     * @param opts additional options
     *
     * @returns list of object
     */
    getByQuery(modelName: string, query: any, { projections, sortOption, populateQuery, limit, skip, }: {
        projections?: {} | undefined;
        sortOption?: {} | undefined;
        populateQuery?: never[] | undefined;
        limit?: number | undefined;
        skip?: number | undefined;
    }): Promise<mongoose.LeanDocument<Omit<any, never>>[] | mongoose.LeanDocument<any>[]>;
    /**
     * @param modelName model name
     * @param query db query
     * @param opts additional options
     *
     * @returns one object
     */
    getOneByQuery(modelName: string, query: any, { noErr, projections, populateQuery, limit, skip, sort, }: {
        noErr?: boolean | undefined;
        projections?: {} | undefined;
        populateQuery?: never[] | undefined;
        limit?: number | undefined;
        skip?: number | undefined;
        sort?: {} | undefined;
    }): Promise<any>;
    /**
     * @param modelName model name
     * @param query mongo query to execute
     * @param opts additional options
     *
     * @returns paginated objects
     */
    paginate(modelName: string, query: any, { page, limit, projections, sortOption, populateQuery, }: {
        page?: number | undefined;
        limit?: number | undefined;
        projections?: {} | undefined;
        sortOption?: {} | undefined;
        populateQuery?: never[] | undefined;
    }): Promise<{
        docs: mongoose.LeanDocument<Omit<any, never>>[] | mongoose.LeanDocument<any>[];
        total: number;
        limit: number;
        page: number;
        pages: number;
    }>;
    /**
     * Get Count of documents by query
     * @param modelName model name
     * @param query mongo query to execute
     * @returns resulting count of object from query
     */
    getCount(modelName: string, query: any): Promise<number>;
    /**
     * @param modelName mongoose model's name
     * @param aggregationPipe an array of aggregation stages
     *
     * @returns resulting data
     */
    aggregate(modelName: string, aggregationPipe?: never[]): Promise<any>;
    /**
     * @param modelName model name
     * @param query db query
     * @param updRec json object to update the document
     * @param opts additional options
     *
     * @returns updated object
     */
    updateMany(modelName: string, query: any, updRec: any, opts: any): Promise<import("mongodb").UpdateResult>;
    /**
     * delete an existing document
     * @param modelName mongoose model's name to delete
     * @param id object to be deleted
     * @returns deleted id
     */
    deleteById(modelName: string, id: string): Promise<{
        id: string;
    }>;
    /**
     * delete multiple documents
     * @param modelName mongoose model's name
     * @param query query to delete many with
     * @returns boolean
     */
    deleteMany(modelName: string, query: any): Promise<boolean>;
    /**
     * Create a document
     * @param modelName mongoose model's name to create
     * @param newObject json object to create the new document with
     * @param opts additional options
     * @returns newly created Object
     */
    insertOne(modelName: string, newObject: any, opts?: {}): Promise<any>;
    /**
     * insert multiple documents
     * @param modelName mongoose model's name
     * @param newObjects array of new documents to be inserted
     * @param opts options: https://mongoosejs.com/docs/api.html#model_Model.insertMany
     * @returns result of insert many operation
     */
    insertMany(modelName: string, newObjects: any, opts?: {}): Promise<any[]>;
}
