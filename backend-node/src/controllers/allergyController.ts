import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";

import IAllergyController from './IControllers/IAllergyController';
import IAllergyDTO from '../dto/IAllergyDTO';
import IAllergyService from '../services/IServices/IAllergyService';

@Service()
export default class AllergyController implements IAllergyController  {
  constructor(
      @Inject(config.services.allergy.name) private allergyServiceInstance : IAllergyService
  ) {}


  // api/allergies
  getAllergies(req: Request, res: Response, next: NextFunction) {
    try {
     
      const allergies = this.allergyServiceInstance.getAllergies();

      if ( allergies === null ) {
        return res.status(404).send("Failed to retrieve allergies");
      }

      return res.json(allergies).status(200);

    }
    catch (e) {
      return next(e);
    }
  };



  // api/allergies
  public async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;
        
      if (allergyOrError.isFailure) {
        return res.status(402).send("Error creating allergy");
      }

      const allergyDTO = allergyOrError.getValue();
      return res.json( allergyDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  // api/allergies/:id
  public async updateAllergy(req: Request, res: Response, next: NextFunction) {
    try {

      const { id, name, code, description } = req.body;

      const allergyOrError = await this.allergyServiceInstance.updateAllergy({ id, name, code, description }) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        return res.status(404).send("Allergy not found");
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(200).json( allergyDTO );
    }
    catch (e) {
      return next(e);
    }
  };
}