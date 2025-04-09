
2025-04-08 16:46

Status: #nova

Tags: [[COMPASS/UOL]], [[projetos]], [[computação]], [[typescript]], [[backend]], [[Nest.js]], [[swagger]], [[jest]], [[node.js]], [[scrum]], [[SOLID]], [[Clean Code]], [[testes]], [[Qualidade]], [[OOP]], [[API]]

# Sumário

## Visão Geral do Projeto

- Título: Backlog para o Software de Calculo de Rotas V2.0

## Épicos

- Épico 1: Migração para NestJS
- Épico 2: Refatoração do Modelo de Loja
- Épico 3: Integração com APIs de Transporte
- Épico 4: Estruturação de Respostas da API
- Épico 5: Qualidade e Testes

## Histórias de Usuário

- Tabela de Histórias de Usuário
- Tabela de Histórias de Usuário - Critérios de Aceitação

## Estimativas e Planejamento

- Estimativa de Pontos de Sprint
- Plano de Execução: Tarefas, Subtarefas e Prazos
    - US-001: Migração para NestJS
    - US-003: Diferenciação de Tipos de Loja
    - US-005: Integração com Google Maps
    - US-006: Opções de Entrega pelos Correios
    - US-004: Visualização de Lojas por CEP
    - US-007: Respostas API com Paginação
    - US-011 e US-012: Endpoints de Listagem e Busca
    - US-008: Visualização de Lojas no Mapa
    - US-002: Documentação Swagger
    - US-009: Testes Unitários
    - US-010: Aplicação de SOLID e Clean Code
    - Revisão Final e Ajustes

# Título: Backlog para o Software de Calculo de Rotas V2.0

## Épico 1: Migração para NestJS

### Features:

1. **Estruturação inicial do projeto NestJS**
    - Configurar a estrutura base do projeto
    - Configurar conexão com MongoDB usando Mongoose
    - Configurar módulos principais
2. **Migração dos controladores**
    - Converter rotas Express para controladores NestJS
    - Implementar DTOs para validação de dados
    - Documentar endpoints com Swagger
3. **Migração dos serviços**
    - Refatorar lógica de negócios para services do NestJS
    - Implementar injeção de dependências seguindo princípios SOLID
    - Aplicar padrões de design do NestJS

## Épico 2: Refatoração do Modelo de Loja

### Features:

1. **Atualização da interface de Loja**
    - Implementar nova interface com tipos PDV e LOJA
    - Criar DTOs para validação de dados
    - Refatorar modelo MongoDB para o novo schema
2. **Implementação de cálculo de distância por tipo**
    - Desenvolver cálculo de entrega para lojas PDV (raio de 50km)
    - Implementar verificação de tipo para determinar método de entrega
3. **Implementação de métodos de listagem**
    - Desenvolver endpoint de listagem completa
    - Implementar filtro por CEP
    - Implementar filtro por ID
    - Implementar filtro por estado

## Épico 3: Integração com APIs de Transporte

### Features:

1. **Integração com API Google Maps**
    - Implementar serviço para cálculo de rota com Google Maps API
    - Migrar do OpenRouteAPI para Google Maps
    - Desenvolver adaptador para formatar respostas de distância
2. **Implementação de API dos Correios**
    - Criar serviço para cálculo de frete SEDEX
    - Implementar cálculo de frete PAC
    - Desenvolver formatação de respostas para o frontend
3. **Cálculo dinâmico de tempo de entrega**
    - Implementar lógica para cálculo de tempo com base no tipo de loja
    - Integrar tempo de preparação do pedido ao cálculo

## Épico 4: Estruturação de Respostas da API

### Features:

1. **Padronização de respostas**
    - Implementar interfaces de resposta conforme especificações
    - Criar transformadores para formatar dados
2. **Implementação de paginação**
    - Desenvolver sistema de paginação com limit e offset
    - Calcular total de registros
