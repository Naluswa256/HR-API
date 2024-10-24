import { z } from 'zod';

// Schema for submitting an overtime request
export const submitOvertimeRequestSchema = {
    body: z.object({
        overtime_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format for 'overtime_date'",
        }),
        regular_overtime_hours: z.number().nonnegative("Regular overtime hours must be a non-negative number"),
        weekend_overtime_hours: z.number().nonnegative("Weekend overtime hours must be a non-negative number"),
        holiday_overtime_hours: z.number().nonnegative("Holiday overtime hours must be a non-negative number"),
        overtime_reason: z.string().nonempty("Overtime reason is required"),
    })
};

// Schema for getting overtime requests by employee ID
export const getOvertimeByEmployeeSchema = {
    params:z.object({
        employee_id: z.string().refine((id) => {
            // Validate that employeeId starts with "Emp" and is followed by 8 hex characters
            const employeeIdPattern = /^Emp[a-f0-9]{8}$/;
            return employeeIdPattern.test(id);
        }, {
            message: "Invalid employeeId. It must start with 'Emp' and be followed by 8 hex characters."
        })
    })
} ;

// Schema for approving an overtime request
export const approveOvertimeRequestSchema = {
    params: z.object({
        overtime_id: z.string(),
    })
};

// Schema for rejecting an overtime request
export const rejectOvertimeRequestSchema = {
    params:z.object({
        overtime_id: z.string(),
    }),
    body:z.object({
        rejection_reason: z.string(),
    })
}

// Schema for getting overtime requests by approval status
export const getOvertimeRequestsByApprovalStatusSchema = {
    query: z.object({
        approved: z.enum(['true', 'false']).optional(),
    })
};
