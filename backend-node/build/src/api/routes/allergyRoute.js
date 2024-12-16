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
    app.use('/allergies', route);
    const ctrl = typedi_1.Container.get(config_1.default.controllers.allergy.name);
    route.get('/', (req, res, next) => ctrl.getAllAllergies(req, res, next));
    route.get('/:id', (0, celebrate_1.celebrate)({
        params: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().required(),
        }),
    }), (req, res, next) => ctrl.getAllergy(req, res, next));
    route.post('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().required(),
            code: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required()
        }),
    }), (req, res, next) => ctrl.createAllergy(req, res, next));
    route.put('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().required(),
            code: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required()
        }),
        params: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().required(),
        }),
    }), (req, res, next) => ctrl.updateAllergy(req, res, next));
    route.delete('/:id/delete', (req, res, next) => ctrl.deleteAllergy(req, res, next));
};
//# sourceMappingURL=allergyRoute.js.map