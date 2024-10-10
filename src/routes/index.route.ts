import IndexController from '@/controllers/index.controller';
import BaseRoute from '@/interfaces/routes.interface';
import indexController from '@/controllers/index.controller';
class IndexRoute extends BaseRoute {
  public path = '/'; 

  protected initializeRoutes(): void {
    this.router.get('/', indexController.index);
  }
}

export default IndexRoute;
