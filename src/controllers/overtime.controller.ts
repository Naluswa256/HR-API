import { Request, Response, NextFunction } from 'express';
import OvertimeService from '@/services/overtime.service';
import catchAsync from '@/utils/catchAsync';
import { responseHandler } from '@/utils/responseHandler';

class OvertimeController {
    // Submit an Overtime Request
    submitOvertimeRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {overtime_date, regular_overtime_hours, weekend_overtime_hours, holiday_overtime_hours, overtime_reason } = req.body;
        const {employeeId} = req.user;
        const overtimeRequest = await OvertimeService.submitOvertimeRequest(
            employeeId,
            new Date(overtime_date),
            regular_overtime_hours,
            weekend_overtime_hours,
            holiday_overtime_hours,
            overtime_reason
        );
        responseHandler(res, 201, 'Overtime request submitted successfully', overtimeRequest);
    });

    // Get Overtime Requests by Employee ID
    getOvertimeByEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { employee_id } = req.params;
        const {employeeId:hrAdminId} = req.user;
        const overtimeRecords = await OvertimeService.getOvertimeByEmployee(employee_id, hrAdminId);
        responseHandler(res, 200, 'Overtime records retrieved successfully', overtimeRecords);
    });

    // Approve Overtime Request
    approveOvertimeRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { overtime_id } = req.params;
        const { employeeId } = req.user;
        const approvedOvertime = await OvertimeService.approveOvertimeRequest(overtime_id, employeeId);
        responseHandler(res, 200, 'Overtime request approved successfully', approvedOvertime);
    });

    // Reject Overtime Request
    rejectOvertimeRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { overtime_id } = req.params;
        const { rejection_reason } = req.body;
        const {employeeId} = req.user;
        const rejectedOvertime = await OvertimeService.rejectOvertimeRequest(overtime_id, employeeId, rejection_reason);
        responseHandler(res, 200, 'Overtime request rejected successfully', rejectedOvertime);
    });

    // Get Overtime Requests by Approval Status (approved or rejected)
    getOvertimeRequestsByApprovalStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { approved } = req.query;
        const isApproved = approved === 'true';
        const {employeeId:hrAdminId} = req.user;
        const overtimeRequests = await OvertimeService.getOvertimeRequestsByApprovalStatus(hrAdminId,isApproved);
        responseHandler(res, 200, 'Overtime requests retrieved successfully', overtimeRequests);
    });
}

export default new OvertimeController();
