import { AttendanceModel, IAttendanceDocument } from "@/models/attendance.model";
import { Department } from "@/models/department.model";
import { PaginateOptions, QueryResult } from "@/models/plugins/paginate.plugin";
import { IShift, IShiftDocument, Shift } from "@/models/shift.model";
import { Employee } from "@/models/users.model";
import { ApiError } from "@/utils/apiError";
import {
    startOfDay, endOfDay,
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth,
    startOfYear, endOfYear,
    eachDayOfInterval, subDays,
    format
} from 'date-fns';
class AttendanceService {

    async markAttendance(employee_id: string, check_in: Date, check_out?: Date): Promise<IAttendanceDocument | null> {
        const shift = await this.getEmployeeShift(employee_id);
        let attendance = await AttendanceModel.findOne({ employee_id, attendance_date: check_in });

        if (!attendance) {
            attendance = new AttendanceModel({
                employee_id,
                attendance_date: check_in,
                check_in,
                shift_type: shift.shift_name,
            });
        }

        if (check_out) {
            if (check_out <= check_in) {
                throw new ApiError(400, 'Check-out time must be after check-in time.');
            }
            attendance.check_out = check_out;
            attendance.work_hours = this.calculateWorkHours(attendance.check_in!, check_out);
            attendance.overtime_hours = this.calculateOvertime(attendance.work_hours, shift);
            attendance.undertime_hours = this.calculateUndertime(attendance.work_hours, shift);
            attendance.missed_check_out = false;
        }



        if (!attendance.check_out) {
            attendance.missed_check_out = true;
        }

        attendance.late_arrival = this.isLate(check_in, shift);
        attendance.early_departure = this.isEarlyDeparture(check_out || new Date(), shift);

        return attendance.save();
    }
     // Method to check if the user has permission to access the attendance records
     private async checkPermission(hrAdminId: string, employeeId: string) {
        // Fetch the employee and verify if they belong to the HR admin
        const employee = await Employee.findOne({ employeeId }).select('hrAdminId');
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }

