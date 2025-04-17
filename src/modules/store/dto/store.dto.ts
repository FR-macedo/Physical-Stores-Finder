import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from './store-response.dto';

export class StoreDto {
  @ApiProperty({
    description: 'ID único da loja',
    example: '507f1f77bcf86cd799439011'
  })
  _id: string;

  @ApiProperty({
    description: 'Nome da loja',
    example: 'Loja Centro'
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
    example: 'Rua das Flores'
  })
  address1: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Bloco B'
  })
  address2: string;

  @ApiProperty({
    description: 'Complemento adicional do endereço',
    example: 'Sala 101'
  })
  address3: string;

  @ApiProperty({
    description: 'Cidade da loja',
    example: 'São Paulo'
  })
  city: string;

  @ApiProperty({
    description: 'Bairro da loja',
    example: 'Centro'
  })
  district: string;

  @ApiProperty({
    description: 'Estado da loja',
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
    description: 'País da loja',
    example: 'Brasil'
  })
  country: string;

  @ApiProperty({
    description: 'CEP da loja',
    example: '01234-567'
  })
  postalCode: string;

  @ApiProperty({
    description: 'Número de telefone da loja',
    example: '(11) 1234-5678'
  })
  telephoneNumber: string;

  @ApiProperty({
    description: 'Endereço de e-mail da loja',
    example: 'contato@loja.com'
  })
  emailAddress: string;
} 