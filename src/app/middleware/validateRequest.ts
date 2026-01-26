import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
   
    try {
      console.log('Request Body:', req.body);
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      
      next();
    } catch (err) {
      
       next(err);
    }
  };
};

export default validateRequest;
