import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { AllergyId } from "./allergyId";
import { AllergyCode } from "./allergyCode";
import { AllergyDescription } from "./allergyDescription";
import { Guard } from "../../core/logic/Guard";
import { AllergyName } from "./allergyName";
import IAllergyDTO from "../../dto/IAllergyDTO";


interface AllergyProps {
  name: AllergyName;
  code: AllergyCode;
  description: AllergyDescription;
}

export class Allergy extends AggregateRoot<AllergyProps> {

    get id (): UniqueEntityID {
        return this._id;
      }
    
      get allergyId (): AllergyId {
        return new AllergyId(this.allergyId.toValue());
      }
    
      get name (): AllergyName {
        return this.props.name;
      }
    
      set name ( value: AllergyName) {
        this.props.name = value;
      }

      get code (): AllergyCode {
        return this.props.code;
      }

      set code ( value: AllergyCode) {
        this.props.code = value;
      }

      get description (): AllergyDescription {
        return this.props.description;
      }

      set description ( value: AllergyDescription) {
        this.props.description = value;
      }

      public constructor (props: AllergyProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (props: AllergyProps, id?: UniqueEntityID): Result<Allergy> {

        const guardedProps = [
          { argument: props.name, argumentName: 'name' },
          { argument: props.code, argumentName: 'code' },
          { argument: props.description, argumentName: 'description' },
        ];
    
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<Allergy>(guardResult.message)
        }     
        else {
          const allergy = new Allergy({
            ...props
          }, id);
    
          return Result.ok<Allergy>(allergy);
        }
      }
}