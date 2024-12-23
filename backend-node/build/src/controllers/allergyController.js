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
let AllergyController = class AllergyController {
    constructor(allergyServiceInstance) {
        this.allergyServiceInstance = allergyServiceInstance;
    }
    async getAllergy(req, res, next) {
        try {
            const allergy = await this.allergyServiceInstance.getAllergy(req.params.id);
            if (allergy === null) {
                return res.status(404).send("Allergy not found or error in retrieving allergy");
            }
            return res.json(allergy).status(200);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    ;
    async getAllAllergies(req, res, next) {
        try {
            const allergies = await this.allergyServiceInstance.getAllAllergies();
            if (allergies.isFailure) {
                return res.status(404).json({ message: "Failed to retrieve allergies" });
            }
            const allergiesDTO = allergies.getValue();
            return res.status(200).json(allergiesDTO);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    ;
    async createAllergy(req, res, next) {
        try {
            const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body);
            if (allergyOrError.isFailure) {
                return res.status(402).send("Error creating allergy");
            }
            const allergyDTO = allergyOrError.getValue();
            return res.json(allergyDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async deleteAllergy(req, res, next) {
        try {
            const allergyOrError = await this.allergyServiceInstance.deleteAllergy(req.params.id);
            if (allergyOrError.isFailure) {
                return res.status(404).json({ message: "Morreu aqui" });
            }
            const allergyDTO = allergyOrError.getValue();
            return res.status(200).json(allergyDTO);
        }
        catch (e) {
            console.error("Error deleting allergy:", e);
            return next(e);
        }
    }
    ;
    // api/allergies/:id
    async updateAllergy(req, res, next) {
        try {
            const allergyOrError = await this.allergyServiceInstance.updateAllergy(req.body);
            if (allergyOrError.isFailure) {
                return res.status(404).send("Allergy not found");
            }
            const allergyDTO = allergyOrError.getValue();
            return res.status(201).json(allergyDTO);
        }
        catch (e) {
            console.error("Error:", e);
            return next(e);
        }
    }
    ;
};
AllergyController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.allergy.name)),
    __metadata("design:paramtypes", [Object])
], AllergyController);
exports.default = AllergyController;
//# sourceMappingURL=allergyController.js.map