3. **Formatação de dados para geolocalização**
    - Implementar estrutura de pins para mapas
    - Formatar coordenadas conforme especificação

## Épico 5: Qualidade e Testes

### Features:

1. **Implementação de testes unitários**
    - Desenvolver testes para serviços
    - Implementar testes para controllers
    - Criar testes para middlewares e utils
2. **Documentação com Swagger**
    - Configurar Swagger no NestJS
    - Documentar todos os endpoints
    - Adicionar exemplos de requisição e resposta
3. **Refatoração para Clean Code**
    - Revisar código para princípios SOLID
    - Padronizar nomenclatura
    - Implementar tratamento de erros consistente

## Histórias de Usuário - Modelo INVEST

# Tabela de Histórias de Usuário

|ID|Título|Como|Eu quero|Para que|Tamanho|Valor|Dependências|
|---|---|---|---|---|---|---|---|
|US-001|Migração para NestJS|desenvolvedor|migrar a aplicação de Express para NestJS|possamos ter uma estrutura mais organizada e escalável do código|Grande|Médio|Nenhuma|
|US-002|Documentação Swagger|desenvolvedor|implementar a documentação Swagger para a API|outros desenvolvedores possam entender facilmente como utilizar a API|Médio|Médio|US-001|
|US-003|Diferenciação de Tipos de Loja|administrador do sistema|diferenciar entre lojas tipo PDV e lojas online|diferentes métodos de entrega possam ser aplicados de acordo com o tipo de loja|Médio|Alto|US-001|
|US-004|Visualização de Lojas por CEP|cliente|visualizar lojas próximas ao meu CEP|eu possa escolher a opção de entrega mais rápida ou econômica|Médio|Alto|US-003|
|US-005|Integração com Google Maps|desenvolvedor|substituir a integração com OpenRouteAPI pela API do Google Maps|possamos ter cálculos de rota mais precisos|Médio|Alto|US-001|
|US-006|Opções de Entrega pelos Correios|cliente|visualizar opções de entrega pelos Correios (SEDEX e PAC)|eu possa escolher o método que melhor atende minhas necessidades de prazo e custo|Grande|Alto|US-003, US-005|
|US-007|Respostas API com Paginação|desenvolvedor frontend|receber respostas padronizadas da API com dados de paginação|eu possa implementar uma interface de usuário com paginação|Pequeno|Médio|US-001|
|US-008|Visualização de Lojas no Mapa|cliente|visualizar lojas em um mapa|eu possa entender melhor a localização de cada uma|Pequeno|Médio|US-004|
|US-009|Testes Unitários|desenvolvedor|ter testes unitários para todos os serviços e controllers|possamos garantir a qualidade e estabilidade do código|Grande|Médio|Todas de implementação|
|US-010|Aplicação de SOLID e Clean Code|desenvolvedor|aplicar princípios SOLID e Clean Code na base de código|ela seja mais manutenível e extensível|Médio|Médio|Todas de implementação|
|US-011|Listagem de Todas as Lojas|administrador do sistema|listar todas as lojas disponíveis|eu possa gerenciar o cadastro de lojas|Pequeno|Médio|US-003|
|US-012|Busca de Loja por ID|administrador do sistema|buscar uma loja específica por ID|eu possa verificar seus detalhes|Pequeno|Baixo|US-003|

# Tabela de Histórias de Usuário - Critérios de Aceitação

