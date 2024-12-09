import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";

import IMedicalConditionController from './IControllers/IMedicalConditionController';
import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';

@Service()
export default class MedicalConditionController implements IMedicalConditionController{
  constructor(
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService
  ) {}

  public async getMedicalCondition(req: Request, res: Response, next: NextFunction) {
  
    try {
      const medicalCondition = await this.medicalConditionServiceInstance.getMedicalCondition(req.params.id);

      if (medicalCondition === null) {
        return res.status(404).send("Medical condition not found or error in retrieving medical condition");
      }
      return res.json(medicalCondition).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };

  // api/medicalConditions
  public async getAllMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
     
      const medicalConditions = await this.medicalConditionServiceInstance.getMedicalConditions();

      if ( medicalConditions === null ) {
        return res.status(404).send("Failed to retrieve medical conditions");
      }

      return res.json(medicalConditions).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };

  // api/medicalConditions
  public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
        
      if (medicalConditionOrError.isFailure) {
        return res.status(402).send("Error creating medical condition");
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.json( medicalConditionDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  // api/medicalConditions/:id
  public async updateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {

      const { id, name, code, description, symptoms } = req.body;
      const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition({ id, name, code, description, symptoms }) as Result<IMedicalConditionDTO>;

      if (medicalConditionOrError.isFailure) {
        return res.status(404).send("Medical Condition not found");
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.status(200).json( medicalConditionDTO );
    }
    catch (e) {
      return next(e);
    }
  };
}