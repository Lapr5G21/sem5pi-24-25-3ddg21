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
const Result_1 = require("../core/logic/Result");
const AllergyMap_1 = require("../mappers/AllergyMap");
const allergy_1 = require("../domain/Allergies/allergy");
const allergyCode_1 = require("../domain/Allergies/allergyCode");
const allergyDescription_1 = require("../domain/Allergies/allergyDescription");
const allergyName_1 = require("../domain/Allergies/allergyName");
const mongoose_1 = __importDefault(require("mongoose"));
let AllergyService = class AllergyService {
    constructor(allergyRepo) {
        this.allergyRepo = allergyRepo;
    }
    async createAllergy(allergyDTO) {
        try {
            const allergyProps = {
                name: allergyName_1.AllergyName.create({ name: allergyDTO.name }).getValue(),
                code: allergyCode_1.AllergyCode.create({ code: allergyDTO.code }).getValue(),
                description: allergyDescription_1.AllergyDescription.create({ description: allergyDTO.description }).getValue(),
                domainId: new mongoose_1.default.Types.ObjectId().toString(),
            };
            const allergyOrError = await allergy_1.Allergy.create(allergyProps);
            if (allergyOrError.isFailure) {
                return Result_1.Result.fail(allergyOrError.errorValue());
            }
            const allergyResult = allergyOrError.getValue();
            await this.allergyRepo.save(allergyResult);
            const allergyDTOResult = AllergyMap_1.AllergyMap.toDTO(allergyResult);
            return Result_1.Result.ok(allergyDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async deleteAllergy(id) {
        try {
            const allergy = await this.allergyRepo.findByDomainId(id);
            if (allergy === null) {
                return Result_1.Result.fail("Allergy not found");
            }
            else {
                await this.allergyRepo.delete(allergy);
                const allergyDTOResult = AllergyMap_1.AllergyMap.toDTO(allergy);
                return Result_1.Result.ok(allergyDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async getAllergy(allergyId) {
        try {
            const allergy = await this.allergyRepo.findByDomainId(allergyId);
            if (allergy === null) {
                return Result_1.Result.fail("Allergy not found");
            }
            else {
                const allergyDTOResult = AllergyMap_1.AllergyMap.toDTO(allergy);
                return Result_1.Result.ok(allergyDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async getAllAllergies() {
        try {
            const allergies = await this.allergyRepo.getAll();
            const allergiesDTO = allergies.map(allergy => AllergyMap_1.AllergyMap.toDTO(allergy));
            return Result_1.Result.ok(allergiesDTO);
        }
        catch (e) {
            throw e;
        }
    }
    async updateAllergy(allergyDTO) {
        try {
            const allergy = await this.allergyRepo.findByDomainId(allergyDTO.id);
            if (allergy === null) {
                return Result_1.Result.fail("allergy not found");
            }
            const allerdyDTOId = AllergyMap_1.AllergyMap.toDTO(allergy.props);
            const nameOrError = allerdyDTOId.name !== allergyDTO.name
                ? allergyName_1.AllergyName.create({ name: allergyDTO.name })
                : Result_1.Result.ok(allergy.props.name);
            const codeOrError = allerdyDTOId.code !== allergyDTO.code
                ? allergyCode_1.AllergyCode.create({ code: allergyDTO.code })
                : Result_1.Result.ok(allergy.props.code);
            const descriptionOrError = allerdyDTOId.description !== allergyDTO.description
                ? allergyDescription_1.AllergyDescription.create({ description: allergyDTO.description })
                : Result_1.Result.ok(allergy.props.description);
            if (nameOrError.isFailure || codeOrError.isFailure || descriptionOrError.isFailure) {
                return Result_1.Result.fail("Invalid data provided");
            }
            if (nameOrError.isSuccess) {
                allergy.props.name = nameOrError.getValue();
            }
            if (codeOrError.isSuccess) {
                allergy.props.code = codeOrError.getValue();
            }
            if (descriptionOrError.isSuccess) {
                allergy.props.description = descriptionOrError.getValue();
            }
            console.log("Allergy FINALLLLLLLLLv ", allergy);
            await this.allergyRepo.save(allergy);
            const allergyDTOResult = AllergyMap_1.AllergyMap.toDTO(allergy.props);
            return Result_1.Result.ok(allergyDTOResult);
        }
        catch (e) {
            console.error("Error during update:", e);
            return Result_1.Result.fail(`Error updating allergy: ${e.message}`);
        }
    }
};
AllergyService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.allergy.name)),
    __metadata("design:paramtypes", [Object])
], AllergyService);
exports.default = AllergyService;
//# sourceMappingURL=allergyService.js.map