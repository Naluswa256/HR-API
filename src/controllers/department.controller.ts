import { Request, Response, NextFunction } from 'express';
import { departmentService } from "@/services/department.service";
import httpStatus from 'http-status';
import catchAsync from "@/utils/catchAsync"; import { createResponse } from './users.controller';
import pick from '@/utils/pick';

interface ReportQuery {
  location?: string;
  status?: string;
  establishedDateFrom?: string;
  establishedDateTo?: string;
  minEmployees?: string;
  maxEmployees?: string;
  minBudget?: string;
  maxBudget?: string;
  parentDepartment?: string;
  sortBy?: string;
  order?: string;
  page?: string;
  limit?: string;
}
class DepartmentController {

  // Query Departments with filtering and pagination
   queryDepartments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const options: Record<string, any> = pick(req.query, ['sortBy', 'limit', 'page']);
    
    // Destructure employeeId from req.user
    const { employeeId } = req.user; // Ensure req.user contains employeeId

    const filter: Record<string, any> = {
      createdBy: employeeId,
    };

    const departments = await departmentService.queryDepartments(filter, options);
    
    return res.status(httpStatus.OK).json(createResponse(httpStatus.OK, 'Departments retrieved successfully', departments));
});

  // Create a new department
  createDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const departmentData = req.body;
    const {employeeId} = req.user;
    const department = await departmentService.createDepartment(departmentData, employeeId);
    return res.status(httpStatus.CREATED).json(createResponse(httpStatus.CREATED, 'Department created successfully', department));
  });

  report = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      location,
      status,
      establishedDateFrom,
      establishedDateTo,
      minEmployees,
      maxEmployees,
      minBudget,
      maxBudget,
      parentDepartment,
      sortBy = 'numEmployees',
      order = 'asc',
      page = '1',
      limit = '10',
    } = req.query as ReportQuery;
    const filters = {
      location,
      status,
      establishedDateFrom,
      establishedDateTo,
      minEmployees,
      maxEmployees,
      minBudget,
      maxBudget,
      parentDepartment,
    };
   const {employeeId} = req.user;
    const report = await departmentService.getReport(filters, sortBy, order, Number(page), Number(limit), employeeId);
 
    res.status(200).json(report);
  });

  // Get department by departmentCode
  getDepartmentByCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { departmentCode } = req.params;
    const {employeeId} = req.user;
    const department = await departmentService.getDepartmentByDepartmentCode(departmentCode, employeeId);
    return res.status(httpStatus.OK).json(createResponse(httpStatus.OK, 'Department retrieved successfully', department));
  });

  // Update a department by departmentCode
  updateDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { departmentCode } = req.params;
    const {employeeId} = req.user;
    const updateData = req.body;
    const updatedDepartment = await departmentService.updateDepartment(departmentCode, updateData, employeeId);
    return res.status(httpStatus.OK).json(createResponse(httpStatus.OK, 'Department updated successfully', updatedDepartment));
  });

  // Delete a department by departmentCode
  deleteDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { departmentCode } = req.params;
    const {employeeId} = req.user;
    await departmentService.deleteDepartment(departmentCode, employeeId);
    return res.status(httpStatus.NO_CONTENT).json(createResponse(httpStatus.NO_CONTENT, 'Department deleted successfully'));
  });
  getEmployeesInDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { departmentCode } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const {employeeId} = req.user;
    const departmentData = await departmentService.getEmployeesInDepartment(departmentCode, employeeId, page, limit, 
    );

    res.status(200).json({
      success: true,
      message: `Employees in department: ${departmentData.departmentName}`,
      data: departmentData,
    });
  });
  // Assign employees to a department
  assignEmployeesToDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { departmentCode } = req.params;
    const { employeeIds } = req.body;
    const {employeeId} = req.user;
    const updatedDepartment = await departmentService.assignEmployeesToDepartment(departmentCode, employeeIds, employeeId);
    return res.status(httpStatus.OK).json(createResponse(httpStatus.OK, 'Employees assigned to department successfully', updatedDepartment));
  });
}

export const departmentController = new DepartmentController();
