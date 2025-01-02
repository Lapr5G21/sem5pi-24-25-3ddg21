import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";

import IMedicalConditionController from './IControllers/IMedicalConditionController';
import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import ISearchMedicalConditionDTO from '../dto/ISearchMedicalConditionDTO';

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
      const result = await this.medicalConditionServiceInstance.getMedicalConditions();

      if (result.isFailure) {
        return res.status(404).json({ message: "Failed to retrieve medical conditions" });
      }

      const medicalConditionsDTO = result.getValue();

      return res.status(200).json(medicalConditionsDTO);
    } catch (err) {

      return res.status(500).json({ message: err.message });
    }
  }

  public async searchMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Controller reached: searchMedicalConditions");
      const { name, code } = req.query;
      
      if (!name && !code) {
        return res.status(400).json({ message: "At least one search parameter ('name' or 'code') is required." });
      }
      
      const searchDto: ISearchMedicalConditionDTO = {
        name: name as string,
        code: code as string,
      };
  
      const result = await this.medicalConditionServiceInstance.searchMedicalConditions(searchDto);
      
      if (result.isFailure) {
        return res.status(404).json({ message: "No medical conditions found" });
      }
      
      const medicalConditionsDTO = result.getValue();
      return res.status(200).json(medicalConditionsDTO);
    } catch (err) {
      console.error("Error in controller:", err);
      return res.status(500).json({ message: err.message });
    }
  }

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

  // api/medicalConditions
  public async updateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
  
      if (medicalConditionOrError.isFailure) {
        return res.status(404).send();
      }
  
      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.status(201).json(medicalConditionDTO);
    } catch (e) {
      return next(e);
    }
  };
  
  public async deleteMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.deleteMedicalCondition(req.params.id) as Result<IMedicalConditionDTO>;

      if (medicalConditionOrError.isFailure) {
        return res.status(404).json({ message: "Medical condition not found" });
    }

      const medicalConditionDTO = medicalConditionOrError.getValue();

      return res.status(200).json( medicalConditionDTO );
    }
    catch (e) {
      console.error("Error deleting medical condition:", e);
        return next(e);
    }
  };

}