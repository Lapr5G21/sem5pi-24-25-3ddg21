"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const mongoose_1 = __importDefault(require("./mongoose"));
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("../../config"));
exports.default = async ({ expressApp }) => {
    const mongoConnection = await (0, mongoose_1.default)();
    logger_1.default.info('✌️ DB loaded and connected!');
    const userSchema = {
        // compare with the approach followed in repos and services
        name: 'userSchema',
        schema: '../persistence/schemas/userSchema',
    };
    const roleSchema = {
        // compare with the approach followed in repos and services
        name: 'roleSchema',
        schema: '../persistence/schemas/roleSchema',
    };
    const allergySchema = {
        name: 'allergySchema',
        schema: '../persistence/schemas/allergySchema',
    };
    const medicalConditionSchema = {
        name: 'medicalConditionSchema',
        schema: '../persistence/schemas/medicalConditionSchema',
    };
    const medicalRecordSchema = {
        name: 'medicalRecordSchema',
        schema: '../persistence/schemas/medicalRecordSchema',
    };
    const roleController = {
        name: config_1.default.controllers.role.name,
        path: config_1.default.controllers.role.path
    };
    const roleRepo = {
        name: config_1.default.repos.role.name,
        path: config_1.default.repos.role.path
    };
    const userRepo = {
        name: config_1.default.repos.user.name,
        path: config_1.default.repos.user.path
    };
    const allergyRepo = {
        name: config_1.default.repos.allergy.name,
        path: config_1.default.repos.allergy.path
    };
    const medicalConditionRepo = {
        name: config_1.default.repos.medicalCondition.name,
        path: config_1.default.repos.medicalCondition.path
    };
    const medicalRecordRepo = {
        name: config_1.default.repos.medicalRecord.name,
        path: config_1.default.repos.medicalRecord.path
    };
    const medicalRecordController = {
        name: config_1.default.controllers.medicalRecord.name,
        path: config_1.default.controllers.medicalRecord.path
    };
    const roleService = {
        name: config_1.default.services.role.name,
        path: config_1.default.services.role.path
    };
    const allergyController = {
        name: config_1.default.controllers.allergy.name,
        path: config_1.default.controllers.allergy.path
    };
    const medicalConditionController = {
        name: config_1.default.controllers.medicalCondition.name,
        path: config_1.default.controllers.medicalCondition.path
    };
    const allergyService = {
        name: config_1.default.services.allergy.name,
        path: config_1.default.services.allergy.path
    };
    const medicalConditionService = {
        name: config_1.default.services.medicalCondition.name,
        path: config_1.default.services.medicalCondition.path
    };
    const medicalRecordService = {
        name: config_1.default.services.medicalRecord.name,
        path: config_1.default.services.medicalRecord.path
    };
    await (0, dependencyInjector_1.default)({
        mongoConnection,
        schemas: [
            userSchema,
            roleSchema,
            allergySchema,
            medicalConditionSchema,
            medicalRecordSchema
        ],
        controllers: [
            roleController,
            allergyController,
            medicalConditionController,
            medicalRecordController
        ],
        repos: [
            roleRepo,
            userRepo,
            allergyRepo,
            medicalConditionRepo,
            medicalRecordRepo
        ],
        services: [
            roleService,
            allergyService,
            medicalConditionService,
            medicalRecordService
        ]
    });
    logger_1.default.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');
    await (0, express_1.default)({ app: expressApp });
    logger_1.default.info('✌️ Express loaded');
};
//# sourceMappingURL=index.js.map