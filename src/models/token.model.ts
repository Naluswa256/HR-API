import mongoose, { Document, Model, Schema } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { IToken, tokenTypes } from '@/interfaces/token.interface';



// Extend Mongoose Document to include the defined token properties
export interface ITokenDocument extends IToken, Document {}

// Define a static method interface (if you want to define statics in the future)
export interface ITokenModel extends Model<ITokenDocument> {}

// Create the Token Schema
const tokenSchema: Schema<ITokenDocument> = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(tokenTypes),
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }  
);

tokenSchema.plugin(toJSON);


const Token: ITokenModel = mongoose.model<ITokenDocument, ITokenModel>('Token', tokenSchema);

export default Token;
