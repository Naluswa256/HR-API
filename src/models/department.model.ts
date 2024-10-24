import { Schema, model, Document } from 'mongoose';
import paginate, { PaginateModel } from './plugins/paginate.plugin';
import toJSON from './plugins/toJSON.plugin';


export interface IDepartment {
    name: string;
    description?: string;
    location?: string; 
    employees?: string[]; 
    parentDepartment?: string;
    departmentHead?: string; // Reference to Employee (Department Head)
    budget?: number; // Financial budget allocated to department
    contactEmail?: string; // Department email
    contactPhone?: string; // Department phone number
    numEmployees?: number; // Calculated or stored number of employees
    status?: 'active' | 'inactive'; // Status of the department
    establishedDate?: Date; // When department was created
    departmentCode?: string; 
    createdBy:string;
    // Unique department code for internal use
}

export interface IDepartmentDocument extends IDepartment, Document {}
export interface IDepartmentModel extends PaginateModel<IDepartmentDocument>{}
 export const departmentSchema = new Schema<IDepartmentDocument>({
    name: { type: String, required: true },
    description: { type: String , default:''},
    location: { type: String, default:'' },
    employees: [{ type:String}],
    parentDepartment: { type:String, default:null },
    departmentHead: { type: String, required:true }, 
    budget: { type: Number , defualt:0},
    contactEmail: { type: String , default:'' },
    contactPhone: { type: String , default:''},
    numEmployees: { type: Number, default:0},
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
    establishedDate: { type: Date, default:null }, 
    departmentCode: { type: String, unique: true },
    createdBy: { type: String, required: true },
}, { timestamps: true });

departmentSchema.plugin(paginate);
departmentSchema.plugin(toJSON);
departmentSchema.pre('save', async function() {
    this.numEmployees = this.employees.length;
});

export const Department = model<IDepartmentDocument, IDepartmentModel>('Department', departmentSchema);
