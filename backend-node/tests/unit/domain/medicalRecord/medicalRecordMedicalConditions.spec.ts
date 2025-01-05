import { MedicalRecordMedicalConditions } from '../../../../src/domain/MedicalRecord/medicalRecordMedicalConditions';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalRecordMedicalConditions', () => {
  it('should create a valid medical record medical conditions object', () => {
    const medicalConditions = ['Asthma', 'Diabetes'];
    const medicalConditionsResult = MedicalRecordMedicalConditions.create({ medicalConditions });

    expect(medicalConditionsResult.isSuccess).toBe(true);
    expect(medicalConditionsResult.getValue().value).toEqual(medicalConditions);
  });


  it('should create a list of MedicalRecordMedicalConditions', () => {
    const medicalConditions = ['Asthma', 'Diabetes'];
    const conditionsList = MedicalRecordMedicalConditions.createMedicalConditions(medicalConditions);

    expect(conditionsList.length).toBe(2);
    expect(conditionsList[0].value).toEqual(['Asthma']);
  });
});