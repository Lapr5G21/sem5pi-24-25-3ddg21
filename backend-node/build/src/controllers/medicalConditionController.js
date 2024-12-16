"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../config"));
let MedicalConditionController = class MedicalConditionController {
    constructor(medicalConditionServiceInstance) {
        this.medicalConditionServiceInstance = medicalConditionServiceInstance;
    }
    async getMedicalCondition(req, res, next) {
        try {
            const medicalCondition = await this.medicalConditionServiceInstance.getMedicalCondition(req.params.id);
            if (medicalCondition === null) {
                return res.status(404).send("Medical condition not found or error in retrieving medical condition");
            }
            return res.json(medicalCondition).status(200);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    ;
    // api/medicalConditions
    async getAllMedicalConditions(req, res, next) {
        try {
            const result = await this.medicalConditionServiceInstance.getMedicalConditions();
            if (result.isFailure) {
                return res.status(404).json({ message: "Failed to retrieve medical conditions" });
            }
            const medicalConditionsDTO = result.getValue();
            return res.status(200).json(medicalConditionsDTO);
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    async searchMedicalConditions(req, res, next) {
        try {
            console.log("Controller reached: searchMedicalConditions");
            const { name, code } = req.query;
            if (!name && !code) {
                return res.status(400).json({ message: "At least one search parameter ('name' or 'code') is required." });
            }
            const searchDto = {
                name: name,
                code: code,
            };
            const result = await this.medicalConditionServiceInstance.searchMedicalConditions(searchDto);
            if (result.isFailure) {
                return res.status(404).json({ message: "No medical conditions found" });
            }
            const medicalConditionsDTO = result.getValue();
            return res.status(200).json(medicalConditionsDTO);
        }
        catch (err) {
            console.error("Error in controller:", err);
            return res.status(500).json({ message: err.message });
        }
    }
    // api/medicalConditions
    async createMedicalCondition(req, res, next) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body);
            if (medicalConditionOrError.isFailure) {
                return res.status(402).send("Error creating medical condition");
            }
            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.json(medicalConditionDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // api/medicalConditions/:id
    async updateMedicalCondition(req, res, next) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(req.body);
            if (medicalConditionOrError.isFailure) {
                return res.status(404).send();
            }
            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.status(201).json(medicalConditionDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async deleteMedicalCondition(req, res, next) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.deleteMedicalCondition(req.params.id);
            if (medicalConditionOrError.isFailure) {
                return res.status(404).json({ message: "Medical condition not found" });
            }
            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.status(200).json(medicalConditionDTO);
        }
        catch (e) {
            console.error("Error deleting medical condition:", e);
            return next(e);
        }
    }
    ;
};
MedicalConditionController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.medicalCondition.name)),
    __metadata("design:paramtypes", [Object])
], MedicalConditionController);
exports.default = MedicalConditionController;
//# sourceMappingURL=medicalConditionController.js.map