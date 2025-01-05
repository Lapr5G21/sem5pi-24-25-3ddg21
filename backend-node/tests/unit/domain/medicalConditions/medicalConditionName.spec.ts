import { MedicalConditionName } from '../../../../src/domain/MedicalConditions/medicalConditionName';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalConditionName', () => {
    it('should create a valid MedicalConditionName', () => {
      const name = MedicalConditionName.create({ name: 'Hypertension' }).getValue();
      expect(name.value).toBe('Hypertension');
    });
  
    it('should fail when creating a MedicalConditionName with an empty name', () => {
      const name = MedicalConditionName.create({ name: '' });
      expect(name.isFailure).toBeFalsy();
      
      expect(name.error).toBeFalsy();
    });
  });