import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { mapStoreToResponseDto, StoreResponseDto, StoreWithRouteResponseDto } from './dto/store-response.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    const store = await this.storeService.create(createStoreDto);
    return mapStoreToResponseDto(store).store;
  }

  @Get()
  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.storeService.findAll();
    return stores.map(store => mapStoreToResponseDto(store).store);
  }

  @Get('nearby')
  async findNearby(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
    @Query('maxDistance') maxDistance: string,
  ): Promise<StoreWithRouteResponseDto[]> {
    const storesWithRouteData = await this.storeService.findNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      maxDistance ? parseFloat(maxDistance) : 10
    );
    
    return storesWithRouteData.map(item => 
      mapStoreToResponseDto(item.store, item.routeData)
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StoreResponseDto> {
    const store = await this.storeService.findOne(id);
    return mapStoreToResponseDto(store).store;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateStoreDto: UpdateStoreDto
  ): Promise<StoreResponseDto> {
    const updatedStore = await this.storeService.update(id, updateStoreDto);
    return mapStoreToResponseDto(updatedStore).store;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    await this.storeService.remove(id);
    return { deleted: true };
  }
}