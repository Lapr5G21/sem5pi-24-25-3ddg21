import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalRecordAllergiesProps{
    allergies: string[];
}

export class MedicalRecordAllergies extends ValueObject<MedicalRecordAllergiesProps> {

    get value (): string[] {
        return this.props.allergies;
    }   

    public constructor (props: MedicalRecordAllergiesProps) {
        super(props);
    }

    public static create (props: MedicalRecordAllergiesProps): Result<MedicalRecordAllergies> {
        const propsResult = Guard.againstNullOrUndefined(props.allergies, 'allergies');
    
        if (!propsResult.succeeded) {
          return Result.fail<MedicalRecordAllergies>(propsResult.message);
        } else {
    
          return Result.ok<MedicalRecordAllergies>(new MedicalRecordAllergies({
            allergies: props.allergies,
            
          }));
        }
      }

}