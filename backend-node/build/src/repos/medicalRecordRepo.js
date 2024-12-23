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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const mongoose_1 = require("mongoose");
const medicalRecordId_1 = require("../domain/MedicalRecord/medicalRecordId");
const MedicalRecordMap_1 = require("../mappers/MedicalRecordMap");
let MedicalRecordRepo = class MedicalRecordRepo {
    constructor(medicalRecordSchema) {
        this.medicalRecordSchema = medicalRecordSchema;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    async exists(medicalRecord) {
        const idX = medicalRecord.id instanceof medicalRecordId_1.MedicalRecordId ? medicalRecord.id.toValue() : medicalRecord.id;
        const query = { domainId: idX };
        const medicalRecordDocument = await this.medicalRecordSchema.findOne(query);
        return !!medicalRecordDocument === true;
    }
    async save(medicalRecord) {
        const query = { domainId: medicalRecord.id.toString() };
        try {
            let medicalRecordDocument = await this.medicalRecordSchema.findOne(query);
            if (medicalRecordDocument === null) {
                const rawMedicalRecord = MedicalRecordMap_1.MedicalRecordMap.toPersistence(medicalRecord);
                const medicalRecordCreated = await this.medicalRecordSchema.create(rawMedicalRecord);
                return MedicalRecordMap_1.MedicalRecordMap.toDomain(medicalRecordCreated);
            }
            else {
                medicalRecordDocument.patientMedicalRecordNumber = medicalRecord.props.patientMedicalRecordNumber.value;
                medicalRecordDocument.allergiesID = medicalRecord.props.allergiesID.map(a => a.toString());
                medicalRecordDocument.medicalConditionsID = medicalRecord.medicalConditionsID.map(a => a.toString());
                await medicalRecordDocument.save();
                return MedicalRecordMap_1.MedicalRecordMap.toDomain(medicalRecordDocument);
            }
        }
        catch (err) {
            throw new Error(`Could not save medical record: ${err.message}`);
        }
    }
    async getAll() {
        try {
            const medicalRecordDocuments = await this.medicalRecordSchema.find({}).exec();
            console.log("repo:", medicalRecordDocuments);
            return medicalRecordDocuments.map(doc => MedicalRecordMap_1.MedicalRecordMap.toDomain(doc));
        }
        catch (err) {
            throw new Error(`Error fetching medical records: ${err.message}`);
        }
    }
    async findByDomainId(medicalRecordId) {
        const query = { domainId: medicalRecordId.toString() };
        const medicalRecordRecord = await this.medicalRecordSchema.findOne(query);
        if (medicalRecordRecord != null) {
            return MedicalRecordMap_1.MedicalRecordMap.toDomain(medicalRecordRecord);
        }
        else
            return null;
    }
    catch(error) {
        console.error('Error finding medical record:', error);
        return null;
    }
    async delete(medicalRecord) {
        const query = { domainId: medicalRecord.id.toString() };
        await this.medicalRecordSchema.deleteOne(query);
    }
};
MedicalRecordRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('medicalRecordSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MedicalRecordRepo);
exports.default = MedicalRecordRepo;
//# sourceMappingURL=medicalRecordRepo.js.map