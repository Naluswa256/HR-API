import { DOMAIN_URL } from "@/config";
import { PaginateOptions, QueryResult } from "@/models/plugins/paginate.plugin";
import { Employee, IDocumentsAndCompliance, IEmployee, IEmployeeDocument } from "@/models/users.model";
import { RegisterInput } from "@/schemas/auth.validation.schemas";
import { CreateEmployeeInput } from "@/schemas/employee.validation.schemas";
import { EmployeeSearchQuery } from "@/schemas/searchQuery.validation.schemas";
import { ApiError } from "@/utils/apiError";
import { generateUniqueEmployeeId } from "@/utils/util";
import HttpStatus from 'http-status'; 
import { Document } from "mongoose";
import path from 'path'; 

const initializeDocumentsAndCompliance = (data?: Partial<IDocumentsAndCompliance>): IDocumentsAndCompliance => ({
  contract: {
    contractDocument: data?.contract?.contractDocument || "",
    startDate: data?.contract?.startDate || null, 
    endDate: data?.contract?.endDate || null, 
  },
  idProof: {
    documentScan: data?.idProof?.documentScan || "",
    type: data?.idProof?.type || "",
    documentNumber: data?.idProof?.documentNumber || "",
  },
  taxDocuments: data?.taxDocuments || [],
  employeeAgreements: data?.employeeAgreements || [],
  workPermits: {
    permitNumber: data?.workPermits?.permitNumber || "",
    validityStartDate: data?.workPermits?.validityStartDate || null, 
    validityEndDate: data?.workPermits?.validityEndDate || null, 
  },
});
const checkAndInitializeDocumentsAndCompliance = (
  data?: Partial<IDocumentsAndCompliance>
): IDocumentsAndCompliance => {
  // Check if required fields are present and valid, else initialize them
  if (
    !data ||
    !data.contract ||
    !data.idProof ||
    !data.taxDocuments ||
    !data.employeeAgreements ||
    !data.workPermits
  ) {
    // Initialize using the provided partial data
    return initializeDocumentsAndCompliance(data);
  }
  
  // Otherwise, return the data as is
  return data as IDocumentsAndCompliance;
};

class UserService {
  private users = Employee;

  public async queryUsers(filter: Record<string, any>, options: PaginateOptions): Promise<QueryResult<Document>> {
    return this.users.paginate(filter, options);
  }
  public async findUserByEmployeeId(employeeId: string): Promise<IEmployeeDocument> {
    if (!employeeId) throw new ApiError(HttpStatus.BAD_REQUEST, "EmployeeId is empty");

    const findUser: IEmployeeDocument = await this.users.findOne({ employeeId });
    if (!findUser) throw new ApiError(HttpStatus.NOT_FOUND, "User doesn't exist");

    return findUser;
  }

  public async getUserByEmail(email: string): Promise<IEmployeeDocument | null> {
    if (!email) throw new ApiError(HttpStatus.BAD_REQUEST, "Email is empty");

    const findUserByEmail: IEmployeeDocument | null = await this.users.findOne({ 'systemAndAccessInfo.email': email });
    if (!findUserByEmail) throw new ApiError(HttpStatus.NOT_FOUND, "User doesn't exist");

    return findUserByEmail;
  }

  public async createUser(userData: RegisterInput): Promise<IEmployeeDocument> {
    if (!userData) throw new ApiError(HttpStatus.BAD_REQUEST, "User data is empty");

    const existingUser: IEmployeeDocument = await this.users.findOne({ 'systemAndAccessInfo.email': userData.email });
    if (existingUser) throw new ApiError(HttpStatus.CONFLICT, `This email ${userData.email} already exists`);

    const employeeId = generateUniqueEmployeeId();

    const createUserData: IEmployeeDocument = await this.users.create({
      personalDetails: {
        fullName: userData.fullname!,
      },
      employeeId,
      systemAndAccessInfo: {
        email: userData.email!,
        passwordHash: userData.password!,
      },
    });
    return createUserData;
  }

