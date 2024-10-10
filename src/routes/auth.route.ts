import BaseRoute from "@/interfaces/routes.interface";
import authController from "@/controllers/auth.controller";
import validate from "@/middlewares/validation.middleware";
import * as authValidation from '@/schemas/auth.validation.schemas';

import auth from "@/middlewares/auth.middleware";
class AuthRoute extends BaseRoute {
  public path = '/auth'; 

  protected initializeRoutes() {
    this.router.post('/register', validate(authValidation.registerSchema), authController.register);
    this.router.post('/login', validate(authValidation.loginSchema), authController.login);
    this.router.post('/logout', validate(authValidation.logout), authController.logout);
    this.router.post('/refresh-tokens', validate(authValidation.refreshTokensSchema), authController.refreshTokens);
    this.router.post('/forgot-password', validate(authValidation.forgotPasswordSchema), authController.forgotPassword);
    this.router.post('/reset-password', validate(authValidation.resetPasswordschema), authController.resetPassword);
    this.router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
    this.router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
  }
}

export default AuthRoute;
