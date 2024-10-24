import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Attendance creation schema
export const createAttendanceSchema = {
    body: z.object({
        check_in: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid check-in date format",
        }), // Validate that check_in is a valid date string
        check_out: z
            .string()
            .optional()
            .nullable()
            .refine((date) => {
                if (date === null || date === undefined) return true; // Allow null or undefined
                return !isNaN(Date.parse(date)); // Validate only if the date is provided
            }, {
                message: "Invalid check-out date format",
            }),
    })
};


export const attendanceQuerySchema = {
    query: z.object({
        from: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid from date format",
        }),
        to: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid to date format",
        }),
        employee_id: z.string().optional(),
        shift_type: z.string().optional(),
        late_arrival: z.string()
            .optional()
            .transform((val) => {
                if (val === undefined || val === '') return undefined;
                if (val === 'true') return true;
                if (val === 'false') return false;
                throw new Error("Invalid late_arrival value, must be 'true' or 'false'");
            }),
        early_departure: z.string()
            .optional()
            .transform((val) => {
                if (val === undefined || val === '') return undefined;
                if (val === 'true') return true;
                if (val === 'false') return false;
                throw new Error("Invalid early_departure value, must be 'true' or 'false'");
            }),
        overtime: z.string()
            .optional()
            .transform((val) => {
                if (val === undefined || val === '') return undefined;
                if (val === 'true') return true;
                if (val === 'false') return false;
                throw new Error("Invalid overtime value, must be 'true' or 'false'");
            }),
        showAbsentDays: z.string()
            .optional()
            .transform((val) => {
                if (val === undefined || val === '') return undefined;
                if (val === 'true') return true;
                if (val === 'false') return false;
                throw new Error("Invalid overtime value, must be 'true' or 'false'");
            }),
        department: z.string().optional(),
        page: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined)),
        pageSize: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined)),
        sortBy: z.enum([
            'attendance_date',
            'check_in',
            'check_out',
            'work_hours',
            'overtime_hours',
            'undertime_hours',
            'employee_id'
        ]).optional(),
        sortDirection: z.enum(['asc', 'desc']).optional(),
    }).refine(data => !(data.employee_id && data.department), {
        message: "Provide either employee_id or department, not both",
    })
};


const allowedFilters = z.enum(['today', 'yesterday', 'week', 'month', 'year', 'custom']);

// Zod schema for getAttendanceSummary request params
export const getAttendanceSummarySchema = z.object({
    params: z.object({
        employee_id: z.string().nonempty("Employee ID is required"),
        filter: allowedFilters
    })
});


// Zod schema for getAttendanceForEmployee request
export const getAttendanceForEmployeeSchema = z.object({
    employee_id: z.string().nonempty("Employee ID is required"),
    filter: allowedFilters,
    from: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid 'from' date format",
    }),
    to: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid 'to' date format",
    }),
}).refine((data) => {
    // Check if filter is 'custom' and validate 'from' and 'to'
    if (data.filter === 'custom') {
        return !!data.from && !!data.to;
    }
    return true;
}, {
    message: "'from' and 'to' are required for custom date ranges",
    path: ['from', 'to']
});
export const validateAttendanceRequest = (req: Request, res: Response, next: NextFunction) => {
    // Combine params and query into a single object for validation
    const dataToValidate = {
        employee_id: req.params.employee_id,
        filter: req.params.filter,
        from: typeof req.query.from === 'string' ? req.query.from : undefined,
        to: typeof req.query.to === 'string' ? req.query.to : undefined,
    };

    const parseResult = getAttendanceForEmployeeSchema.safeParse(dataToValidate);
    if (!parseResult.success) {
        return res.status(400).json({
            errors: parseResult.error.errors,
        });
    }

    next(); // Proceed to the next middleware or route handler
};

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema.body>;
