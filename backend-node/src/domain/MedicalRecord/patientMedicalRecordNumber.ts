import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface PatientMedicalRecordNumberProps{
  patientMedicalRecordNumber: string;
}

export class PatientMedicalRecordNumber extends ValueObject<PatientMedicalRecordNumberProps> {

    get value (): string {
        return this.props.patientMedicalRecordNumber;
    }   

    public constructor (props: PatientMedicalRecordNumberProps) {
        super(props);
    }

    public static create (props: PatientMedicalRecordNumberProps): Result<PatientMedicalRecordNumber> {
        const propsResult = Guard.againstNullOrUndefined(props.patientMedicalRecordNumber, 'medicalRecordNumber');
    
        if (!propsResult.succeeded) {
          return Result.fail<PatientMedicalRecordNumber>(propsResult.message);
        } else {
    
          return Result.ok<PatientMedicalRecordNumber>(new PatientMedicalRecordNumber({
            patientMedicalRecordNumber: props.patientMedicalRecordNumber,
            
          }));
        }
      }

}