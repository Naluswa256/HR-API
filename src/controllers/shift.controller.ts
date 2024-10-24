import { createShiftInputType, updateShiftInputType } from '@/schemas/shift.validation.schemas';
import { shiftService } from '@/services/shift.service';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync'; 

interface ApiResponse {
  message: string;
  statusCode: number;
  data?: any;
}

class ShiftController {
  static async createShift(req: Request, res: Response) {
    const shiftData: createShiftInputType = req.body; 
    const {employeeId:hrAdminId} = req.user
    const shift = await shiftService.createShift(hrAdminId, shiftData);
    const response: ApiResponse = {
      message: 'Shift created successfully!',
      statusCode: 201,
      data: shift,
    };
    res.status(response.statusCode).json(response);
  }

  static async getShifts(req: Request, res: Response) {

    const {employeeId:hrAdminId} = req.user
    const shifts = await shiftService.getShifts(hrAdminId);
    const response: ApiResponse = {
      message: 'Shifts retrieved successfully!',
      statusCode: 200,
      data: shifts,
    };
    res.status(response.statusCode).json(response);
  }

 static async updateShift(req: Request, res: Response) {
    const shiftId = req.params.id;
    const updateData: updateShiftInputType = req.body;
    const {employeeId:hrAdminId} = req.user
    const updatedShift = await shiftService.updateShift(hrAdminId,shiftId, updateData);
    const response: ApiResponse = updatedShift
      ? {
          message: 'Shift updated successfully!',
          statusCode: 200,
          data: updatedShift,
        }
      : {
          message: 'Something went wrong',
          statusCode: 404,
        };
    res.status(response.statusCode).json(response);
  }
}


export default {
  createShift: catchAsync((req: Request, res: Response) => ShiftController.createShift(req, res)),
  getShifts: catchAsync((req: Request, res: Response) => ShiftController.getShifts(req, res)),
  updateShift: catchAsync((req: Request, res: Response) => ShiftController.updateShift(req, res)),
};
