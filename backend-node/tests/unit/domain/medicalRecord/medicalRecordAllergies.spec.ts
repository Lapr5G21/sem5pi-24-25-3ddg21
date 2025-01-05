import { MedicalRecordAllergies } from '../../../../src/domain/MedicalRecord/medicalRecordAllergies';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalRecordAllergies', () => {
  it('should create a valid medical record allergies object', () => {
    const allergies = ['Peanuts', 'Shellfish'];
    const allergiesResult = MedicalRecordAllergies.create({ allergies });

    expect(allergiesResult.isSuccess).toBe(true);
    expect(allergiesResult.getValue().value).toEqual(allergies);
  });


  it('should create a list of MedicalRecordAllergies', () => {
    const allergies = ['Peanuts', 'Shellfish'];
    const allergiesList = MedicalRecordAllergies.createAllergies(allergies);

    expect(allergiesList.length).toBe(2);
    expect(allergiesList[0].value).toEqual(['Peanuts']);
  });
});