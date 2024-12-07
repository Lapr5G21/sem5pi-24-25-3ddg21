import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController  {
  createAllergy(req: Request, res: Response, next: NextFunction);
  updateAllergy(req: Request, res: Response, next: NextFunction);
  getAllAllergies(req: Request, res: Response, next: NextFunction);
  getAllergy(req: Request, res: Response, next: NextFunction);
}