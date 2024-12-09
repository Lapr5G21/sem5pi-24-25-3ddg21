import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController  {
  createMedicalRecord(req: Request, res: Response, next: NextFunction);
  updateMedicalRecord(req: Request, res: Response, next: NextFunction);
  getAllMedicalRecords(req: Request, res: Response, next: NextFunction);
  getMedicalRecord(req: Request, res: Response, next: NextFunction);
}