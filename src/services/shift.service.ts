import { IShiftDocument, Shift } from "@/models/shift.model";
import { createShiftInputType, updateShiftInputType } from "@/schemas/shift.validation.schemas";
import { ApiError } from "@/utils/apiError";




class ShiftService {
    async createShift(hrAdminId: string, shiftData: createShiftInputType): Promise<IShiftDocument> {
        const existingShift = await Shift.findOne({ shift_name: shiftData.shift_name! });
        if (existingShift) {
            throw new ApiError(400, 'A shift with this name already exists.', true);
        }

        const newShift = new Shift({ ...shiftData, createdBy: hrAdminId }); // Set createdBy to hrAdminId
        return await newShift.save();
    }

    async getShifts(hrAdminId: string) {
        const shifts = await Shift.find({createdBy: hrAdminId});
        return shifts;
    }

    async updateShift(hrAdminId: string, shiftId: string, shiftData: updateShiftInputType): Promise<IShiftDocument | null> {
        const existingShift = await Shift.findById(shiftId);
        if (!existingShift) {
            throw new ApiError(404, 'Shift does not exist.', true);
        }

        // Check if the HR Admin has permission to update the shift
        if (existingShift.createdBy !== hrAdminId) {
            throw new ApiError(403, 'You do not have permission to modify this shift.', true);
        }

        const updatedShift = await Shift.findByIdAndUpdate(shiftId, shiftData, { new: true });
        return updatedShift;
    }
}

export const shiftService = new ShiftService();
