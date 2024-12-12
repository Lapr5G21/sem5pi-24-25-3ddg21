import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController  {
  createMedicalCondition(req: Request, res: Response, next: NextFunction);
  updateMedicalCondition(req: Request, res: Response, next: NextFunction);
  getMedicalCondition(req: Request, res: Response, next: NextFunction);
  getAllMedicalConditions(req: Request, res: Response, next: NextFunction);
  searchMedicalConditions(req: Request, res: Response, next: NextFunction);
  deleteMedicalCondition(req: Request, res: Response, next: NextFunction);
}