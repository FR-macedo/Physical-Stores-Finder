import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store, StoreDocument } from './entities/store.entity';

interface StoreWithRouteData {
  store: StoreDocument;
  routeData: {
    distance: number;
    duration: number;
  };
}

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<StoreDocument> {
    const createdStore = new this.storeModel(createStoreDto);
    return createdStore.save();
  }

  async findAll(): Promise<StoreDocument[]> {
    return this.storeModel.find().exec();
  }

  async findOne(id: string): Promise<StoreDocument> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<StoreDocument> {
    const updatedStore = await this.storeModel
      .findByIdAndUpdate(id, updateStoreDto, { new: true })
      .exec();
    
    if (!updatedStore) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    
    return updatedStore;
  }

  async remove(id: string): Promise<void> {
    const result = await this.storeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
  }

  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number = 10,
  ): Promise<StoreWithRouteData[]> {
    const maxDistanceInMeters = maxDistance * 1000;
    const stores = await this.storeModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistanceInMeters,
        },
      },
    }).exec();

    return stores.map(store => {
      const storeCoords = store.location.coordinates;
      const distance = this.calculateDistance(
        latitude, 
        longitude, 
        storeCoords[1], 
        storeCoords[0]
      );
      
      const duration = (distance / 1000) * 60;

      return {
        store,
        routeData: {
          distance,
          duration,
        },
      };
    });
  }

  private calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371000; 
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}