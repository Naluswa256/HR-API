import BaseRoute from "@/interfaces/routes.interface";
import validate from "@/middlewares/validation.middleware";
import usersController from "@/controllers/users.controller";
import auth from "@/middlewares/auth.middleware";
import * as userValidation from '@/schemas/users.validation.schemas';
import * as employeeValidation from '@/schemas/employee.validation.schemas';
import * as searchQueryValidation from '@/schemas/searchQuery.validation.schemas';
class UserRoute extends BaseRoute {
  public path = '/users';

  protected initializeRoutes() {
    this.router
      .route('/')
      .get(auth('manageUsers'), validate(userValidation.getUsers), usersController.getUsers);
    this.router.route('/create-employee')
      .post(auth('manageUsers'), validate(employeeValidation.CreateEmployeeInputSchema), usersController.createEmployee);
    this.router.route('/employees/search').get(auth('manageUsers'), validate(searchQueryValidation.EmployeeSearchSchema), usersController.searchEmployees);
    this.router
      .route('/:userId')
      .get(auth('manageUsers'), validate(userValidation.getUser), usersController.getUser)
      .delete(auth('manageUsers'), validate(userValidation.deleteUser), usersController.deleteUser)
      .put(auth('manageUsers'), validate(employeeValidation.UpdateEmployeeSchema), usersController.updateEmployee);
  }
}


export default UserRoute;