import { Allergy } from '../../../../src/domain/Allergies/allergy';
import { AllergyName } from '../../../../src/domain/Allergies/allergyName';
import { AllergyCode } from '../../../../src/domain/Allergies/allergyCode';
import { AllergyDescription } from '../../../../src/domain/Allergies/allergyDescription';
import { Result } from '../../../../src/core/logic/Result';
import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';

describe('Allergy Aggregate Root', () => {
  it('should successfully create an Allergy when valid props are provided', () => {
    const validName = AllergyName.create({ name: 'Peanuts' }).getValue();
    const validCode = AllergyCode.create({ code: 'A12345' }).getValue();
    const validDescription = AllergyDescription.create({ description: 'Severe reaction to peanuts' }).getValue();

    const allergyOrError = Allergy.create(
      {
        name: validName,
        code: validCode,
        description: validDescription,
      },
      new UniqueEntityID('12345')
    );

    expect(allergyOrError.isSuccess).toBe(true);
    const allergy = allergyOrError.getValue();

    expect(allergy).toBeInstanceOf(Allergy);
    expect(allergy.name).toBe(validName);
    expect(allergy.code).toBe(validCode);
    expect(allergy.description).toBe(validDescription);
  });

  it('should fail to create an Allergy if the name is null or undefined', () => {
    const validCode = AllergyCode.create({ code: 'A12345' }).getValue();
    const validDescription = AllergyDescription.create({ description: 'Severe reaction to peanuts' }).getValue();

    const allergyOrError = Allergy.create(
      {
        name: null as any, // Invalid name
        code: validCode,
        description: validDescription,
      }
    );

    expect(allergyOrError.isFailure).toBe(true);
    expect(allergyOrError.error).toBe("name is null or undefined");
  });

  it('should fail to create an Allergy if the code is null or undefined', () => {
    const validName = AllergyName.create({ name: 'Peanuts' }).getValue();
    const validDescription = AllergyDescription.create({ description: 'Severe reaction to peanuts' }).getValue();

    const allergyOrError = Allergy.create(
      {
        name: validName,
        code: null as any, // Invalid code
        description: validDescription,
      }
    );

    expect(allergyOrError.isFailure).toBe(true);
    expect(allergyOrError.error).toBe("code is null or undefined");
  });

  it('should fail to create an Allergy if the description is null or undefined', () => {
    const validName = AllergyName.create({ name: 'Peanuts' }).getValue();
    const validCode = AllergyCode.create({ code: 'A12345' }).getValue();

    const allergyOrError = Allergy.create(
      {
        name: validName,
        code: validCode,
        description: null as any, // Invalid description
      }
    );

    expect(allergyOrError.isFailure).toBe(true);
    expect(allergyOrError.error).toBe("description is null or undefined");
  });

  it('should allow updating the name of an Allergy', () => {
    const validName = AllergyName.create({ name: 'Peanuts' }).getValue();
    const validCode = AllergyCode.create({ code: 'A12345' }).getValue();
    const validDescription = AllergyDescription.create({ description: 'Severe reaction to peanuts' }).getValue();

    const allergy = Allergy.create(
      {
        name: validName,
        code: validCode,
        description: validDescription,
      }
    ).getValue();

    const newName = AllergyName.create({ name: 'Dust' }).getValue();
    allergy.name = newName;

    expect(allergy.name).toBe(newName);
  });

  it('should allow updating the code of an Allergy', () => {
    const validName = AllergyName.create({ name: 'Peanuts' }).getValue();
    const validCode = AllergyCode.create({ code: 'A12345' }).getValue();
    const validDescription = AllergyDescription.create({ description: 'Severe reaction to peanuts' }).getValue();

    const allergy = Allergy.create(
      {
        name: validName,
        code: validCode,
        description: validDescription,
      }
    ).getValue();

    const newCode = AllergyCode.create({ code: 'B67890' }).getValue();
    allergy.code = newCode;

    expect(allergy.code).toBe(newCode);
  });

  it('should allow updating the description of an Allergy', () => {
    const validName = AllergyName.create({ name: 'Peanuts' }).getValue();
    const validCode = AllergyCode.create({ code: 'A12345' }).getValue();
    const validDescription = AllergyDescription.create({ description: 'Severe reaction to peanuts' }).getValue();

    const allergy = Allergy.create(
      {
        name: validName,
        code: validCode,
        description: validDescription,
      }
    ).getValue();

    const newDescription = AllergyDescription.create({ description: 'Mild reaction to peanuts' }).getValue();
    allergy.description = newDescription;

    expect(allergy.description).toBe(newDescription);
  });
});
