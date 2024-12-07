import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface PatientNameProps{
    name: string;
}

export class PatientName extends ValueObject<PatientNameProps> {

    get value (): string {
        return this.props.name;
    }   

    public constructor (props: PatientNameProps) {
        super(props);
    }

    public static create (props: PatientNameProps): Result<PatientName> {
        const propsResult = Guard.againstNullOrUndefined(props.name, 'name');
    
        if (!propsResult.succeeded) {
          return Result.fail<PatientName>(propsResult.message);
        } else {
    
          return Result.ok<PatientName>(new PatientName({
            name: props.name,
            
          }));
        }
      }

}