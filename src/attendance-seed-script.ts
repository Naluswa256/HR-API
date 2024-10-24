// utils/dateUtils.ts

import { AttendanceModel } from "./models/attendance.model";
import { Shift } from "./models/shift.model";
import { Employee } from "./models/users.model";

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A random integer between min and max
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns a random date within the current year
 * @returns A random date in the current year
 */
export const getRandomDateThisYear = (): Date => {
  const startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the year
  const endDate = new Date(new Date().getFullYear(), 11, 31); // End of the year
  return new Date(getRandomInt(startDate.getTime(), endDate.getTime()));
};

/**
 * Seed attendance records with random dates in the current year.
 */
export const seedAttendance = async () => {
  try {
    const employees = await Employee.find();
    const shifts = await Shift.find();
    
    const attendanceRecords = [];

    for (const employee of employees) {
      const employeeId = employee.employeeId;

      // Generate random attendance records (e.g., 10 random dates)
      for (let i = 0; i < 20; i++) {
        const randomDate = getRandomDateThisYear(); // Get a random date in the current year
        attendanceRecords.push(generateAttendanceRecord(employeeId, randomDate, shifts));
      }
    }

    await AttendanceModel.insertMany(attendanceRecords);
    console.log('Attendance records seeded:', attendanceRecords.length);

  } catch (error) {
    console.error('Error seeding attendance:', error);
    throw error;
  }
};

/**
 * Generate a single attendance record for an employee.
 * @param employeeId - The employee's ID
 * @param attendanceDate - The date for the attendance
 * @param shifts - The available shifts to choose from
 * @returns A formatted attendance record
 */
const generateAttendanceRecord = (employeeId: string, attendanceDate: Date, shifts: any[]) => {
  const shift = shifts[getRandomInt(0, shifts.length - 1)]; // Pick a random shift

  const checkInTime = new Date(attendanceDate);
  checkInTime.setHours(shift.shift_start.getUTCHours() + getRandomInt(-1, 1), getRandomInt(0, 59));

  const checkOutTime = new Date(attendanceDate);
  checkOutTime.setHours(shift.shift_end.getUTCHours() + getRandomInt(-1, 1), getRandomInt(0, 59));

  const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // Calculate work hours

  return {
    employee_id: employeeId,
    attendance_date: attendanceDate,
    check_in: checkInTime,
    check_out: checkOutTime,
    shift_type: shift.shift_name,
    late_arrival: checkInTime > shift.shift_start,
    early_departure: checkOutTime < shift.shift_end,
    missed_check_in: false, // Customize as needed
    missed_check_out: false, // Customize as needed
    work_hours: workHours,
    overtime_hours: workHours > shift.shift_duration ? workHours - shift.shift_duration : 0,
    undertime_hours: workHours < shift.shift_duration ? shift.shift_duration - workHours : 0,
  };
};
