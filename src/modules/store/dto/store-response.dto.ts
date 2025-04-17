import { StoreDto } from './store.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    description: 'Tipo do ponto geográfico (sempre deve ser "Point")',
    example: 'Point',
    enum: ['Point']
  })
  type: string;

  @ApiProperty({
    description: 'Coordenadas da loja no formato [longitude, latitude]',
    example: [-46.633308, -23.550520]
  })
  coordinates: number[];
}

export class StoreDetailDto {
  @ApiProperty({
    description: 'ID da loja',
    example: '67fa8b5112267c34e0743a7b'
  })
  storeID: string;

  @ApiProperty({
    description: 'Nome da loja',
    example: 'Loja Centro São Paulo'
  })
  storeName: string;

  @ApiProperty({
    description: 'Indica se a loja permite retirada no local',
    example: true
  })
  takeOutInStore: boolean;

  @ApiProperty({
    description: 'Tempo de entrega em dias',
    example: 1
  })
  shippingTimeInDays: number;

  @ApiProperty({
    description: 'Localização geográfica da loja',
    type: LocationDto
  })
  location: LocationDto;

  @ApiProperty({
    description: 'Endereço principal da loja',
    example: 'Avenida Paulista'
  })
  address1: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: ''
  })
  address2: string;

  @ApiProperty({
    description: 'Complemento adicional do endereço',
    example: ''
  })
  address3: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo'
  })
  city: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Bela Vista'
  })
  district: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP'
  })
  state: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'LOJA',
    enum: ['PDV', 'LOJA']
  })
  type: 'PDV' | 'LOJA';

  @ApiProperty({
    description: 'País',
    example: 'Brasil'
  })
  country: string;

  @ApiProperty({
    description: 'CEP da loja',
    example: '01310-100'
  })
  postalCode: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '(11) 4321-1234'
  })
  telephoneNumber: string;

  @ApiProperty({
    description: 'Endereço de e-mail',
    example: 'sp.centro@minhaloja.com'
  })
  emailAddress: string;
}

export class StoreResponseDto {
  @ApiProperty({
    description: 'Lista de lojas encontradas',
    type: [StoreDetailDto]
  })
  stores: StoreDetailDto[];

  @ApiProperty({
    description: 'Número máximo de lojas retornadas',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Número de lojas puladas na paginação',
    example: 0
  })
  offset: number;

  @ApiProperty({
    description: 'Total de lojas encontradas',
    example: 1
  })
  total: number;
}

export class StoreWithRouteResponseDto extends StoreDetailDto {
  @ApiProperty({
    description: 'Distância até o endereço de destino',
    example: '2.5km'
  })
  distance?: string;

  @ApiProperty({
    description: 'Opções de frete disponíveis',
    type: [Object]
  })
  shippingOptions?: any[];
}

export class ShippingOptionDto {
  @ApiProperty({
    description: 'Prazo de entrega',
    example: '3 dias úteis'
  })
  prazo: string;

  @ApiProperty({
    description: 'Preço do frete',
    example: '15.90'
  })
  price: string;

  @ApiProperty({
    description: 'Descrição do serviço de entrega',
    example: 'PAC'
  })
  description: string;

  @ApiProperty({
    description: 'Código do produto da agência (opcional)',
    example: '123456',
    required: false
  })
  codProdutoAgencia?: string;
}

export class StoreDistanceDto {
  @ApiProperty({
    description: 'Nome da loja',
    example: 'Loja Centro'
  })
  name: string;

  @ApiProperty({
    description: 'Cidade da loja',
    example: 'São Paulo'
  })
  city: string;

  @ApiProperty({
    description: 'CEP da loja',
    example: '01234-567'
  })
  postalCode: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'LOJA',
    enum: ['PDV', 'LOJA']
  })
  type: 'PDV' | 'LOJA';

  @ApiProperty({
    description: 'Distância até a loja',
    example: '2.5 km'
  })
  distance: string;

  @ApiProperty({
    description: 'Opções de frete disponíveis',
    type: [ShippingOptionDto]
  })
  value: ShippingOptionDto[];
}

export class PinMapDto {
  @ApiProperty({
    description: 'Posição do pin no mapa',
    example: {
      lat: '-23.550520',
      lng: '-46.633308'
    }
  })
  position: {
    lat: string;
    lng: string;
  };

  @ApiProperty({
    description: 'Título do pin',
    example: 'Loja Centro'
  })
  title: string;
}

export class ShippingInfoDto {
  @ApiProperty({
    description: 'Nome do serviço de entrega',
    example: 'PAC'
  })
  service: string;

  @ApiProperty({
    description: 'Preço do frete',
    example: 15.90
  })
  price: number;

  @ApiProperty({
    description: 'Tempo de entrega em dias',
    example: 3
  })
  deliveryTime: number;
}

export function mapStoreToResponseDto(store: any, routeData?: any, shippingOptions?: any, pdvDeliveryFee?: number): StoreWithRouteResponseDto {
  const location: LocationDto = {
    type: 'Point',
    coordinates: [
      parseFloat(store.location?.coordinates?.[0]?.toString() || '0'),
      parseFloat(store.location?.coordinates?.[1]?.toString() || '0')
    ]
  };

  const storeDto: StoreDto = {
    _id: (store as any)._id?.toString(),
    storeName: store.storeName,
    takeOutInStore: store.takeOutInStore || true,
    shippingTimeInDays: store.shippingTimeInDays || 1,
    location,
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
    emailAddress: store.emailAddress || '',
  };

  if (routeData) {
    return {
      storeID: storeDto._id,
      ...storeDto,
      distance: formatDistance(routeData.distance),
      shippingOptions,
    };
  }

  return {
    storeID: storeDto._id,
    ...storeDto,
    distance: '',
    shippingOptions: [],
  };
}

function formatDistance(distance: number): string {
  if (!distance) return '';
  return `${(distance / 1000).toFixed(1)} km`;
}

function formatDuration(duration: number): string {
  if (!duration) return '';
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}min`;
}