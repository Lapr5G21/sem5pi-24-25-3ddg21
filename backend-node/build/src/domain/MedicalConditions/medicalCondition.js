"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCondition = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const medicalConditionId_1 = require("./medicalConditionId");
const Guard_1 = require("../../core/logic/Guard");
class MedicalCondition extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get medicalConditionId() {
        return new medicalConditionId_1.MedicalConditionId(this.medicalConditionId.toValue());
    }
    get name() {
        return this.props.name;
    }
    set name(value) {
        this.props.name = value;
    }
    get code() {
        return this.props.code;
    }
    set code(value) {
        this.props.code = value;
    }
    get description() {
        return this.props.description;
    }
    set description(value) {
        this.props.description = value;
    }
    get symptoms() {
        return this.props.symptoms;
    }
    set symptoms(value) {
        this.props.symptoms = value;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.name, argumentName: 'name' },
            { argument: props.code, argumentName: 'code' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.symptoms, argumentName: 'symptoms' },
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const medicalCondition = new MedicalCondition(Object.assign({}, props), id);
            return Result_1.Result.ok(medicalCondition);
        }
    }
}
exports.MedicalCondition = MedicalCondition;
//# sourceMappingURL=medicalCondition.js.map