import { Schema, Document, Model, model } from 'mongoose';
import { Moment } from 'moment';

const ShowSchema = new Schema({
  date: Date,
  time: String,
  showId: Number,
  text: String,
});

export interface IShow {
  date: Moment;
  time: string;
  showId: number;
  text: string;
}

export interface IShowDocument extends IShow, Document {}

export interface IShowModel extends Model<IShowDocument> {}

export const ShowModel = model<IShowDocument>('show', ShowSchema);
