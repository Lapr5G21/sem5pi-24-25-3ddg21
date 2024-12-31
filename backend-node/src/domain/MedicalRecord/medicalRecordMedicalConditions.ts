import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalRecordMedicalConditionsProps{
    medicalConditions: string[];
}

export class MedicalRecordMedicalConditions extends ValueObject<MedicalRecordMedicalConditionsProps> {

    get value (): string[] {
        return this.props.medicalConditions;
    }   

    public constructor (props: MedicalRecordMedicalConditionsProps) {
        super(props);
    }

    public static create (props: MedicalRecordMedicalConditionsProps): Result<MedicalRecordMedicalConditions> {
        const propsResult = Guard.againstNullOrUndefined(props.medicalConditions, 'medicalConditions');
    
        if (!propsResult.succeeded) {
          return Result.fail<MedicalRecordMedicalConditions>(propsResult.message);
        } else {
    
          return Result.ok<MedicalRecordMedicalConditions>(new MedicalRecordMedicalConditions({
            medicalConditions: props.medicalConditions,
            
          }));
        }
      }

}