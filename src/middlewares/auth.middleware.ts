import passport from 'passport';
import httpStatus from 'http-status';
import { Permission, roleRights } from '../config/roles';
import { Request, Response, NextFunction } from 'express';
import { IEmployeeDocument } from '@/models/users.model'; // Adjust the import path as necessary
import { ApiError } from '@/utils/apiError';

// Define the type for the request with the user property
interface AuthRequest extends Request {
  user?: IEmployeeDocument; // The user property can be of type IUserDocument
}

// Define the verifyCallback function
const verifyCallback = (req: AuthRequest, resolve: () => void, reject: (error: ApiError) => void, requiredRights: Permission[]) => async (err: any, user: IEmployeeDocument | false, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access - No token provided or invalid token'));
  }

  req.user = user; // Attach the user to the request

  if (requiredRights.length) {
    const userRights = roleRights.get(user.systemAndAccessInfo.role as Role) || [];
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this resource'));
    }
  }

  resolve();
};

// Define the auth middleware
const auth = (...requiredRights: Permission[]) => async (req: AuthRequest, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
