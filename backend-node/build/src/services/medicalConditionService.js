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
const MedicalConditionMap_1 = require("../mappers/MedicalConditionMap");
const medicalCondition_1 = require("../domain/MedicalConditions/medicalCondition");
const medicalConditionCode_1 = require("../domain/MedicalConditions/medicalConditionCode");
const medicalConditionDescription_1 = require("../domain/MedicalConditions/medicalConditionDescription");
const medicalConditionName_1 = require("../domain/MedicalConditions/medicalConditionName");
const medicalConditionSymptoms_1 = require("../domain/MedicalConditions/medicalConditionSymptoms");
const mongoose_1 = __importDefault(require("mongoose"));
let MedicalConditionService = class MedicalConditionService {
    constructor(medicalConditionRepo) {
        this.medicalConditionRepo = medicalConditionRepo;
    }
    async createMedicalCondition(medicalConditionDTO) {
        try {
            const medicalConditionProps = {
                name: medicalConditionName_1.MedicalConditionName.create({ name: medicalConditionDTO.name }).getValue(),
                code: medicalConditionCode_1.MedicalConditionCode.create({ code: medicalConditionDTO.code }).getValue(),
                description: medicalConditionDescription_1.MedicalConditionDescription.create({ description: medicalConditionDTO.description }).getValue(),
                symptoms: medicalConditionSymptoms_1.MedicalConditionSymptoms.create({ symptoms: medicalConditionDTO.symptoms }).getValue(),
                domainId: new mongoose_1.default.Types.ObjectId().toString(),
            };
            const medicalConditionOrError = await medicalCondition_1.MedicalCondition.create(medicalConditionProps);
            if (medicalConditionOrError.isFailure) {
                return Result_1.Result.fail(medicalConditionOrError.errorValue());
            }
            const medicalConditionResult = medicalConditionOrError.getValue();
            await this.medicalConditionRepo.save(medicalConditionResult);
            const medicalConditionDTOResult = MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalConditionResult);
            return Result_1.Result.ok(medicalConditionDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async getMedicalCondition(medicalConditionId) {
        try {
            const medicalCondition = await this.medicalConditionRepo.findByDomainId(medicalConditionId);
            if (medicalCondition === null) {
                return Result_1.Result.fail("Medical Condition not found");
            }
            else {
                const medicalConditionDTOResult = MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalCondition);
                return Result_1.Result.ok(medicalConditionDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async getMedicalConditions() {
        try {
            const medicalConditions = await this.medicalConditionRepo.getAll();
            const medicalConditionsDTO = medicalConditions.map(medicalCondition => MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalCondition));
            return Result_1.Result.ok(medicalConditionsDTO);
        }
        catch (e) {
            throw e;
        }
    }
    async searchMedicalConditions(searchDTO) {
        try {
            const medicalConditions = await this.medicalConditionRepo.searchMedicalConditions(searchDTO);
            if (medicalConditions.length === 0) {
                console.log("No medical conditions found in service.");
                return Result_1.Result.fail(`No medical conditions found for the given search parameters.`);
            }
            const medicalConditionsDTO = medicalConditions.map(medicalCondition => MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalCondition));
            return Result_1.Result.ok(medicalConditionsDTO);
        }
        catch (e) {
            console.error("Error during search in service:", e);
            return Result_1.Result.fail(`Error searching medical conditions: ${e.message}`);
        }
    }
    async updateMedicalCondition(medicalConditionDTO) {
        try {
            const medicalCondition = await this.medicalConditionRepo.findByDomainId(medicalConditionDTO.id);
            if (medicalCondition === null) {
                return Result_1.Result.fail("Medical Condition not found");
            }
            console.log("Objeto", medicalCondition);
            const medicalConditionDTOOld = MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalCondition.props);
            const nameOrError = medicalConditionDTOOld.name !== medicalConditionDTO.name
                ? medicalConditionName_1.MedicalConditionName.create({ name: medicalConditionDTO.name })
                : Result_1.Result.ok(medicalCondition.props.name);
            const codeOrError = medicalConditionDTOOld.code !== medicalConditionDTO.code
                ? medicalConditionCode_1.MedicalConditionCode.create({ code: medicalConditionDTO.code })
                : Result_1.Result.ok(medicalCondition.props.code);
            const descriptionOrError = medicalConditionDTOOld.description !== medicalConditionDTO.description
                ? medicalConditionDescription_1.MedicalConditionDescription.create({ description: medicalConditionDTO.description })
                : Result_1.Result.ok(medicalCondition.props.description);
            const symptomsOrError = medicalConditionDTOOld.symptoms !== medicalConditionDTO.symptoms
                ? medicalConditionSymptoms_1.MedicalConditionSymptoms.create({ symptoms: medicalConditionDTO.symptoms })
                : Result_1.Result.ok(medicalCondition.props.symptoms);
            if (nameOrError.isFailure || codeOrError.isFailure || descriptionOrError.isFailure || symptomsOrError.isFailure) {
                return Result_1.Result.fail("Invalid data provided");
            }
            if (nameOrError.isSuccess)
                medicalCondition.props.name = nameOrError.getValue();
            if (codeOrError.isSuccess)
                medicalCondition.props.code = codeOrError.getValue();
            if (descriptionOrError.isSuccess)
                medicalCondition.props.description = descriptionOrError.getValue();
            if (symptomsOrError.isSuccess)
                medicalCondition.props.symptoms = symptomsOrError.getValue();
            await this.medicalConditionRepo.save(medicalCondition);
            const medicalConditionDTOResult = MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalCondition.props);
            return Result_1.Result.ok(medicalConditionDTOResult);
        }
        catch (e) {
            console.error("Error during update:", e);
            return Result_1.Result.fail(`Error updating medical condition: ${e.message}`);
        }
    }
    async deleteMedicalCondition(id) {
        try {
            const medicalCondition = await this.medicalConditionRepo.findByDomainId(id);
            if (medicalCondition === null) {
                return Result_1.Result.fail("Medical condition not found");
            }
            else {
                await this.medicalConditionRepo.delete(medicalCondition);
                const medicalConditionDTOResult = MedicalConditionMap_1.MedicalConditionMap.toDTO(medicalCondition);
                return Result_1.Result.ok(medicalConditionDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
};
MedicalConditionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.medicalCondition.name)),
    __metadata("design:paramtypes", [Object])
], MedicalConditionService);
exports.default = MedicalConditionService;
//# sourceMappingURL=medicalConditionService.js.map