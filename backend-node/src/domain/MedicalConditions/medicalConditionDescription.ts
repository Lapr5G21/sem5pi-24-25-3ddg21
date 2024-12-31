import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalConditionDescriptionProps{
    description: string;
}

export class MedicalConditionDescription extends ValueObject<MedicalConditionDescriptionProps> {

    get value (): string {
        return this.props.description;
    }   

    public constructor (props: MedicalConditionDescriptionProps) {
        super(props);
    }

    public static create (props: MedicalConditionDescriptionProps): Result<MedicalConditionDescription> {
        const propsResult = Guard.againstNullOrUndefined(props.description, 'description');
    
        if ( props.description.length > 2048) {
          return Result.fail<MedicalConditionDescription>("Medical condition description its too long");
        }

        if (!propsResult.succeeded) {
          return Result.fail<MedicalConditionDescription>(propsResult.message);
        } else {
    
          return Result.ok<MedicalConditionDescription>(new MedicalConditionDescription({
            description: props.description,
            
          }));
        }
      }

}