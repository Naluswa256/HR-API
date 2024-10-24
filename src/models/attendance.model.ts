import { Schema, Document, model } from 'mongoose';
import paginate, { PaginateModel } from './plugins/paginate.plugin';
import toJSON from './plugins/toJSON.plugin';

export interface IAttendance{
    employee_id: string;
    attendance_date: Date;
    check_in?: Date;
    check_out?: Date;
    late_arrival: boolean;
    early_departure: boolean;
    shift_type: string;
    missed_check_in: boolean;
    missed_check_out: boolean;
    work_hours: number;
    overtime_hours: number;
    undertime_hours: number;
}


export interface IAttendanceDocument extends IAttendance, Document {}
interface IAttendanceModel extends PaginateModel<IAttendanceDocument> {}

const AttendanceSchema = new Schema<IAttendanceDocument>({
    employee_id: { type: String, required: true },
    attendance_date: { type: Date, required: true },
    check_in: { type: Date },
    check_out: { type: Date },
    late_arrival: { type: Boolean, default: false },
    early_departure: { type: Boolean, default: false },
    shift_type: { type: String, required: true }, 
    missed_check_in: { type: Boolean, default: false },
    missed_check_out: { type: Boolean, default: false },
    work_hours: { type: Number, default: 0 },
    overtime_hours: { type: Number, default: 0 },
    undertime_hours: { type: Number, default: 0 }
});
AttendanceSchema.plugin(paginate)
AttendanceSchema.plugin(toJSON);
export const AttendanceModel:IAttendanceModel = model<IAttendanceDocument, IAttendanceModel>('Attendance', AttendanceSchema);
