import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { Store, StoreDocument } from '../entities/store.entity';
import { ViaCepService } from '../../external/services/via-cep.service';
import { GoogleMapsService } from '../../external/services/google-maps.service';
import { MelhorEnvioService } from '../../external/services/melhor-envio.service';
import { StoreDistanceResponseDto, ShippingOptionDto } from '../dto/store-distance-response.dto';
import { StoreResponseDto, StoreDetailDto } from '../dto/store-response.dto';
import {
  StoreNotFoundException,
  StoreValidationException,
  StoreDuplicateException,
  StoreGeocodingException,
  StoreDistanceCalculationException,
  StoreNoNearbyException,
} from '../exceptions/store.exception';
import { StoreDistanceDto } from '../dto/store-distance.dto';
import { StoreValidationError } from '../exceptions/store-validation.error';
import { RouteData } from '../../external/services/google-maps.service';
import { ViaCepResponse } from '../../external/services/via-cep.service';

// Interfaces auxiliares
interface ShippingRequest {
  from: { postal_code: string };
  to: { postal_code: string };
  package: { height: number; width: number; length: number; weight: number };
  products: Array<{ name: string; quantity: number; unitary_value: number }>;
}

interface StoreWithRouteData {
  store: StoreDocument;
  routeData: RouteData;
  shippingOptions?: any[];
  pdvDeliveryFee?: number;
}

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly configService: ConfigService,
    private readonly viaCepService: ViaCepService,
    private readonly googleMapsService: GoogleMapsService,
    private readonly melhorEnvioService: MelhorEnvioService,
  ) {}

  // Função principal para criar loja
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    try {
      this.validateRequiredFields(createStoreDto);

      const store = this.createStoreEntity(createStoreDto);
      const savedStore = await this.storeModel.create(store);

      return savedStore;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar loja');
    }
  }

  // Funções auxiliares para criar loja
  private validateRequiredFields(dto: CreateStoreDto): void {
    const requiredFields = [
      { field: 'storeName', message: 'Nome da loja é obrigatório' },
      { field: 'postalCode', message: 'CEP é obrigatório' },
      { field: 'telephoneNumber', message: 'Telefone é obrigatório' },
      { field: 'emailAddress', message: 'Email é obrigatório' },
    ];

    for (const { field, message } of requiredFields) {
      if (!dto[field]) {
        throw new StoreValidationException(message);
      }
    }

    if (!dto.location || !dto.location.coordinates || dto.location.coordinates.length !== 2) {
      throw new StoreValidationException('Localização é obrigatória e deve conter coordenadas válidas');
    }
  }

  private createStoreEntity(dto: CreateStoreDto): Store {
    return new this.storeModel({
      storeName: dto.storeName,
      takeOutInStore: dto.takeOutInStore,
      shippingTimeInDays: dto.shippingTimeInDays,
      address1: dto.address1,
      address2: dto.address2 || '',
      address3: dto.address3 || '',
      city: dto.city,
      district: dto.district,
      state: dto.state,
      type: dto.type,
      country: dto.country,
      postalCode: dto.postalCode,
      telephoneNumber: dto.telephoneNumber,
      emailAddress: dto.emailAddress,
      location: dto.location,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Funções principais
  async findAll(): Promise<Store[]> {
    return await this.storeModel.find().exec();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new StoreNotFoundException(id);
    }
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    try {
      const store = await this.storeModel.findById(id);
      if (!store) {
        throw new StoreNotFoundException(id);
      }

      await this.validateStoreUpdate(store, updateStoreDto);
      await this.handleAddressUpdate(store, updateStoreDto);

    const updatedStore = await this.storeModel
        .findByIdAndUpdate(id, { ...updateStoreDto, updatedAt: new Date() }, { new: true })
      .exec();
    
      return updatedStore;
    } catch (error) {
      throw this.handleError(error, `Erro ao atualizar loja ${id}`);
    }
  }

  // Funções auxiliares para update
  private async validateStoreUpdate(store: Store, updateDto: UpdateStoreDto): Promise<void> {
    if (updateDto.storeName && updateDto.storeName !== store.storeName) {
      const existingStore = await this.storeModel.findOne({ storeName: updateDto.storeName });
      if (existingStore) {
        throw new StoreDuplicateException(updateDto.storeName);
      }
    }
  }

  private async handleAddressUpdate(store: Store, updateDto: UpdateStoreDto): Promise<void> {
    if (this.hasAddressChanged(store, updateDto) && !updateDto.location) {
      const address = this.buildAddress(updateDto);
      const coordinates = await this.getCoordinatesFromAddress(address);
      
      if (!coordinates) {
        throw new StoreGeocodingException(`Erro ao geocodificar endereço: ${address}`);
      }

      updateDto['location'] = {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat]
      };
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.storeModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new StoreValidationError('Loja não encontrada', { id });
      }
    } catch (error) {
      throw this.handleError(error, `Erro ao remover loja ${id}`);
    }
  }

  // Função principal para buscar lojas próximas
  async findNearby(postalCode: string): Promise<StoreDistanceResponseDto[]> {
    try {
      this.validatePostalCode(postalCode);
      
      const address = await this.viaCepService.getAddressByCep(postalCode);
      const coordinates = await this.getCoordinatesFromViaCepAddress(address);
      
      // Buscar lojas em ordem de preferência
      let results = await this.findNearbySortedStores(coordinates, postalCode, address);
      
      // Ordenar por distância
      return this.sortStoresByDistance(results);
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar lojas próximas');
    }
  }

  // Funções auxiliares para findNearby
  private validatePostalCode(postalCode: string): void {
    if (!this.isValidPostalCode(postalCode)) {
      throw new StoreValidationException('CEP inválido');
    }
  }

  private async getCoordinatesFromViaCepAddress(address: ViaCepResponse) {
    const addressStr = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}`;
    return await this.googleMapsService.getCoordinatesFromAddress(addressStr);
  }

  private async findNearbySortedStores(coordinates: any, postalCode: string, address: ViaCepResponse): Promise<StoreDistanceResponseDto[]> {
    // Primeiro tenta PDVs dentro do raio
    const pdvStores = await this.findNearbyPDVs(coordinates);
    if (pdvStores.length > 0) {
      return await this.processStoresWithShipping(pdvStores, postalCode, address, true);
    }
    
    // Se não há PDVs, busca lojas regulares
    const regularStores = await this.findNearbyRegularStores(coordinates);
    if (regularStores.length > 0) {
      return await this.processStoresWithShipping(regularStores, postalCode, address, false);
    }
    
    // Se não há lojas próximas, busca a mais próxima independente da distância
    return await this.findSingleNearestStore(coordinates, postalCode, address);
  }

  private async findNearbyPDVs(coordinates: any, radius = 50000): Promise<StoreDocument[]> {
    return await this.storeModel.find({
      type: 'PDV',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          },
          $maxDistance: radius
        }
      }
    }).exec();
  }

  private async findNearbyRegularStores(coordinates: any, radius = 50000): Promise<StoreDocument[]> {
    return await this.storeModel.find({
      type: 'LOJA',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          },
          $maxDistance: radius
        }
      }
    }).exec();
  }

  private async findSingleNearestStore(coordinates: any, postalCode: string, address: ViaCepResponse): Promise<StoreDistanceResponseDto[]> {
    const nearestStore = await this.storeModel.findOne({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          }
        }
      }
    }).exec();
    
    if (!nearestStore) {
      throw new StoreNoNearbyException('Nenhuma loja cadastrada no sistema');
    }
    
    return await this.processStoresWithShipping([nearestStore], postalCode, address, nearestStore.type === 'PDV');
  }

  private async processStoresWithShipping(
    stores: StoreDocument[], 
    postalCode: string, 
    address: ViaCepResponse, 
    isPDV: boolean
  ): Promise<StoreDistanceResponseDto[]> {
    const results: StoreDistanceResponseDto[] = [];
    const pdvDeliveryFee = Number(this.configService.get<string>('PDV_DELIVERY_FEE')) || 15.00;

    // Definimos os serviços que queremos permitir (PAC e SEDEX)
  const allowedServices = ['1', '2']; // Códigos do PAC e SEDEX
    
  for (const store of stores) {
    try {
      const originStr = `${store.address1}, ${store.district}, ${store.city}, ${store.state}, Brasil`;
      const destinationStr = `${address.logradouro}, ${address.localidade}, ${address.uf}, Brasil`;
      
      const routeData = await this.calculateRoute(originStr, destinationStr);
      let shippingOptions: ShippingOptionDto[] = [];
      
      if (isPDV) {
        shippingOptions = [{
          prazo: '1 dia útil',
          price: `R$ ${pdvDeliveryFee.toFixed(2)}`,
          description: 'Entrega PDV',
          codProdutoAgencia: 'PDV001'
        }];
      } else {
        const shippingRequest = this.createShippingRequest(store.postalCode, postalCode);
        const options = await this.melhorEnvioService.calculateShipping(shippingRequest.from.postal_code, shippingRequest.to.postal_code);
        
        // Filtrar apenas os serviços permitidos (PAC e SEDEX)
        const filteredOptions = options.filter(option => 
          allowedServices.includes(option.id.toString())
        );
        
        shippingOptions = filteredOptions.map(option => ({
          prazo: `${option.delivery_time} dias úteis`,
          price: `R$ ${Number(option.price).toFixed(2)}`,
          description: option.name,
          codProdutoAgencia: option.id.toString()
        }));
      }
      
      results.push({
        name: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: store.type,
        distance: this.formatDistance(routeData.distance),
        value: shippingOptions
      });
    } catch (error) {
      this.logger.error(`Erro ao processar loja ${store.storeName}:`, error);
      // Continua com a próxima loja
    }
  }
  
  return results;
}

  private createShippingRequest(fromPostalCode: string, toPostalCode: string): ShippingRequest {
      return {
      from: { postal_code: fromPostalCode },
      to: { postal_code: toPostalCode },
      package: { height: 10, width: 10, length: 10, weight: 1 },
      products: [{ name: 'Produto Teste', quantity: 1, unitary_value: 100 }]
    };
  }

  private sortStoresByDistance(stores: StoreDistanceResponseDto[]): StoreDistanceResponseDto[] {
    return stores.sort((a, b) => {
      const distA = parseFloat(a.distance.replace(/[^0-9,.]/g, '').replace(',', '.'));
      const distB = parseFloat(b.distance.replace(/[^0-9,.]/g, '').replace(',', '.'));
      return distA - distB;
    });
  }

  // Funções de utilidade
  private formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  }

  private isValidPostalCode(postalCode: string): boolean {
    return /^\d{5}-?\d{3}$/.test(postalCode);
  }

  private hasAddressChanged(store: Store, updateDto: UpdateStoreDto): boolean {
    return (
      updateDto.address1 !== undefined ||
      updateDto.address2 !== undefined ||
      updateDto.address3 !== undefined ||
      updateDto.district !== undefined ||
      updateDto.city !== undefined ||
      updateDto.state !== undefined ||
      updateDto.postalCode !== undefined ||
      updateDto.location !== undefined
    );
  }

  private buildAddress(dto: any): string {
    return `${dto.address1}, ${dto.address2 || ''}, ${dto.address3 || ''}, ${dto.district}, ${dto.city}, ${dto.state}, ${dto.postalCode}`;
  }

  private async getAddressByCep(postalCode: string): Promise<ViaCepResponse> {
    try {
      return await this.viaCepService.getAddressByCep(postalCode);
    } catch (error) {
      throw new StoreValidationException(
        `Erro ao buscar endereço pelo CEP: ${error.message}`,
      );
    }
  }

  private async getCoordinatesFromAddress(address: string) {
    try {
      return await this.googleMapsService.getCoordinatesFromAddress(address);
    } catch (error) {
      throw new StoreGeocodingException(
        `Erro ao geocodificar endereço: ${error.message}`,
      );
    }
  }

  private async calculateRoute(origin: string, destination: string): Promise<RouteData> {
    try {
      // Converter strings de endereço em objetos de localização
      const originLocation = await this.googleMapsService.getCoordinatesFromAddress(origin);
      const destinationLocation = await this.googleMapsService.getCoordinatesFromAddress(destination);
      
      const originObj = {
        type: 'Point',
        coordinates: [originLocation.lng, originLocation.lat]
      };
      
      const destinationObj = {
        type: 'Point',
        coordinates: [destinationLocation.lng, destinationLocation.lat]
      };
      
      return await this.googleMapsService.calculateDistance(originObj, destinationObj);
    } catch (error) {
      throw new StoreDistanceCalculationException('Erro ao calcular rota entre origem e destino');
    }
  }

  // Funções para busca por estado e CEP
  async findByState(state: string): Promise<StoreResponseDto> {
    try {
      const stores = await this.storeModel.find({ state: state.toUpperCase() }).exec();
      
      if (!stores.length) {
        return { stores: [], limit: 0, offset: 0, total: 0 };
      }

      const storesWithDetails = stores.map(store => this.mapToStoreDetailDto(store));

      return {
        stores: storesWithDetails,
        limit: storesWithDetails.length,
        offset: 0,
        total: storesWithDetails.length,
      };
    } catch (error) {
      throw this.handleError(error, `Erro ao buscar lojas no estado ${state}`);
    }
  }

  async findStoreByCEP(cep: string): Promise<StoreDetailDto> {
    // Mock de dados para teste
    const store: StoreDetailDto = {
      storeID: '67fa8b5112267c34e0743a7b',
      storeName: 'Loja Teste',
      takeOutInStore: true,
      shippingTimeInDays: 1,
      location: {
        type: 'Point',
        coordinates: [-46.633308, -23.550520]
      },
      address1: 'Rua Teste',
      address2: '',
      address3: '',
      city: 'São Paulo',
      district: 'Centro',
      state: 'SP',
      type: 'LOJA',
      country: 'Brasil',
      postalCode: cep,
      telephoneNumber: '(11) 1234-5678',
      emailAddress: 'contato@lojateste.com'
    };

    if (!store) {
      throw new StoreNotFoundException(`Loja com CEP ${cep} não encontrada`);
    }

    return store;
  }

  async calculateShipping(storeId: string, postalCode: string): Promise<StoreDistanceDto> {
    try {
      const store = await this.findOne(storeId);
      const address = await this.getAddressByCep(postalCode);
      
      const originStr = `${store.address1}, ${store.district}, ${store.city}, ${store.state}, Brasil`;
      const destinationStr = `${address.logradouro}, ${address.localidade}, ${address.uf}, Brasil`;
  
      const routeData = await this.calculateRoute(originStr, destinationStr);
      const shippingRequest = this.createShippingRequest(store.postalCode, postalCode);
  
      const shippingOptions = await this.melhorEnvioService.calculateShipping(shippingRequest.from.postal_code, shippingRequest.to.postal_code);
      
      // Filtrar apenas PAC e SEDEX
      const allowedServices = ['1', '2'];
      const filteredOptions = shippingOptions.filter(option => 
        allowedServices.includes(option.id.toString())
      );
      
      return {
        storeID: (store as any)._id.toString(),
        storeName: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: store.type,
        distance: this.formatDistance(routeData.distance),
        value: filteredOptions.map(option => ({
          prazo: `${option.delivery_time} dias úteis`,
          price: option.price.toString(),
          description: option.name,
          codProdutoAgencia: option.id.toString()
        }))
      };
    } catch (error) {
      throw this.handleError(error, 'Erro ao calcular frete');
    }
  }

  private mapToStoreDetailDto(store: StoreDocument): StoreDetailDto {
    return {
      storeID: store._id.toString(),
      storeName: store.storeName,
      takeOutInStore: store.takeOutInStore || true,
      shippingTimeInDays: store.shippingTimeInDays || 1,
      location: {
        type: 'Point',
        coordinates: store.location?.coordinates || [0, 0]
      },
      address1: store.address1,
      address2: store.address2 || '',
      address3: store.address3 || '',
      city: store.city,
      district: store.district,
      state: store.state,
      type: store.type || 'LOJA',
      country: store.country || 'Brasil',
      postalCode: store.postalCode,
      telephoneNumber: store.telephoneNumber || '',
      emailAddress: store.emailAddress || ''
    };
  }

  // Tratamento de erros centralizado
private handleError(error: any, prefix: string): never {
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  this.logger.error(`${prefix}: ${message}`, error instanceof Error ? error.stack : undefined);
  
  // Preservar exceções conhecidas
  if (
    error instanceof StoreNotFoundException ||
    error instanceof StoreDuplicateException ||
    error instanceof StoreGeocodingException ||
    error instanceof StoreDistanceCalculationException ||
    error instanceof StoreNoNearbyException ||
    error instanceof StoreValidationError
  ) {
    throw error;
  }
  
  // Converter erros de validação do Mongoose
  if (error?.name === 'ValidationError' && error?.errors) {
    const validationError = error as { errors: { [key: string]: { message: string } } };
    const errorMessages = Object.values(validationError.errors)
      .map(err => err.message)
      .join(', ');
    throw new StoreValidationException(`Erro de validação: ${errorMessages}`);
  }
  
  // Erro genérico
  throw new StoreValidationException(`${prefix}: ${message}`);
  }
}