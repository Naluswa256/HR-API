import { ILeaveDocument, LeaveModel, LeaveStatus } from "@/models/leave.model";
import { PaginateOptions, QueryResult } from "@/models/plugins/paginate.plugin";
import { Employee } from "@/models/users.model";
import { ApiError } from "@/utils/apiError";
import { emailService } from "./email.service";


class LeaveService {

  async submitLeaveRequest(
    employee_id: string,
    leave_type: string,
    start_date: Date,
    end_date: Date,
    reason: string
  ): Promise<ILeaveDocument> {
    const employee = await Employee.findOne({ employee_id });

    if (!employee) {
      throw new ApiError(404,`Employee with ${employee_id} does not Exist `);
    }
    const leave_days = this.calculateLeaveDays(start_date,end_date);

    const leave = new LeaveModel({
      leave_id: `LV-${Date.now()}`, 
      employee_id,
      leave_type,
      start_date,
      end_date,
      leave_days,
      status: 'pending',  
      approver_id: null,  
      reason,
      submitted_at: new Date(),
    });

    return await leave.save();
  }
  
 // Get Leaves by Status

 async getLeavesByStatus(hrAdminID: string, status: LeaveStatus, options: PaginateOptions = {}): Promise<QueryResult<ILeaveDocument>> {
  // Fetch employee IDs associated with the HR admin
  const employees = await Employee.find({ 'systemAndAccessInfo.createdBy': hrAdminID }).select('employeeId');

  if (!employees || employees.length === 0) {
      throw new ApiError(404, 'No employees found for this HR Admin.');
  }

  // Create the filter to only include leaves for employees managed by the HR admin
  const filter = {
      status,
      employee_id: { $in: employees.map(emp => emp.employeeId) } // Use employeeId for filtering
  };

  // Fetch all leaves with the given status
  const leaves = await LeaveModel.paginate(filter, options);

  if (leaves.results.length === 0) {
      throw new ApiError(404, `No leaves found with status: ${status}`);
  }

  return leaves;
}

// Approve Leave Request
async approveLeaveRequest(leaveId: string, approverId: string): Promise<ILeaveDocument> {
  const leave = await LeaveModel.findById(leaveId);

  if (!leave) {
      throw new ApiError(404, 'Leave request not found');
  }

  if (leave.status !== 'pending') {
      throw new ApiError(404, 'Leave request is not pending');
  }

  // Fetch employee and verify permission
  const employee = await Employee.findOne({ employeeId: leave.employee_id }).select('systemAndAccessInfo.createdBy');
  if (!employee) {
      throw new ApiError(404, 'Employee not found');
  }

  if (employee.systemAndAccessInfo.createdBy !== approverId) {
      throw new ApiError(403, 'Unauthorized: HR Admin does not have permission to approve this leave');
  }

  leave.status = LeaveStatus.Approved;
  leave.approval_date = new Date();
  leave.approver_id = approverId;

  await leave.save();

  // Update employee leave balance
  if (leave.leave_type === 'annual') {
      employee.attendanceAndLeave.leaveBalance.annualLeaveBalance -= leave.leave_days;
  } else if (leave.leave_type === 'sick') {
      employee.attendanceAndLeave.leaveBalance.sickLeaveBalance -= leave.leave_days;
  }
  await employee.save();
  await emailService.sendLeaveApprovalEmail(employee.systemAndAccessInfo.email, leave.leave_type, leave.start_date, leave.end_date);
  return leave;
}

// Reject Leave Request
async rejectLeaveRequest(leaveId: string, approverId: string, rejectionReason: string): Promise<ILeaveDocument> {
  const leave = await LeaveModel.findById(leaveId);

  if (!leave) {
      throw new ApiError(404, 'Leave request not found');
  }

  if (leave.status !== 'pending') {
      throw new ApiError(404, 'Leave request is not pending');
  }

  // Fetch employee and verify permission
  const employee = await Employee.findOne({ employeeId: leave.employee_id }).select('systemAndAccessInfo.createdBy');
  if (!employee) {
      throw new ApiError(404, 'Employee not found');
  }

  if (employee.systemAndAccessInfo.createdBy !== approverId) {
      throw new ApiError(403, 'Unauthorized: HR Admin does not have permission to reject this leave');
  }

  // Reject the leave request
  leave.status = LeaveStatus.Rejected;
  leave.rejection_reason = rejectionReason;
  leave.approver_id = approverId;
  leave.approval_date = null;

  await leave.save();
  await emailService.sendLeaveRejectionEmail(employee.systemAndAccessInfo.email, leave.leave_type, leave.rejection_reason);
  return leave;
}

// Retrieve Leave by Employee ID
async getLeaveByEmployee(hrAdminID: string, employee_id: string, options: PaginateOptions = {}): Promise<QueryResult<ILeaveDocument>> {
  // Fetch employee to verify permission
  const employee = await Employee.findOne({ employeeId: employee_id }).select('systemAndAccessInfo.createdBy');
  if (!employee) {
      throw new ApiError(404, 'Employee not found');
  }

  // Check if hrAdminID matches the employee's createdBy
  if (employee.systemAndAccessInfo.createdBy !== hrAdminID) {
      throw new ApiError(403, 'Unauthorized: HR Admin does not have permission to view this employee\'s leaves');
  }

  const filter = { employee_id };
  return await LeaveModel.paginate(filter, options);
}


  // Helper function to calculate the number of leave days between two dates
  private calculateLeaveDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including both start and end day
  }
}

export default new LeaveService();


