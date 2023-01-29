"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const http_errors_1 = __importDefault(require("http-errors"));
const logger_1 = require("../../config/logger");
// const { modelName } = require("../agent/agentModel");
/**
 * Common db class
 * all common functions can be defined here
 * pass the modelname as mandatory parameter
 */
class DBService {
    constructor() {
        this.mongoose = mongoose_1.default;
        this.mongoose = mongoose_1.default;
    }
    /**
     * [getModelInstance description]
     *
     * @param   {[string]}  modelName  mongoose model's name
     *
     * @return  {[Mongoose Model instance]}
     */
    getModelInstance(modelName) {
        return this.mongoose.model(modelName);
    }
    ;
    getCreateModelInstance(modelName) {
        return this.mongoose.model(modelName).db.collection(modelName);
    }
    ;
    normalizeObject(obj) {
        if (typeof (obj === null || obj === void 0 ? void 0 : obj.toObject) === "function") {
            obj = obj.toObject();
        }
        return obj;
    }
    ;
    // /**
    //  * update an existing document
    //  * @param modelName model name
    //  * @param id _id of the schema
    //  * @param updRec json object to update the document
    //  * @param opts additional options
    //  *
    //  * @returns updated object
    //  */
    updateById(modelName, id, updRec, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            let options = { new: true };
            if (opts) {
                options = Object.assign(Object.assign({}, options), opts);
            }
            const updatedObjectInstance = yield model.findOneAndUpdate({ _id: id }, updRec, options);
            if (!updatedObjectInstance) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `${modelName} item with ${id} could not be updated`);
            }
            logger_1.log.info(`${modelName} item with id: ${id} updated successfully`);
            return updatedObjectInstance;
        });
    }
    ;
    updateOne(modelName, query, updRec, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            let options = { new: true };
            if (opts) {
                options = Object.assign(Object.assign({}, options), opts);
            }
            const updatedObjectInstance = yield model.findOneAndUpdate(query, updRec, options);
            if (!updatedObjectInstance) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `${modelName} item with ${updatedObjectInstance === null || updatedObjectInstance === void 0 ? void 0 : updatedObjectInstance._id} could not be updated`);
            }
            logger_1.log.info(`${modelName} item with id: ${updatedObjectInstance === null || updatedObjectInstance === void 0 ? void 0 : updatedObjectInstance._id} updated successfully`);
            return updatedObjectInstance;
        });
    }
    ;
    /**
     * @param modelName model name
     * @param id _id of the schema
     * @param opts additional options
     *
     * @returns object
     */
    getById(modelName, id, { noErr = false, populate = [] }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            const result = yield model.findById(id).populate(populate).lean();
            if (!result && !noErr) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `${modelName} item with id - ${id} could not be found`);
            }
            logger_1.log.info(`${modelName} item with id - ${id} fetched successfully`);
            return result;
        });
    }
    ;
    /**
     * @param modelName model name
     * @param query db query
     * @param opts additional options
     *
     * @returns list of object
     */
    getByQuery(modelName, query, { projections = null || {}, sortOption = {}, populateQuery = [], limit = 0, skip = 0, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            const result = yield model
                .find(query, projections)
                .populate(populateQuery)
                .sort(sortOption)
                .limit(limit)
                .skip(skip)
                .lean();
            if (!result) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `No ${modelName} items found`);
            }
            logger_1.log.info(`${modelName} items fetched successfully`);
            return result;
        });
    }
    ;
    /**
     * @param modelName model name
     * @param query db query
     * @param opts additional options
     *
     * @returns one object
     */
    getOneByQuery(modelName, query, { noErr = false, projections = null || {}, populateQuery = [], limit = 0, skip = 0, sort = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            const result = yield model
                .findOne(query, projections)
                .populate(populateQuery)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean();
            if (!result && !noErr) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `No ${modelName} item found`);
            }
            logger_1.log.info(`${modelName} items fetched successfully`);
            return result;
        });
    }
    ;
    /**
     * @param modelName model name
     * @param query mongo query to execute
     * @param opts additional options
     *
     * @returns paginated objects
     */
    paginate(modelName, query, { page = 1, limit = 10, projections = null || {}, sortOption = {}, populateQuery = [], }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page <= 0 || limit <= 0) {
                throw (0, http_errors_1.default)(http_status_1.default.BAD_REQUEST, `page or limit cannot be 0 or negative`);
            }
            const skip = (page - 1) * limit;
            // initialise model
            const model = this.getModelInstance(modelName);
            const docs = yield model
                .find(query, projections)
                .populate(populateQuery)
                .sort(sortOption)
                .skip(skip)
                .limit(limit) // sorts the data
                .lean();
            const total = yield this.getCount(modelName, query);
            const pages = Math.ceil(total / limit);
            const result = {
                docs,
                total,
                limit,
                page,
                pages,
            };
            logger_1.log.info(`${modelName} items fetched successfully`);
            return result;
        });
    }
    ;
    /**
     * Get Count of documents by query
     * @param modelName model name
     * @param query mongo query to execute
     * @returns resulting count of object from query
     */
    getCount(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            // initialise model
            const model = this.getModelInstance(modelName);
            return yield model.find(query).count();
        });
    }
    ;
    /**
     * @param modelName mongoose model's name
     * @param aggregationPipe an array of aggregation stages
     *
     * @returns resulting data
     */
    aggregate(modelName, aggregationPipe = []) {
        return __awaiter(this, void 0, void 0, function* () {
            // initialise model
            const model = this.getModelInstance(modelName);
            let result;
            result = yield model.aggregate(aggregationPipe);
            if (!result) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `No ${modelName} items found`);
            }
            logger_1.log.info(`${modelName} aggregation run successfully`);
            return result;
        });
    }
    ;
    /**
     * @param modelName model name
     * @param query db query
     * @param updRec json object to update the document
     * @param opts additional options
     *
     * @returns updated object
     */
    updateMany(modelName, query, updRec, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            const result = yield model.updateMany(query, updRec, opts);
            if (!result) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `{modelName} items could not be updated`);
            }
            logger_1.log.info(`${modelName} items updated successfully`);
            return result;
        });
    }
    ;
    /**
     * delete an existing document
     * @param modelName mongoose model's name to delete
     * @param id object to be deleted
     * @returns deleted id
     */
    deleteById(modelName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            const deletedObjectInstance = yield model.findOneAndRemove({ _id: id });
            if (!deletedObjectInstance) {
                throw (0, http_errors_1.default)(http_status_1.default.NOT_FOUND, `${modelName} item with id: ${id} could not be deleted`);
            }
            logger_1.log.info(`${modelName} item with id: ${id} deleted successfully`);
            return { id };
        });
    }
    ;
    /**
     * delete multiple documents
     * @param modelName mongoose model's name
     * @param query query to delete many with
     * @returns boolean
     */
    deleteMany(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            try {
                yield model.deleteMany(query);
            }
            catch (err) {
                logger_1.log.error(`error encountered in deleteMany`);
                throw err;
            }
            logger_1.log.info(`${modelName} multiple items deleted successfully`);
            return true;
        });
    }
    ;
    /**
     * Create a document
     * @param modelName mongoose model's name to create
     * @param newObject json object to create the new document with
     * @param opts additional options
     * @returns newly created Object
     */
    // eslint-disable-next-line no-unused-vars
    insertOne(modelName, newObject, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            let newObjectInstance = new model(newObject);
            newObjectInstance = yield newObjectInstance.save();
            logger_1.log.info(`${modelName} created successfully`);
            return this.normalizeObject(newObjectInstance);
        });
    }
    ;
    /**
     * insert multiple documents
     * @param modelName mongoose model's name
     * @param newObjects array of new documents to be inserted
     * @param opts options: https://mongoosejs.com/docs/api.html#model_Model.insertMany
     * @returns result of insert many operation
     */
    insertMany(modelName, newObjects, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.getModelInstance(modelName);
            let options = Object.assign({ ordered: false }, opts);
            const result = yield model.insertMany(newObjects, options);
            logger_1.log.info(`${modelName} many entries inserted successfully`);
            return result;
        });
    }
    ;
}
exports.DBService = DBService;
;
