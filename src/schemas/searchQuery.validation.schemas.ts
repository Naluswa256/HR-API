import { z } from 'zod';
const isoDateString = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  { message: "Invalid date format, expected ISO date string" }
);
// Zod schema for validating query parameters
export const EmployeeSearchSchema = {
  query: z.object({
    employeeId: z.string().optional(),
    fullName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    department: z.string().optional(),
    jobTitle: z.string().optional(),
    employeeRole: z.string().optional(),
    employeeStatus: z.string().optional(),
    workLocation: z.string().optional(),
    supervisorId: z.string().optional(),
    documentNumber: z.string().optional(),
    accountLocked: z.boolean().optional(),
    employmentType: z.string().optional(),
    contractType: z.string().optional(),
    dateOfHireFrom: isoDateString.optional(),
    dateOfHireTo: isoDateString.optional(),  // for date range filter (ISO Date string)
    salaryMin: z.preprocess((v) => (v !== undefined ? Number(v) : undefined), z.number().optional()),
    salaryMax: z.preprocess((v) => (v !== undefined ? Number(v) : undefined), z.number().optional()),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.preprocess((v) => (v !== undefined ? Number(v) : 1), z.number().int().positive().optional()),
    limit: z.preprocess((v) => (v !== undefined ? Number(v) : 20), z.number().int().positive().optional()),
  })
}

export type EmployeeSearchQuery = z.infer<typeof EmployeeSearchSchema.query>;
