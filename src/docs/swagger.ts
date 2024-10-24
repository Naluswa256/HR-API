
import swaggerJsDoc, { OAS3Options } from 'swagger-jsdoc';

export const swaggerOptions: OAS3Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express API',
      version: '1.0.0',
      description: 'API documentation with JWT authentication',
    },
    servers: [
      {
        url: 'http://localhost:3000/v1/api',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Attendance: {
          type: 'object',
          properties: {
            employee_id: {
              type: 'string',
              description: 'The ID of the employee.',
              example: 'Emp1a2b3c4',
            },
            attendance_date: {
              type: 'string',
              format: 'date',
              description: 'The date of attendance.',
              example: '2024-10-01',
            },
            check_in: {
              type: 'string',
              format: 'date-time',
              description: 'The time the employee checked in.',
              example: '2024-10-01T09:00:00Z',
            },
            check_out: {
              type: 'string',
              format: 'date-time',
              description: 'The time the employee checked out.',
              example: '2024-10-01T17:00:00Z',
            },
            late_arrival: {
              type: 'boolean',
              description: 'Indicates if the employee arrived late.',
              example: false,
            },
            early_departure: {
              type: 'boolean',
              description: 'Indicates if the employee left early.',
              example: false,
            },
            shift_type: {
              type: 'string',
              description: 'The type of shift (e.g., morning, evening).',
              example: 'morning',
            },
            missed_check_in: {
              type: 'boolean',
              description: 'Indicates if the employee missed the check-in.',
              example: false,
            },
            missed_check_out: {
              type: 'boolean',
              description: 'Indicates if the employee missed the check-out.',
              example: false,
            },
            work_hours: {
              type: 'number',
              description: 'The total work hours for the day.',
              example: 8,
            },
            overtime_hours: {
              type: 'number',
              description: 'The total overtime hours worked.',
              example: 2,
            },
            undertime_hours: {
              type: 'number',
              description: 'The total undertime hours recorded.',
              example: 0,
            },
          },
          required: ['employee_id', 'attendance_date', 'shift_type'],
        },
        Employee: {
          type: 'object',
          properties: {
            employeeId: {
              type: 'string',
              description: 'Unique identifier for the employee'
            },
            personalDetails: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string',
                  description: 'Full name of the employee'
                },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  description: 'Date of birth of the employee'
                },
                gender: {
                  type: 'string',
                  description: 'Gender of the employee'
                },
                maritalStatus: {
                  type: 'string',
                  description: 'Marital status of the employee'
                },
                nationality: {
                  type: 'string',
                  description: 'Nationality of the employee'
                },
                contactInformation: {
                  type: 'object',
                  properties: {
                    phoneNumber: {
                      type: 'string',
                      description: 'Phone number of the employee'
                    },
                    email: {
                      type: 'string',
                      description: 'Email address of the employee'
                    },
                    address: {
                      type: 'object',
                      properties: {
                        currentAddress: {
                          type: 'string',
                          description: 'Current address of the employee'
                        },
                        permanentAddress: {
                          type: 'string',
                          description: 'Permanent address of the employee'
                        }
                      }
                    }
                  }
                }
              }
            },
            employmentDetails: {
              type: 'object',
              properties: {
                department: {
                  type: 'string',
                  description: 'Department of the employee'
                },
                jobTitle: {
                  type: 'string',
                  description: 'Job title of the employee'
                },
                dateOfHire: {
                  type: 'string',
                  format: 'date',
                  description: 'Date of hire'
                },
                employmentType: {
                  type: 'string',
                  description: 'Type of employment (e.g., full-time, part-time)'
                },
                supervisorId: {
                  type: 'string',
                  description: 'ID of the employee\'s supervisor'
                },
                employeeStatus: {
                  type: 'string',
                  description: 'Status of the employee (e.g., active, terminated)'
                },
                employeeRole: {
                  type: 'string',
                  description: 'Role of the employee'
                },
                workLocation: {
                  type: 'string',
                  description: 'Work location of the employee'
                },
                contractType: {
                  type: 'string',
                  description: 'Type of contract (e.g., permanent, temporary)'
                },
                shift: {
                  type: 'string',
                  description: 'Reference to shift document'
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  description: 'End date of employment, if applicable'
                }
              }
            },
            compensationAndBenefits: {
              type: 'object',
              properties: {
                salary: {
                  type: 'object',
                  properties: {
                    baseSalary: {
                      type: 'number',
                      description: 'Base salary of the employee'
                    },
                    currency: {
                      type: 'string',
                      description: 'Currency of the salary'
                    }
                  }
                },
                payFrequency: {
                  type: 'string',
                  description: 'Frequency of salary payment'
                },
                bankAccountDetails: {
                  type: 'object',
                  properties: {
                    bankName: {
                      type: 'string',
                      description: 'Name of the bank'
                    },
                    accountNumber: {
                      type: 'string',
                      description: 'Bank account number'
                    },
                    routingNumber: {
                      type: 'string',
                      description: 'Routing number for the bank account'
                    }
                  }
                },
                taxInformation: {
                  type: 'object',
                  properties: {
                    taxId: {
                      type: 'string',
                      description: 'Tax ID of the employee'
                    },
                    nationalInsurance: {
                      type: 'string',
                      description: 'National insurance number'
                    }
                  }
                },
                healthInsurance: {
                  type: 'object',
                  properties: {
                    provider: {
                      type: 'string',
                      description: 'Health insurance provider'
                    },
                    policyNumber: {
                      type: 'string',
                      description: 'Policy number for health insurance'
                    }
                  }
                },
                pensionContributions: {
                  type: 'object',
                  properties: {
                    contributionPercentage: {
                      type: 'number',
                      description: 'Percentage of salary contributed to pension'
                    },
                    employerContribution: {
                      type: 'number',
                      description: 'Contribution made by the employer to the pension'
                    }
                  }
                },
                bonusStructure: {
                  type: 'string',
                  description: 'Bonus structure details, if any'
                }
              }
            },
            attendanceAndLeave: {
              type: 'object',
              properties: {
                annualLeaveQuota: {
                  type: 'number',
                  description: 'Annual leave quota'
                },
                sickLeaveTaken: {
                  type: 'number',
                  description: 'Sick leave taken'
                },
                leaveStatus: {
                  type: 'string',
                  description: 'Current leave status of the employee'
                },
                leaveBalance: {
                  type: 'object',
                  properties: {
                    annualLeaveBalance: {
                      type: 'number',
                      description: 'Remaining annual leave balance'
                    },
                    sickLeaveBalance: {
                      type: 'number',
                      description: 'Remaining sick leave balance'
                    },
                    maternityLeave: {
                      type: 'number',
                      description: 'Maternity leave balance, if applicable'
                    },
                    paternityLeave: {
                      type: 'number',
                      description: 'Paternity leave balance, if applicable'
                    }
                  }
                }
              }
            },
            performanceAndEvaluations: {
              type: 'object',
              properties: {
                performanceReviews: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      reviewDate: {
                        type: 'string',
                        format: 'date',
                        description: 'Date of the performance review'
                      },
                      reviewScore: {
                        type: 'number',
                        description: 'Score received in the review'
                      },
                      comments: {
                        type: 'string',
                        description: 'Comments from the reviewer'
                      }
                    }
                  }
                },
                disciplinaryActions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      actionDate: {
                        type: 'string',
                        format: 'date',
                        description: 'Date of the disciplinary action'
                      },
                      reason: {
                        type: 'string',
                        description: 'Reason for the disciplinary action'
                      },
                      notes: {
                        type: 'string',
                        description: 'Additional notes regarding the action'
                      }
                    }
                  }
                },
                promotions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      promotionDate: {
                        type: 'string',
                        format: 'date',
                        description: 'Date of the promotion'
                      },
                      newTitle: {
                        type: 'string',
                        description: 'New job title after the promotion'
                      },
                      newSalary: {
                        type: 'number',
                        description: 'New salary after the promotion'
                      }
                    }
                  }
                },
                terminationReason: {
                  type: 'string',
                  description: 'Reason for termination, if applicable'
                }
              }
            },
            documentsAndCompliance: {
              type: 'object',
              properties: {
                contract: {
                  type: 'object',
                  properties: {
                    contractDocument: {
                      type: 'string',
                      description: 'Document related to the employee\'s contract'
                    },
                    startDate: {
                      type: 'string',
                      format: 'date',
                      description: 'Start date of the contract'
                    },
                    endDate: {
                      type: 'string',
                      format: 'date',
                      description: 'End date of the contract'
                    }
                  }
                },
                idProof: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      description: 'Type of ID proof (e.g., passport, driver\'s license)'
                    },
                    documentNumber: {
                      type: 'string',
                      description: 'Document number of the ID proof'
                    },
                    documentScan: {
                      type: 'string',
                      description: 'Scan of the ID proof document'
                    }
                  }
                },
                taxDocuments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      year: {
                        type: 'string',
                        description: 'Year for the tax document'
                      },
                      document: {
                        type: 'string',
                        description: 'Document related to taxes'
                      }
                    }
                  }
                },
                employeeAgreements: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      agreementType: {
                        type: 'string',
                        description: 'Type of agreement (e.g., NDA, non-compete)'
                      },
                      agreementDocument: {
                        type: 'string',
                        description: 'Document related to the agreement'
                      }
                    }
                  }
                }
              }
            },
            systemAndAccessInfo: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  description: "Role of the employee in the system"
                },
                lastLogin: {
                  type: "string",
                  format: "date-time",
                  description: "Last login date of the employee"
                },
                failedAttempts: {
                  type: "number",
                  description: "Number of failed login attempts"
                },
                accountLocked: {
                  type: "boolean",
                  description: "Indicates if the account is locked"
                },
                passwordHash: {
                  type: "string",
                  description: "Hashed password of the employee"
                },
                email: {
                  type: "string",
                  description: "Email address of the employee"
                }
              }
            }
          }
        },
        Department: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the department.",
              example: "Human Resources"
            },
            description: {
              type: "string",
              description: "A brief description of the department.",
              example: "Responsible for employee relations and benefits."
            },
            location: {
              type: "string",
              description: "The physical location of the department.",
              example: "Building A, 2nd Floor"
            },
            employees: {
              type: "array",
              items: {
                type: "string"
              },
              description: "An array of employee IDs associated with the department.",
              example: ["Emp1a2b3c4", "Emp5e6f7g8"]
            },
            parentDepartment: {
              type: "string",
              description: "The ID of the parent department, if applicable.",
              example: "DEP-1234ABCD"
            },
            departmentHead: {
              type: "string",
              description: "The ID of the employee who heads the department.",
              example: "Emp7h8i9j0"
            },
            budget: {
              type: "number",
              description: "The financial budget allocated to the department.",
              example: 500000
            },
            contactEmail: {
              type: "string",
              format: "email",
              description: "The email address for contacting the department.",
              example: "hr@example.com"
            },
            contactPhone: {
              type: "string",
              description: "The phone number for contacting the department.",
              example: "+1234567890"
            },
            numEmployees: {
              type: "number",
              description: "The number of employees in the department.",
              example: 10
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              description: "The status of the department.",
              example: "active"
            },
            establishedDate: {
              type: "string",
              format: "date",
              description: "The date when the department was created.",
              example: "2020-01-01"
            },
            departmentCode: {
              type: "string",
              description: "A unique code for the department.",
              example: "DEP-1234ABCD"
            }
          },
          required: ['name', 'departmentHead', 'departmentCode']
        },
        Leave: {
          type: "object",
          properties: {
            leave_id: {
              type: "string",
              description: "The unique ID for the leave request.",
              example: "LEAVE-123456"
            },
            employee_id: {
              type: "string",
              description: "The ID of the employee requesting leave.",
              example: "Emp1a2b3c4"
            },
            leave_type: {
              type: "string",
              enum: [
                "annual",
                "sick",
                "maternity",
                "paternity",
                "other"
              ],
              description: "The type of leave being requested.",
              example: "sick"
            },
            start_date: {
              type: "string",
              format: "date",
              description: "The start date of the leave.",
              example: "2024-10-01"
            },
            end_date: {
              type: "string",
              format: "date",
              description: "The end date of the leave.",
              example: "2024-10-05"
            },
            leave_days: {
              type: "number",
              description: "The number of leave days requested.",
              example: 5
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "approved",
                "rejected"
              ],
              description: "The current status of the leave request.",
              example: "pending"
            },
            approver_id: {
              type: "string",
              nullable: true,
              description: "The ID of the person approving the leave, if applicable.",
              example: "Emp1a2b3c5"
            },
            reason: {
              type: "string",
              description: "The reason for the leave request.",
              example: "Medical appointment"
            },
            submitted_at: {
              type: "string",
              format: "date-time",
              description: "The date and time when the leave request was submitted.",
              example: "2024-09-25T10:30:00Z"
            },
            approval_date: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "The date and time when the leave was approved, if applicable.",
              example: "2024-09-26T09:00:00Z"
            },
            rejection_reason: {
              type: "string",
              nullable: true,
              description: "The reason for rejection, if applicable.",
              example: "Insufficient leave balance"
            }
          },
          "required": [
            "leave_id",
            "employee_id",
            "leave_type",
            "start_date",
            "end_date",
            "leave_days",
            "status",
            "reason",
            "submitted_at"
          ]
        },
        Overtime: {
          type: "object",
          properties: {
            overtime_id: {
              type: "string",
              description: "The unique ID for the overtime request.",
              example: "OVERTIME-123456"
            },
            employee_id: {
              type: "string",
              description: "The ID of the employee requesting overtime.",
              example: "Emp1a2b3c4"
            },
            overtime_date: {
              type: "string",
              format: "date",
              description: "The date of the overtime worked.",
              example: "2024-10-20"
            },
            regular_overtime_hours: {
              type: "number",
              description: "The number of regular overtime hours worked.",
              example: 3
            },
            weekend_overtime_hours: {
              type: "number",
              description: "The number of overtime hours worked on weekends.",
              example: 2
            },
            holiday_overtime_hours: {
              type: "number",
              description: "The number of overtime hours worked on holidays.",
              example: 4
            },
            compensatory_leave_earned: {
              type: "number",
              nullable: true,
              description: "The number of compensatory leave days earned.",
              example: 1
            },
            overtime_reason: {
              type: "string",
              description: "The reason for the overtime request.",
              example: "Project deadline"
            },
            approved: {
              type: "boolean",
              description: "Indicates whether the overtime request has been approved.",
              example: false
            },
            approver_id: {
              type: "string",
              description: "The ID of the person approving the overtime request.",
              example: "Emp1a2b3c5"
            },
            rejection_reason: {
              type: "string",
              nullable: true,
              description: "The reason for rejection, if applicable.",
              example: "Not enough project budget"
            }
          },
          "required": [
            "overtime_id",
            "employee_id",
            "overtime_date",
            "regular_overtime_hours",
            "weekend_overtime_hours",
            "holiday_overtime_hours",
            "overtime_reason"
          ]
        },
        Shift: {
          type: "object",
          properties: {
            shift_name: {
              type: "string",
              description: "The name of the shift.",
              example: "Morning Shift"
            },
            shift_start: {
              type: "string",
              format: "date-time",
              description: "The starting time of the shift.",
              example: "2024-10-20T09:00:00Z"
            },
            shift_end: {
              type: "string",
              format: "date-time",
              description: "The ending time of the shift.",
              example: "2024-10-20T17:00:00Z"
            },
            max_work_hours: {
              type: "number",
              description: "The maximum number of work hours allowed for this shift.",
              example: 8
            },
            allowed_overtime: {
              type: "boolean",
              description: "Indicates if overtime is allowed for this shift.",
              example: true
            },
            time_zone: {
              type: "string",
              description: "The time zone in which the shift operates.",
              example: "UTC"
            },
            shift_duration: {
              type: "number",
              nullable: true,
              description: "The total duration of the shift in hours (calculated automatically).",
              example: 8
            },
            break_start: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "The starting time of the break.",
              example: "2024-10-20T12:00:00Z"
            },
            break_end: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "The ending time of the break.",
              example: "2024-10-20T12:30:00Z"
            },
            break_duration: {
              type: "number",
              nullable: true,
              description: "The duration of the break in minutes.",
              example: 30
            },
            shift_pattern: {
              type: "string",
              nullable: true,
              description: "The pattern of the shift (e.g., 'Weekly', 'Bi-Weekly').",
              example: "Weekly"
            }
          },
          "required": [
            "shift_name",
            "shift_start",
            "shift_end",
            "max_work_hours",
            "allowed_overtime",
            "time_zone"
          ]
        },
        Token: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "The token string used for authentication.",
              example: "abcd1234efgh5678"
            },
            userId: {
              type: "string",
              description: "The ID of the user associated with the token.",
              example: "60d21b4667d0d8992e610c85"
            },
            type: {
              type: "string",
              enum: [
                "access",
                "refresh",
                "reset"
              ],
              description: "The type of token.",
              example: "access"
            },
            expires: {
              type: "string",
              format: "date-time",
              description: "The expiration date and time of the token.",
              example: "2024-12-31T23:59:59.000Z"
            },
            blacklisted: {
              type: "boolean",
              description: "Indicates whether the token has been blacklisted.",
              default: false,
              example: false
            }
          },
          "required": [
            "token",
            "userId",
            "type",
            "expires"
          ]
        },
        DepartmentInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the department',
              example: 'Human Resources',
            },
            description: {
              type: 'string',
              description: 'A brief description of the department',
              example: 'Responsible for managing employee relations and benefits.',
              nullable: true,
            },
            location: {
              type: 'string',
              description: 'The location of the department',
              example: 'Building A, 2nd Floor',
              nullable: true,
            },
            departmentHead: {
              type: 'string',
              description: 'The Employee ID of the department head',
              example: 'Emp1234567',
            },
            budget: {
              type: 'number',
              description: 'The budget allocated to the department',
              example: 100000,
              nullable: true,
            },
            contactEmail: {
              type: 'string',
              description: 'The contact email for the department',
              example: 'hr@example.com',
              nullable: true,
            },
            contactPhone: {
              type: 'string',
              description: 'The contact phone number for the department',
              example: '+123456789',
              nullable: true,
            },
            establishedDate: {
              type: 'string',
              format: 'date',
              description: 'The date the department was established',
              example: '2020-01-01',
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'The status of the department',
              example: 'active',
              nullable: true,
            },
            parentDepartment: {
              type: 'string',
              description: 'The code of the parent department (if any)',
              example: 'DEP-001',
              nullable: true,
            },
          },
          required: ['name', 'departmentHead'],
        },
        UpdateShift:{
          type: "object",
          properties: {
            shift_name: {
              type: "string",
              description: "Name of the shift",
              example: "Morning Shift"
            },
            shift_start: {
              type: "string",
              format: "date-time",
              description: "Start time of the shift",
              example: "2024-10-23T08:00:00Z"
            },
            shift_end: {
              type: "string",
              format: "date-time",
              description: "End time of the shift",
              example: "2024-10-23T16:00:00Z"
            },
            max_work_hours: {
              type: "number",
              description: "Maximum number of work hours in the shift",
              example: 8
            },
            allowed_overtime: {
              type: "boolean",
              description: "Whether overtime is allowed during this shift",
              example: true
            },
            time_zone: {
              type: "string",
              description: "Time zone of the shift",
              example: "America/New_York"
            },
            break_start: {
              type: "string",
              format: "date-time",
              description: "Start time of the break",
              example: "2024-10-23T12:00:00Z"
            },
            break_end: {
              type: "string",
              format: "date-time",
              description: "End time of the break",
              example: "2024-10-23T12:30:00Z"
            },
            break_duration: {
              type: "number",
              description: "Duration of the break in minutes",
              example: 30
            },
            shift_pattern: {
              type: "string",
              description: "Pattern of the shift (e.g., Weekly, Monthly)",
              example: "Weekly"
            }
          },
          required: []
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Unauthorized, token missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: { type: 'integer', example: 401 },
                  message: { type: 'string', example: 'Unauthorized access - No token provided or invalid token' },
                  error: { type: 'string', example: 'Unauthorized' },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Forbidden, user lacks necessary permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: { type: 'integer', example: 403 },
                  message: { type: 'string', example: 'You do not have permission to access this resource' },
                  error: { type: 'string', example: 'Forbidden' },
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts',], // Your routes configuration
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);