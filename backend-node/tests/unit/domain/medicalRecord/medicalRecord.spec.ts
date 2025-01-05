
import { MedicalRecord } from '../../../../src/domain/MedicalRecord/medicalRecord';
import { MedicalRecordAllergies } from '../../../../src/domain/MedicalRecord/medicalRecordAllergies';
import { MedicalRecordMedicalConditions } from '../../../../src/domain/MedicalRecord/medicalRecordMedicalConditions';
import { MedicalRecordNotations } from '../../../../src/domain/MedicalRecord/medicalRecordNotations';
import { PatientMedicalRecordNumber } from '../../../../src/domain/MedicalRecord/patientMedicalRecordNumber';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalRecord', () => {
  it('should create a valid medical record', () => {
    const patientMedicalRecordNumber = PatientMedicalRecordNumber.create({ patientMedicalRecordNumber: '12345' }).getValue();
    const allergies = MedicalRecordAllergies.createAllergies(['Peanuts', 'Shellfish']);
    const medicalConditions = MedicalRecordMedicalConditions.createMedicalConditions(['Asthma', 'Diabetes']);
    const notations = MedicalRecordNotations.create({ notations: 'Regular checkup' }).getValue();

    const medicalRecordProps = {
      patientMedicalRecordNumber,
      allergiesId: allergies,
      medicalConditionsId: medicalConditions,
      notations,
    };

    const medicalRecordResult = MedicalRecord.create(medicalRecordProps);

    expect(medicalRecordResult.isSuccess).toBe(true);
    expect(medicalRecordResult.getValue().patientMedicalRecordNumber.value).toBe('12345');
  });

  it('should fail when any required property is missing', () => {
    const medicalRecordProps = {
      patientMedicalRecordNumber: null,
      allergiesId: [],
      medicalConditionsId: [],
      notations: null,
    };
  });
});
