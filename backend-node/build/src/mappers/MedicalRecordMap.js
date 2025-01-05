"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordMap = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const medicalRecord_1 = require("../domain/MedicalRecord/medicalRecord");
class MedicalRecordMap extends Mapper_1.Mapper {
    static toDTO(medicalRecord) {
        var _a, _b, _c;
        // Verifica se o registro médico é nulo ou indefinido
        if (!medicalRecord) {
            console.error("MedicalRecord is null or undefined.");
            return null;
        }
        // Acessa os dados do registro médico
        const rawData = medicalRecord._doc || medicalRecord;
        console.log('rawData bbbbbbbbbbbbbbbbbbbbbbbbb', rawData);
        // Verifica se rawData é válido
        if (!rawData || typeof rawData !== 'object') {
            console.error("Invalid medicalRecord object structure:", medicalRecord);
            return null;
        }
        // Verifica os dados do registro médico
        console.log("rawData:", rawData); // Verificando os dados antes de mapear
        // Retorna o DTO com os dados processados
        return {
            id: rawData.domainId || ((_a = medicalRecord._id) === null || _a === void 0 ? void 0 : _a.toString()) || null,
            patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
            allergiesId: ((_b = rawData.allergiesId) === null || _b === void 0 ? void 0 : _b.map((a) => a._id || a)) || [],
            medicalConditionsId: ((_c = rawData.medicalConditionsId) === null || _c === void 0 ? void 0 : _c.map((mc) => mc._id || mc)) || [],
            notations: rawData.notations || null, // Notações do prontuário
        };
    }
    static toDomain(medicalRecord) {
        console.log("toDomain input medicalRecord:", medicalRecord);
        const medicalRecordProps = {
            patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber,
            allergiesId: medicalRecord.allergies || [],
            medicalConditionsId: medicalRecord.medicalConditions || [],
            notations: medicalRecord.notations || null,
        };
        const medicalRecordOrError = medicalRecord_1.MedicalRecord.create(medicalRecordProps, new UniqueEntityID_1.UniqueEntityID(medicalRecord.domainId));
        if (medicalRecordOrError.isFailure) {
            console.error("Error creating MedicalRecord domain object:", medicalRecordOrError.error);
        }
        return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
    }
    static toPersistence(medicalRecord) {
        return {
            id: medicalRecord.id.toString(),
            patientMedicalRecordNumber: medicalRecord.props.patientMedicalRecordNumber.value,
            allergies: medicalRecord.props.allergiesId.map(allergy => allergy.props.allergies.toString()),
            medicalConditions: medicalRecord.props.medicalConditionsId.map(condition => condition.props.medicalConditions.toString()),
            notations: medicalRecord.props.notations.value,
        };
    }
}
exports.MedicalRecordMap = MedicalRecordMap;
//# sourceMappingURL=MedicalRecordMap.js.map