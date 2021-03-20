import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ShowDocument = Show & mongoose.Document;

@Schema()
export class Show {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  showId: number;

  @Prop({ required: true })
  ut: boolean;

  @Prop({ required: true })
  text: string;

  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  entities: any;
}

export const ShowSchema = SchemaFactory.createForClass(Show);
