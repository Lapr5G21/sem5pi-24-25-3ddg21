"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionCode = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class MedicalConditionCode extends ValueObject_1.ValueObject {
    get value() {
        return this.props.code;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const propsResult = Guard_1.Guard.againstNullOrUndefined(props.code, 'code');
        if (props.code.length > 7 && props.code.length < 6) {
            return Result_1.Result.fail("Medical condition code must be 6 or 7 characters long");
        }
        if (!propsResult.succeeded) {
            return Result_1.Result.fail(propsResult.message);
        }
        else {
            return Result_1.Result.ok(new MedicalConditionCode({
                code: props.code,
            }));
        }
    }
}
exports.MedicalConditionCode = MedicalConditionCode;
//# sourceMappingURL=medicalConditionCode.js.map