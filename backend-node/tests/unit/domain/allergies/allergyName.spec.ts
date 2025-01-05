import { AllergyName } from '../../../../src/domain/Allergies/allergyName';

describe('AllergyName Value Object', () => {
  it('should create an AllergyName successfully when a valid name is provided', () => {
    const validName = 'Peanut Allergy';
    const result = AllergyName.create({ name: validName });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(AllergyName);
    expect(result.getValue().value).toBe(validName);
  });

  it('should allow retrieving the value of the AllergyName', () => {
    const validName = 'Dust Allergy';
    const result = AllergyName.create({ name: validName });

    const allergyName = result.getValue();
    expect(allergyName.value).toBe(validName);
  });
});