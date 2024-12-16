"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../../config"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/medicalConditions', route);
    const ctrl = typedi_1.Container.get(config_1.default.controllers.medicalCondition.name);
    route.get('/', (req, res, next) => ctrl.getAllMedicalConditions(req, res, next));
    route.get('/:id', (0, celebrate_1.celebrate)({
        params: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().required(),
        }),
    }), (req, res, next) => ctrl.getMedicalCondition(req, res, next));
    route.get('/search', (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().optional(),
            code: celebrate_1.Joi.string().optional(),
        }),
    }), (req, res, next) => ctrl.searchMedicalConditions(req, res, next));
    route.post('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().required(),
            code: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required(),
            symptoms: celebrate_1.Joi.string().required()
        }),
    }), (req, res, next) => ctrl.createMedicalCondition(req, res, next));
    route.put('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().required(),
            name: celebrate_1.Joi.string().required(),
            code: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required(),
            symptoms: celebrate_1.Joi.string().required(),
        }),
    }), (req, res, next) => ctrl.updateMedicalCondition(req, res, next));
    route.delete('/:id/delete', (req, res, next) => ctrl.deleteMedicalCondition(req, res, next));
};
//# sourceMappingURL=medicalConditionRoute.js.map