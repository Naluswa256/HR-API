import { Router } from 'express';
import { departmentController } from "@/controllers/department.controller";
import BaseRoute from "@/interfaces/routes.interface";
import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validation.middleware";
import * as departmentsValidationSchemas from '@/schemas/department.validation.schemas';
import * as userValidation from '@/schemas/users.validation.schemas';
import validateSortBy from '@/middlewares/sortBy.validate.middleware';
import { departmentSchema } from '@/models/department.model';

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API for managing departments
 */

class DepartmentRoute extends BaseRoute {
    public path = '/departments';

    // Initialize routes
    protected initializeRoutes() {
        this.router.use(auth('manageUsers'));
        
        /**
         * @swagger
         * /departments:
         *   get:
         *     summary: Retrieve a list of departments
         *     tags: [Departments]
         *     parameters:
         *       - in: query
         *         name: sortBy
         *         description: Sorting field
         *         required: false
         *         schema:
         *           type: string
         *       - in: query
         *         name: limit
         *         description: Number of departments to retrieve per page
         *         required: false
         *         schema:
         *           type: integer
         *       - in: query
         *         name: page
         *         description: Page number
         *         required: false
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Successfully retrieved departments
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 message:
         *                   type: string
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Department'
         *       400:
         *         description: Invalid query parameters
         */
        this.router
            .route('/')
            .get(validate(userValidation.fetchMany), validateSortBy(departmentSchema), departmentController.queryDepartments)
            .post(validate(departmentsValidationSchemas.departmentSchema), departmentController.createDepartment);

        /**
         * @swagger
         * /departments:
         *   post:
         *     summary: Create a new department
         *     tags: [Departments]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DepartmentInput'
         *     responses:
         *       201:
         *         description: Successfully created department
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 message:
         *                   type: string
         *                 data:
         *                   $ref: '#/components/schemas/Department'
         *       400:
         *         description: Invalid input data
         */
        
        this.router
            .route('/:departmentCode')
            .get(validate(departmentsValidationSchemas.getDepartmentByCodeSchema), departmentController.getDepartmentByCode)
            .put(validate(departmentsValidationSchemas.updateDepartmentSchema), departmentController.updateDepartment)
            .delete(validate(departmentsValidationSchemas.deleteDepartmentSchema), departmentController.deleteDepartment);

        /**
         * @swagger
         * /departments/{departmentCode}/assignEmployees:
         *   post:
         *     summary: Assign employees to a department
         *     tags: [Departments]
         *     parameters:
         *       - in: path
         *         name: departmentCode
         *         required: true
         *         description: The code of the department
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               employeeIds:
         *                 type: array
         *                 items:
         *                   type: string
         *     responses:
         *       200:
         *         description: Successfully assigned employees to the department
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 message:
         *                   type: string
         *                 data:
         *                   $ref: '#/components/schemas/Department'
         *       404:
         *         description: Department not found
         */
        this.router
            .post('/:departmentCode/assignEmployees', validate(departmentsValidationSchemas.assignEmployeesToDepartmentSchema), departmentController.assignEmployeesToDepartment);
        
        /**
         * @swagger
         * /departments/{departmentCode}/employees:
         *   get:
         *     summary: Get employees in a department
         *     tags: [Departments]
         *     parameters:
         *       - in: path
         *         name: departmentCode
         *         required: true
         *         description: The code of the department
         *         schema:
         *           type: string
         *       - in: query
         *         name: page
         *         description: Page number for pagination
         *         required: false
         *         schema:
         *           type: integer
         *       - in: query
         *         name: limit
         *         description: Number of employees to retrieve per page
         *         required: false
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Successfully retrieved employees in department
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 message:
         *                   type: string
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Employee'
         *       404:
         *         description: Department not found
         */
        this.router
            .get('/:departmentCode/employees', auth('manageUsers'), validate(departmentsValidationSchemas.getDepartmentByCodeSchema), departmentController.getEmployeesInDepartment);
    }
}

export default DepartmentRoute;