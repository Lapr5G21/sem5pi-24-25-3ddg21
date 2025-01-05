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
    get allergiesId() {
        return this.props.allergiesId;
    }
    set allergiesId(value) {
        this.props.allergiesId = value;
    }
    get medicalConditionsId() {
        return this.props.medicalConditionsId;
    }
    set medicalConditionsId(value) {
        this.props.medicalConditionsId = value;
    }
    get notations() {
        return this.props.notations;
    }
    set notations(value) {
        this.props.notations = value;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
            { argument: props.allergiesId, argumentName: 'allergiesId' },
            { argument: props.medicalConditionsId, argumentName: 'medicalConditionsId' },
            { argument: props.notations, argumentName: 'notations' }
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