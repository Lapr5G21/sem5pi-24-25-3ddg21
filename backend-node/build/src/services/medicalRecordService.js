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
const mongoose_1 = __importDefault(require("mongoose"));
const patientMedicalRecordNumber_1 = require("../domain/MedicalRecord/patientMedicalRecordNumber");
const MedicalRecordMap_1 = require("../mappers/MedicalRecordMap");
const medicalRecord_1 = require("../domain/MedicalRecord/medicalRecord");
const MedicalConditionMap_1 = require("../mappers/MedicalConditionMap");
let MedicalRecordService = class MedicalRecordService {
    constructor(medicalRecordRepo) {
        this.medicalRecordRepo = medicalRecordRepo;
    }
    async createMedicalRecord(medicalRecordDTO) {
        try {
            const medicalRecordProps = {
                patientMedicalRecordNumber: patientMedicalRecordNumber_1.PatientMedicalRecordNumber.create({ medicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber }).getValue(),
                allergies: medicalRecordDTO.allergiesID.map(a => AllergyMap_1.AllergyMap.toDomain(a)),
                medicalConditions: medicalRecordDTO.medicalConditionsID.map(mc => MedicalConditionMap_1.MedicalConditionMap.toDomain(mc)),
                domainId: new mongoose_1.default.Types.ObjectId().toString(),
            };
            const medicalRecordOrError = await medicalRecord_1.MedicalRecord.create(medicalRecordProps);
            if (medicalRecordOrError.isFailure) {
                return Result_1.Result.fail(medicalRecordOrError.errorValue());
            }
            const medicalRecordResult = medicalRecordOrError.getValue();
            await this.medicalRecordRepo.save(medicalRecordResult);
            const medicalRecordDTOResult = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecordResult);
            return Result_1.Result.ok(medicalRecordDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async getMedicalRecord(medicalRecordId) {
        try {
            const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordId);
            if (medicalRecord === null) {
                return Result_1.Result.fail("Medical Record not found");
            }
            else {
                const medicalRecordDTOResult = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord);
                return Result_1.Result.ok(medicalRecordDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async getAllMedicalRecords() {
        try {
            const medicalRecords = await this.medicalRecordRepo.getAll();
            const medicalRecordsDTO = medicalRecords.map(medicalRecords => MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecords));
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
                return Result_1.Result.fail("Medical Record not found");
            }
            else {
                await this.medicalRecordRepo.save(medicalRecord);
                const medicalRecordDTOResult = MedicalRecordMap_1.MedicalRecordMap.toDTO(medicalRecord);
                return Result_1.Result.ok(medicalRecordDTOResult);
            }
        }
        catch (e) {
            throw e;
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