  public async createEmployee(userData: Partial<IEmployee>, files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }, createdBy: string): Promise<IEmployeeDocument> {
    if (!userData) throw new ApiError(HttpStatus.BAD_REQUEST, "User data is empty");

    const employeeId = generateUniqueEmployeeId();
    const createUserData: Partial<IEmployee> = {
      personalDetails: userData.personalDetails,
      employeeId,
      employmentDetails: userData.employmentDetails,
      compensationAndBenefits: userData.compensationAndBenefits,
      documentsAndCompliance: initializeDocumentsAndCompliance(userData.documentsAndCompliance),
      emergencyContact: userData.emergencyContact,
      systemAndAccessInfo: {
        email: userData.systemAndAccessInfo?.email!,
        passwordHash: userData.systemAndAccessInfo.passwordHash!,
        role: userData.systemAndAccessInfo.role!,
        lastLogin: undefined,
        failedAttempts: 0,
        accountLocked: false,
        createdBy: createdBy,
      },
    };

    // Handle file uploads if files are provided
    if (files) {
      this.processFiles(files, createUserData.documentsAndCompliance);
    }

    const newUser = await this.users.create(createUserData);
    return newUser;
  }

  public async updateEmployee(employeeId: string, updateData: Partial<IEmployee>, files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }, userId: string): Promise<IEmployeeDocument> {
    if (!employeeId) throw new ApiError(HttpStatus.BAD_REQUEST, "EmployeeId is required");

    // Check if at least one field is provided
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(HttpStatus.BAD_REQUEST, "At least one field must be updated");
  }
  
    // Create an object to store updated fields
    const updateFields: Partial<IEmployee> = {};
  
    // Add updated personal details if provided
    if (updateData.personalDetails) {
      updateFields.personalDetails = { ...updateData.personalDetails };
    }
  
    // Add updated employment details if provided
    if (updateData.employmentDetails) {
      updateFields.employmentDetails = { ...updateData.employmentDetails };
    }
  
    // Add updated compensation and benefits if provided
    if (updateData.compensationAndBenefits) {
      updateFields.compensationAndBenefits = { ...updateData.compensationAndBenefits };
    }
  
    // Add updated emergency contact if provided
    if (updateData.emergencyContact) {
      updateFields.emergencyContact = { ...updateData.emergencyContact };
    }
  
    // Add updated documents and compliance if provided
    if (updateData.documentsAndCompliance) {
      updateFields.documentsAndCompliance = {
        ...initializeDocumentsAndCompliance(updateData.documentsAndCompliance), // Ensure all fields are correctly initialized
        ...updateData.documentsAndCompliance // Override with provided fields
      };
    }
  
    // Handle file uploads if files are provided
    if (files) {
     
      const updateFieldsWithFiles = {
        documentsAndCompliance: checkAndInitializeDocumentsAndCompliance(updateFields.documentsAndCompliance),
      };
      this.processFiles(files, updateFieldsWithFiles.documentsAndCompliance!);
       // Merge the fields updated by file processing into the main updateFields object
    updateFields.documentsAndCompliance = {
      ...updateFields.documentsAndCompliance,
      ...updateFieldsWithFiles.documentsAndCompliance, // Add processed files into documentsAndCompliance
    };
    }
    console.log(`object for fields being updated ${JSON.stringify(updateFields, null, 2)}`);
    // Use findOneAndUpdate to update the document
    const updatedEmployee = await this.users.findOneAndUpdate(
      { employeeId, 'systemAndAccessInfo.createdBy': userId },
      { $set: updateFields }, // Set only the updated fields
      { new: true } // Return the updated document
    );
  
    if (!updatedEmployee) throw new ApiError(HttpStatus.NOT_FOUND,"Employee not found or you do not have permission to update this user");
  
    return updatedEmployee;
  }
  


  private processFiles(files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }, documentsAndCompliance: IDocumentsAndCompliance) {
    if (Array.isArray(files) && files.length > 0) {
      files.forEach((file) => this.handleFileMapping(file, documentsAndCompliance));
    } else if (typeof files === 'object') {
      Object.keys(files).forEach((fieldname) => {
        const fileArray = files[fieldname];
        if (fileArray.length > 0) {
          fileArray.forEach((file: Express.Multer.File) => this.handleFileMapping(file, documentsAndCompliance));
        }
      });
    }
  }



  public handleFileMapping(file: Express.Multer.File,  documentsAndCompliance: IDocumentsAndCompliance) {
    const { fieldname, path: filePath } = file;
  
    // Construct the file URL
    const domain = DOMAIN_URL || 'http://localhost:3000'; 
    const fileUrl = `${domain}/uploads/${path.basename(filePath)}`;
  
    switch (fieldname) {
      case "contractDocument":
        documentsAndCompliance.contract.contractDocument = fileUrl; 
        break;
      case "idProof":
        documentsAndCompliance.idProof.documentScan = fileUrl; 
        break;
      case "taxDocument":
        documentsAndCompliance.taxDocuments.push({ year: "", document: fileUrl }); 
        break;
      case "employeeAgreement":
        documentsAndCompliance.employeeAgreements.push({ agreementType: '', agreementDocument: fileUrl }); 
        break;
      case "workPermit":
        documentsAndCompliance.workPermits.permitNumber = fileUrl; 
        break;
      default:
        break;
    }
  }
  

  public async deleteUserByEmployeeId(employeeId: string, userId:string): Promise<IEmployeeDocument | null> {
    const deletedUser = await this.users.findOneAndDelete({ employeeId,'systemAndAccessInfo.createdBy': userId });
    if (!deletedUser) throw new ApiError(HttpStatus.NOT_FOUND,"User doesn't exist or you do not have permission to delete this user");

    return deletedUser;
  }
  

  public async searchEmployees (criteria: EmployeeSearchQuery,userId: string){
    const query = buildQuery(criteria, userId);

    // Pagination and sorting
    const page = criteria.page || 1;
    const limit = criteria.limit || 10;
    const sortField = criteria.sortBy || 'personalDetails.fullName'; 
    const sortOrder = criteria.sortOrder === 'desc' ? -1 : 1;

    // Find employees with the query and sorting
    const employees = await Employee.find(query, {
        'personalDetails.fullName': 1,
        'employmentDetails.jobTitle': 1,
        'employmentDetails.department': 1,
        'personalDetails.gender':1,
        'personalDetails.contactInformation.phoneNumber':1,
        'compensationAndBenefits.salary.baseSalary': 1,
        'systemAndAccessInfo.email':1
    })
    .sort({ [sortField]: sortOrder })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

    const totalCount = await Employee.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1; 
    return {
        totalCount,
        totalPages,
        currentPage: page,
        employees,
        hasNextPage,
        hasPreviousPage,
    };
};  
}

