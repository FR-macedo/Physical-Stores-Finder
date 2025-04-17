import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({ required: true })
  storeName: string;

  @Prop({ required: true, default: true })
  takeOutInStore: boolean;

  @Prop({ required: true, default: 1 })
  shippingTimeInDays: number;

  @Prop({ required: true })
  address1: string;

  @Prop({ required: false, default: '' })
  address2: string;

  @Prop({ required: false, default: '' })
  address3: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, enum: ['PDV', 'LOJA'], default: 'LOJA' })
  type: 'PDV' | 'LOJA';

  @Prop({ required: true, default: 'Brasil' })
  country: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  telephoneNumber: string;

  @Prop({ required: true })
  emailAddress: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Criar índice geoespacial
StoreSchema.index({ location: '2dsphere' });