import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreResponseDto, StoreWithRouteResponseDto, StoreDetailDto } from '../dto/store-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { StoreDistanceResponseDto } from '../dto/store-distance-response.dto';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  private readonly logger = new Logger(StoreController.name);

  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova loja',
    description: 'Cria uma nova loja com as informações fornecidas, incluindo sua localização geográfica'
  })
  @ApiBody({
    type: CreateStoreDto,
    description: 'Dados da loja a ser criada',
    examples: {
      'loja-exemplo': {
        value: {
          storeName: "Loja Centro SP",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          address1: "Avenida Paulista, 1000",
          address2: "Andar 10",
          address3: "Sala 1001",
          city: "São Paulo",
          district: "Bela Vista",
          state: "SP",
          type: "LOJA",
          country: "Brasil",
          postalCode: "01310-100",
          telephoneNumber: "(11) 3456-7890",
          emailAddress: "loja.centro@minhaloja.com",
          location: {
            type: "Point",
            coordinates: [-46.633308, -23.550520]
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Loja criada com sucesso',
    type: StoreResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos'
  })
  async create(@Body() createStoreDto: CreateStoreDto) {
    this.logger.log(`[POST /stores] Criando nova loja com dados: ${JSON.stringify(createStoreDto)}`);
    try {
      const result = await this.storeService.create(createStoreDto);
      this.logger.log(`[POST /stores] Loja criada com sucesso: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[POST /stores] Erro ao criar loja: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas as lojas',
    description: 'Retorna uma lista de todas as lojas cadastradas no sistema, incluindo lojas ativas e inativas.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de lojas retornada com sucesso',
    type: [StoreWithRouteResponseDto]
  })
  async findAll() {
    this.logger.log('[GET /stores] Buscando todas as lojas');
    try {
      const result = await this.storeService.findAll();
      this.logger.log(`[GET /stores] ${result.length} lojas encontradas`);
      return result;
    } catch (error) {
      this.logger.error(`[GET /stores] Erro ao buscar lojas: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('nearby/:cep')
@ApiOperation({ 
  summary: 'Busca lojas próximas a um CEP',
  description: 'Encontra lojas próximas a um determinado CEP, ordenadas por distância. Retorna opções de frete para cada loja.'
})
@ApiParam({ 
  name: 'cep', 
  description: 'CEP de referência para busca de lojas próximas',
  example: '01310-100',
  required: true
})
@ApiResponse({ 
  status: 200, 
  description: 'Lojas próximas retornadas com sucesso',
  type: [StoreDistanceResponseDto]
})
@ApiResponse({ 
  status: 400, 
  description: 'CEP inválido ou em formato incorreto'
})
@ApiResponse({ 
  status: 404, 
  description: 'Nenhuma loja encontrada próxima ao CEP informado'
})
async findNearby(@Param('cep') cep: string): Promise<StoreDistanceResponseDto[]> {
  this.logger.log(`[GET /stores/nearby/${cep}] Buscando lojas próximas ao CEP: ${cep}`);
  try {
    const stores = await this.storeService.findNearby(cep);
    this.logger.log(`[GET /stores/nearby/${cep}] ${stores.length} lojas encontradas`);
    return stores;
  } catch (error) {
    this.logger.error(`[GET /stores/nearby/${cep}] Erro ao buscar lojas próximas: ${error.message}`, error.stack);
    throw error;
  }
}

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar uma loja pelo ID',
    description: 'Retorna os detalhes completos de uma loja específica a partir do seu ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da loja a ser buscada', 
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Loja encontrada com sucesso',
    type: StoreWithRouteResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Loja não encontrada com o ID fornecido',
    schema: {
      example: {
        statusCode: 404,
        message: "Loja com ID 507f1f77bcf86cd799439011 não encontrada",
        error: "Not Found"
      }
    }
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`[GET /stores/${id}] Buscando loja pelo ID: ${id}`);
    try {
      const result = await this.storeService.findOne(id);
      this.logger.log(`[GET /stores/${id}] Loja encontrada: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[GET /stores/${id}] Erro ao buscar loja: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar uma loja',
    description: 'Atualiza os dados de uma loja existente a partir do seu ID. Apenas os campos fornecidos serão atualizados.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da loja a ser atualizada', 
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiBody({ 
    type: UpdateStoreDto,
    description: 'Dados a serem atualizados na loja',
    examples: {
      example1: {
        value: {
          storeName: "Loja Centro São Paulo - Atualizada",
          telephoneNumber: "(11) 4321-5678"
        },
        summary: 'Exemplo de atualização parcial de loja'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Loja atualizada com sucesso',
    type: StoreWithRouteResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos para atualização',
    schema: {
      example: {
        statusCode: 400,
        message: "Dados inválidos para atualização da loja",
        error: "Bad Request"
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Loja não encontrada com o ID fornecido',
    schema: {
      example: {
        statusCode: 404,
        message: "Loja com ID 507f1f77bcf86cd799439011 não encontrada",
        error: "Not Found"
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    this.logger.log(`[PATCH /stores/${id}] Atualizando loja com dados: ${JSON.stringify(updateStoreDto)}`);
    try {
      const result = await this.storeService.update(id, updateStoreDto);
      this.logger.log(`[PATCH /stores/${id}] Loja atualizada com sucesso: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[PATCH /stores/${id}] Erro ao atualizar loja: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover uma loja',
    description: 'Remove permanentemente uma loja do sistema a partir do seu ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da loja a ser removida', 
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Loja removida com sucesso',
    schema: {
      example: {
        message: "Loja com ID 507f1f77bcf86cd799439011 removida com sucesso"
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Loja não encontrada com o ID fornecido',
    schema: {
      example: {
        statusCode: 404,
        message: "Loja com ID 507f1f77bcf86cd799439011 não encontrada",
        error: "Not Found"
      }
    }
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`[DELETE /stores/${id}] Removendo loja`);
    try {
      await this.storeService.remove(id);
      this.logger.log(`[DELETE /stores/${id}] Loja removida com sucesso`);
      return { message: `Loja com ID ${id} removida com sucesso` };
    } catch (error) {
      this.logger.error(`[DELETE /stores/${id}] Erro ao remover loja: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('state/:state')
  @ApiOperation({ 
    summary: 'Busca lojas por estado',
    description: 'Retorna todas as lojas cadastradas em um determinado estado (UF).'
  })
  @ApiParam({ 
    name: 'state', 
    description: 'Estado (UF) para busca de lojas', 
    example: 'SP',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lojas encontradas com sucesso',
    type: StoreResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Estado inválido ou em formato incorreto',
    schema: {
      example: {
        statusCode: 400,
        message: "Estado inválido: formato deve ser uma UF válida (ex: SP, RJ, PE)",
        error: "Bad Request"
      }
    }
  })
  async findByState(
    @Param('state') state: string,
  ): Promise<StoreResponseDto> {
    this.logger.log(`[GET /stores/state/${state}] Buscando lojas no estado: ${state}`);
    try {
      const result = await this.storeService.findByState(state);
      this.logger.log(`[GET /stores/state/${state}] ${result.stores.length} lojas encontradas`);
      return result;
    } catch (error) {
      this.logger.error(`[GET /stores/state/${state}] Erro ao buscar lojas por estado: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':cep')
  @ApiOperation({ 
    summary: 'Busca loja por CEP',
    description: 'Retorna os detalhes de uma loja específica a partir do seu CEP.'
  })
  @ApiParam({ 
    name: 'cep', 
    description: 'CEP da loja a ser buscada',
    example: '01310-100',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Loja encontrada com sucesso',
    type: StoreDetailDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Loja não encontrada com o CEP fornecido',
    schema: {
      example: {
        statusCode: 404,
        message: "Loja com CEP 01310-100 não encontrada",
        error: "Not Found"
      }
    }
  })
  async findStoreByCEP(@Param('cep') cep: string): Promise<StoreDetailDto> {
    this.logger.log(`[GET /stores/${cep}] Buscando loja pelo CEP: ${cep}`);
    try {
      const result = await this.storeService.findStoreByCEP(cep);
      this.logger.log(`[GET /stores/${cep}] Loja encontrada: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[GET /stores/${cep}] Erro ao buscar loja por CEP: ${error.message}`, error.stack);
      throw error;
    }
  }
}