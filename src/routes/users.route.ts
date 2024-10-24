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

    /**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a paginated list of users. Only users with the 'manageUsers' role can access this route.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., name, email)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of users to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (for pagination)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Employee'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalResults:
 *                       type: integer
 *                       example: 50
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     pagingCounter:
 *                       type: integer
 *                       description: Starting index of the current page
 *                       example: 1
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /create-employee:
 *   post:
 *     summary: Create a new employee
 *     description: This endpoint allows for creating a new employee record. The body of the request contains employee information, personal details, employment details, compensation, and other related fields. File uploads are handled for documents and compliance.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               personalDetails:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     description: Full name of the employee.
 *                   dateOfBirth:
 *                     type: string
 *                     format: date-time
 *                     description: ISO date string for date of birth.
 *                   gender:
 *                     type: string
 *                     description: Gender of the employee.
 *                   nationality:
 *                     type: string
 *                     description: Nationality of the employee.
 *                   contactInformation:
 *                     type: object
 *                     description: Contact information of the employee.
 *                     properties:
 *                       phoneNumber:
 *                         type: string
 *                         description: Phone number of the employee.
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Email address of the employee.
 *                       address:
 *                         type: object
 *                         description: Employee's address details.
 *                         properties:
 *                           currentAddress:
 *                             type: string
 *                           permanentAddress:
 *                             type: string
 *               employmentDetails:
 *                 type: object
 *                 description: Employment details for the employee.
 *                 properties:
 *                   department:
 *                     type: string
 *                   jobTitle:
 *                     type: string
 *                   dateOfHire:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the employee was hired.
 *                   shift:
 *                     type: string
 *                     description: Shift ID.
 *               compensationAndBenefits:
 *                 type: object
 *                 properties:
 *                   salary:
 *                     type: object
 *                     properties:
 *                       baseSalary:
 *                         type: number
 *                       currency:
 *                         type: string
 *                   payFrequency:
 *                     type: string
 *                   bankAccountDetails:
 *                     type: object
 *                     properties:
 *                       bankName:
 *                         type: string
 *                       accountNumber:
 *                         type: string
 *               documentsAndCompliance:
 *                 type: object
 *                 properties:
 *                   contractDocument:
 *                     type: string
 *                     format: binary
 *                     description: Contract document file.
 *                   idProof:
 *                     type: string
 *                     format: binary
 *                     description: ID proof document file.
 *                   taxDocument:
 *                     type: string
 *                     format: binary
 *                     description: Tax document file.
 *                   employeeAgreement:
 *                     type: string
 *                     format: binary
 *                     description: Employee agreement document file.
 *                   workPermit:
 *                     type: string
 *                     format: binary
 *                     description: Work permit document file.
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   relationship:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *               systemAndAccessInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                   passwordHash:
 *                     type: string
 *                   role:
 *                     type: string
 *             required:
 *               - systemAndAccessInfo
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Employee created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Bad request - Validation or file errors
 *       401:
 *         description: Unauthorized - Invalid or missing credentials
 */

