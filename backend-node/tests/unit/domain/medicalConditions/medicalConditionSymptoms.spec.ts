import { MedicalConditionSymptoms } from '../../../../src/domain/MedicalConditions/medicalConditionSymptoms';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalConditionSymptoms', () => {
  it('should create a valid MedicalConditionSymptoms', () => {
    const symptoms = MedicalConditionSymptoms.create({ symptoms: 'Fatigue, dizziness' }).getValue();
    expect(symptoms.value).toBe('Fatigue, dizziness');
  });

  it('should fail when creating MedicalConditionSymptoms with too long symptoms', () => {
    const symptoms = MedicalConditionSymptoms.create({ symptoms: 'A'.repeat(2049) }); // 2049 characters
    expect(symptoms.isFailure).toBeTruthy();
    expect(symptoms.error).toBe('Medical condition symptoms its too long');
  });
});