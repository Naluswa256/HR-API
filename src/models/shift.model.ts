import { shiftSchema } from '@/schemas/shift.validation.schemas';
import mongoose, { Document } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';

export interface IShift {
  shift_name: string;
  shift_start: Date;
  shift_end: Date;
  max_work_hours: number;
  allowed_overtime: boolean;
  time_zone: string; 
  shift_duration?: number; 
  break_start?: Date; 
  break_end?: Date; 
  break_duration?: number;
  shift_pattern?: string;
  createdBy:string
}

export interface IShiftDocument extends IShift , Document{}

const ShiftSchema = new mongoose.Schema<IShiftDocument>({
  shift_name: { type: String, required: true , unique:true},
  shift_start: { type: Date, required: true },
  shift_end: { type: Date, required: true },
  max_work_hours: { type: Number, required: true },
  allowed_overtime: { type: Boolean, default: false },
  time_zone: { type: String },
  shift_duration: { type: Number },
  break_start: { type: Date, default:null },
  break_end: { type: Date, default:null},
  break_duration: { type: Number, default:0},
  shift_pattern: { type: String },
  createdBy:{type:String, required:true}
});

ShiftSchema.plugin(toJSON);

ShiftSchema.pre('save', function (next) {
  const shift = this;

  const durationMs = shift.shift_end.getTime() - shift.shift_start.getTime();
  shift.shift_duration = durationMs / (1000 * 60 * 60);

  next();
});

export const Shift = mongoose.model<IShiftDocument>('Shift', ShiftSchema);