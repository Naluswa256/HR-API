import mongoose from 'mongoose';
import { Employee } from '@/models/users.model';
import { generateUniqueEmployeeId } from '@/utils/util';
import { MONGODB_URI } from '@/config';
import { Department } from './models/department.model';
import { Shift } from './models/shift.model';
import { departmentService } from './services/department.service';
import { seedAttendance } from './attendance-seed-script';


const getRandomLengthArray = (arr: any[], maxLen: number): string[] => {
  const randomLength = Math.floor(Math.random() * (maxLen + 1)); // Random length between 0 and maxLen
  const randomIndices = new Set<number>();

  while (randomIndices.size < randomLength) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    randomIndices.add(randomIndex);
  }

  return Array.from(randomIndices).map(index => arr[index].employeeId);
};

const seedEmployees = async () => {
  try {
    // Seed Shifts
    const shifts = [
      {
        shift_name: 'Morning Shift',
        shift_start: new Date('2023-10-01T08:00:00Z'),
        shift_end: new Date('2023-10-01T16:00:00Z'),
        max_work_hours: 8,
        allowed_overtime: true,
        time_zone: 'UTC',
        shift_duration: 8,
        break_start: new Date('2023-10-01T12:00:00Z'),
        break_end: new Date('2023-10-01T12:30:00Z'),
        break_duration: 30,
        shift_pattern: 'fixed',
      },
      {
        shift_name: 'Afternoon Shift',
        shift_start: new Date('2023-10-01T16:00:00Z'),
        shift_end: new Date('2023-10-01T00:00:00Z'), 
        max_work_hours: 8,
        allowed_overtime: true,
        time_zone: 'UTC',
        shift_duration: 8,
        break_start: new Date('2023-10-01T20:00:00Z'),
        break_end: new Date('2023-10-01T20:30:00Z'),
        break_duration: 30,
        shift_pattern: 'fixed',
      },
      {
        shift_name: 'Night Shift',
        shift_start: new Date('2023-10-01T00:00:00Z'),
        shift_end: new Date('2023-10-01T08:00:00Z'),
        max_work_hours: 8,
        allowed_overtime: false,
        time_zone: 'UTC',
        shift_duration: 8,
        break_start: null,
        break_end: null,
        break_duration: 0,
        shift_pattern: 'fixed',
      },
    ];

    const shiftDocuments = await Shift.insertMany(shifts);
    console.log('Shifts seeded:', shiftDocuments);

    // Seed Departments
    const departments = [
      {
        name: 'Human Resources',
        description: 'Handles employee-related matters',
        location: 'Building A',
        employees: [],
        parentDepartment: null,
        departmentHead: 'John Doe',
        budget: 100000,
        contactEmail: 'hr@example.com',
        contactPhone: '123-456-7890',
        numEmployees: 0,
        status: 'active',
        establishedDate: new Date('2020-01-01'),
        departmentCode: 'HR01',
      },
      {
        name: 'IT Department',
        description: 'Responsible for IT infrastructure and support',
        location: 'Building B',
        employees: [],
        parentDepartment: null,
        departmentHead: 'Jane Smith',
        budget: 150000,
        contactEmail: 'it@example.com',
        contactPhone: '098-765-4321',
        numEmployees: 0,
        status: 'active',
        establishedDate: new Date('2020-01-01'),
        departmentCode: 'IT01',
      },
      {
        name: 'Finance',
        description: 'Handles financial operations',
        location: 'Building C',
        employees: [],
        parentDepartment: null,
        departmentHead: 'Emily Johnson',
        budget: 200000,
        contactEmail: 'finance@example.com',
        contactPhone: '111-222-3333',
        numEmployees: 0,
        status: 'active',
        establishedDate: new Date('2020-01-01'),
        departmentCode: 'FIN01',
      },
    ];

    const departmentDocuments = await Department.insertMany(departments);
    console.log('Departments seeded:', departmentDocuments);

    // Seed Employees
    const employees = [];
    for (let i = 1; i <= 30; i++) {
      const departmentName = departmentDocuments[i % 3].name; // Use department name

      employees.push({
        employeeId: generateUniqueEmployeeId(), // Use the unique ID generator
        personalDetails: {
          fullName: `Employee ${i}`,
          dateOfBirth: new Date(`1990-01-01`),
          gender: i % 2 === 0 ? 'Female' : 'Male',
          maritalStatus: 'Single',
          nationality: 'Country',
          contactInformation: {
            phoneNumber: `555-010${i}`,
            email: `employee${i}@example.com`,
            address: {
              currentAddress: `Address ${i}`,
              permanentAddress: `Permanent Address ${i}`,
            },
          },
        },
        employmentDetails: {
          department: departmentName, // Use department name instead of _id
          jobTitle: `Job Title ${i}`,
          dateOfHire: new Date(`2022-01-01`),
          employmentType: 'Full-time',
          supervisorId: `EMP${(i % 10) + 1}`, // Random supervisor
          employeeStatus: 'Active',
          employeeRole: 'employee',
          workLocation: 'Remote',
          contractType: 'Permanent',
          shift: shiftDocuments[i % 3]._id, // Assign shift
          endDate: null,
        },
        compensationAndBenefits: {
          salary: {
            baseSalary: 50000 + i * 5000,
            currency: 'USD',
          },
          payFrequency: 'Monthly',
          bankAccountDetails: {
            bankName: 'Bank XYZ',
            accountNumber: '123456789',
            routingNumber: '987654321',
          },
          taxInformation: {
            taxId: 'TAX123456',
            nationalInsurance: 'NI123456',
          },
          healthInsurance: {
            provider: 'HealthCo',
            policyNumber: 'POL123456',
          },
          pensionContributions: {
            contributionPercentage: 5,
            employerContribution: 3,
          },
          bonusStructure: 'Annual',
        },
        attendanceAndLeave: {
          annualLeaveQuota: 20,
          sickLeaveTaken: 2,
          leaveStatus: 'Active',
          leaveBalance: {
            annualLeaveBalance: 18,
            sickLeaveBalance: 5,
            maternityLeave: 0,
            paternityLeave: 0,
          },
        },
        performanceAndEvaluations: {
          performanceReviews: [],
          disciplinaryActions: [],
          promotions: [],
          terminationReason: '',
        },
        documentsAndCompliance: {
          contract: {
            contractDocument: 'contract.pdf',
            startDate: new Date(),
            endDate: null,
          },
          idProof: {
            type: 'Passport',
            documentNumber: `DOC${i}`,
            documentScan: 'id_proof.pdf',
          },
          taxDocuments: [],
          employeeAgreements: [],
          workPermits: {
            permitNumber: `PERMIT${i}`,
            validityStartDate: new Date(),
            validityEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
          visaStatus: 'Active',
        },
        emergencyContact: {
          name: `Emergency Contact ${i}`,
          relationship: 'Friend',
          phoneNumber: `555-019${i}`,
          address: `Emergency Address ${i}`,
        },
        systemAndAccessInfo: {
          role: 'employee',
          lastLogin: null,
          failedAttempts: 0,
          accountLocked: false,
          passwordHash: 'hashedpassword',
          email: `employee${i}@example.com`,
        },
      });
    }

    const employeeDocuments = await Employee.insertMany(employees);
    console.log('Employees seeded:', employeeDocuments);

    // Assign random employees to each department using the service
    for (const department of departmentDocuments) {
      const randomEmployeeIds = getRandomLengthArray(employeeDocuments, 10); // Get random array of employeeIds
      console.log(`Assigning ${randomEmployeeIds.length} employees to department ${department.departmentCode}`);
      await departmentService.assignEmployeesToDepartment(department.departmentCode, randomEmployeeIds);
    }

    console.log('Employees assigned to departments successfully.');
    
  } catch (error) {
    console.error('Error seeding employees:', error);
    throw error;
  }
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Database connected');
    return seedEmployees(); // Seed employees first
  })
  .then(() => {
    console.log('Employees seeded');
    return seedAttendance(); // Seed attendance after employees
  })
  .then(() => {
    console.log('Attendance seeded');
    return mongoose.disconnect(); // Disconnect once both seeding operations are done
  })
  .then(() => {
    console.log('Database disconnected');
  })
  .catch((error) => {
    console.error('Error during seeding process:', error);
    mongoose.disconnect(); // Ensure disconnection even if there's an error
  });
