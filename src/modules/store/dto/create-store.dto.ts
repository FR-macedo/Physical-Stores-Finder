import { IsString, IsNotEmpty, IsArray, IsNumber, ValidateNested, IsBoolean, IsOptional, IsEnum, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  @IsNotEmpty()
  type: string = 'Point';

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsOptional()
  address3?: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string = 'Brasil';

  @IsBoolean()
  @IsOptional()
  takeOutInStore: boolean = true;

  @IsPositive()
  @IsOptional()
  shippingTimeInDays: number = 1;

  @IsEnum(['PDV', 'LOJA'])
  @IsOptional()
  type: string = 'LOJA';

  @IsString()
  @IsOptional()
  telephoneNumber?: string;

  @IsString()
  @IsOptional()
  emailAddress?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}