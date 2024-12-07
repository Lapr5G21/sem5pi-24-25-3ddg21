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


  public async getAllergy(req: Request, res: Response, next: NextFunction) {
  
    try {
      const allergy = await this.allergyServiceInstance.getAllergy(req.params.id);

      if (allergy === null) {
        return res.status(404).send("Allergy not found or error in retrieving allergy");
      }
      return res.json(allergy).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };


  // api/allergies
  public async getAllAllergies(req: Request, res: Response, next: NextFunction) {
    try {
     
      const allergies = await this.allergyServiceInstance.getAllergies();

      if ( allergies === null ) {
        return res.status(404).send("Failed to retrieve allergies");
      }

      return res.json(allergies).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
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
      console.log(`ID: ${req.params.id}`); // Log para verificar o ID
      console.log(`Name: ${name}, Code: ${code}, Description: ${description}`);

      const allergyOrError = await this.allergyServiceInstance.updateAllergy({ id, name, code, description }) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        console.error("Failed to update allergy:", allergyOrError.error); 
        return res.status(404).send("Allergy not found");
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(200).json( allergyDTO );
    }
    catch (e) {
      console.error("Error:", e);
      return next(e);
    }
  };
}