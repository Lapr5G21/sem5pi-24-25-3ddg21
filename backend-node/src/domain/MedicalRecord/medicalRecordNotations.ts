import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalRecordNotationsProps{
    notations: string;
}

export class MedicalRecordNotations extends ValueObject<MedicalRecordNotationsProps> {

    get value (): string {
        return this.props.notations;
    }   

    public constructor (props: MedicalRecordNotationsProps) {
        super(props);
    }

    public static create (props: MedicalRecordNotationsProps): Result<MedicalRecordNotations> {
        const propsResult = Guard.againstNullOrUndefined(props.notations, 'notations');
    
        if (!propsResult.succeeded) {
          return Result.fail<MedicalRecordNotations>(propsResult.message);
        } else {
    
          return Result.ok<MedicalRecordNotations>(new MedicalRecordNotations({
            notations: props.notations,    
          }));
        }
      }
}