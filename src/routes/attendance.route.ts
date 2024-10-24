import { attendanceController } from '@/controllers/attendance.controller';
import BaseRoute from '@/interfaces/routes.interface';
import auth from '@/middlewares/auth.middleware';
import validate from '@/middlewares/validation.middleware';
import { attendanceQuerySchema, createAttendanceSchema, validateAttendanceRequest } from '@/schemas/attendance.validation.schemas';

/**
 * @swagger
 * /attendance/mark:
 *   post:
 *     summary: Mark employee attendance (check-in and check-out)
 *     description: Marks the attendance for an employee with check-in and optional check-out times.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkAttendanceRequest'
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarkAttendanceResponse'
 *       400:
 *         description: Bad request. Invalid check-in/check-out data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /attendance/report:
 *   get:
 *     summary: Generate attendance report
 *     description: Fetch a detailed attendance report based on various filters such as date range, employee ID, department, and more.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the report (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the report (YYYY-MM-DD)
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: shift_type
 *         schema:
 *           type: string
 *         description: Filter by shift type
 *       - in: query
 *         name: late_arrival
 *         schema:
 *           type: boolean
 *         description: Filter by late arrival status (true or false)
 *       - in: query
 *         name: early_departure
 *         schema:
 *           type: boolean
 *         description: Filter by early departure status (true or false)
 *       - in: query
 *         name: overtime
 *         schema:
 *           type: boolean
 *         description: Filter by overtime status (true or false)
 *       - in: query
 *         name: showAbsentDays
 *         schema:
 *           type: boolean
 *         description: Show absent days in the report (true or false)
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of records per page for pagination
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [attendance_date, check_in, check_out, work_hours, overtime_hours, undertime_hours, employee_id]
 *         description: Field to sort by
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction (ascending or descending)
 *     responses:
 *       200:
 *         description: Attendance report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceReport'
 *       400:
 *         description: Bad request - invalid input or parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid authentication
 *       404:
 *         description: Employee or department not found
 */

/**
 * @swagger
 * /summary/{employee_id}/{filter}:
 *   get:
 *     summary: Retrieve employee attendance summary
 *     description: Fetches the attendance summary for a specific employee based on a filter (date range or specific condition).
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: employee_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employee whose attendance summary is being fetched.
 *       - in: path
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, custom]
 *         description: The type of filter to apply to the attendance summary (e.g., weekly, monthly, or custom date range).
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for the custom filter (required for custom date range).
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for the custom filter (required for custom date range).
 *     responses:
 *       200:
 *         description: Attendance summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employee_id:
 *                   type: string
 *                   description: The ID of the employee.
 *                 employee:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                       description: The full name of the employee.
 *                     email:
 *                       type: string
 *                       description: The email address of the employee.
 *                 summary:
 *                   type: object
 *                   properties:
 *                     present_days:
 *                       type: integer
 *                       description: Total number of days the employee was present.
 *                     absent_days:
 *                       type: integer
 *                       description: Total number of days the employee was absent.
 *                     late_arrivals:
 *                       type: integer
 *                       description: Number of late arrivals.
 *                     early_departures:
 *                       type: integer
 *                       description: Number of early departures.
 *                     total_overtime_hours:
 *                       type: number
 *                       description: Total overtime hours worked by the employee.
 *       400:
 *         description: Bad request - Invalid parameters or query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Description of the validation error.
 *       404:
 *         description: Employee not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating that the employee was not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the server issue.
 */

/**
 * @swagger
 * /attendance/employee/{employee_id}/{filter}:
 *   get:
 *     summary: Retrieve detailed attendance records for an employee
 *     description: Fetches detailed attendance records for a specific employee within a given date range or based on a filter such as 'weekly' or 'monthly'.
 *     tags:
 *       - Attendance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employee_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employee whose attendance records are being fetched.
 *       - in: path
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, custom]
 *         description: The type of filter to apply to the attendance records (e.g., weekly, monthly, or custom date range).
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for the custom date range (required for custom filter).
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for the custom date range (required for custom filter).
 *     responses:
 *       200:
 *         description: Attendance details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employee_id:
 *                   type: string
 *                   description: The ID of the employee.
 *                 employee:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                       description: The full name of the employee.
 *                     email:
 *                       type: string
 *                       description: The employee's email address.
 *                 attendanceDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The attendance date.
 *                       status:
 *                         type: string
 *                         description: Attendance status (e.g., present, absent).
 *                       checkIn:
 *                         type: string
 *                         format: time
 *                         description: Check-in time (if present).
 *                       checkOut:
 *                         type: string
 *                         format: time
 *                         description: Check-out time (if present).
 *                       lateArrival:
 *                         type: boolean
 *                         description: Whether the employee arrived late.
 *                       earlyDeparture:
 *                         type: boolean
 *                         description: Whether the employee left early.
 *                       shiftType:
 *                         type: string
 *                         description: The type of shift (e.g., morning, evening).
 *                       missedCheckIn:
 *                         type: boolean
 *                         description: Whether the employee missed check-in.
 *                       missedCheckOut:
 *                         type: boolean
 *                         description: Whether the employee missed check-out.
 *                       workHours:
 *                         type: number
 *                         description: Total work hours for the day.
 *                       overtimeHours:
 *                         type: number
 *                         description: Total overtime hours for the day.
 *                       undertimeHours:
 *                         type: number
 *                         description: Total undertime hours for the day.
 *       400:
 *         description: Bad request - Invalid parameters or query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Description of the validation error.
 *       404:
 *         description: Employee not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the employee was not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the server issue.
 */






