import { employeeIdRegex } from "@/utils/util";
import { z } from "zod";
import { isValidDateString } from "./shift.validation.schemas";

// Common regex for department code validation
const departmentCodeRegex = /^DEP-[A-Z0-9]{8}$/;

// Reusable schema for departmentId validation
const departmentIdSchema = z.object({
  departmentCode: z.string().regex(departmentCodeRegex, {
    message: "Invalid Department Code. It must start with 'DEP' and be followed by 8 alphanumeric characters.",
  }),
});

// Department Schema
export const departmentSchema =  {
    body:z.object({
        name: z.string(),
        description: z.string().optional().default(''),
        location: z.string().optional().default(''),
        departmentHead: z
          .string()
          .regex(employeeIdRegex, { message: "Invalid Employee ID format. It should be in the format 'EmpXXXXXXX'." }),
        budget: z.number().optional(),
        contactEmail: z.string().email().optional().default(''),
        contactPhone: z.string().optional().default(''),
        establishedDate: z.string().optional().refine(isValidDateString, {
          message: "Invalid date format for break_start",
        }).transform((dateString) => new Date(dateString)),
        status: z.enum(['active', 'inactive']).optional().default('active'),
        parentDepartment: z
          .string()
          .regex(departmentCodeRegex, { message: "Invalid Department Code format. It should be in the format 'DEP-XXXXXX'." }).optional(),
      })
};

// Schema for deleting a department
export const deleteDepartmentSchema = {
  params: departmentIdSchema,
};

// Schema for getting a department by code
export const getDepartmentByCodeSchema = {
  params: departmentIdSchema,
};

// Schema for updating a department
export const updateDepartmentSchema = {
  params: departmentIdSchema,
  body: departmentSchema.body.partial(), // Allows partial updates for the department
};

// Schema for assigning employees to a department
export const assignEmployeesToDepartmentSchema = {
  params: departmentIdSchema,
  body: z.object({
    employeeIds: z.array(
      z.string().regex(employeeIdRegex, { message: "Invalid Employee ID format." })
    ),
  }),
};

// Type inference for create and update department inputs
export type CreateDepartmentInputType = z.infer<typeof departmentSchema.body>;
export type UpdateDepartmentInputType = Partial<z.infer<typeof departmentSchema.body>>;
