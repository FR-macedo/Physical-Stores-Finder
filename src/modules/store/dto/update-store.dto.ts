import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsEnum, IsPositive, ValidateNested, IsObject, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LocationDto {
  @ApiProperty({
    description: 'Tipo do ponto geográfico (sempre deve ser "Point")',
    example: 'Point',
    enum: ['Point']
  })
  @IsString()
  @IsEnum(['Point'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Coordenadas da loja no formato [longitude, latitude]',
    example: [-46.633308, -23.550520]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  coordinates: number[];
}

export class UpdateStoreDto {
  @ApiProperty({
    description: 'Nome da loja',
    example: 'Loja Centro São Paulo',
    required: false
  })
  @IsString()
  @IsOptional()
  storeName?: string;

  @ApiProperty({
    description: 'Indica se a loja permite retirada no local',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  takeOutInStore?: boolean;

  @ApiProperty({
    description: 'Tempo de entrega em dias',
    example: 1,
    default: 1,
    required: false
  })
  @IsPositive()
  @IsOptional()
  shippingTimeInDays?: number;

  @ApiProperty({
    description: 'Localização geográfica da loja',
    type: LocationDto,
    required: false
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({
    description: 'Endereço principal da loja',
    example: 'Avenida Paulista',
    required: false
  })
  @IsString()
  @IsOptional()
  address1?: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: '',
    required: false
  })
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiProperty({
    description: 'Complemento adicional do endereço',
    example: '',
    required: false
  })
  @IsString()
  @IsOptional()
  address3?: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
    required: false
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Bela Vista',
    required: false
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP',
    required: false
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'LOJA',
    enum: ['PDV', 'LOJA'],
    default: 'LOJA',
    required: false
  })
  @IsEnum(['PDV', 'LOJA'])
  @IsOptional()
  type?: 'PDV' | 'LOJA';

  @ApiProperty({
    description: 'País',
    example: 'Brasil',
    default: 'Brasil',
    required: false
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'CEP da loja',
    example: '01310-100',
    required: false
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '(11) 4321-1234',
    required: false
  })
  @IsString()
  @IsOptional()
  telephoneNumber?: string;

  @ApiProperty({
    description: 'Endereço de e-mail',
    example: 'sp.centro@minhaloja.com',
    required: false
  })
  @IsString()
  @IsOptional()
  emailAddress?: string;
}