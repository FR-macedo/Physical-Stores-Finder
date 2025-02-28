// src/models/store.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

const StoreSchema: Schema = new Schema({
  name: { type: String, required: true },
  cep: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

export default mongoose.model<IStore>('Store', StoreSchema);