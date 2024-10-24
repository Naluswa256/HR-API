import BaseRoute from "@/interfaces/routes.interface";
import authController from "@/controllers/auth.controller";
import validate from "@/middlewares/validation.middleware";
import * as authValidation from '@/schemas/auth.validation.schemas';
import auth from "@/middlewares/auth.middleware";

class AuthRoute extends BaseRoute {
  public path = '/auth';

  protected initializeRoutes() {
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               fullname:
     *                 type: string
     *                 example: "John Doe"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: johndoe@example.com
     *               password:
     *                 type: string
     *                 example: johnDoe256
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/Employee'  
     *                 tokens:
     *                   type: object
     *                   properties:
     *                     access:
     *                       type: object
     *                       properties:
     *                         token:
     *                           type: string
     *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *                         expires:
     *                           type: string
     *                           format: date-time
     *                           example: 2024-10-22T08:56:39.783Z
     *                     refresh:
     *                       type: object
     *                       properties:
     *                         token:
     *                           type: string
     *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *                         expires:
     *                           type: string
     *                           format: date-time
     *                           example: 2024-11-21T08:26:39.792Z
     *       400:
     *         description: Bad Request - Email already exists
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "This email johndoe@example.com already exists"
     */

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login an employee
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: johndoe@example.com
     *               password:
     *                 type: string
     *                 example: johnDoe256
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/Employee'  
     *                 tokens:
     *                   type: object
     *                   properties:
     *                     access:
     *                       type: object
     *                       properties:
     *                         token:
     *                           type: string
     *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *                         expires:
     *                           type: string
     *                           format: date-time
     *                           example: 2024-10-22T08:56:39.783Z
     *                     refresh:
     *                       type: object
     *                       properties:
     *                         token:
     *                           type: string
     *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *                         expires:
     *                           type: string
     *                           format: date-time
     *                           example: 2024-11-21T08:26:39.792Z
     *       400:
     *         description: Bad Request - User doesn't exist
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "User doesn't exist"
     */


    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Logout user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *                 example: "your_refresh_token_here"
     *     responses:
     *       204:
     *         description: Successfully logged out
     *       404:
     *         description: Refresh token not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Refresh token not found"
     */
    /**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh authentication tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "your_refresh_token_here"
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Tokens refreshed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "new_access_token_here"
 *                         expires:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-22T08:56:39.783Z"
 *                     refresh:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "new_refresh_token_here"
 *                         expires:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-21T08:26:39.792Z"
 *       401:
 *         description: Unauthorized - Please authenticate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Sends a reset password email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Reset password email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Reset password email sent successfully"
 *       404:
 *         description: No users found with this email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found with this email"
 */
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Resets the user password
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: "your-reset-token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: Bad request if token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       401:
 *         description: Unauthorized if password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset failed"
 */
 /**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Sends a verification email to the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Verification email sent successfully"
 *       401:
 *         description: Unauthorized if the user is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 */
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verifies the user's email using a token
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token used for email verification
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       400:
 *         description: Bad request if the token is not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       401:
 *         description: Unauthorized if email verification fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verification failed"
 */

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
