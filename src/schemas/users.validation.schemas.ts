import mongoose from 'mongoose';
import { object, z } from 'zod';
const objectId = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId format',
  });
// Get Users validation schema
const fetchMany = {
  query: z.object({
    sortBy: z.string().optional(),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)), // Transform string to number
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)), // Transform string to number
  }),
};


// Get User validation schema
const getUser ={
  params: z.object({
    userId:objectId
  }),
};

// Delete User validation schema
const deleteUser = {
  params: z.object({
    userId: z.string().refine((id) => {
      // Validate that employeeId starts with "Emp" and is followed by 8 hex characters
      const employeeIdPattern = /^Emp[a-f0-9]{8}$/;
      return employeeIdPattern.test(id);
    }, {
      message: "Invalid employeeId. It must start with 'Emp' and be followed by 8 hex characters."
    })
  }),
};
 export {
  fetchMany,
  getUser,
  deleteUser,
};
