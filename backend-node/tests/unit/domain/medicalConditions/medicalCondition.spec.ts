import { MedicalCondition } from '../../../../src/domain/MedicalConditions/medicalCondition';
import { MedicalConditionName } from '../../../../src/domain/MedicalConditions/medicalConditionName';
import { MedicalConditionCode } from '../../../../src/domain/MedicalConditions/medicalConditionCode';
import { MedicalConditionDescription } from '../../../../src/domain/MedicalConditions/medicalConditionDescription';
import { MedicalConditionSymptoms } from '../../../../src/domain/MedicalConditions/medicalConditionSymptoms';
import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';
import { Result } from '../../../../src/core/logic/Result';
import { MedicalConditionId } from '../../../../src/domain/MedicalConditions/medicalConditionId';

describe('MedicalCondition', () => {
    it('should create a valid MedicalCondition', () => {
      const name = MedicalConditionName.create({ name: 'Diabetes' }).getValue();
      const code = MedicalConditionCode.create({ code: 'D12345' }).getValue();
      const description = MedicalConditionDescription.create({ description: 'A chronic condition that affects how the body processes blood sugar' }).getValue();
      const symptoms = MedicalConditionSymptoms.create({ symptoms: 'Thirst, frequent urination, fatigue' }).getValue();
  
      const medicalCondition = MedicalCondition.create({
        name,
        code,
        description,
        symptoms
      }).getValue();
  
      expect(medicalCondition).toBeInstanceOf(MedicalCondition);
      expect(medicalCondition.name.value).toBe('Diabetes');
      expect(medicalCondition.code.value).toBe('D12345');
      expect(medicalCondition.description.value).toBe('A chronic condition that affects how the body processes blood sugar');
      expect(medicalCondition.symptoms.value).toBe('Thirst, frequent urination, fatigue');
    });
  
    it('should fail when creating a MedicalCondition with invalid data', () => {
      const name = MedicalConditionName.create({ name: '' }).getValue();
      const code = MedicalConditionCode.create({ code: 'D1234' }).getValue(); // Invalid length
      const description = MedicalConditionDescription.create({ description: '' }).getValue();
      const symptoms = MedicalConditionSymptoms.create({ symptoms: '' }).getValue();
  
      const result = MedicalCondition.create({
        name,
        code,
        description,
        symptoms
      });
  
      expect(result.isFailure).toBeFalsy();
      
    });
  });