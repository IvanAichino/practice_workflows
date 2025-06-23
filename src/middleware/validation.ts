import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseHelper } from '../utils/responseHelper';

/**
 * Middleware factory for request validation using Joi
 */
export function validateRequest(schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body validation: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query validation: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params validation: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      ResponseHelper.validationError(res, errors.join('; '), req.requestId);
      return;
    }

    next();
  };
}

/**
 * Common validation schemas
 */
export const validationSchemas = {
  feriadosQuery: Joi.object({
    mes: Joi.string().pattern(/^(0?[1-9]|1[0-2])$/).optional(),
    tipo: Joi.string().valid('feriado', 'feriado puente', 'día no laborable').optional(),
  }),
};