import httpStatus from 'http-status';
import tokenService from './token.service';
import Token from '../models/token.model';
import usersService from './users.service';
import { IEmployeeDocument } from '@/models/users.model';
import { ApiError } from '@/utils/apiError';
import { tokenTypes } from '@/interfaces/token.interface';


class AuthService {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<IEmployeeDocument>}
   */
  public async loginUserWithEmailAndPassword(email: string, password: string): Promise<IEmployeeDocument> {
    const user = await usersService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  }

  /**
   * Logout by invalidating refresh token
   * @param {string} refreshToken
   * @returns {Promise<void>}
   */
  public async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found');
    }
    await refreshTokenDoc.remove();
  }

  /**
   * Refresh authentication tokens
   * @param {string} refreshToken
   * @returns {Promise<{ access: { token: string; expires: Date }, refresh: { token: string; expires: Date }}>}
   */
  public async refreshAuth(refreshToken: string): Promise<{ access: { token: string; expires: Date }, refresh: { token: string; expires: Date } }> {
    try {
      const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await usersService.findUserByEmployeeId(refreshTokenDoc.userId);
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.remove();
      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  }

  /**
   * Reset password using a valid reset token
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  public async resetPassword(resetPasswordToken: string, newPassword: string): Promise<void> {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      const user = await usersService.findUserByEmployeeId(resetPasswordTokenDoc.userId);
      if (!user) {
        throw new Error();
      }
     // await usersService.updateUser(user.id, { password: newPassword });
      await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  }

  /**
   * Verify email using the email verification token
   * @param {string} verifyEmailToken
   * @returns {Promise<void>}
   */
  public async verifyEmail(verifyEmailToken: string): Promise<void> {
    try {
      const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
      const user = await usersService.findUserByEmployeeId(verifyEmailTokenDoc.userId);
      if (!user) {
        throw new Error();
      }
      await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
      //await usersService.updateUser(user.id, { isEmailVerified: true });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
  }
}

export default new AuthService();
