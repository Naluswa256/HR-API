import { IOvertimeDocument, OvertimeModel } from "@/models/overtime.model";
import { Employee } from "@/models/users.model";
import { ApiError } from "@/utils/apiError";
import { emailService } from "./email.service";


class OvertimeService {
    async submitOvertimeRequest(
        employee_id: string, overtime_date: Date, regular_overtime_hours: number, weekend_overtime_hours: number, holiday_overtime_hours: number, overtime_reason: any): Promise<IOvertimeDocument> {
        // Ensure at least one overtime hour is provided
        const totalOvertimeHours = regular_overtime_hours + weekend_overtime_hours + holiday_overtime_hours;

        if (totalOvertimeHours <= 0) {
            throw new ApiError(400, 'At least one overtime hour must be greater than zero.');
        }

        // Default any overtime hour fields that are not provided to zero
        regular_overtime_hours = regular_overtime_hours || 0;
        weekend_overtime_hours = weekend_overtime_hours || 0;
        holiday_overtime_hours = holiday_overtime_hours || 0;

        const overtimeRequest = new OvertimeModel({
            overtime_id: `OT-${Date.now()}`,
            employee_id,
            overtime_date,
            regular_overtime_hours,
            weekend_overtime_hours,
            holiday_overtime_hours,
            overtime_reason,
            approved: false,
            approver_id: null
        });

        return await overtimeRequest.save();
    }

    // Retrieve Overtime Records by Employee ID
    async getOvertimeByEmployee(employee_id: string, hrAdminID:string): Promise<IOvertimeDocument[]> {


        const employee = await Employee.findOne({ employeeId: employee_id }).select('systemAndAccessInfo.createdBy');
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }
      
        // Check if hrAdminID matches the employee's createdBy
        if (employee.systemAndAccessInfo.createdBy !== hrAdminID) {
            throw new ApiError(403, 'Unauthorized: HR Admin does not have permission to view this employee\'s overtime');
        }
      
        const records = await OvertimeModel.find({ employee_id });

        if (!records) {
            throw new ApiError(404, 'No overtime records found for this employee.');
        }

        return records;
    }

    // Approve an Overtime Request
    async approveOvertimeRequest(overtime_id: string, approver_id: string): Promise<IOvertimeDocument> {
        const overtimeRequest = await OvertimeModel.findOne({ overtime_id });

        if (!overtimeRequest) {
            throw new ApiError(404, 'Overtime request not found.');
        }

        if (overtimeRequest.approved) {
            throw new ApiError(400, 'Overtime request has already been approved.');
        }
        const employee = await Employee.findOne({ employeeId: overtimeRequest.employee_id }).select('systemAndAccessInfo.createdBy');
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }

        if (employee.systemAndAccessInfo.createdBy !== approver_id) {
            throw new ApiError(403, 'Unauthorized: HR Admin does not have permission to approve this leave');
        }
        overtimeRequest.approved = true;
        overtimeRequest.approver_id = approver_id; // Set the approver
        await overtimeRequest.save();
        await emailService.sendOvertimeApprovalEmail(
            employee.systemAndAccessInfo.email,
            overtimeRequest.overtime_date,
            overtimeRequest.regular_overtime_hours +
            overtimeRequest.weekend_overtime_hours +
            overtimeRequest.holiday_overtime_hours
        );
        return overtimeRequest;
    }

    // Reject an Overtime Request
    async rejectOvertimeRequest(overtime_id: string, approver_id: string, rejectionReason: string): Promise<IOvertimeDocument> {
        const overtimeRequest = await OvertimeModel.findOne({ overtime_id });

        if (!overtimeRequest) {
            throw new ApiError(404, 'Overtime request not found.');
        }

        if (overtimeRequest.approved) {
            throw new ApiError(400, 'Overtime request has already been approved.');
        }
        const employee = await Employee.findOne({ employeeId: overtimeRequest.employee_id }).select('systemAndAccessInfo');
        if (!employee) {
            throw new ApiError(404, `Employee with ${overtimeRequest.employee_id} does not exist`);
        }

        if (employee.systemAndAccessInfo.createdBy !== approver_id) {
            throw new ApiError(403, 'Unauthorized: HR Admin does not have permission reject this leave');
        }
        overtimeRequest.approved = false;
        overtimeRequest.approver_id = approver_id;
        overtimeRequest.rejection_reason = rejectionReason
        await overtimeRequest.save();
        await emailService.sendOvertimeRejectionEmail(
            overtimeRequest.employee_id,
            rejectionReason
        );
        return overtimeRequest;
    }

    async getOvertimeRequestsByApprovalStatus(hrAdminID: string, approved: boolean): Promise<IOvertimeDocument[]> {
        // Fetch employee IDs associated with the HR admin
        const employees = await Employee.find({ 'systemAndAccessInfo.createdBy': hrAdminID }).select('employeeId');
    
        if (!employees || employees.length === 0) {
            throw new ApiError(404, 'No employees found for this HR Admin.');
        }
    
        // Create the filter to only include overtime requests for employees managed by the HR admin
        const filter = {
            approved,
            employee_id: { $in: employees.map(emp => emp.employeeId) } // Use employeeId for filtering
        };
    
        // Find all overtime requests with the specified approval status
        const overtimeRequests = await OvertimeModel.find(filter);
    
        if (overtimeRequests.length === 0) {
            throw new ApiError(404, `No overtime requests found with approved status: ${approved}`);
        }
    
        return overtimeRequests;
    }
    

}

export default new OvertimeService();
