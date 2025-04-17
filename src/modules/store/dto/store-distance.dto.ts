import { ApiProperty } from '@nestjs/swagger';

export class StoreDistanceDto {
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
    description: 'Cidade',
    example: 'São Paulo'
  })
  city: string;

  @ApiProperty({
    description: 'CEP da loja',
    example: '01310-100'
  })
  postalCode: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'LOJA',
    enum: ['PDV', 'LOJA']
  })
  type: 'PDV' | 'LOJA';

  @ApiProperty({
    description: 'Distância até o endereço de destino',
    example: '2.5km'
  })
  distance: string;

  @ApiProperty({
    description: 'Opções de frete disponíveis',
    type: [Object]
  })
  value: {
    prazo: string;
    price: string;
    description: string;
    codProdutoAgencia: string;
  }[];
} 