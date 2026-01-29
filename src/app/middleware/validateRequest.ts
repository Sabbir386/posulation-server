import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,     // ✅ needed for ?page= & ?search=
        params: req.params,   // ✅ needed for /:id
        cookies: req.cookies,
      });

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

export default validateRequest;
