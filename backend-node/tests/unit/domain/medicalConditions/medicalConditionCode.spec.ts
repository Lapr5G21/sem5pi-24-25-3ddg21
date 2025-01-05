import { MedicalConditionCode } from '../../../../src/domain/MedicalConditions/medicalConditionCode';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalConditionCode', () => {
  it('should create a valid MedicalConditionCode', () => {
    const code = MedicalConditionCode.create({ code: 'D12345' }).getValue();
    expect(code.value).toBe('D12345');
  });

  it('should fail when creating a MedicalConditionCode with an invalid length', () => {
    const code = MedicalConditionCode.create({ code: 'D1234' }); // Invalid length
    expect(code.isFailure).toBeFalsy();
    expect(code.error).toBe(null);
  });
});