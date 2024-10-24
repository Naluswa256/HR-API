import { Request, Response } from 'express';
import leaveService from "@/services/leave.service";
import { LeaveStatus } from "@/models/leave.model";
import { ApiError } from "@/utils/apiError";
import catchAsync from "@/utils/catchAsync"; // Import the catchAsync utility

class LeaveController {
  // Submit a leave request
  submitLeaveRequest = catchAsync(async (req: Request, res: Response) => {
    const { leave_type, start_date, end_date, reason } = req.body;
    const employee_id = req.user.employeeId; // Get employee_id from req.user

    const leaveRequest = await leaveService.submitLeaveRequest(
      employee_id,
      leave_type,
      new Date(start_date),
      new Date(end_date),
      reason
    );

    return res.status(201).json({
      status: "success",
      message: "Successfully submitted leave request.",
      data: leaveRequest,
    });
  });

  // Approve a leave request
  approveLeaveRequest = catchAsync(async (req: Request, res: Response) => {
    const { leaveId } = req.params;
    const approverId = req.user.employeeId; // Get approver_id from req.user
    const {employeeId:hrAdminId} = req.user;
    const approvedLeave = await leaveService.approveLeaveRequest(leaveId, approverId);
    return res.status(200).json({
      status: "success",
      message: "Leave request approved successfully.",
      data: approvedLeave,
    });
  });

  // Reject a leave request
  rejectLeaveRequest = catchAsync(async (req: Request, res: Response) => {
    const { leaveId } = req.params;
    const approverId = req.user.employeeId; // Get approver_id from req.user
    const { rejectionReason } = req.body;
    const {employeeId:hrAdminId} = req.user;
    const rejectedLeave = await leaveService.rejectLeaveRequest(leaveId, approverId, rejectionReason);
    return res.status(200).json({
      status: "success",
      message: "Leave request rejected successfully.",
      data: rejectedLeave,
    });
  });

  // Get all leaves by status
  getLeavesByStatus = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.params; // Get status from request parameters
    const options = req.query; // You can customize pagination options from the query
    const {employeeId:hrAdminId} = req.user;
    const leaves = await leaveService.getLeavesByStatus(hrAdminId,status as LeaveStatus, options);
    return res.status(200).json({
      status: "success",
      message: "Leaves retrieved successfully.",
      data: leaves,
    });
  });

  // Retrieve leave by employee ID
  getLeaveByEmployee = catchAsync(async (req: Request, res: Response) => {
    const { employee_id } = req.params; // Get employee_id from request parameters
    const options = req.query; // You can customize pagination options from the query
    const {employeeId:hrAdminId} = req.user;
    const leaves = await leaveService.getLeaveByEmployee(hrAdminId,employee_id, options);
    return res.status(200).json({
      status: "success",
      message: "Leaves retrieved successfully.",
      data: leaves,
    });
  });
}

export default new LeaveController();
