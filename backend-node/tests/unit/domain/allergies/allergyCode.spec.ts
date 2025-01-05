import { describe, it, expect } from '@jest/globals';
import { AllergyCode } from "../../../../src/domain/Allergies/allergyCode";



describe("AllergyCode Value Object", () => {
    it("should create an AllergyCode successfully when valid input is provided", () => {
      const validCode = "A12345";
      const result = AllergyCode.create({ code: validCode });
  
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(AllergyCode);
      expect(result.getValue().value).toBe(validCode);
    });
  
  
    it("should allow retrieving the value of the AllergyCode", () => {
      const validCode = "B12345";
      const result = AllergyCode.create({ code: validCode });
  
      const allergyCode = result.getValue();
      expect(allergyCode.value).toBe(validCode);
    });
  });
