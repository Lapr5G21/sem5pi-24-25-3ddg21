import { AllergyDescription } from '../../../../src/domain/Allergies/allergyDescription';

describe('AllergyDescription Value Object', () => {
  it('should create an AllergyDescription successfully when a valid description is provided', () => {
    const validDescription = 'This is a valid description of an allergy.';
    const result = AllergyDescription.create({ description: validDescription });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(AllergyDescription);
    expect(result.getValue().value).toBe(validDescription);
  });

  it('should fail to create an AllergyDescription if the description is too long', () => {
    const longDescription = 'A'.repeat(2049); // 2049 characters
    const result = AllergyDescription.create({ description: longDescription });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Allergy description its too long');
  });

  it('should allow retrieving the value of the AllergyDescription', () => {
    const validDescription = 'Mild allergy to pollen.';
    const result = AllergyDescription.create({ description: validDescription });

    const allergyDescription = result.getValue();
    expect(allergyDescription.value).toBe(validDescription);
  });
});
