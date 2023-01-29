import mongoose from "mongoose";
import httpStatus from "http-status";
import httpErrors from 'http-errors';
import { log } from "../../config/logger";

// const { modelName } = require("../agent/agentModel");

/**
 * Common db class
 * all common functions can be defined here
 * pass the modelname as mandatory parameter
 */
export class DBService {
    private mongoose = mongoose;
    constructor() {
        this.mongoose = mongoose;
    }
    /**
     * [getModelInstance description]
     *
     * @param   {[string]}  modelName  mongoose model's name
     *
     * @return  {[Mongoose Model instance]}
     */

    public getModelInstance(modelName: string) {
        return this.mongoose.model(modelName);
    };


    public getCreateModelInstance(modelName: string) {
        return this.mongoose.model(modelName).db.collection(modelName);
    };

    public normalizeObject(obj: any) {
        if (typeof obj?.toObject === "function") {
            obj = obj.toObject();
        }

        return obj;
    };

    // /**
    //  * update an existing document
    //  * @param modelName model name
    //  * @param id _id of the schema
    //  * @param updRec json object to update the document
    //  * @param opts additional options
    //  *
    //  * @returns updated object
    //  */
    async updateById(modelName: string, id: string, updRec: any, opts: any) {
        const model = this.getModelInstance(modelName);
        let options = { new: true };

        if (opts) {
            options = { ...options, ...opts };
        }

        const updatedObjectInstance = await model.findOneAndUpdate(
            { _id: id },
            updRec,
            options
        );

        if (!updatedObjectInstance) {
            throw httpErrors(
                httpStatus.NOT_FOUND,
                `${modelName} item with ${id} could not be updated`
            );
        }
        log.info(`${modelName} item with id: ${id} updated successfully`);

        return updatedObjectInstance;
    };

    async updateOne(modelName: string, query: any, updRec: any, opts: any) {
        const model = this.getModelInstance(modelName);
        let options = { new: true };

        if (opts) {
            options = { ...options, ...opts };
        }

        const updatedObjectInstance = await model.findOneAndUpdate(
            query,
            updRec,
            options
        );

        if (!updatedObjectInstance) {
            throw httpErrors(
                httpStatus.NOT_FOUND,
                `${modelName} item with ${updatedObjectInstance?._id} could not be updated`
            );
        }
        log.info(
            `${modelName} item with id: ${updatedObjectInstance?._id} updated successfully`
        );

        return updatedObjectInstance;
    };

    /**
     * @param modelName model name
     * @param id _id of the schema
     * @param opts additional options
     *
     * @returns object
     */
    async getById(modelName: string, id: string, { noErr = false, populate = [] }) {
        const model = this.getModelInstance(modelName);

        const result = await model.findById(id).populate(populate).lean();

        if (!result && !noErr) {
            throw httpErrors(
                httpStatus.NOT_FOUND,
                `${modelName} item with id - ${id} could not be found`
            );
        }

        log.info(`${modelName} item with id - ${id} fetched successfully`);

        return result;
    };

    /**
     * @param modelName model name
     * @param query db query
     * @param opts additional options
     *
     * @returns list of object
     */
    async getByQuery(
        modelName: string,
        query: any,
        {
            projections = null || {},
            sortOption = {},
            populateQuery = [],
            limit = 0,
            skip = 0,
        }
    ) {
        const model = this.getModelInstance(modelName);
        const result = await model
            .find(query, projections)
            .populate(populateQuery)
            .sort(sortOption)
            .limit(limit)
            .skip(skip)
            .lean();

        if (!result) {
            throw httpErrors(httpStatus.NOT_FOUND, `No ${modelName} items found`);
        }

        log.info(`${modelName} items fetched successfully`);

        return result;
    };

    /**
     * @param modelName model name
     * @param query db query
     * @param opts additional options
     *
     * @returns one object
     */
    async getOneByQuery(
        modelName: string,
        query: any,
        {
            noErr = false,
            projections = null || {},
            populateQuery = [],
            limit = 0,
            skip = 0,
            sort = {},
        }
    ) {
        const model = this.getModelInstance(modelName);
        const result = await model
            .findOne(query, projections)
            .populate(populateQuery)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        if (!result && !noErr) {
            throw httpErrors(httpStatus.NOT_FOUND, `No ${modelName} item found`);
        }

        log.info(`${modelName} items fetched successfully`);

        return result;
    };

