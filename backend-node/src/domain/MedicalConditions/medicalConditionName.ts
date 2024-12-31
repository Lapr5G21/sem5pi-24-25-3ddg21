import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalConditionNameProps{
    name: string;
}

export class MedicalConditionName extends ValueObject<MedicalConditionNameProps> {

    get value (): string {
        return this.props.name;
    }   

    public constructor (props: MedicalConditionNameProps) {
        super(props);
    }

    public static create (props: MedicalConditionNameProps): Result<MedicalConditionName> {
        const propsResult = Guard.againstNullOrUndefined(props.name, 'name');
    
        if ( props.name.length > 100){
          return Result.fail<MedicalConditionName>("Medical condition name its too long");
        }

        if (!propsResult.succeeded) {
          return Result.fail<MedicalConditionName>(propsResult.message);
        } else {
    
          return Result.ok<MedicalConditionName>(new MedicalConditionName({
            name: props.name,
            
          }));
        }
      }

}