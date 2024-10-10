import mongoose from 'mongoose';
import { object, z } from 'zod';
const objectId = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId format',
  });
// Get Users validation schema
const getUsers = {
  query: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
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
  getUsers,
  getUser,
  deleteUser,
};
