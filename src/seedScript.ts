import mongoose from 'mongoose';
import { Employee } from '@/models/users.model';
import { generateUniqueEmployeeId } from '@/utils/util';
import { MONGODB_URI } from '@/config';

const seedEmployees = async () => {
  const employees = [
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'John Doe',
        gender: 'male',
        nationality: 'American',
        contactInformation: {
          phoneNumber: '1234567890',
          email: 'johndoe@example.com',
        },
        dateOfBirth: new Date('1990-01-01'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        dateOfHire: new Date('2023-03-01'), // Changed to Date object
        employeeRole: 'developer',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 80000,
        },
      },
      systemAndAccessInfo: {
        email: 'johndoe@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Jane Smith',
        gender: 'female',
        nationality: 'Canadian',
        contactInformation: {
          phoneNumber: '0987654321',
          email: 'janesmith@example.com',
        },
        dateOfBirth: new Date('1985-06-15'), // Changed to Date object
      },
      employmentDetails: {
        department: 'HR',
        jobTitle: 'HR Manager',
        dateOfHire: new Date('2021-09-10'), // Changed to Date object
        employeeRole: 'manager',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 95000,
        },
      },
      systemAndAccessInfo: {
        email: 'janesmith@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Alice Johnson',
        gender: 'female',
        nationality: 'British',
        contactInformation: {
          phoneNumber: '1112223333',
          email: 'alicejohnson@example.com',
        },
        dateOfBirth: new Date('1992-02-25'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Marketing',
        jobTitle: 'Marketing Specialist',
        dateOfHire: new Date('2022-07-18'), // Changed to Date object
        employeeRole: 'specialist',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 70000,
        },
      },
      systemAndAccessInfo: {
        email: 'alicejohnson@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Bob Williams',
        gender: 'male',
        nationality: 'Australian',
        contactInformation: {
          phoneNumber: '4445556666',
          email: 'bobwilliams@example.com',
        },
        dateOfBirth: new Date('1988-04-12'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Finance',
        jobTitle: 'Accountant',
        dateOfHire: new Date('2020-11-05'), // Changed to Date object
        employeeRole: 'accountant',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 85000,
        },
      },
      systemAndAccessInfo: {
        email: 'bobwilliams@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Charlie Evans',
        gender: 'male',
        nationality: 'New Zealander',
        contactInformation: {
          phoneNumber: '7778889999',
          email: 'charlieevans@example.com',
        },
        dateOfBirth: new Date('1985-09-30'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Operations',
        jobTitle: 'Operations Manager',
        dateOfHire: new Date('2019-05-15'), // Changed to Date object
        employeeRole: 'manager',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 100000,
        },
      },
      systemAndAccessInfo: {
        email: 'charlieevans@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Diana Lee',
        gender: 'female',
        nationality: 'South Korean',
        contactInformation: {
          phoneNumber: '1231231234',
          email: 'dianalee@example.com',
        },
        dateOfBirth: new Date('1995-10-20'), // Changed to Date object
      },
      employmentDetails: {
        department: 'IT',
        jobTitle: 'Network Engineer',
        dateOfHire: new Date('2023-01-15'), // Changed to Date object
        employeeRole: 'engineer',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 90000,
        },
      },
      systemAndAccessInfo: {
        email: 'dianalee@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Edward Brown',
        gender: 'male',
        nationality: 'Irish',
        contactInformation: {
          phoneNumber: '4325432543',
          email: 'edwardbrown@example.com',
        },
        dateOfBirth: new Date('1978-03-08'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Logistics',
        jobTitle: 'Logistics Coordinator',
        dateOfHire: new Date('2021-07-01'), // Changed to Date object
        employeeRole: 'coordinator',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 72000,
        },
      },
      systemAndAccessInfo: {
        email: 'edwardbrown@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Fiona White',
        gender: 'female',
        nationality: 'Dutch',
        contactInformation: {
          phoneNumber: '9876543210',
          email: 'fionawhite@example.com',
        },
        dateOfBirth: new Date('1993-11-22'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Design',
        jobTitle: 'UI/UX Designer',
        dateOfHire: new Date('2022-10-05'), // Changed to Date object
        employeeRole: 'designer',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 75000,
        },
      },
      systemAndAccessInfo: {
        email: 'fionawhite@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'George Harris',
        gender: 'male',
        nationality: 'British',
        contactInformation: {
          phoneNumber: '1010101010',
          email: 'georgeharris@example.com',
        },
        dateOfBirth: new Date('1983-05-19'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Product',
        jobTitle: 'Product Manager',
        dateOfHire: new Date('2020-12-20'), // Changed to Date object
        employeeRole: 'manager',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 98000,
        },
      },
      systemAndAccessInfo: {
        email: 'georgeharris@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
    {
      employeeId: generateUniqueEmployeeId(),
      personalDetails: {
        fullName: 'Hannah Martinez',
        gender: 'female',
        nationality: 'Mexican',
        contactInformation: {
          phoneNumber: '2020202020',
          email: 'hannahmartinez@example.com',
        },
        dateOfBirth: new Date('1990-07-15'), // Changed to Date object
      },
      employmentDetails: {
        department: 'Sales',
        jobTitle: 'Sales Representative',
        dateOfHire: new Date('2023-02-01'), // Changed to Date object
        employeeRole: 'representative',
        contractType: 'full-time',
        employeeStatus: 'active',
      },
      compensationAndBenefits: {
        salary: {
          baseSalary: 68000,
        },
      },
      systemAndAccessInfo: {
        email: 'hannahmartinez@example.com',
        passwordHash: 'hashed_password',
        role: 'employee',
        accountLocked: false,
      },
    },
  ];

  await Employee.insertMany(employees);
  console.log('Employees seeded successfully');
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Database connected');
    return seedEmployees();
  })
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error('Database connection error:', error);
  });
