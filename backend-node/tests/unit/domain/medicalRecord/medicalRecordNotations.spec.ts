import { MedicalRecordNotations } from '../../../../src/domain/MedicalRecord/medicalRecordNotations';
import { Result } from '../../../../src/core/logic/Result';

describe('MedicalRecordNotations', () => {
  it('should create a valid medical record notations object', () => {
    const notations = 'Regular checkup';
    const notationsResult = MedicalRecordNotations.create({ notations });

    expect(notationsResult.isSuccess).toBe(true);
    expect(notationsResult.getValue().value).toBe(notations);
  });

});