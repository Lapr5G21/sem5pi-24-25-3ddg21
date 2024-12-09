import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import IMedicalConditionDTO from "../../dto/IMedicalConditionDTO";
import { MedicalConditionId } from "./medicalConditionId";
import { MedicalConditionCode } from "./medicalConditionCode";
import { MedicalConditionDescription } from "./medicalConditionDescription";
import { MedicalConditionSymptoms } from "./medicalConditionSymptoms";
import { Guard } from "../../core/logic/Guard";
import { MedicalConditionName } from "./medicalConditionName";


interface MedicalConditionProps {
  name: MedicalConditionName;
  code: MedicalConditionCode;
  description: MedicalConditionDescription;
  symptoms: MedicalConditionSymptoms;
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {

    get id (): UniqueEntityID {
        return this._id;
      }
    
      get medicalConditionId (): MedicalConditionId {
        return new MedicalConditionId(this.medicalConditionId.toValue());
      }
    
      get name (): MedicalConditionName {
        return this.props.name;
      }
    
      set name ( value: MedicalConditionName) {
        this.props.name = value;
      }

      get code (): MedicalConditionCode {
        return this.props.code;
      }

      set code ( value: MedicalConditionCode) {
        this.props.code = value;
      }

      get description (): MedicalConditionDescription {
        return this.props.description;
      }

      set description ( value: MedicalConditionDescription) {
        this.props.description = value;
      }

      get symptoms (): MedicalConditionSymptoms {
        return this.props.symptoms;
      }

      set symptoms ( value: MedicalConditionSymptoms) {
        this.props.symptoms = value;
      }

      public constructor (props: MedicalConditionProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (props: MedicalConditionProps, id?: UniqueEntityID): Result<MedicalCondition> {

        const guardedProps = [
          { argument: props.name, argumentName: 'name' },
          { argument: props.code, argumentName: 'code' },
          { argument: props.description, argumentName: 'description' },
          { argument: props.symptoms, argumentName: 'symptoms' },
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<MedicalCondition>(guardResult.message)
        }   else {
          const medicalCondition = new MedicalCondition({
            ...props
          }, id);
    
          return Result.ok<MedicalCondition>(medicalCondition);
        }
      }
    }