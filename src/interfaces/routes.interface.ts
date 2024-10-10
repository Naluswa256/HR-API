import { Router } from 'express';

export interface Routes {
  path: string;
  router: Router;
}

export default abstract class BaseRoute implements Routes {
  public abstract path: string;
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;
}
