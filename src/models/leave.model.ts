
import { Document, model, Schema } from 'mongoose';
import paginate, { PaginateModel } from './plugins/paginate.plugin';
import toJSON from './plugins/toJSON.plugin';

enum LeaveType {
    Annual = "annual",
    Sick = "sick",
    Maternity = "maternity",
    Paternity = "paternity",
    Other = "other"
}

export enum LeaveStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}


interface ILeave {
    leave_id: string;
    employee_id: string;
    leave_type: LeaveType;
    start_date: Date;
    end_date: Date;
    leave_days: number;
    status: LeaveStatus;
    approver_id?: string | null;
    reason: string;
    submitted_at: Date;
    approval_date?: Date | null;
    rejection_reason?: string | null;
}



export interface ILeaveDocument extends ILeave, Document { }
interface IleaveModel extends PaginateModel<ILeaveDocument> { }

const LeaveSchema = new Schema<ILeaveDocument>({
    leave_id: { type: String, required: true },
    employee_id: { type: String, required: true },
    leave_type: { type: String, enum: Object.values(LeaveType), required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    leave_days: { type: Number, required: true },
    status: { type: String, enum: Object.values(LeaveStatus), required: true },
    approver_id: { type: String, default:null },
    reason: { type: String, required: true },
    submitted_at: { type: Date, default: Date.now, required: true },
    approval_date: { type: Date, default: null },
    rejection_reason: { type: String, default: null },
});
LeaveSchema.plugin(toJSON);
LeaveSchema.plugin(paginate);
export const LeaveModel = model<ILeaveDocument, IleaveModel>('Leave', LeaveSchema);