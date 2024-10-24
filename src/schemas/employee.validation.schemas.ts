import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

// Function to validate ISO Date strings
const isoDateString = z.string().refine((value) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?$/;
  return isoDateRegex.test(value);
}, {
  message: "Invalid ISO date string",
});



// Schema for Address
const AddressSchema = z.object({
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Address. Valid fields: currentAddress, permanentAddress."
});

// Schema for Contact Information
const ContactInformationSchema = z.object({
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  address: AddressSchema.optional(),
}).strict({
  message: "Unrecognized fields in Contact Information. Valid fields: phoneNumber, email, address."
});

// Schema for Personal Details
const PersonalDetailsSchema = z.object({
  fullName: z.string(),
  dateOfBirth: isoDateString.optional(), // ISO Date string
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  contactInformation: ContactInformationSchema.optional(),
}).strict({
  message: "Unrecognized fields in Personal Details. Valid fields: fullName, dateOfBirth, gender, maritalStatus, nationality, contactInformation."
});

// Schema for Employment Details
const EmploymentDetailsSchema = z.object({
  employeeId: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  dateOfHire: isoDateString.optional(),
  employmentType: z.string().optional(),
  supervisorId: z.string().optional(),
  shift: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid shift ID", //
  }),
  employeeStatus: z.string().optional(),
  employeeRole: z.string().optional(),
  workLocation: z.string().optional(),
  contractType: z.string().optional(),
  endDate: isoDateString.optional(), 
}).strict({
  message: "Unrecognized fields in Employment Details. Valid fields: employeeId, department, jobTitle, dateOfHire, employmentType, supervisorId, shift, employeeStatus, employeeRole, workLocation, contractType, endDate."
});

// Schema for Salary
const SalarySchema = z.object({
  baseSalary: z.number().optional(),
  currency: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Salary. Valid fields: baseSalary, currency."
});

// Schema for Bank Account Details
const BankAccountDetailsSchema = z.object({
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Bank Account Details. Valid fields: bankName, accountNumber, routingNumber."
});

// Schema for Tax Information
const TaxInformationSchema = z.object({
  taxId: z.string().optional(),
  nationalInsurance: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Tax Information. Valid fields: taxId, nationalInsurance."
});

// Schema for Health Insurance
const HealthInsuranceSchema = z.object({
  provider: z.string().optional(),
  policyNumber: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Health Insurance. Valid fields: provider, policyNumber."
});

// Schema for Pension Contributions
const PensionContributionsSchema = z.object({
  contributionPercentage: z.number().optional(),
  employerContribution: z.number().optional(),
}).strict({
  message: "Unrecognized fields in Pension Contributions. Valid fields: contributionPercentage, employerContribution."
});

// Schema for Compensation and Benefits
const CompensationAndBenefitsSchema = z.object({
  salary: SalarySchema.optional(),
  payFrequency: z.string().optional(),
  bankAccountDetails: BankAccountDetailsSchema.optional(),
  taxInformation: TaxInformationSchema.optional(),
  healthInsurance: HealthInsuranceSchema.optional(),
  pensionContributions: PensionContributionsSchema.optional(),
  bonusStructure: z.string().optional(), // Added field
}).strict({
  message: "Unrecognized fields in Compensation and Benefits. Valid fields: salary, payFrequency, bankAccountDetails, taxInformation, healthInsurance, pensionContributions, bonusStructure."
});

// Schema for Leave Balance
const LeaveBalanceSchema = z.object({
  annualLeaveBalance: z.number().optional(),
  sickLeaveBalance: z.number().optional(),
  maternityLeave: z.number().optional(),
  paternityLeave: z.number().optional(),
}).strict({
  message: "Unrecognized fields in Leave Balance. Valid fields: annualLeaveBalance, sickLeaveBalance, maternityLeave, paternityLeave."
});

// Schema for Attendance and Leave
const AttendanceAndLeaveSchema = z.object({
  annualLeaveQuota: z.number().optional(),
  sickLeaveTaken: z.number().optional(),
  leaveStatus: z.string().optional(),
  leaveBalance: LeaveBalanceSchema.optional(),
}).strict({
  message: "Unrecognized fields in Promotion. Valid fields: promotionDate, newTitle, newSalary."
});

// Schema for Performance Review
const PerformanceReviewSchema = z.object({
  reviewDate: isoDateString.optional(), // ISO Date string
  reviewScore: z.number().optional(),
  comments: z.string().optional(),
});