|ID|Título|Critérios de Aceitação|
|---|---|---|
|US-001|Migração para NestJS|• A aplicação deve manter todas as funcionalidades existentes<br>• Os endpoints devem responder com os mesmos formatos de dados<br>• O tempo de resposta deve ser igual ou melhor que o atual<br>• Os testes existentes devem passar com a nova implementação|
|US-002|Documentação Swagger|• Todos os endpoints devem estar documentados<br>• Os modelos de dados devem estar descritos<br>• Exemplos de requisição e resposta devem ser fornecidos<br>• A documentação deve ser acessível via URL específica|
|US-003|Diferenciação de Tipos de Loja|• A nova interface de loja deve incluir o campo "type" com valores "PDV" ou "LOJA"<br>• Lojas do tipo PDV devem oferecer entrega própria para endereços em até 50km<br>• Lojas do tipo LOJA devem oferecer entregas via correios (SEDEX e PAC)<br>• Deve ser possível converter dados do modelo antigo para o novo|
|US-004|Visualização de Lojas por CEP|• O sistema deve retornar lojas PDV em um raio de 50km<br>• O sistema deve retornar lojas online independente da distância<br>• A distância deve ser calculada e exibida para cada loja<br>• A resposta deve incluir pins para visualização em mapas|
|US-005|Integração com Google Maps|• O serviço deve calcular corretamente a distância entre dois pontos<br>• O tempo estimado de percurso deve ser calculado<br>• Os dados devem ser formatados conforme o padrão da aplicação<br>• Deve haver tratamento adequado para erros de API|
|US-006|Opções de Entrega pelos Correios|• O sistema deve calcular o valor do frete para SEDEX<br>• O sistema deve calcular o valor do frete para PAC<br>• Os prazos de entrega devem ser calculados corretamente<br>• As informações devem ser exibidas de forma clara e comparativa|
|US-007|Respostas API com Paginação|• Todas as respostas de listagem devem incluir limit, offset e total<br>• O formato deve seguir o padrão definido nas especificações<br>• O sistema deve suportar parâmetros de paginação nas requisições<br>• O desempenho não deve ser afetado significativamente|
|US-008|Visualização de Lojas no Mapa|• O endpoint deve retornar pins com latitude e longitude<br>• Cada pin deve ter um título correspondente ao nome da loja<br>• Os dados devem seguir o formato especificado para pins<br>• A resposta deve ser otimizada para carregamento rápido|
|US-009|Testes Unitários|• Cobertura de testes de pelo menos 80% para services<br>• Cobertura de testes de pelo menos 70% para controllers<br>• Testes para casos de sucesso e falha<br>• Testes para cenários limites (edge cases)|
|US-010|Aplicação de SOLID e Clean Code|• Código refatorado seguindo princípios de responsabilidade única<br>• Dependências injetadas corretamente<br>• Nomenclatura clara e consistente<br>• Comentários relevantes onde necessário|
|US-011|Listagem de Todas as Lojas|• O endpoint deve retornar todas as lojas no formato especificado<br>• A resposta deve incluir dados de paginação<br>• O sistema deve permitir filtrar por estado<br>• O desempenho deve ser otimizado para grandes volumes de dados|
|US-012|Busca de Loja por ID|• O endpoint deve retornar os dados da loja correspondente ao ID<br>• Se o ID não existir, deve retornar um erro apropriado<br>• A resposta deve seguir o formato especificado<br>• O tempo de resposta deve ser otimizado|

# Estimativa de Pontos de Sprint

## US-001: Migração para NestJS (Total: 8 pontos)

- Configuração do projeto NestJS: 3 pontos
- Migração dos controladores: 2 pontos
- Migração dos serviços: 3 pontos

## US-003: Diferenciação de Tipos de Loja (Total: 5 pontos)

- Atualização do modelo de dados: 2 pontos
- Implementação da lógica de tipos: 3 pontos

## US-005: Integração com Google Maps (Total: 5 pontos)

- Configuração da API Google Maps: 1 ponto
- Implementação do serviço de rotas: 3 pontos
- Testes de integração: 1 ponto

## US-006: Opções de Entrega pelos Correios (Total: 8 pontos)

- Implementação da API dos Correios: 3 pontos
- Cálculos de prazo e valor: 3 pontos
- Integração com sistema existente: 2 pontos

## US-004: Visualização de Lojas por CEP (Total: 5 pontos)

- Implementação da busca por proximidade: 3 pontos
- Formatação de resposta com pins: 2 pontos

