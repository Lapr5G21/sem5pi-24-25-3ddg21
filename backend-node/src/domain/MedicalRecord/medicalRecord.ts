import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Allergy } from "../Allergies/allergy";
import { MedicalCondition } from "../MedicalConditions/medicalCondition";
import { MedicalRecordId } from "./medicalRecordId";
import { PatientMedicalRecordNumber } from "./patientMedicalRecordNumber";

interface MedicalRecordProps {
  patientMedicalRecordNumber: PatientMedicalRecordNumber;
  allergies: Allergy[];
  medicalConditions: MedicalCondition[];
  medicalHistory: string;
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {

    get id (): UniqueEntityID {
        return this._id;
      }
    

      get medicalRecordId (): MedicalRecordId {
        return new MedicalRecordId(this.medicalRecordId.toValue());
      }

        get patientMedicalRecordNumber (): PatientMedicalRecordNumber {
            return this.props.patientMedicalRecordNumber;
        }

        set patientMedicalRecordNumber (value: PatientMedicalRecordNumber) {
            this.props.patientMedicalRecordNumber = value;
        }

        get allergies (): Allergy[] {
            return this.props.allergies;
        }

        set allergies (value: Allergy[]) {
            this.props.allergies = value;
        }

        get medicalConditions (): MedicalCondition[] {
            return this.props.medicalConditions;
        }

        set medicalConditions (value: MedicalCondition[]) {
            this.props.medicalConditions = value;
        }

        get medicalHistory (): string {
            return this.props.medicalHistory;
        }

        set medicalHistory (value: string) {
            this.props.medicalHistory = value;
        }

      private constructor (props: MedicalRecordProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (props: MedicalRecordProps, id?: UniqueEntityID): Result<MedicalRecord> {

        const guardedProps = [
          { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
          { argument: props.allergies, argumentName: 'allergies' },
          { argument: props.medicalConditions, argumentName: 'medicalConditions' },
          { argument: props.medicalHistory, argumentName: 'medicalHistory' }
        ];
    
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<MedicalRecord>(guardResult.message)
        }     
        else {
          const medicalRecord = new MedicalRecord({
            ...props
          }, id);
    
          return Result.ok<MedicalRecord>(medicalRecord);
        }
      }
}