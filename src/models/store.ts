import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const StoreSchema: Schema = new Schema({
  name: { type: String, required: true },
  cep: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// cria o índice geoespacial
StoreSchema.index({ location: '2dsphere' });

export default mongoose.model<IStore>('Store', StoreSchema);