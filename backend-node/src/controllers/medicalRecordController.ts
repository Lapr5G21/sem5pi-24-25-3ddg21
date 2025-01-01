import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";
import IMedicalRecordController from './IControllers/IMedicalRecordController';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

@Service()
export default class MedicalRecordController implements IMedicalRecordController  {
  constructor(
      @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance : IMedicalRecordService
  ) {}

  public async getMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecord(req.params.id);

      if (medicalRecordOrError.isFailure) {
        return res.status(404).json({ message: medicalRecordOrError.errorValue() });
      }

      return res.status(200).json(medicalRecordOrError.getValue());
    } catch (err) {
      console.error("Error retrieving medical record:", err);
      res.status(500).json({ message: err.message });
    }
  }


  // api/medicalRecords
  public async getAllMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.medicalRecordServiceInstance.getAllMedicalRecords();

      if (result.isFailure) {
        return res.status(404).json({ message: "Failed to retrieve medical records" });
      }

      return res.status(200).json(result.getValue());
    } catch (err) {
      console.error("Error retrieving all medical records:", err);
      res.status(500).json({ message: err.message });
    }
  }



  // api/medicalRecords
  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO);

      if (medicalRecordOrError.isFailure) {
        return res.status(400).json({ message: medicalRecordOrError.errorValue() });
      }

      return res.status(201).json(medicalRecordOrError.getValue());
    } catch (e) {
      console.error("Error creating medical record:", e);
      res.status(500).json({ message: e.message });
    }
  }

  // api/medicalRecords
  public async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        return res.status(404).send();
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();

      return res.status(201).json(medicalRecordDTO);
    } catch (e) {
      return next(e);
    }
  }
}