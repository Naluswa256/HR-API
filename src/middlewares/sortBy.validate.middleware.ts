import { ApiError } from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';


// Helper function to get all paths, including nested ones
const getAllPaths = (schema: Schema): string[] => {
  const paths: string[] = [];

  const addPaths = (prefix: string, schemaPaths: any) => {
    Object.keys(schemaPaths).forEach((path) => {
      const fullPath = prefix ? `${prefix}.${path}` : path;
      if (['__v', '_id'].includes(fullPath)) {
        return;
      }
      // If it's a nested schema, recursively add its paths
      if (schemaPaths[path].schema) {
        addPaths(fullPath, schemaPaths[path].schema.paths);
      } else {
        paths.push(fullPath);
      }
    });
  };

  addPaths('', schema.paths);
  return paths;
};

// Middleware to validate sortBy in the format 'sortField:sortOrder'
const validateSortBy = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { sortBy } = req.query;

    // Get all valid paths, including nested ones
    const validSortFields = getAllPaths(schema);

    // If sortBy is provided, split into sortField and sortOrder
    if (sortBy) {
      const [sortField, sortOrder] = (sortBy as string).split(':');

      // Validate sortField
      if (!validSortFields.includes(sortField)) {
        return next(
          new ApiError(
            400,
            `Invalid sort field: ${sortField}. Valid fields are: ${validSortFields.join(', ')}`
          )
        );
      }

      // Validate sortOrder (must be either 'asc' or 'desc')
      if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
        return next(
          new ApiError(
            400,
            `Invalid sort order: ${sortOrder}. Valid sort orders are 'asc' or 'desc'.`
          )
        );
      }
    }

    next(); // Proceed if validation passes
  };
};

export default validateSortBy;