// Schema for Disciplinary Action
const DisciplinaryActionSchema = z.object({
  actionDate: isoDateString.optional(), // ISO Date string
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for Promotion
const PromotionSchema = z.object({
  promotionDate: isoDateString.optional(), // ISO Date string
  newTitle: z.string().optional(),
  newSalary: z.number().optional(),
});

// Schema for Performance and Evaluations
const PerformanceAndEvaluationsSchema = z.object({
  performanceReviews: z.array(PerformanceReviewSchema).optional(),
  disciplinaryActions: z.array(DisciplinaryActionSchema).optional(),
  promotions: z.array(PromotionSchema).optional(),
  terminationReason: z.string().optional(),
});

// Schema for Contract
const ContractSchema = z.object({
  contractDocument: z.string().optional(),
  startDate: isoDateString.optional(), // ISO Date string
  endDate: isoDateString.optional(), // ISO Date string
}).strict({
  message: "Unrecognized fields in Contract. Valid fields: contractDocument, startDate, endDate."
});

// Schema for ID Proof
const IdProofSchema = z.object({
  type: z.string().optional(),
  documentNumber: z.string().optional(),
  documentScan: z.string().optional(),
}).strict({
  message: "Unrecognized fields in ID Proof. Valid fields: type, documentNumber, documentScan."
});

// Schema for Tax Documents
const TaxDocumentSchema = z.object({
  year: z.string().optional(),
  document: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Tax Documents. Valid fields: year, document."
});

// Schema for Employee Agreement
const EmployeeAgreementSchema = z.object({
  agreementType: z.string().optional(),
  agreementDocument: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Employee Agreement. Valid fields: agreementType, agreementDocument."
});

// Schema for Work Permit
const WorkPermitSchema = z.object({
  permitNumber: z.string().optional(),
  validityStartDate: isoDateString.optional(), // ISO Date string
  validityEndDate: isoDateString.optional(), // ISO Date string
}).strict({
  message: "Unrecognized fields in Work Permit. Valid fields: permitNumber, validityStartDate, validityEndDate."
});

// Documents and Compliance Schema
const DocumentsAndComplianceSchema = z.object({
  contract: ContractSchema.optional(),
  idProof: IdProofSchema.optional(),
  taxDocuments: z.array(TaxDocumentSchema).optional(),
  employeeAgreements: z.array(EmployeeAgreementSchema).optional(),
  workPermits: WorkPermitSchema.optional(),
  visaStatus: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Documents and Compliance. Valid fields: contract, idProof, taxDocuments, employeeAgreements, workPermits, visaStatus."
});

// Schema for Emergency Contact
const EmergencyContactSchema = z.object({
  name: z.string().optional(),
  relationship: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
}).strict({
  message: "Unrecognized fields in Emergency Contact. Valid fields: name, relationship, phoneNumber, address."
});;

// Schema for System Access Information
const SystemAccessSchema = z.object({
  role: z.string(),
  passwordHash: z.string(),
  email: z.string().email(),
});

// Main Employee Schema
export const CreateEmployeeInputSchema = {
  body: z.object({
    personalDetails: PersonalDetailsSchema.optional(),
    employmentDetails: EmploymentDetailsSchema.optional(),
    compensationAndBenefits: CompensationAndBenefitsSchema.optional(),
    documentsAndCompliance: DocumentsAndComplianceSchema.optional(),
    emergencyContact: EmergencyContactSchema.optional(),
    systemAndAccessInfo: SystemAccessSchema,
  }).strict({
    message: "Unrecognized fields in Employee Schema. Valid fields: personalDetails, employmentDetails, documentsAndCompliance, emergencyContact, systemAccess."
  })
};

export const UpdateEmployeeSchema = {
  body:z.object({
    personalDetails: PersonalDetailsSchema.optional(),
    employmentDetails: EmploymentDetailsSchema.optional(),
    compensationAndBenefits: CompensationAndBenefitsSchema.optional(),
    documentsAndCompliance: DocumentsAndComplianceSchema.optional(),
    emergencyContact: EmergencyContactSchema.optional(),
  }).strict({
    message: "Unrecognized fields in Employee Schema. Valid fields: personalDetails, employmentDetails, documentsAndCompliance, emergencyContact, systemAccess."
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  })
};

// For updating the employee information
export const UpdateEmployeeInputSchema = CreateEmployeeInputSchema.body.partial();

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeInputSchema.body>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeInputSchema>;