class AttendanceRoute extends BaseRoute {
  public path = '/attendance';

  constructor() {
    super();
  }

  // Initialize the routes for attendance
  protected initializeRoutes(): void {
    this.router.post(`/mark`,auth(),validate(createAttendanceSchema), attendanceController.markAttendance); // POST /attendance/mark
    this.router.get(`/report`,auth('manageUsers','createAccount','updateProfile'),validate(attendanceQuerySchema), attendanceController.generateAttendanceReport); // GET /attendance/report
    this.router.get(`/summary/:employee_id/:filter`,auth('manageUsers'),validateAttendanceRequest, attendanceController.getAttendanceSummary); // GET /attendance/summary/:employee_id/:filter
    this.router.get(`/employee/:employee_id/:filter`,auth('manageUsers'),validateAttendanceRequest, attendanceController.getAttendanceForEmployee); // GET /attendance/employee/:employee_id/:filter
  }
}

export default AttendanceRoute;




/**
 * @swagger
 * components:
 *   schemas:
 *     MarkAttendanceRequest:
 *       type: object
 *       required:
 *         - check_in
 *       properties:
 *         check_in:
 *           type: string
 *           format: date-time
 *           description: The check-in time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
 *         check_out:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The check-out time in ISO 8601 format (optional, can be null or undefined)
 *       example:
 *         check_in: "2023-10-01T09:00:00.000Z"
 *         check_out: "2023-10-01T18:00:00.000Z"
 *     
 *     MarkAttendanceResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         attendance:
 *           type: object
 *           properties:
 *             employee_id:
 *               type: string
 *               description: Employee ID
 *             attendance_date:
 *               type: string
 *               format: date
 *               description: Date of attendance
 *             check_in:
 *               type: string
 *               format: date-time
 *               description: Check-in time
 *             check_out:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               description: Check-out time (nullable)
 *             work_hours:
 *               type: number
 *               description: Total work hours calculated between check-in and check-out
 *             overtime_hours:
 *               type: number
 *               description: Overtime hours, if applicable
 *             undertime_hours:
 *               type: number
 *               description: Undertime hours, if applicable
 *             shift_type:
 *               type: string
 *               description: Type of shift (e.g., morning, evening)
 *             missed_check_out:
 *               type: boolean
 *               description: Whether check-out was missed
 *             late_arrival:
 *               type: boolean
 *               description: Whether the employee arrived late
 *             early_departure:
 *               type: boolean
 *               description: Whether the employee left early
 *       example:
 *         message: "Attendance marked successfully"
 *         attendance:
 *           employee_id: "60a6c5f8e8256b7a6d435451"
 *           attendance_date: "2023-10-01"
 *           check_in: "2023-10-01T09:00:00.000Z"
 *           check_out: "2023-10-01T18:00:00.000Z"
 *           work_hours: 8
 *           overtime_hours: 2
 *           undertime_hours: 0
 *           shift_type: "morning"
 *           missed_check_out: false
 *           late_arrival: false
 *           early_departure: false
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *       example:
 *         message: "Check-out time must be after check-in time."
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     AttendanceReport:
 *       type: object
 *       properties:
 *         reportMeta:
 *           type: object
 *           properties:
 *             reportType:
 *               type: string
 *             generatedAt:
 *               type: string
 *               format: date-time
 *             filterCriteria:
 *               type: object
 *               properties:
 *                 dateRange:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                 employeeIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                 shiftType:
 *                   type: string
 *                 lateArrival:
 *                   type: boolean
 *                 earlyDeparture:
 *                   type: boolean
 *                 department:
 *                   type: string
 *                 showAbsentDays:
 *                   type: boolean
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 prevPage:
 *                   type: integer
 *                 nextPage:
 *                   type: integer
 *                 pagingCounter:
 *                   type: integer
 *             sorting:
 *               type: object
 *               properties:
 *                 sortBy:
 *                   type: string
 *                 sortDirection:
 *                   type: string
 *           required:
 *             - reportType
 *             - generatedAt
 *             - filterCriteria
 *             - pagination
 *             - sorting
 *         attendanceSummary:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [present, absent]
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *               lateArrival:
 *                 type: boolean
 *               earlyDeparture:
 *                 type: boolean
 *               shiftType:
 *                 type: string
 *               missedCheckIn:
 *                 type: boolean
 *               missedCheckOut:
 *                 type: boolean
 *               workHours:
 *                 type: number
 *                 format: float
 *               overtimeHours:
 *                 type: number
 *                 format: float
 *               undertimeHours:
 *                 type: number
 *                 format: float
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *         error:
 *           type: string
 *
 */ 
