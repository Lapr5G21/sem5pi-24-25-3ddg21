import { MedicalConditionDescription } from '../../../../src/domain/MedicalConditions/medicalConditionDescription';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalConditionDescription', () => {
  it('should create a valid MedicalConditionDescription', () => {
    const description = MedicalConditionDescription.create({ description: 'A chronic condition affecting blood sugar levels' }).getValue();
    expect(description.value).toBe('A chronic condition affecting blood sugar levels');
  });

  it('should fail when creating a MedicalConditionDescription with too long description', () => {
    const description = MedicalConditionDescription.create({ description: 'A'.repeat(2049) }); // 2049 characters
    expect(description.isFailure).toBeTruthy();
    expect(description.error).toBe('Medical condition description its too long');
  });
});
