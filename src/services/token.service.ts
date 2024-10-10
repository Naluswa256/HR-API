import jwt, { JwtPayload } from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';
import { 
    JWT_ACCESS_EXPIRATION_MINUTES, 
    JWT_REFRESH_EXPIRATION_DAYS, 
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 
    SECRET_KEY 
} from '@/config';
import Token, { ITokenDocument } from '@/models/token.model';
import { ApiError } from '@/utils/apiError';
import { tokenTypes } from '@/interfaces/token.interface';
import usersService from './users.service';
import { IEmployee, IEmployeeDocument } from '@/models/users.model';

interface AuthTokens {
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
}

class TokenService {
    /**
     * Generate a JWT token with the given payload
     * @param {string} userId
     * @param {Moment} expires
     * @param {string} type
     * @param {string} [secret]
     * @returns {string}
     */
    private static generateToken(userId: string, expires: Moment, type: string, secret: string = SECRET_KEY): string {
        const payload: JwtPayload = {
            sub: userId,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    }

    /**
     * Save a token to the database
     * @param {string} token
     * @param {ObjectId} userId
     * @param {Moment} expires
     * @param {string} type
     * @param {boolean} [blacklisted=false]
     * @returns {Promise<ITokenDocument>}
     */
    private static async saveToken(
        token: string,
        userId: string,
        expires: Moment,
        type: string,
        blacklisted: boolean = false
    ): Promise<ITokenDocument> {
        return await Token.create({
            token,
            userId: userId,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
    }

    /**
     * Verify a token and return the corresponding token document
     * @param {string} token
     * @param {string} type
     * @returns {Promise<ITokenDocument>}
     */
    public static async verifyToken(token: string, type: string): Promise<ITokenDocument> {
        const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;
        const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
        
        if (!tokenDoc) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
        }
        return tokenDoc;
    }

    /**
     * Generate authentication tokens (access and refresh)
     * @param {IUserDocument} user
     * @returns {Promise<AuthTokens>}
     */
    public static async generateAuthTokens(user: IEmployeeDocument): Promise<AuthTokens> {
        const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
        const accessToken = this.generateToken(user.employeeId, accessTokenExpires, tokenTypes.ACCESS);

        const refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');
        const refreshToken = this.generateToken(user.employeeId, refreshTokenExpires, tokenTypes.REFRESH);
        await this.saveToken(refreshToken, user.employeeId, refreshTokenExpires, tokenTypes.REFRESH);

        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    }

    /**
     * Generate a reset password token
     * @param {string} email
     * @returns {Promise<string>}
     */
    public static async generateResetPasswordToken(email: string): Promise<string> {
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
        }
        const expires = moment().add(JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
        const resetPasswordToken = this.generateToken(user.employeeId, expires, tokenTypes.RESET_PASSWORD);
        await this.saveToken(resetPasswordToken, user.employeeId, expires, tokenTypes.RESET_PASSWORD);
        return resetPasswordToken;
    }

    /**
     * Generate an email verification token
     * @param {IUserDocument} user
     * @returns {Promise<string>}
     */
    public static async generateVerifyEmailToken(user: IEmployeeDocument): Promise<string> {
        const expires = moment().add(JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
        const verifyEmailToken = this.generateToken(user.employeeId, expires, tokenTypes.VERIFY_EMAIL);
        await this.saveToken(verifyEmailToken, user.employeeId, expires, tokenTypes.VERIFY_EMAIL);
        return verifyEmailToken;
    }
}

export default TokenService;
