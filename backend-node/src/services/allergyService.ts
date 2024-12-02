import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IAllergyService from './IServices/IAllergyService';
import IAllergyRepo from './IRepos/IAllergyRepo';
import IAllergyDTO from '../dto/IAllergyDTO';
import { AllergyMap } from '../mappers/AllergyMap';
import { Allergy } from '../domain/Allergies/allergy';


@Service()
export default class AllergyService implements IAllergyService {
  constructor(
      @Inject(config.repos.allergy.name) private allergyRepo : IAllergyRepo
  ) {}

  public async getAllergy( allergyId: string): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByDomainId(allergyId);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }


  public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {

      const allergyOrError = await Allergy.create( allergyDTO );

      if (allergyOrError.isFailure) {
        return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
      }

      const allergyResult = allergyOrError.getValue();

      await this.allergyRepo.save(allergyResult);

      const allergyDTOResult = AllergyMap.toDTO( allergyResult ) as IAllergyDTO;
      return Result.ok<IAllergyDTO>( allergyDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByDomainId(allergyDTO.id);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        allergy.name = allergyDTO.name;
        await this.allergyRepo.save(allergy);

        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
