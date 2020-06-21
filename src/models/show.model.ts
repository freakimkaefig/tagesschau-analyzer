import { Schema, Document, Model, model } from 'mongoose';

const ShowSchema = new Schema({
  showId: Number,
  time: String,
  text: String,
});

export interface IShow {
  showId: number;
  time: string;
  text: string;
}

export interface IShowDocument extends IShow, Document {}

export interface IShowModel extends Model<IShowDocument> {}

export const ShowModel = model<IShowDocument>('show', ShowSchema);
