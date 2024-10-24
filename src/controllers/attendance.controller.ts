import { attendanceService } from '@/services/attendance.service';
import catchAsync from '@/utils/catchAsync';
import { responseHandler } from '@/utils/responseHandler';
import { employeeIdRegex } from '@/utils/util';
import { Request, Response } from 'express';


class AttendanceController {
  // Endpoint to mark attendance
  markAttendance = catchAsync(async (req: Request, res: Response) => {
    const {check_in, check_out } = req.body;
    const {employeeId} = req.user!;
    const attendance = await attendanceService.markAttendance(
      employeeId,
      new Date(check_in),
      check_out ? new Date(check_out) : undefined
    );
    return responseHandler(res, 200, 'Attendance marked successfully', attendance);
  });

  // Endpoint to generate attendance report
  generateAttendanceReport = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const {employeeId:hrAdminId} = req.user;
    const report = await attendanceService.generateAttendanceReport(query as any, hrAdminId); // Typecast as needed
    return responseHandler(res, 200, 'Attendance report generated successfully', report);
  });

  // Endpoint to get attendance summary for an employee
  getAttendanceSummary = catchAsync(async (req: Request, res: Response) => {
    const { employee_id, filter } = req.params;
    const { from, to } = req.query;
    const {employeeId:hrAdminId} = req.user;
    const summary = await attendanceService.getAttendanceSummary(employee_id, filter, hrAdminId, from as string, to as string);
    return responseHandler(res, 200, 'Attendance summary retrieved successfully', summary);
  });

  // Endpoint to get detailed attendance records for an employee
  getAttendanceForEmployee = catchAsync(async (req: Request, res: Response) => {
    const { employee_id, filter } = req.params;
    const { from, to } = req.query;
    const {employeeId:hrAdminId} = req.user;
    const attendanceDetails = await attendanceService.getAttendanceForEmployee(
      employee_id,
      filter,
      hrAdminId,
      from as string,
      to as string
    );
    return responseHandler(res, 200, 'Attendance details retrieved successfully', attendanceDetails);
  });
}

export const attendanceController = new AttendanceController();
