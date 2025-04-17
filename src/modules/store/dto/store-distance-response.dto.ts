import { ApiProperty } from '@nestjs/swagger';

export class ShippingOptionDto {
  @ApiProperty({
    description: 'Prazo de entrega',
    example: '3 dias úteis'
  })
  prazo: string;

  @ApiProperty({
    description: 'Preço do frete',
    example: 'R$ 15.90'
  })
  price: string;

  @ApiProperty({
    description: 'Descrição do serviço de entrega',
    example: 'PAC'
  })
  description: string;

  @ApiProperty({
    description: 'Código do produto da agência',
    example: '04510'
  })
  codProdutoAgencia: string;
}

export class StoreDistanceResponseDto {
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