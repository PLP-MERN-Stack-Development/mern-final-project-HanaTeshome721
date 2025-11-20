import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: 'Validation failed',
          errors: error.flatten(),
        });
      }

      next(error);
    }
  };

