import { Schema, Document, Model, model } from 'mongoose';

const StatusSchema = new Schema({
  time: String,
  showId: Number,
});

export interface IStatus {
  time: string;
  showId: number;
}

export interface IStatusDocument extends IStatus, Document {}

export interface IStatusModel extends Model<IStatusDocument> {}

export const StatusModel = model<IStatusDocument>('status', StatusSchema);
