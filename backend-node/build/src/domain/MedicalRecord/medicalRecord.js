"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecord = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
const medicalRecordId_1 = require("./medicalRecordId");
class MedicalRecord extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get medicalRecordId() {
        return new medicalRecordId_1.MedicalRecordId(this.medicalRecordId.toValue());
    }
    get patientMedicalRecordNumber() {
        return this.props.patientMedicalRecordNumber;
    }
    set patientMedicalRecordNumber(value) {
        this.props.patientMedicalRecordNumber = value;
    }
    get allergiesID() {
        return this.props.allergiesID;
    }
    set allergiesID(value) {
        this.props.allergiesID = value;
    }
    get medicalConditionsID() {
        return this.props.medicalConditionsID;
    }
    set medicalConditionsID(value) {
        this.props.medicalConditionsID = value;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
            { argument: props.allergiesID, argumentName: 'allergiesID' },
            { argument: props.medicalConditionsID, argumentName: 'medicalConditionsID' },
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const medicalRecord = new MedicalRecord(Object.assign({}, props), id);
            console.log("Dentro do create:", medicalRecord);
            return Result_1.Result.ok(medicalRecord);
        }
    }
}
exports.MedicalRecord = MedicalRecord;
//# sourceMappingURL=medicalRecord.js.map