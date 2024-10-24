import { Department, IDepartmentDocument } from "@/models/department.model";
import { PaginateOptions, QueryResult } from "@/models/plugins/paginate.plugin";
import { Employee, IEmployeeDocument } from "@/models/users.model";
import { CreateDepartmentInputType, UpdateDepartmentInputType } from "@/schemas/department.validation.schemas";
import { ApiError } from "@/utils/apiError";
import { employeeIdRegex, generateDepartmentCode } from "@/utils/util";
import { Document, Types } from "mongoose";


class DepartmentService {
    async queryDepartments(filter: Record<string, any>, options: PaginateOptions): Promise<QueryResult<Document>> {
        return Department.paginate(filter, options);
    }
    async createDepartment(data: CreateDepartmentInputType, employeeId: string) {
        const uniqueCode = generateDepartmentCode();
        const newDepartment = new Department({ ...data, departmentCode: uniqueCode, createdBy: employeeId });
        return await newDepartment.save();
    }

    async getDepartmentByDepartmentCode(departmentCode: string, employeeId: string) {
        const department = await Department.findOne({ departmentCode });

        if (!department) {
            throw new ApiError(404, `Department with code ${departmentCode} not found.`);
        }

        if (department.createdBy !== employeeId) {
            throw new ApiError(403, `You do not have permission to access this department.`);
        }

        return department;
    }


    async updateDepartment(departmentCode: string, data: UpdateDepartmentInputType, employeeId: string) {
        const department = await Department.findOne({ departmentCode });

        if (!department) {
            throw new ApiError(404, `Department with code ${departmentCode} not found.`);
        }

        if (department.createdBy !== employeeId) {
            throw new ApiError(403, `You do not have permission to modify this department.`);
        }

        const updatedDepartment = await Department.findOneAndUpdate({ departmentCode }, data, { new: true });
        return updatedDepartment;
    }



    async assignEmployeesToDepartment(departmentCode: string, employeeIds: string[], employeeId: string) {
        const department = await Department.findOne({ departmentCode });

        if (!department) {
            throw new ApiError(404, `Department with code ${departmentCode} not found.`);
        }

        if (department.createdBy !== employeeId) {
            throw new ApiError(403, `You do not have permission to modify this department.`);
        }
        const invalidIds = employeeIds.filter(id => !employeeIdRegex.test(id));

        if (invalidIds.length > 0) {
            throw new ApiError(400, `Invalid employee IDs: ${invalidIds.join(', ')}`);
        }

        const updatedDepartment = await Department.findOneAndUpdate(
            { departmentCode },
            { $addToSet: { employees: { $each: employeeIds } } },
            { new: true }
        );

        if (!updatedDepartment) {
            throw new ApiError(404, `Department with code ${departmentCode} not found.`);
        }

        return updatedDepartment;
    }
    async getReport(filters: any, sortBy: string, order: string, page: number = 1, limit: number = 10,employeeId: string) {
        const filter: any = {};
        if (filters.location) filter.location = filters.location;
        if (filters.status) filter.status = filters.status;
        if (filters.establishedDateFrom || filters.establishedDateTo) {
            filter.establishedDate = {};
            if (filters.establishedDateFrom) filter.establishedDate.$gte = new Date(filters.establishedDateFrom);
            if (filters.establishedDateTo) filter.establishedDate.$lte = new Date(filters.establishedDateTo);
        }
        if (filters.minEmployees) filter.numEmployees = { ...filter.numEmployees, $gte: Number(filters.minEmployees) };
        if (filters.maxEmployees) filter.numEmployees = { ...filter.numEmployees, $lte: Number(filters.maxEmployees) };
        if (filters.minBudget) filter.budget = { ...filter.budget, $gte: Number(filters.minBudget) };
        if (filters.maxBudget) filter.budget = { ...filter.budget, $lte: Number(filters.maxBudget) };
        if (filters.parentDepartment) filter.parentDepartment = filters.parentDepartment; // Filter by parent department
        filter.createdBy = employeeId; 
        // Pagination options
        const options = {
            sortBy: `${sortBy}:${order}`, // Construct the sortBy string for pagination
            limit,
            page,
        };

        // Query departments with pagination
        const result: QueryResult<IDepartmentDocument> = await Department.paginate(filter, options);

        // Calculate metrics
        const totalDepartments = result.totalResults;
        const departmentsWithMoreThanX = result.results.filter(department => department.numEmployees > 0).length;
        const totalEmployees = result.results.reduce((sum, department) => sum + department.numEmployees, 0);
        const averageEmployeesPerDepartment = totalDepartments > 0 ? (totalEmployees / totalDepartments) : 0;

        // Build report response
        const report = {
            totalDepartments: {
                count: totalDepartments,
                departmentsWithMoreThanX,
            },
            averageEmployeesPerDepartment,
            departments: result.results,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                pagingCounter: result.pagingCounter,
            },
            filters,
            sorting: {
                sortBy,
                order,
            },
        };

        return report;
    }

    async deleteDepartment(departmentCode: string, employeeId: string) {
        const department = await Department.findOne({ departmentCode });
    
        if (!department) {
            throw new ApiError(404, `Department with code ${departmentCode} not found.`);
        }
    
        if (department.createdBy !== employeeId) {
            throw new ApiError(403, `You do not have permission to delete this department.`);
        }
    
        const deletedDepartment = await Department.findOneAndDelete({ departmentCode });
        return deletedDepartment;
    }
    

    async getEmployeesInDepartment(
        departmentCode: string,
        employeeId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{
        departmentName: string;
        numEmployees: number;
        budget: number;
        status: string;
        establishedDate: Date | null;
        employees: QueryResult<IEmployeeDocument>; // Paginated employees
    }> {
        // Find the department by its code
        const department = await Department.findOne({ departmentCode });

        if (!department) {
            throw new ApiError(404, `Department with code ${departmentCode} not found.`);
        }
        // Check if the user is the creator of the department
        if (department.createdBy !== employeeId) {
            throw new ApiError(403, `You do not have permission to view employees in this department.`);
        }
        // Extract employee IDs from the department
        const employeeIds = department.employees || [];

        // Define pagination options
        const options: PaginateOptions = {
            page,
            limit,
            sortBy: 'establishedDate:desc', // Optional: Sort by creation date descending
            // You can add populate options if there are relationships to populate
            populate: '', // e.g., 'manager,department'
        };

        // Paginate employees using employee IDs as the filter
        const paginatedEmployees = await Employee.paginate({ employeeId: { $in: employeeIds } }, options);

        // Return the department details and paginated employees
        return {
            departmentName: department.name,
            numEmployees: department.numEmployees,
            budget: department.budget,
            status: department.status,
            establishedDate: department.establishedDate,
            employees: paginatedEmployees
        };

    }
}

export const departmentService = new DepartmentService();