## US-007: Respostas API com Paginação (Total: 3 pontos)

- Implementação do sistema de paginação: 2 pontos
- Testes de desempenho: 1 ponto

## US-011 e US-012: Endpoints de Listagem e Busca (Total: 3 pontos)

- Implementação de listagem de lojas: 2 pontos
- Implementação de busca por ID: 1 ponto

## US-008: Visualização de Lojas no Mapa (Total: 3 pontos)

- Formatação de dados para mapas: 2 pontos
- Integração com endpoints existentes: 1 ponto

## US-002: Documentação Swagger (Total: 2 pontos)

- Configuração do Swagger: 1 ponto
- Documentação dos endpoints: 1 ponto

## US-009: Testes Unitários (Total: 5 pontos)

- Implementação de testes para serviços: 2 pontos
- Implementação de testes para controladores: 2 pontos
- Implementação de testes para utils e helpers: 1 ponto

## US-010: Aplicação de SOLID e Clean Code (Total: 5 pontos)

- Refatoração para princípios SOLID: 3 pontos
- Limpeza e padronização de código: 2 pontos

## Revisão Final e Ajustes (Total: 3 pontos)

- Testes de integração completos: 2 pontos
- Otimizações finais: 1 ponto

**Total de Pontos da Sprint: 55 pontos**

# Plano de Execução: Tarefas, Subtarefas e Prazos

## US-001: Migração para NestJS

**Prazo Total: 2 dias (08/04 - 09/04)**

### Tarefas:

1. **Configuração do projeto NestJS (0,5 dia)**
    
    - Instalar NestJS CLI
    - Criar estrutura base do projeto
    - Configurar conexão com MongoDB
2. **Migração dos controladores (0,5 dia)**
    
    - Converter rotas Express para controladores NestJS
    - Implementar middleware de autenticação
    - Configurar injeção de dependências
3. **Migração dos serviços (1 dia)**
    
    - Refatorar serviços para o padrão NestJS
    - Implementar interfaces e DTOs
    - Testar endpoints básicos

## US-003: Diferenciação de Tipos de Loja

**Prazo Total: 1 dia (10/04)**

### Tarefas:

1. **Atualização do modelo de dados (0,5 dia)**
    
    - Criar nova interface de loja
    - Atualizar schema do MongoDB
    - Implementar DTOs para validação
2. **Implementação da lógica de tipos (0,5 dia)**
    
    - Desenvolver lógica para diferenciar PDV e LOJA
    - Implementar cálculo de distância para PDV
    - Testar conversão entre modelos antigo e novo

## US-005: Integração com Google Maps

**Prazo Total: 1 dia (11/04)**

### Tarefas:

1. **Configuração da API Google Maps (0,25 dia)**
    
    - Obter credenciais de API
    - Configurar cliente HTTP
    - Implementar camada de cache
2. **Implementação do serviço de rotas (0,5 dia)**
    
    - Desenvolver métodos para cálculo de distância
    - Implementar conversão de formato de coordenadas
    - Criar adaptadores para resposta da API
3. **Testes de integração (0,25 dia)**
    
    - Testar cenários de sucesso
    - Implementar tratamento de erros
    - Validar precisão dos cálculos

## US-006: Opções de Entrega pelos Correios

**Prazo Total: 1,5 dias (11/04 - 12/04)**

### Tarefas:

1. **Implementação da API dos Correios (0,75 dia)**
    
    - Configurar cliente para API dos Correios
    - Implementar cálculos para SEDEX
    - Implementar cálculos para PAC
2. **Cálculos de prazo e valor (0,5 dia)**
    
    - Desenvolver lógica para cálculo de prazos
    - Implementar formatação de valores
    - Criar lógica para escolha de melhor opção
3. **Integração com sistema existente (0,25 dia)**
    
    - Conectar com serviço de lojas
    - Testar fluxo completo
    - Ajustar formatação de respostas

## US-004: Visualização de Lojas por CEP

