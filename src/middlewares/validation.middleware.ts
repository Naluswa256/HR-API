// src/middlewares/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validate = (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the body if schema exists
      if (schemas.body) {
        schemas.body.parse(req.body);
      }
      
      // Validate the query if schema exists
      if (schemas.query) {
        schemas.query.parse(req.query);
      }

      // Validate the params if schema exists
      if (schemas.params) {
        schemas.params.parse(req.params);
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors }); // Return validation errors
      }
      next(error); // Pass other errors to the next error handler
    }
  };
};

export default validate;
