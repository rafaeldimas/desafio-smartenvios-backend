import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrackingDocument = HydratedDocument<Tracking>;

export interface Event {
  timestamp: string;
  status: string;
  location: string;
}

@Schema()
export class Tracking {
  @Prop()
  trackingCode: string;

  @Prop()
  carrier: string;

  @Prop()
  wasDelivered: boolean;

  @Prop()
  events: Event[];
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