**Prazo Total: 1 dia (12/04 - 13/04)**

### Tarefas:

1. **Implementação da busca por proximidade (0,5 dia)**
    
    - Desenvolver query geoespacial para MongoDB
    - Implementar filtro por raio de 50km para PDV
    - Criar lógica para inclusão de lojas online
2. **Formatação de resposta com pins (0,5 dia)**
    
    - Implementar estrutura de pins para mapas
    - Formatar dados de distância
    - Testar diferentes cenários de busca

## US-007: Respostas API com Paginação

**Prazo Total: 0,5 dia (13/04)**

### Tarefas:

1. **Implementação do sistema de paginação (0,25 dia)**
    
    - Desenvolver middleware de paginação
    - Implementar interceptor para formatação de resposta
    - Criar estrutura padrão de resposta
2. **Testes de desempenho (0,25 dia)**
    
    - Testar com volumes grandes de dados
    - Otimizar queries
    - Validar formato de resposta

## US-011 e US-012: Endpoints de Listagem e Busca

**Prazo Total: 0,5 dia (13/04)**

### Tarefas:

1. **Implementação de listagem de lojas (0,25 dia)**
    
    - Desenvolver endpoint listAll
    - Implementar filtro por estado
    - Integrar com sistema de paginação
2. **Implementação de busca por ID (0,25 dia)**
    
    - Desenvolver endpoint storeById
    - Implementar tratamento de erros
    - Testar casos de sucesso e falha

## US-008: Visualização de Lojas no Mapa

**Prazo Total: 0,5 dia (14/04)**

### Tarefas:

1. **Formatação de dados para mapas (0,25 dia)**
    
    - Implementar transformador para formato de pins
    - Otimizar dados para frontend
    - Testar integração com Google Maps
2. **Integração com endpoints existentes (0,25 dia)**
    
    - Incluir pins nas respostas de busca
    - Testar performance
    - Validar formato dos dados

## US-002: Documentação Swagger

**Prazo Total: 0,5 dia (14/04)**

### Tarefas:

1. **Configuração do Swagger (0,25 dia)**
    
    - Instalar e configurar pacotes
    - Definir informações básicas da API
    - Configurar autenticação no Swagger
2. **Documentação dos endpoints (0,25 dia)**
    
    - Adicionar anotações aos controladores
    - Documentar DTOs e modelos
    - Incluir exemplos de requisição e resposta

## US-009: Testes Unitários

**Prazo Total: 1 dia (15/04)**

### Tarefas:

1. **Implementação de testes para serviços (0,5 dia)**
    
    - Criar testes para serviços de loja
    - Criar testes para serviços de entrega
    - Criar testes para integrações externas
2. **Implementação de testes para controladores (0,25 dia)**
    
    - Criar testes para endpoints
    - Testar validações de entrada
    - Testar fluxos de erro
3. **Implementação de testes para utils e helpers (0,25 dia)**
    
    - Criar testes para funções auxiliares
    - Testar transformadores
    - Validar cobertura de código

## US-010: Aplicação de SOLID e Clean Code

**Prazo Total: 1 dia (16/04 - 17/04)**

### Tarefas:

1. **Refatoração para princípios SOLID (0,5 dia)**
    
    - Revisar responsabilidade única
    - Otimizar injeção de dependências
    - Aplicar princípio de substituição de Liskov
2. **Limpeza e padronização de código (0,5 dia)**
    
    - Padronizar nomenclatura
    - Otimizar imports e dependências
    - Adicionar comentários relevantes

## Revisão Final e Ajustes

**Prazo: 1 dia (17/04 - 18/04)**

### Tarefas:

1. **Testes de integração completos (0,5 dia)**
    
    - Testar fluxos completos
    - Validar casos de borda
    - Corrigir problemas identificados
2. **Otimizações finais (0,5 dia)**
    
    - Ajustar performance
    - Revisar documentação
    - Preparar para deploy