    /**
     * @param modelName model name
     * @param query mongo query to execute
     * @param opts additional options
     *
     * @returns paginated objects
     */
    async paginate(
        modelName: string,
        query: any,
        {
            page = 1,
            limit = 10,
            projections = null || {},
            sortOption = {},
            populateQuery = [],
        }
    ) {
        if (page <= 0 || limit <= 0) {
            throw httpErrors(
                httpStatus.BAD_REQUEST,
                `page or limit cannot be 0 or negative`
            );
        }
        const skip = (page - 1) * limit;
        // initialise model
        const model = this.getModelInstance(modelName);
        const docs = await model
            .find(query, projections)
            .populate(populateQuery)
            .sort(sortOption)
            .skip(skip)
            .limit(limit) // sorts the data
            .lean();

        const total = await this.getCount(modelName, query);
        const pages = Math.ceil(total / limit);

        const result = {
            docs,
            total,
            limit,
            page,
            pages,
        };

        log.info(`${modelName} items fetched successfully`);

        return result;
    };

    /**
     * Get Count of documents by query
     * @param modelName model name
     * @param query mongo query to execute
     * @returns resulting count of object from query
     */
    async getCount(modelName: string, query: any) {
        // initialise model
        const model = this.getModelInstance(modelName);

        return await model.find(query).count();
    };

    /**
     * @param modelName mongoose model's name
     * @param aggregationPipe an array of aggregation stages
     *
     * @returns resulting data
     */
    async aggregate(modelName: string, aggregationPipe = []) {
        // initialise model
        const model = this.getModelInstance(modelName);
        let result: any;

        result = await model.aggregate(aggregationPipe);

        if (!result) {
            throw httpErrors(httpStatus.NOT_FOUND, `No ${modelName} items found`);
        }

        log.info(`${modelName} aggregation run successfully`);

        return result;
    };

    /**
     * @param modelName model name
     * @param query db query
     * @param updRec json object to update the document
     * @param opts additional options
     *
     * @returns updated object
     */
    async updateMany(modelName: string, query: any, updRec: any, opts: any) {
        const model = this.getModelInstance(modelName);
        const result = await model.updateMany(query, updRec, opts);

        if (!result) {
            throw httpErrors(
                httpStatus.NOT_FOUND,
                `{modelName} items could not be updated`
            );
        }

        log.info(`${modelName} items updated successfully`);

        return result;
    };

    /**
     * delete an existing document
     * @param modelName mongoose model's name to delete
     * @param id object to be deleted
     * @returns deleted id
     */
    async deleteById(modelName: string, id: string) {
        const model = this.getModelInstance(modelName);
        const deletedObjectInstance = await model.findOneAndRemove({ _id: id });

        if (!deletedObjectInstance) {
            throw httpErrors(
                httpStatus.NOT_FOUND,
                `${modelName} item with id: ${id} could not be deleted`
            );
        }

        log.info(`${modelName} item with id: ${id} deleted successfully`);

        return { id };
    };

    /**
     * delete multiple documents
     * @param modelName mongoose model's name
     * @param query query to delete many with
     * @returns boolean
     */
    async deleteMany(modelName: string, query: any) {
        const model = this.getModelInstance(modelName);

        try {
            await model.deleteMany(query);
        } catch (err) {
            log.error(`error encountered in deleteMany`);
            throw err;
        }

        log.info(`${modelName} multiple items deleted successfully`);

        return true;
    };

    /**
     * Create a document
     * @param modelName mongoose model's name to create
     * @param newObject json object to create the new document with
     * @param opts additional options
     * @returns newly created Object
     */
    // eslint-disable-next-line no-unused-vars
    async insertOne(modelName: string, newObject: any, opts = {}) {
        const model = this.getModelInstance(modelName);
        let newObjectInstance = new model(newObject);

        newObjectInstance = await newObjectInstance.save();
        log.info(`${modelName} created successfully`);

        return this.normalizeObject(newObjectInstance);
    };

    /**
     * insert multiple documents
     * @param modelName mongoose model's name
     * @param newObjects array of new documents to be inserted
     * @param opts options: https://mongoosejs.com/docs/api.html#model_Model.insertMany
     * @returns result of insert many operation
     */
    async insertMany(modelName: string, newObjects: any, opts = {}) {
        const model = this.getModelInstance(modelName);
        let options = Object.assign({ ordered: false }, opts);

        const result = await model.insertMany(newObjects, options);
        log.info(`${modelName} many entries inserted successfully`);

        return result;
    };
};

