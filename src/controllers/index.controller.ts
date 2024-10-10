import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        statusCode:200, 
        message:'server is running and healthy'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new IndexController();
