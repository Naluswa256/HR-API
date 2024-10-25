import { Document, Schema, model, Model, ObjectId } from 'mongoose';
import paginate, { PaginateModel } from './plugins/paginate.plugin';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { roles } from '@/config/roles';
import toJSON from './plugins/toJSON.plugin';
import { IShiftDocument } from './shift.model';



interface IAddress {
  currentAddress: string;
  permanentAddress: string;
}

interface IContactInformation {
  phoneNumber: string;
  email: string;
  address: IAddress;
}

interface IPersonalDetails {
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus: string;
  nationality: string;
  contactInformation: IContactInformation;
}

interface IEmploymentDetails {
  employeeId: string;
  shift?: ObjectId | IShiftDocument,
  department: string;
  jobTitle: string;
  dateOfHire: Date;
  employmentType: string;
  supervisorId: string; 
  employeeStatus: string;
  employeeRole: string;
  workLocation: string;
  contractType?: string; 
  endDate?: Date;
}

interface ISalary {
  baseSalary: number;
  currency: string;
}

interface IBankAccountDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
}

interface ITaxInformation {
  taxId: string;
  nationalInsurance: string;
} 

interface IHealthInsurance {
  provider: string;
  policyNumber: string;
}

interface IPensionContributions {
  contributionPercentage: number;
  employerContribution: number;
}

export interface ICompensationAndBenefits {
  salary: ISalary;
  payFrequency: string;
  bankAccountDetails: IBankAccountDetails;
  taxInformation: ITaxInformation;
  healthInsurance: IHealthInsurance;
  pensionContributions: IPensionContributions;
  bonusStructure?: string; // Added field
}

interface ILeaveBalance {
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  maternityLeave?: number; // Added field
  paternityLeave?: number; // Added field
}

interface IAttendanceAndLeave {
  annualLeaveQuota: number;
  sickLeaveTaken: number;
  leaveStatus: string;
  leaveBalance: ILeaveBalance;
}

interface IPerformanceReview {
  reviewDate: Date;
  reviewScore: number;
  comments: string;
}

interface IDisciplinaryAction {
  actionDate: Date;
  reason: string;
  notes: string;
}

interface IPromotion {
  promotionDate: Date;
  newTitle: string;
  newSalary: number;
}

interface IPerformanceAndEvaluations {
  performanceReviews: IPerformanceReview[];
  disciplinaryActions: IDisciplinaryAction[];
  promotions: IPromotion[];
  terminationReason?: string;
}

interface IContract {
  contractDocument: string;
  startDate: Date;
  endDate: Date;
}

interface IIdProof {
  type: string;
  documentNumber: string;
  documentScan: string;
}

interface ITaxDocument {
  year: string;
  document: string;
}

interface IEmployeeAgreement {
  agreementType: string;
  agreementDocument: string;
}

interface IWorkPermit {
  permitNumber: string;
  validityStartDate: Date;
  validityEndDate: Date;
}

export interface IDocumentsAndCompliance {
  contract: IContract;
  idProof: IIdProof;
  taxDocuments: ITaxDocument[];
  employeeAgreements: IEmployeeAgreement[];
  workPermits: IWorkPermit;
  visaStatus?: string; // Added field
}

interface IEmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  address: string;
}

interface ISystemAccess {
  role: string;
  lastLogin: Date;
  failedAttempts: number;
  accountLocked: boolean;
  passwordHash: string;
  email: string;
  createdBy?:string | null

}



// Main Document Interface
export interface IEmployee {
  employeeId: string;
  personalDetails: IPersonalDetails;
  employmentDetails: IEmploymentDetails;
  compensationAndBenefits: ICompensationAndBenefits;
  attendanceAndLeave: IAttendanceAndLeave;
  performanceAndEvaluations: IPerformanceAndEvaluations;
  documentsAndCompliance: IDocumentsAndCompliance;
  emergencyContact: IEmergencyContact;
  systemAndAccessInfo: ISystemAccess;
}

export interface IEmployeeDocument extends IEmployee, Document {
  // Instance methods
  isPasswordMatch(password: string): Promise<boolean>;
}

// Static Methods for the Model
interface IEmployeeModel extends PaginateModel<IEmployeeDocument> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}



