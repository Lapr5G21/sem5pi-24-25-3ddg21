import { PatientMedicalRecordNumber } from '../../../../src/domain/MedicalRecord/patientMedicalRecordNumber';
import { Result } from '../../../../src/core/logic/Result';

describe('PatientMedicalRecordNumber', () => {
  it('should create a valid patient medical record number', () => {
    const recordNumber = '12345';
    const recordNumberResult = PatientMedicalRecordNumber.create({ patientMedicalRecordNumber: recordNumber });

    expect(recordNumberResult.isSuccess).toBe(true);
    expect(recordNumberResult.getValue().value).toBe(recordNumber);
  });

  
});