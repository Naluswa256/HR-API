import { z } from 'zod';

export const isValidDateString = (dateString:string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Main Shift Schema
const shiftSchema = {
  body: z.object({
    shift_name: z.string(),
    shift_start: z.string().refine(isValidDateString, {
      message: "Invalid date format for shift_start",
    }).transform((dateString) => new Date(dateString)),
    shift_end: z.string().refine(isValidDateString, {
      message: "Invalid date format for shift_end",
    }).transform((dateString) => new Date(dateString)),
    max_work_hours: z.number().positive(),
    allowed_overtime: z.boolean(),
    time_zone: z.string().optional(),
    break_start: z.string().optional().refine(isValidDateString, {
      message: "Invalid date format for break_start",
    }).transform((dateString) => new Date(dateString)),
    break_end: z.string().optional().refine(isValidDateString, {
      message: "Invalid date format for break_end",
    }).transform((dateString) => new Date(dateString)),
    break_duration: z.number().optional(),
    shift_pattern: z.string().optional(),
  }).refine((data) => data.shift_end > data.shift_start, {
    message: "shift_end must be after shift_start",
    path: ["shift_end"],
  }),
};

// Update Shift Schema
const updateShiftSchema = {
  body: z.object({
    shift_name: z.string().optional(),
    shift_start: z.string().optional().refine(isValidDateString, {
      message: "Invalid date format for shift_start",
    }).transform((dateString) => new Date(dateString)),
    shift_end: z.string().optional().refine(isValidDateString, {
      message: "Invalid date format for shift_end",
    }).transform((dateString) => new Date(dateString)),
    max_work_hours: z.number().positive().optional(),
    allowed_overtime: z.boolean().optional(),
    time_zone: z.string().optional(),
    break_start: z.string().optional().refine(isValidDateString, {
      message: "Invalid date format for break_start",
    }).transform((dateString) => new Date(dateString)),
    break_end: z.string().optional().refine(isValidDateString, {
      message: "Invalid date format for break_end",
    }).transform((dateString) => new Date(dateString)),
    break_duration: z.number().optional(),
    shift_pattern: z.string().optional(),
  }).refine((data) => {
    // Only check if both dates are provided
    if (data.shift_start && data.shift_end) {
      return data.shift_end > data.shift_start;
    }
    return true; // No need to validate if one of them is not provided
  }, {
    message: "shift_end must be after shift_start if both are provided",
    path: ["shift_end"],
  }),
};

export type createShiftInputType = z.infer<typeof shiftSchema.body>;
export type updateShiftInputType = z.infer<typeof updateShiftSchema.body>;

export  {
  shiftSchema,
  updateShiftSchema,
};
