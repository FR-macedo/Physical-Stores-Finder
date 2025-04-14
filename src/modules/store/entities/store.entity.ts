import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({ required: true })
  storeName: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  address1: string;

  @Prop()
  address2: string;

  @Prop()
  address3: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, default: 'Brasil' })
  country: string;

  @Prop({ required: true, default: true })
  takeOutInStore: boolean;

  @Prop({ required: true, default: 1 })
  shippingTimeInDays: number;

  @Prop({ required: true, enum: ['PDV', 'LOJA'], default: 'LOJA' })
  type: string;

  @Prop()
  telephoneNumber: string;

  @Prop()
  emailAddress: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  })
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Criar índice geoespacial
StoreSchema.index({ location: '2dsphere' });