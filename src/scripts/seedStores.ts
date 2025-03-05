import mongoose from "mongoose";
import Store from "../models/store";
import { config } from "../config/env";

const stores = [
  {
    name: "Loja Centro São Paulo",
    cep: "01310-100",
    street: "Avenida Paulista",
    number: "1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    location: {
      type: "Point",
      coordinates: [-46.6333, -23.5505], // [longitude, latitude]
    },
  },
  {
    name: "Loja Recife I",
    cep: "50870-005",
    street: "Avenida José Rufino",
    number: "1407",
    neighborhood: "Areias",
    city: "Recife",
    state: "PE",
    location: {
      type: "Point",
      coordinates: [-34.9355, -8.0913], // [longitude, latitude]
    },
  },
  {
    name: "Loja Limoeiro I",
    cep: "22250-040",
    street: "PE-050",
    number: "NA",
    neighborhood: "NA",
    city: "Limoeiro",
    state: "PE",
    location: {
      type: "Point",
      coordinates: [-35.4281, -7.8983], // [longitude, latitude]
    },
  },
  {
    name: "Loja Caruaru I",
    cep: "22250-040",
    street: "Rua Ypiraflor",
    number: "NA",
    neighborhood: "Cortume",
    city: "Caruaru",
    state: "PE",
    location: {
      type: "Point",
      coordinates: [-36.0292, -8.1973], // [longitude, latitude]
    },
  },
];

async function seedStores() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    await Store.deleteMany({});

    await Store.insertMany(stores);

    console.log("Lojas inseridas com sucesso!");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Erro ao inserir lojas:", error);
    process.exit(1);
  }
}

seedStores();
