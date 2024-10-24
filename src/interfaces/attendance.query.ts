interface AttendanceQuery {
    from: string;
    to: string;
    employee_id?: string;
    shift_type?: string;
    late_arrival?: boolean;
    early_departure?: boolean;
    overtime?: boolean;
    department?: string;
    page?: number;
    pageSize?: number;
    showAbsentDays?:boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }


interface AttendanceReportMeta {
    reportType: string;
    generatedAt: string;
    filterCriteria: {
      dateRange: {
        startDate: string | null;
        endDate: string | null;
      };
      employeeIds: string[];
      shiftType: string | null;
      lateArrival: boolean | null;
      earlyDeparture: boolean | null;
      department: string | null;
      showAbsentDays: boolean | null;
    };
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
        pagingCounter: number; 
    };
    sorting: {
      sortBy: string;
      sortDirection: 'asc' | 'desc';
    };
    exportOptions: {
      availableFormats: string[];
    };
  }



  interface AttendanceDay {
    date: string;
    status: 'present' | 'absent';
    check_in?: string;
    check_out?: string;
    late_arrival?: boolean;
    early_departure?: boolean;
    shift_type?: string;
    missed_check_in?: boolean;
    missed_check_out?: boolean;
    work_hours?: number;
    overtime_hours?: number;
    undertime_hours?: number;
  }
  
  interface EmployeeDetails {
    employee_id: string;
    full_name: string;
    email: string;
    attendance: AttendanceDay[];
    totalPresentDays: number;
    totalAbsentDays: number;
    averageAttendance: string;
  }
  
  interface AttendanceReport {
    reportMeta: AttendanceReportMeta;
    attendanceSummary: AttendanceDay[];
    employee?: EmployeeDetails;
  }