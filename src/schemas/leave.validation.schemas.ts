import { z } from 'zod';

// Enums for leave type and status
const LeaveTypeEnum = z.enum(["annual", "sick", "maternity", "paternity", "other"]);
const LeaveStatusEnum = z.enum(["pending", "approved", "rejected"]);

const dateFormatMessage = "Date must be in the format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ";

// Employee ID Validation Schema
const employeeIdSchema = z.string().refine((id) => {
    const employeeIdPattern = /^Emp[a-f0-9]{8}$/;
    return employeeIdPattern.test(id);
}, {
    message: "Invalid employeeId. It must start with 'Emp' and be followed by 8 hex characters."
});

// Create Leave Schema
export const createLeaveSchema = {
    body: z.object({
        leave_type: LeaveTypeEnum,
        start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: `Invalid start date. ${dateFormatMessage}`,
        }),
        end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: `Invalid end date. ${dateFormatMessage}`,
        }),
        reason: z.string().min(5, "Reason must be at least 5 characters long"),
    }).refine((data) => {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        
        // Check if end date is after start date
        return endDate >= startDate;
    }, {
        message: "End date must be after start date",
        path: ["end_date"], 
    })
};

// Approve Leave Request Schema
export const approveLeaveSchema = {
    params: z.object({
        leaveId: z.string().min(1, "Leave ID is required"),
    }),
    body: z.object({
        approver_id: employeeIdSchema, // Validating approver_id
    }),
};

// Reject Leave Request Schema
export const rejectLeaveSchema = {
    params: z.object({
        leaveId: z.string().min(1, "Leave ID is required"),
    }),
    body: z.object({
        approver_id: employeeIdSchema, // Validating approver_id
        rejection_reason: z.string().min(5, "Rejection reason must be at least 5 characters long"),
    }),
};

// Get Leaves by Status Schema
export const getLeavesByStatusSchema = {
    params: z.object({
        status: LeaveStatusEnum, // Validates based on the enum
    }),
};

// Get Leave by Employee Schema
export const getLeaveByEmployeeSchema = {
    params: z.object({
        employee_id: employeeIdSchema, // Validating employee_id
    }),
};

// Get Overtime by Employee Schema
export const getOvertimeByEmployeeSchema = {
    params: z.object({
        employee_id: employeeIdSchema, // Validating employee_id
    }),
};
