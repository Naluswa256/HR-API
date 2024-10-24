import { Response } from "express";

export const responseHandler = (res: Response, statusCode: number, message: string, data: unknown = null) => {
    return res.status(statusCode).json({
      statusCode,
      message,
      data
    });
  };
  