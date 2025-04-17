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

export class CreateStoreDto {
  @ApiProperty({
    description: 'Nome da loja',
    example: 'Loja Centro São Paulo'
  })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({
    description: 'Indica se a loja permite retirada no local',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  takeOutInStore?: boolean = true;

  @ApiProperty({
    description: 'Tempo de entrega em dias',
    example: 1,
    default: 1
  })
  @IsPositive()
  @IsOptional()
  shippingTimeInDays?: number = 1;

  @ApiProperty({
    description: 'Endereço principal da loja',
    example: 'Avenida Paulista, 1000'
  })
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Andar 10',
    required: false
  })
  @IsString()
  @IsOptional()
  address2?: string = '';

  @ApiProperty({
    description: 'Complemento adicional do endereço',
    example: 'Sala 1001',
    required: false
  })
  @IsString()
  @IsOptional()
  address3?: string = '';

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo'
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Bela Vista'
  })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP'
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'LOJA',
    enum: ['PDV', 'LOJA'],
    default: 'LOJA'
  })
  @IsEnum(['PDV', 'LOJA'])
  @IsOptional()
  type?: 'PDV' | 'LOJA' = 'LOJA';

  @ApiProperty({
    description: 'País',
    example: 'Brasil',
    default: 'Brasil'
  })
  @IsString()
  @IsOptional()
  country?: string = 'Brasil';

  @ApiProperty({
    description: 'CEP da loja',
    example: '01310-100'
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '(11) 3456-7890'
  })
  @IsString()
  @IsNotEmpty()
  telephoneNumber: string;

  @ApiProperty({
    description: 'Endereço de e-mail',
    example: 'loja.centro@minhaloja.com'
  })
  @IsString()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    description: 'Localização geográfica da loja',
    type: LocationDto
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;
}