// Mongoose Schema Definition
const employeeSchema = new Schema<IEmployeeDocument>({
  employeeId: { type: String, unique: true },
  personalDetails: {
    fullName: {
      type: String, required: true, default: ''
    },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    nationality: { type: String, default: '' },
    contactInformation: {
      phoneNumber: { type: String, default: '' },
      email: { type: String, default: '' },
      address: {
        currentAddress: { type: String, default: '' },
        permanentAddress: { type: String, default: '' },
      },
    },
  },
  employmentDetails: {
    department: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    dateOfHire: { type: Date, default: null },
    employmentType: { type: String, default: '' },
    supervisorId: { type: String, default: '' },
    employeeStatus: { type: String, default: '' },
    employeeRole: { type: String, default: 'employee' },
    workLocation: { type: String, default: '' },
    contractType: { type: String, default: '' },
    shift: { type: Schema.Types.ObjectId, ref: 'Shift'},
    endDate: { type: Date, default: null },
  },
  compensationAndBenefits: {
    salary: {
      baseSalary: { type: Number, default: 0 },
      currency: { type: String, default: '' },
    },
    payFrequency: { type: String, default: '' },
    bankAccountDetails: {
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      routingNumber: { type: String, default: '' },
    },
    taxInformation: {
      taxId: { type: String, default: '' },
      nationalInsurance: { type: String, default: '' },
    },
    healthInsurance: {
      provider: { type: String, default: '' },
      policyNumber: { type: String, default: '' },
    },
    pensionContributions: {
      contributionPercentage: { type: Number, default: 0 },
      employerContribution: { type: Number, default: 0 },
    },
    bonusStructure: { type: String, default: '' },
  },
  attendanceAndLeave: {
    annualLeaveQuota: { type: Number, default: 0 },
    sickLeaveTaken: { type: Number, default: 0 },
    leaveStatus: { type: String, default: '' },
    leaveBalance: {
      annualLeaveBalance: { type: Number, default: 0 },
      sickLeaveBalance: { type: Number, default: 0 },
      maternityLeave: { type: Number, default: 0 },
      paternityLeave: { type: Number, default: 0 },
    },
  },
  performanceAndEvaluations: {
    performanceReviews: [
      {
        reviewDate: { type: Date, default: null },
        reviewScore: { type: Number, default: 0 },
        comments: { type: String, default: '' },
      },
    ],
    disciplinaryActions: [
      {
        actionDate: { type: Date, default: null },
        reason: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    ],
    promotions: [
      {
        promotionDate: { type: Date, default: null },
        newTitle: { type: String, default: '' },
        newSalary: { type: Number, default: 0 },
      },
    ],
    terminationReason: { type: String, default: '' },
  },
  documentsAndCompliance: {
    contract: {
      contractDocument: { type: String, default: '' },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
    idProof: {
      type: { type: String, default: '' },
      documentNumber: { type: String, default: '' },
      documentScan: { type: String, default: '' },
    },
    taxDocuments: [
      {
        year: { type: String, default: '' },
        document: { type: String, default: '' },
      },
    ],
    employeeAgreements: [
      {
        agreementType: { type: String, default: '' },
        agreementDocument: { type: String, default: '' },
      },
    ],
    workPermits: {
      permitNumber: { type: String, default: '' },
      validityStartDate: { type: Date, default: null},
      validityEndDate: { type: Date, default: null },
    },
    visaStatus: { type: String, default: '' },
  },
  emergencyContact: {
    name: { type: String, default: '' },
    relationship: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  systemAndAccessInfo: {
    role: { type: String, enum: roles, default: 'hrAdmin' },
    lastLogin: { type: Date, default: null },
    failedAttempts: { type: Number, default: 0 },
    accountLocked: { type: Boolean, default: false },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdBy:{type:String, default:null}
  },
});

// Plugins
employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);

// Instance method for password comparison
employeeSchema.methods.isPasswordMatch = async function (this: IEmployeeDocument,password: string) {
  return bcrypt.compare(password, this.systemAndAccessInfo.passwordHash);
};

// Static method to check if email is taken
employeeSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
employeeSchema.pre<IEmployeeDocument>('save', async function (next) {
  // Check if passwordHash is modified or new
  if (this.isModified('systemAndAccessInfo.passwordHash')) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.systemAndAccessInfo.passwordHash = await bcrypt.hash(this.systemAndAccessInfo.passwordHash, salt);
  }
  next(); // Proceed to save the document
})

// Create the model
export const Employee: IEmployeeModel = model<IEmployeeDocument, IEmployeeModel>('Employee', employeeSchema);

