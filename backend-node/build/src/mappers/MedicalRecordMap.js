"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordMap = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const medicalRecord_1 = require("../domain/MedicalRecord/medicalRecord");
class MedicalRecordMap extends Mapper_1.Mapper {
    static toDTO(medicalRecord) {
        var _a;
        if (!medicalRecord) {
            console.error("MedicalRecord is null or undefined aqui.");
            return null;
        }
        const rawData = medicalRecord._doc || medicalRecord;
        if (!rawData) {
            console.error("Invalid medicalCondition object structure:", medicalRecord);
            return null;
        }
        return {
            id: rawData.domainId || ((_a = medicalRecord._id) === null || _a === void 0 ? void 0 : _a.toString()) || null,
            patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
            allergiesID: rawData.allergiesID || [],
            medicalConditionsID: rawData.medicalConditionsID || [],
        };
    }
    static toDomain(medicalRecord) {
        console.log("todomain", medicalRecord);
        const medicalRecordOrError = medicalRecord_1.MedicalRecord.create(medicalRecord, new UniqueEntityID_1.UniqueEntityID(medicalRecord.domainId));
        medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';
        console.log(" toDomain : ", medicalRecordOrError);
        return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
    }
    static toPersistence(medicalRecord) {
        return {
            id: medicalRecord.id.toString(),
            patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber.value,
            allergies: medicalRecord.allergiesID,
            medicalConditions: medicalRecord.medicalConditionsID,
        };
    }
}
exports.MedicalRecordMap = MedicalRecordMap;
//# sourceMappingURL=MedicalRecordMap.js.map