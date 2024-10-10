import { IEmployee, IEmployeeDocument } from "@/models/users.model";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import usersService from "@/services/users.service";
import httpStatus from "http-status";
import pick from "@/utils/pick";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { EmployeeSearchQuery } from "@/schemas/searchQuery.validation.schemas";
const createResponse = (code: number, message: string, data?: any) => {
  return {
    code,
    message,
    data,
  };
};
// Configure Multer to handle file uploads and map files to specific fields
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // File upload destination folder
  },
  filename: (req:Request, file:Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer instance to handle multiple files with specific field names
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const fileTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc, .docx, .jpg, .jpeg, .png file types are allowed!'));
    }
  }
}).fields([
  { name: 'contractDocument', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'taxDocument', maxCount: 1 },
  { name: 'employeeAgreement', maxCount: 1 },
  { name: 'workPermit', maxCount: 1 }
]);


class UserController {
  // Get multiple users
  public getUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter: Record<string, any> = {};
    const options: Record<string, any> = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await usersService.queryUsers(filter, options);
    res.json(createResponse(httpStatus.OK, 'Users retrieved successfully', result));
  });

  // Delete a user
  public deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.userId;
    await usersService.deleteUserByEmployeeId(userId);
    res.json(createResponse(httpStatus.OK, `Successfully deleted Employee with ID ${userId}`))
  });

  // Get a single user by ID
  public getUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.userId;
    const user: IEmployeeDocument | null = await usersService.findUserByEmployeeId(userId);
    res.send(createResponse(httpStatus.OK, 'User retrieved successfully', user));
  });

  public searchEmployees = catchAsync(async (req: Request, res: Response) => {
      const validatedQuery: EmployeeSearchQuery = req.query;
      const result = await usersService.searchEmployees(validatedQuery);
      res.status(httpStatus.OK).json(result);
  });

  // Create a new employee
  public createEmployee = [
    // Middleware for file upload using Multer
    upload,
    catchAsync(async (req: Request, res: Response): Promise<void> => {
      const employeeData:Partial<IEmployee> = req.body;
      const files = req.files;
      const newEmployee = await usersService.createEmployee(employeeData, files);
      res.status(httpStatus.CREATED).send(createResponse(httpStatus.CREATED, 'Employee created successfully', newEmployee));
    })
  ];

  // Update an employee
  public updateEmployee = [
    // Middleware for file upload using Multer
    upload,
    catchAsync(async (req: Request, res: Response): Promise<void> => {
      const employeeId: string = req.params.userId;
      const updateData:Partial<IEmployee> = req.body;
      const files = req.files;
      const updatedEmployee = await usersService.updateEmployee(employeeId, updateData, files);
      res.status(httpStatus.OK).send(createResponse(httpStatus.OK, 'Employee updated successfully', updatedEmployee));
    })
  ];

}

// Export an instance of the UserController class
export default new UserController();
