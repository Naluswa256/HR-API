import mongoose from "mongoose";

export const tokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail',
  } as const;
  

  export type TokenType = keyof typeof tokenTypes;
  export interface IToken {
    token: string;
    userId: string; // Reference to the User model
    type: TokenType;
    expires: Date;
    blacklisted: boolean;
  }