"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allergy = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const allergyId_1 = require("./allergyId");
const Guard_1 = require("../../core/logic/Guard");
class Allergy extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get allergyId() {
        return new allergyId_1.AllergyId(this.allergyId.toValue());
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
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.name, argumentName: 'name' },
            { argument: props.code, argumentName: 'code' },
            { argument: props.description, argumentName: 'description' },
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const allergy = new Allergy(Object.assign({}, props), id);
            return Result_1.Result.ok(allergy);
        }
    }
}
exports.Allergy = Allergy;
//# sourceMappingURL=allergy.js.map