        if (employee.employeeId !== hrAdminId) {
            throw new ApiError(403, 'You do not have permission to access this employee\'s attendance records');
        }
    }

    private async checkDepartmentPermission(hrAdminId: string, departmentId: string) {
        const department = await Department.findById(departmentId).select('createdBy');
        if (!department) {
            throw new ApiError(404, 'Department not found');
        }

        if (department.createdBy !== hrAdminId) {
            throw new ApiError(403, 'You do not have permission to access this department\'s attendance records');
        }
    }
    private getDateRange(filter: string, from?: string, to?: string): { startDate: Date, endDate: Date } {
        let startDate: Date, endDate: Date;

        switch (filter) {
            case 'today':
                startDate = startOfDay(new Date());
                endDate = endOfDay(new Date());
                break;
            case 'yesterday':
                startDate = startOfDay(subDays(new Date(), 1));
                endDate = endOfDay(subDays(new Date(), 1));
                break;
            case 'week':
                startDate = startOfWeek(new Date());
                endDate = endOfWeek(new Date());
                break;
            case 'month':
                startDate = startOfMonth(new Date());
                endDate = endOfMonth(new Date());
                break;
            case 'year':
                startDate = startOfYear(new Date());
                endDate = endOfYear(new Date());
                break;
            case 'custom':
                if (!from || !to) {
                    throw new Error('Custom date range requires both "from" and "to" query parameters.');
                }
                startDate = new Date(from);
                endDate = new Date(to);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error('Invalid date format for "from" or "to". Please provide valid dates.');
                }
                break;
            default:
                throw new Error('Invalid filter type. Please use today, yesterday, week, month, year, or custom.');
        }

        return { startDate, endDate };
    }
    async generateAttendanceReport(query: AttendanceQuery, hrAdminId:string): Promise<AttendanceReport> {
        const {
            from,
            to,
            employee_id,
            shift_type,
            late_arrival,
            early_departure,
            overtime,
            department,
            page = 1,
            pageSize = 20,
            showAbsentDays = true,
            sortBy = 'attendance_date',
            sortDirection = 'asc',
        } = query;

        // Date Range Calculation
        const startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0); // Set to start of the day

        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999)
        // Check permission for employee attendance
        if (employee_id) {
            await this.checkPermission(hrAdminId, employee_id);
        }

        // Check permission for department attendance
        if (department) {
            await this.checkDepartmentPermission(hrAdminId, department);
        }

        // Fetch employee details if a single employee is requested
        let employee = null;
        if (employee_id) {
            employee = await Employee.findOne({ employeeId: employee_id }).select('personalDetails.fullName systemAndAccessInfo.email');
            if (!employee) {
                throw new ApiError(404, `Employee with ID ${employee_id} not found`);
            }
        }
        // Prepare attendance filter criteria
        let filterCriteria: any = {
            attendance_date: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        // Match filter criteria keys with schema
        if (employee_id) filterCriteria.employee_id = employee_id;
        if (shift_type) filterCriteria.shift_type = shift_type;
        if (late_arrival !== undefined) filterCriteria.late_arrival = late_arrival;
        if (early_departure !== undefined) filterCriteria.early_departure = early_departure;
        if (overtime !== undefined) filterCriteria.overtime_hours = { $gt: 0 };

        // Fetch department employee IDs directly
        if (department) {
            const departmentData = await Department.findById(department).select('employees');
            if (!departmentData || !departmentData.employees) {
                throw new ApiError(404, 'Department not found or has no employees');
            }
            filterCriteria.employee_id = { $in: departmentData.employees.map((emp: string) => emp) };
        }

        // Paginate attendance records
        const paginatedData = await AttendanceModel.paginate(filterCriteria, {
            page,
            limit: pageSize,
            sortBy: `${sortBy}:${sortDirection}`,
        });

        const attendanceSummary: AttendanceDay[] = eachDayOfInterval({
            start: new Date(from),
            end: new Date(to),
        }).reduce((summary, date) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const attendanceRecord = paginatedData.results.find((att: IAttendanceDocument) => {
                const attendanceFormattedDate = format(new Date(att.attendance_date), 'yyyy-MM-dd');
                return attendanceFormattedDate === formattedDate;
            });
        
            // Skip days if `showAbsentDays` is false and the employee is absent
            if (!attendanceRecord && !showAbsentDays) {
                return summary; // Do not add anything to the summary, move to the next date
            }
        
            // Add attendance data for present days or for all days if `showAbsentDays` is true
            summary.push({
                date: formattedDate,
                status: attendanceRecord ? 'present' : 'absent',
                ...(attendanceRecord ? {
                    checkIn: attendanceRecord.check_in,
                    checkOut: attendanceRecord.check_out,
                    lateArrival: attendanceRecord.late_arrival,
                    earlyDeparture: attendanceRecord.early_departure,
                    shiftType: attendanceRecord.shift_type,
                    missedCheckIn: attendanceRecord.missed_check_in,
                    missedCheckOut: attendanceRecord.missed_check_out,
                    workHours: attendanceRecord.work_hours,
                    overtimeHours: attendanceRecord.overtime_hours,
                    undertimeHours: attendanceRecord.undertime_hours,
                } : {}), // Empty object when absent
            });
        
            return summary;
        }, []);
        
        

        // Build the report structure
        const report: AttendanceReport = {
            reportMeta: {
                reportType: "Attendance Summary",
                generatedAt: new Date().toISOString(),
                filterCriteria: {
                    dateRange: { startDate: from || null, endDate: to || null },
                    employeeIds: department
                        ? (await Department.findById(department).select('employees')).employees.map(emp => emp)
                        : employee_id
                            ? [employee_id]
                            : [],
                    shiftType: shift_type || null,
                    lateArrival: late_arrival !== undefined ? late_arrival : null,
                    earlyDeparture: early_departure !== undefined ? early_departure : null,
                    department: department || null,
                    showAbsentDays: showAbsentDays || null,
                },
                pagination: {
                    page: paginatedData.page,
                    limit: paginatedData.limit,
                    totalPages: paginatedData.totalPages,
                    totalResults: paginatedData.totalResults,
                    hasPrevPage: paginatedData.hasPrevPage,
                    hasNextPage: paginatedData.hasNextPage,
                    prevPage: paginatedData.prevPage,
                    nextPage: paginatedData.nextPage,
                    pagingCounter: paginatedData.pagingCounter
                },
                sorting: {
                    sortBy,
                    sortDirection,
                },
                exportOptions: {
                    availableFormats: [],
                },
            },
            attendanceSummary:attendanceSummary 
        };

        // Calculate attendance summary for a single employee
        if (employee) {
            const totalPresentDays = attendanceSummary.filter((day) => day.status === 'present').length;
            const totalAbsentDays = attendanceSummary.filter((day) => day.status === 'absent').length;
            const averageAttendance = totalPresentDays / (totalPresentDays + totalAbsentDays || 1);
            report.employee = {
                employee_id: employee_id,
                full_name: employee.personalDetails.fullName,
                email: employee.systemAndAccessInfo.email,
                attendance: attendanceSummary,
                totalPresentDays,
                totalAbsentDays,
                averageAttendance: (averageAttendance * 100).toFixed(2) + '%', // Format as percentage
            };

        }

        return report;
    }
    async getAttendanceSummary(employeeId: string, filter: string, hrAdminId:string,from?: string, to?: string) {
        if (employeeId) {
            await this.checkPermission(hrAdminId, employeeId);
        }
        const { startDate, endDate } = this.getDateRange(filter, from, to);
         
        // Fetch employee's full name and email
        const employee = await Employee.findOne({ employeeId }).select('personalDetails.fullName systemAndAccessInfo.email');
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }

        // Fetch attendance records within the date range
        const attendances = await AttendanceModel.find({
            employee_id: employeeId,
            attendance_date: {
                $gte: startDate,
                $lte: endDate,
            }
        });

        // Initialize summary counters
        let presentDays = 0;
        let absentDays = 0;
        let lateArrivals = 0;
        let earlyDepartures = 0;
        let totalOvertimeHours = 0;

        // Process attendance records and count presence/absence
        eachDayOfInterval({ start: startDate, end: endDate }).forEach(date => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const attendanceRecord = attendances.find(att => format(new Date(att.attendance_date), 'yyyy-MM-dd') === formattedDate);

            if (attendanceRecord) {
                presentDays += 1;
                if (attendanceRecord.late_arrival) lateArrivals += 1;
                if (attendanceRecord.early_departure) earlyDepartures += 1;
                if (attendanceRecord.overtime_hours) totalOvertimeHours += attendanceRecord.overtime_hours;
            } else {
                absentDays += 1;
            }
        });

        // Return the attendance summary
        return {
            employee_id: employeeId,
            employee: {
                full_name: employee.personalDetails.fullName,
                email: employee.systemAndAccessInfo.email
            },
            summary: {
                present_days: presentDays,
                absent_days: absentDays,
                late_arrivals: lateArrivals,
                early_departures: earlyDepartures,
                total_overtime_hours: totalOvertimeHours
            }
        };
    }


    // Function 2: Get attendance with presence/absence details for an employee
    async getAttendanceForEmployee(employeeId: string, filter: string, hrAdminId:string, from?: string, to?: string) {
        if (employeeId) {
            await this.checkPermission(hrAdminId, employeeId);
        }
        const { startDate, endDate } = this.getDateRange(filter, from, to);

        // Fetch employee details
        const employee = await Employee.findOne({ employeeId }).select('personalDetails.fullName systemAndAccessInfo.email');
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }

        // Fetch attendance records within the date range
        const attendances = await AttendanceModel.find({
            employee_id: employeeId,
            attendance_date: {
                $gte: startDate,
                $lte: endDate,
            }
        });

        // Generate detailed attendance report
        const attendanceDetails = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const attendanceRecord = attendances.find(att => format(new Date(att.attendance_date), 'yyyy-MM-dd') === formattedDate);

            return {
                date: formattedDate,
                status: attendanceRecord ? 'present' : 'absent',
                ...(attendanceRecord ? {
                    checkIn: attendanceRecord.check_in,
                    checkOut: attendanceRecord.check_out,
                    lateArrival: attendanceRecord.late_arrival,
                    earlyDeparture: attendanceRecord.early_departure,
                    shiftType: attendanceRecord.shift_type,
                    missedCheckIn: attendanceRecord.missed_check_in,
                    missedCheckOut: attendanceRecord.missed_check_out,
                    workHours: attendanceRecord.work_hours,
                    overtimeHours: attendanceRecord.overtime_hours,
                    undertimeHours: attendanceRecord.undertime_hours,
                } : {})
            };
        });

        return {
            employee_id: employeeId,
            employee: {
                full_name: employee.personalDetails.fullName,
                email: employee.systemAndAccessInfo.email,
            },
            attendanceDetails,
        };
    }

    async getAttendanceByDate(hrAdminId: string, targetDate: Date = new Date(), options: PaginateOptions = {}): Promise<QueryResult<IAttendanceDocument>> {
        const startDate = startOfDay(targetDate);
        const endDate = endOfDay(targetDate);
        
        // Fetch employee IDs associated with the HR admin where createdBy matches hrAdminId
        const employees = await Employee.find({ createdBy: hrAdminId }).select('systemAndAccessInfo.createdBy');
        
        if (!employees || employees.length === 0) {
            throw new ApiError(404, 'No employees found for this HR Admin that can be associated with attendances');
        }
    
        // Create the filter to only include attendances for employees managed by the HR admin
        const filter = {
            attendance_date: {
                $gte: startDate,
                $lte: endDate
            },
            employee_id: { $in: employees.map(emp => emp.employeeId) } 
        };
    
        // Fetch paginated attendances
        const paginatedAttendances = await AttendanceModel.paginate(filter, options);
    
        return paginatedAttendances;
    }


    private calculateWorkHours(check_in: Date, check_out: Date): number {
        const diff = Math.abs(check_out.getTime() - check_in.getTime());
        return Math.floor(diff / (1000 * 60 * 60));
    }

    private calculateOvertime(work_hours: number, shift: IShift): number {
        const shiftHours = shift.shift_duration
        return work_hours > shiftHours ? work_hours - shiftHours : 0;
    }

    private calculateUndertime(work_hours: number, shift: IShift): number {
        const shiftHours = shift.shift_duration
        return work_hours < shiftHours ? shiftHours - work_hours : 0;
    }

    private isLate(check_in: Date, shift: IShift): boolean {
        return check_in.getTime() > shift.shift_start.getTime();
    }

    private isEarlyDeparture(check_out: Date, shift: IShift): boolean {
        return check_out.getTime() < shift.shift_end.getTime();
    }

    async getEmployeeShift(employee_id: string): Promise<IShiftDocument> {
        const employee = await Employee.findOne({ employeeId: employee_id }).populate('employmentDetails.shift');

        if (!employee || !employee.employmentDetails.shift) {
            throw new ApiError(401, 'Shift not found for the employee');
        }

        return employee.employmentDetails.shift as IShiftDocument;
    }
}

export const attendanceService = new AttendanceService();
