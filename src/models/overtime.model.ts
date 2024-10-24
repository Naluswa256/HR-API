import { Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import { PaginateModel } from './plugins/paginate.plugin';
import toJSON from './plugins/toJSON.plugin';
interface IOvertime {
    overtime_id: string;
    employee_id: string;
    overtime_date: Date;
    regular_overtime_hours: number;
    weekend_overtime_hours: number;
    holiday_overtime_hours: number;
    compensatory_leave_earned: number;
    overtime_reason: string;
    approved: boolean;
    approver_id?: string | null;
    rejection_reason?: string | null;
  }

  export interface IOvertimeDocument extends IOvertime, Document {}
  interface IOvertimeModel extends PaginateModel<IOvertimeDocument> { }
  const OvertimeSchema = new Schema<IOvertimeDocument>({
    overtime_id: { type: String, required: true },
    employee_id: { type: String, required: true },
    overtime_date: { type: Date, required: true },
    regular_overtime_hours: { type: Number, required: true },
    weekend_overtime_hours: { type: Number, required: true },
    holiday_overtime_hours: { type: Number, required: true },
    compensatory_leave_earned: { type: Number, default:null },
    overtime_reason: { type: String, required: true },
    approved: { type: Boolean, default: false },
    rejection_reason: { type: String, default: null },
    approver_id: { type: String, default:null },
  });

  OvertimeSchema.plugin(toJSON);
  export const OvertimeModel:IOvertimeModel = model<IOvertimeDocument, IOvertimeModel>('Overtime', OvertimeSchema);
  