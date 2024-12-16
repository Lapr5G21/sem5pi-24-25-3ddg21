"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordMap = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const medicalRecord_1 = require("../domain/MedicalRecord/medicalRecord");
class MedicalRecordMap extends Mapper_1.Mapper {
    static toDTO(medicalRecord) {
        var _a, _b;
        const rawData = ((_a = medicalRecord.props) === null || _a === void 0 ? void 0 : _a._doc) || medicalRecord.props || medicalRecord;
        if (!rawData) {
            console.error("Invalid medicalCondition object structure:", medicalRecord);
            return null;
        }
        return {
            id: rawData.domainId || ((_b = medicalRecord._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
            patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
            allergiesID: rawData.allergiesID || null,
            medicalConditionsID: rawData.medicalConditionsID || null,
        };
    }
    static toDomain(medicalRecord) {
        const medicalRecordOrError = medicalRecord_1.MedicalRecord.create(medicalRecord, new UniqueEntityID_1.UniqueEntityID(medicalRecord.domainId));
        medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';
        return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
    }
    static toPersistence(medicalRecord) {
        return {
            id: medicalRecord.id.toString(),
            patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber.value,
            allergies: medicalRecord.allergies,
            medicalConditions: medicalRecord.medicalConditions,
        };
    }
}
exports.MedicalRecordMap = MedicalRecordMap;
//# sourceMappingURL=MedicalRecordMap.js.map