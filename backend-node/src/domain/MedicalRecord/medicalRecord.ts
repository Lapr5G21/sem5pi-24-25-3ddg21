import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { AllergyId } from "../Allergies/allergyId";
import { MedicalConditionId } from "../MedicalConditions/medicalConditionId";
import { MedicalRecordId } from "./medicalRecordId";
import { PatientMedicalRecordNumber } from "./patientMedicalRecordNumber";

interface MedicalRecordProps {
  patientMedicalRecordNumber: PatientMedicalRecordNumber;
  allergies: AllergyId[];
  medicalConditions: MedicalConditionId[];
  medicalHistory: string[];
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

        get allergies (): AllergyId[] {
            return this.props.allergies;
        }

        set allergies (value: AllergyId[]) {
            this.props.allergies = value;
        }

        get medicalConditions (): MedicalConditionId[] {
            return this.props.medicalConditions;
        }

        set medicalConditions (value: MedicalConditionId[]) {
            this.props.medicalConditions = value;
        }

        get medicalHistory (): string[] {
            return this.props.medicalHistory;
        }

        set medicalHistory (value: string[]) {
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