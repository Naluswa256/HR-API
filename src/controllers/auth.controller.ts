import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import usersService from '@/services/users.service';
import TokenService from '@/services/token.service';
import emailService from '@/services/email.service';
import authService from '@/services/auth.service';
import { ApiError } from '@/utils/apiError';
import { IEmployeeDocument } from '@/models/users.model';

declare global {
  namespace Express {
      interface User extends IEmployeeDocument {}
      interface Request {
          user?: IEmployeeDocument;
      }

      interface AuthenticatedRequest extends Request {
          user: IEmployeeDocument; 
      }
  }
}


// Define the interfaces for the request bodies
interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface RefreshTokenRequestBody {
  refreshToken: string;
}

interface ForgotPasswordRequestBody {
  email: string;
}

interface ResetPasswordRequestBody {
  password: string;
}

class AuthController {

  // Register a new user
  public register = catchAsync(async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const user = await usersService.createUser(req.body);
    const tokens = await TokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  });

  // Login a user
  public login = catchAsync(async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await TokenService.generateAuthTokens(user);
    res.send({ user, tokens });
  });

  // Logout a user
  public logout = catchAsync(async (req: Request<{}, {}, RefreshTokenRequestBody>, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  // Refresh authentication tokens
  public refreshTokens = catchAsync(async (req: Request<{}, {}, RefreshTokenRequestBody>, res: Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  });

  // Forgot password
  public forgotPassword = catchAsync(async (req: Request<{}, {}, ForgotPasswordRequestBody>, res: Response) => {
    const resetPasswordToken = await TokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  // Reset password
  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.query;
    const { password } = req.body as ResetPasswordRequestBody;
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
    }
    await authService.resetPassword(token as string, password);
    res.status(httpStatus.NO_CONTENT).send();
  });

  // Send verification email
  public sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const verifyEmailToken = await TokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.systemAndAccessInfo.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  // Verify email
  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
    }
    await authService.verifyEmail(token as string);
    res.status(httpStatus.NO_CONTENT).send();
  });
}

export default new AuthController();