const buildQuery = (criteria: EmployeeSearchQuery, userId:string) => {
  const query: any = {};

  const addDateFilter = (field: string, from?: string, to?: string) => {
      if (from || to) {
          query[field] = {};
          if (from) query[field].$gte = new Date(from);
          if (to) query[field].$lte = new Date(to);
      }
  };

  // Default role filter
  query['systemAndAccessInfo.role'] = 'employee';
  query['systemAndAccessInfo.createdBy'] = userId; 

  // Helper function to add regex queries
  const addRegexQuery = (field: string, value: string | undefined) => {
      if (value) {
          query[field] = new RegExp(value, 'i');
      }
  };

  // Adding exact matches
  if (criteria.employeeId) {
      query.employeeId = criteria.employeeId;
  }
  if (criteria.dateOfBirth) {
      query['personalDetails.dateOfBirth'] = criteria.dateOfBirth;
  }
  if (criteria.supervisorId) {
      query['employmentDetails.supervisorId'] = criteria.supervisorId;
  }
  if (criteria.accountLocked !== undefined) {
      query['systemAndAccessInfo.accountLocked'] = criteria.accountLocked;
  }

  // Adding regex queries
  addRegexQuery('personalDetails.fullName', criteria.fullName);
  addRegexQuery('personalDetails.gender', criteria.gender);
  addRegexQuery('personalDetails.nationality', criteria.nationality);
  addRegexQuery('personalDetails.contactInformation.email', criteria.email);
  addRegexQuery('personalDetails.contactInformation.phoneNumber', criteria.phoneNumber);
  addRegexQuery('employmentDetails.department', criteria.department);
  addRegexQuery('employmentDetails.jobTitle', criteria.jobTitle);
  addRegexQuery('employmentDetails.employeeRole', criteria.employeeRole);
  addRegexQuery('employmentDetails.employmentType', criteria.employmentType);
  addRegexQuery('employmentDetails.contractType', criteria.contractType);
  addRegexQuery('employmentDetails.employeeStatus', criteria.employeeStatus);
  addRegexQuery('employmentDetails.workLocation', criteria.workLocation);
  addRegexQuery('documentsAndCompliance.idProof.documentNumber', criteria.documentNumber);

  // Adding date filters
  addDateFilter('employmentDetails.dateOfHire', criteria.dateOfHireFrom, criteria.dateOfHireTo);

  // Salary range
  if (criteria.salaryMin || criteria.salaryMax) {
      query['compensationAndBenefits.salary.baseSalary'] = {};
      if (criteria.salaryMin) {
          query['compensationAndBenefits.salary.baseSalary'].$gte = criteria.salaryMin;
      }
      if (criteria.salaryMax) {
          query['compensationAndBenefits.salary.baseSalary'].$lte = criteria.salaryMax;
      }
  }
  return query;


};

export default new UserService();