/**
 * @swagger
 * /employees/search:
 *   get:
 *     summary: Search employees
 *     description: Retrieve a list of employees based on various search criteria such as employee ID, department, job title, salary range, etc. This endpoint also supports pagination and sorting.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: ID of the employee to search for.
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Full name of the employee.
 *       - in: query
 *         name: dateOfBirth
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of birth (ISO format).
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Gender of the employee.
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Nationality of the employee.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the employee.
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Phone number of the employee.
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department of the employee.
 *       - in: query
 *         name: jobTitle
 *         schema:
 *           type: string
 *         description: Job title of the employee.
 *       - in: query
 *         name: employeeRole
 *         schema:
 *           type: string
 *         description: Role of the employee within the company.
 *       - in: query
 *         name: employeeStatus
 *         schema:
 *           type: string
 *         description: Status of the employee (e.g., active, terminated).
 *       - in: query
 *         name: workLocation
 *         schema:
 *           type: string
 *         description: Work location of the employee.
 *       - in: query
 *         name: supervisorId
 *         schema:
 *           type: string
 *         description: Supervisor's ID for the employee.
 *       - in: query
 *         name: documentNumber
 *         schema:
 *           type: string
 *         description: Document number (e.g., ID, passport).
 *       - in: query
 *         name: accountLocked
 *         schema:
 *           type: boolean
 *         description: Whether the employee's account is locked.
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *         description: Type of employment (e.g., full-time, part-time).
 *       - in: query
 *         name: contractType
 *         schema:
 *           type: string
 *         description: Type of contract for the employee.
 *       - in: query
 *         name: dateOfHireFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter employees hired from this date (ISO format).
 *       - in: query
 *         name: dateOfHireTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter employees hired up to this date (ISO format).
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *         description: Minimum salary of the employee.
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *         description: Maximum salary of the employee.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort the results by (default is fullName).
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved employee search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of employees matching the search criteria.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *                 employees:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Indicates if there is another page of results.
 *                 hasPreviousPage:
 *                   type: boolean
 *                   description: Indicates if there is a previous page of results.
 *       400:
 *         description: Invalid search query parameters
 *       401:
 *         description: Unauthorized - Missing or invalid credentials
 */
  /**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update employee details
 *     description: Update the details of an employee. Only authenticated users with the "manageUsers" permission can access this endpoint.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personalDetails:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: 1990-01-01
 *                   gender:
 *                     type: string
 *                     example: Male
 *                   maritalStatus:
 *                     type: string
 *                     example: Single
 *                   nationality:
 *                     type: string
 *                     example: American
 *                   contactInformation:
 *                     type: object
 *                     properties:
 *                       phoneNumber:
 *                         type: string
 *                         example: "+123456789"
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *                       address:
 *                         type: object
 *                         properties:
 *                           currentAddress:
 *                             type: string
 *                             example: "123 Main St, Springfield, IL"
 *                           permanentAddress:
 *                             type: string
 *                             example: "456 Elm St, Springfield, IL"
 *               employmentDetails:
 *                 type: object
 *                 properties:
 *                   department:
 *                     type: string
 *                     example: Engineering
 *                   jobTitle:
 *                     type: string
 *                     example: Software Engineer
 *                   dateOfHire:
 *                     type: string
 *                     format: date
 *                     example: 2022-06-15
 *                   employmentType:
 *                     type: string
 *                     example: Full-time
 *                   supervisorId:
 *                     type: string
 *                     example: "60c72b2f9b1d8b45f8bfa2b4"
 *                   employeeStatus:
 *                     type: string
 *                     example: Active
 *                   employeeRole:
 *                     type: string
 *                     example: Employee
 *                   workLocation:
 *                     type: string
 *                     example: Remote
 *                   contractType:
 *                     type: string
 *                     example: Permanent
 *                   shift:
 *                     type: string
 *                     example: "Morning"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: null
 *               compensationAndBenefits:
 *                 type: object
 *                 properties:
 *                   salary:
 *                     type: object
 *                     properties:
 *                       baseSalary:
 *                         type: number
 *                         example: 60000
 *                       currency:
 *                         type: string
 *                         example: USD
 *                   payFrequency:
 *                     type: string
 *                     example: Monthly
 *                   bankAccountDetails:
 *                     type: object
 *                     properties:
 *                       bankName:
 *                         type: string
 *                         example: Bank of America
 *                       accountNumber:
 *                         type: string
 *                         example: "123456789"
 *                       routingNumber:
 *                         type: string
 *                         example: "987654321"
 *                   taxInformation:
 *                     type: object
 *                     properties:
 *                       taxId:
 *                         type: string
 *                         example: "123-45-6789"
 *                       nationalInsurance:
 *                         type: string
 *                         example: "AB123456C"
 *                   healthInsurance:
 *                     type: object
 *                     properties:
 *                       provider:
 *                         type: string
 *                         example: "Health Inc."
 *                       policyNumber:
 *                         type: string
 *                         example: "POL123456"
 *                   pensionContributions:
 *                     type: object
 *                     properties:
 *                       contributionPercentage:
 *                         type: number
 *                         example: 5
 *                       employerContribution:
 *                         type: number
 *                         example: 3
 *                   bonusStructure:
 *                     type: string
 *                     example: Performance-based
 *               documentsAndCompliance:
 *                 type: object
 *                 properties:
 *                   contract:
 *                     type: object
 *                     properties:
 *                       contractDocument:
 *                         type: string
 *                         example: "contract.pdf"
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: "2022-06-15"
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-15"
 *                   idProof:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Passport"
 *                       documentNumber:
 *                         type: string
 *                         example: "P123456789"
 *                       documentScan:
 *                         type: string
 *                         example: "scan.jpg"
 *                   taxDocuments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         year:
 *                           type: string
 *                           example: "2022"
 *                         document:
 *                           type: string
 *                           example: "tax_doc.pdf"
 *                   employeeAgreements:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         agreementType:
 *                           type: string
 *                           example: "Non-Disclosure Agreement"
 *                         agreementDocument:
 *                           type: string
 *                           example: "nda.pdf"
 *                   workPermits:
 *                     type: object
 *                     properties:
 *                       permitNumber:
 *                         type: string
 *                         example: "WP123456"
 *                       validityStartDate:
 *                         type: string
 *                         format: date
 *                         example: "2022-06-15"
 *                       validityEndDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-15"
 *                   visaStatus:
 *                     type: string
 *                     example: "Valid"
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   relationship:
 *                     type: string
 *                     example: "Spouse"
 *                   phoneNumber:
 *                     type: string
 *                     example: "+123456789"
 *                   address:
 *                     type: string
 *                     example: "789 Pine St, Springfield, IL"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Employee updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: At least one field must be updated
 *       404:
 *         description: Employee not found or user does not have permission to update this employee.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Employee not found or you do not have permission to update this user
 */
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user by their ID
 *     description: Retrieves a user's information based on their employee ID. Only users with 'manageUsers' permission can access this route.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: /^[a-fA-F0-9]{24}$/
 *         description: The ID of the user (employeeId)
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Employee'   
 *       400:
 *         description: Bad request, possibly due to invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid userId format
 *       401:
 *         description: Unauthorized, user does not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User doesn't exist
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by their employee ID
 *     description: Deletes a user based on their employee ID. Only users with 'manageUsers' permission can access this route. The user performing the action must be the creator of the employee being deleted.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: Empa1b2c3d4  # Example following the pattern of Emp + 8 hex characters
 *           description: The employee ID of the user to delete (must start with "Emp" and be followed by 8 hex characters)
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Successfully deleted Employee with ID Empa1b2c3d4
 *                 data:
 *                   type: null
 *       400:
 *         description: Invalid userId format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid employeeId. It must start with 'Emp' and be followed by 8 hex characters.
 *       401:
 *         description: Unauthorized, user does not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found or no permission to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User doesn't exist or you do not have permission to delete this user
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

    this.router
      .route('/')
      .get(auth('manageUsers'), validate(userValidation.fetchMany), usersController.getUsers);
    this.router.route('/create-employee')
      .post(auth('manageUsers'), validate(employeeValidation.CreateEmployeeInputSchema), usersController.createEmployee);
    this.router.route('/employees/search').get(auth('manageUsers'), validate(searchQueryValidation.EmployeeSearchSchema), usersController.searchEmployees);
    this.router
      .route('/:userId')
      .get(auth('manageUsers'), validate(userValidation.getUser), usersController.getUser)
      .delete(auth('manageUsers'), validate(userValidation.deleteUser), usersController.deleteUser)
      .patch(auth('manageUsers'), usersController.updateEmployee);
  }
}


export default UserRoute;