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
const patientMedicalRecordNumber_1 = require("../domain/MedicalRecord/patientMedicalRecordNumber");
const MedicalRecordMap_1 = require("../mappers/MedicalRecordMap");
const medicalRecord_1 = require("../domain/MedicalRecord/medicalRecord");
const medicalRecordAllergies_1 = require("../domain/MedicalRecord/medicalRecordAllergies");
const medicalRecordMedicalConditions_1 = require("../domain/MedicalRecord/medicalRecordMedicalConditions");
const medicalRecordNotations_1 = require("../domain/MedicalRecord/medicalRecordNotations");
let MedicalRecordService = class MedicalRecordService {
    constructor(medicalRecordRepo) {
        this.medicalRecordRepo = medicalRecordRepo;
    }
    async createMedicalRecord(medicalRecordDTO) {
        try {
            const allergiesOrErrors = medicalRecordDTO.allergiesId.map((allergyId) => medicalRecordAllergies_1.MedicalRecordAllergies.create({ allergies: [allergyId] }));
            const invalidAllergies = allergiesOrErrors.find((result) => result.isFailure);
            if (invalidAllergies) {
                return Result_1.Result.fail(`Error creating allergies: ${invalidAllergies.errorValue()}`);
            }
            const allergiesID = allergiesOrErrors.map((result) => result.getValue());
            const medicalConditionsOrErrors = medicalRecordDTO.medicalConditionsId.map((conditionId) => medicalRecordMedicalConditions_1.MedicalRecordMedicalConditions.create({ medicalConditions: [conditionId] }));
            const invalidConditions = medicalConditionsOrErrors.find((result) => result.isFailure);
            if (invalidConditions) {
                return Result_1.Result.fail(`Error creating medical conditions: ${invalidConditions.errorValue()}`);
            }
            const medicalConditionsID = medicalConditionsOrErrors.map((result) => result.getValue());
            const medicalRecordProps = {
                patientMedicalRecordNumber: patientMedicalRecordNumber_1.PatientMedicalRecordNumber.create({
                    patientMedicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber,
                }).getValue(),
                allergiesId: allergiesID,
                medicalConditionsId: medicalConditionsID,
                notations: medicalRecordNotations_1.MedicalRecordNotations.create({ notations: medicalRecordDTO.notations, }).getValue(),
            };
            const medicalRecordOrError = medicalRecord_1.MedicalRecord.create(medicalRecordProps);
            if (medicalRecordOrError.isFailure) {
                return Result_1.Result.fail(medicalRecordOrError.errorValue());
            }
            const medicalRecordResult = medicalRecordOrError.getValue();
            await this.medicalRecordRepo.save(medicalRecordResult);
            const medicalRecordDTOResult = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecordResult);
            return Result_1.Result.ok(medicalRecordDTOResult);
        }
        catch (e) {
            console.error("Error creating medical record:", e);
            throw e;
        }
    }
    async getMedicalRecord(medicalRecordId) {
        try {
            const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordId);
            if (!medicalRecord) {
                return Result_1.Result.fail("Medical Record not found");
            }
            const medicalRecordDTOResult = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord);
            return Result_1.Result.ok(medicalRecordDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async getByPatientMedicalRecordNumber(patientMedicalRecordNumber) {
        try {
            const medicalRecord = await this.medicalRecordRepo.findByPatientMedicalRecordNumber(patientMedicalRecordNumber);
            if (!medicalRecord) {
                return Result_1.Result.fail('Medical record not found');
            }
            return Result_1.Result.ok(MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord));
        }
        catch (err) {
            console.error("Erro ao buscar prontuário:", err); // Log de erro no serviço
            return Result_1.Result.fail('Error retrieving medical record');
        }
    }
    async getAllMedicalRecords() {
        try {
            const medicalRecords = await this.medicalRecordRepo.getAll();
            console.log("absvdhsgdasd", medicalRecords);
            const medicalRecordsDTO = medicalRecords.map(medicalRecord => MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord));
            return Result_1.Result.ok(medicalRecordsDTO);
        }
        catch (e) {
            throw e;
        }
    }
    async updateMedicalRecord(medicalRecordDTO) {
        try {
            const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordDTO.id);
            if (medicalRecord === null) {
                return Result_1.Result.fail("Medical Rceord not found");
            }
            console.log("MedicalRecordDTO:", medicalRecordDTO);
            const medicalRecordDTOOld = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord.props);
            console.log("MedicalRecordDTOOld:", medicalRecordDTOOld);
            const patientMedicalRecordNumberOrError = medicalRecordDTOOld.patientMedicalRecordNumber !== medicalRecordDTO.patientMedicalRecordNumber
                ? patientMedicalRecordNumber_1.PatientMedicalRecordNumber.create({ patientMedicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber })
                : Result_1.Result.ok(medicalRecord.props.patientMedicalRecordNumber);
            const allergiesInstances = medicalRecordAllergies_1.MedicalRecordAllergies.createAllergies(medicalRecordDTO.allergiesId);
            const allergiesOrError = Result_1.Result.ok(allergiesInstances);
            const medicalConditionsInstances = medicalRecordMedicalConditions_1.MedicalRecordMedicalConditions.createMedicalConditions(medicalRecordDTO.medicalConditionsId);
            const medicalConditionsOrError = Result_1.Result.ok(medicalConditionsInstances);
            const notationsOrError = medicalRecordDTOOld.notations !== medicalRecordDTO.notations
                ? medicalRecordNotations_1.MedicalRecordNotations.create({ notations: medicalRecordDTO.notations })
                : Result_1.Result.ok(medicalRecord.props.notations);
            if (patientMedicalRecordNumberOrError.isFailure || allergiesOrError.isFailure || medicalConditionsOrError.isFailure || notationsOrError.isFailure) {
                return Result_1.Result.fail("Invalid data provided");
            }
            if (patientMedicalRecordNumberOrError.isSuccess)
                medicalRecord.props.patientMedicalRecordNumber = patientMedicalRecordNumberOrError.getValue();
            console.log("patientMedicalRecord", patientMedicalRecordNumberOrError.getValue());
            if (allergiesOrError.isSuccess)
                medicalRecord.props.allergiesId = allergiesOrError.getValue();
            console.log("allergies", allergiesOrError.getValue());
            if (medicalConditionsOrError.isSuccess)
                medicalRecord.props.medicalConditionsId = medicalConditionsOrError.getValue();
            console.log("medicalConditions", medicalConditionsOrError.getValue());
            if (notationsOrError.isSuccess)
                medicalRecord.props.notations = notationsOrError.getValue();
            console.log("notations", notationsOrError.getValue());
            await this.medicalRecordRepo.save(medicalRecord);
            const medicalRecordDTOResult = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord.props);
            return Result_1.Result.ok(medicalRecordDTOResult);
        }
        catch (e) {
            console.error("Error during update:", e);
            return Result_1.Result.fail(`Error updating medical record: ${e.message}`);
        }
    }
};
MedicalRecordService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.medicalRecord.name)),
    __metadata("design:paramtypes", [Object])
], MedicalRecordService);
exports.default = MedicalRecordService;
//# sourceMappingURL=medicalRecordService.js.map