# Physical Stores API

API RESTful que fornece dados de geolocalização de lojas físicas, permitindo encontrar as lojas mais próximas com base no CEP do usuário.

![Versão](https://img.shields.io/badge/versão-2.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#️-configuração-das-variáveis-de-ambiente)
- [Endpoints](#-endpoints)
- [Modelos de Dados](#-modelos-de-dados)
- [Serviços Integrados](#-serviços-integrados)
- [Scripts](#-scripts)
- [Testes](#testes)
- [Licença](#-licença)

## 🔍 Visão Geral

Physical Stores API é uma aplicaçãoem em Node.js desenvolvida com Nest que permite encontrar lojas físicas próximas a um determinado CEP e calcular o custo de frete de um produto para este endereço. A API utiliza múltiplos serviços de geolocalização para calcular distâncias e rotas entre o endereço do usuário e as lojas cadastradas. Também utiliza a API do Melhor Envio para realizar uma busca por empresas de frete que atendama aquela area.

## Estrutura do Projeto


```
Repo
├──src
│   ├──common
│   │   └──exceptions
│   │   │   ├──base-api.error.ts
│   │   │   ├──base.exception.ts
│   │   │   └──global-exception.filter.ts
│   ├──config
│   │   └──configuration.ts
│   ├──filters
│   │   └──http-exception.filter.ts
│   ├──modules
│   │   ├──external
│   │   │   ├──exceptions
│   │   │   │   ├──external-api.exception.ts
│   │   │   │   ├──google-maps-api.error.ts
│   │   │   │   ├──google-maps.exception.ts
│   │   │   │   └──melhor-envio-api.error.ts
│   │   │   ├──filters
│   │   │   ├──interfaces
│   │   │   ├──services
│   │   │   │   ├──base-external-api.service.ts
│   │   │   │   ├──google-maps.service.spec.ts
│   │   │   │   ├──google-maps.service.ts
│   │   │   │   ├──melhor-envio.service.spec.ts
│   │   │   │   ├──melhor-envio.service.ts
│   │   │   │   ├──via-cep.service.spec.ts
│   │   │   │   └──via-cep.service.ts
│   │   │   └──external.module.ts
│   │   └──store
│   │   │   ├──controllers
│   │   │   │   ├──store.controller.spec.ts
│   │   │   │   └──store.controller.ts
│   │   │   ├──dto
│   │   │   │   ├──create-store.dto.ts
│   │   │   │   ├──store-distance-response.dto.ts
│   │   │   │   ├──store-distance.dto.ts
│   │   │   │   ├──store-response.dto.ts
│   │   │   │   ├──store.dto.ts
│   │   │   │   └──update-store.dto.ts
│   │   │   ├──entities
│   │   │   │   └──store.entity.ts
│   │   │   ├──exceptions
│   │   │   │   ├──store-validation.error.ts
│   │   │   │   └──store.exception.ts
│   │   │   ├──schemas
│   │   │   │   └──store.schema.ts
│   │   │   ├──seeds
│   │   │   │   └──store.seed.ts
│   │   │   ├──services
│   │   │   │   └──store.service.ts
│   │   │   └──store.module.ts
│   ├──providers
│   │   └──database
│   │   │   ├──database.connection.spec.ts
│   │   │   ├──database.connection.ts
│   │   │   ├──database.module.ts
│   │   │   ├──database.service.spec.ts
│   │   │   └──database.service.ts
│   ├──app.controller.spec.ts
│   ├──app.controller.ts
│   ├──app.module.ts
│   ├──app.service.ts
│   └──main.ts
├──test
│   ├──app.e2e-spec.ts
│   └──jest-e2e.json
├──eslint.config.mjs
├──LICENSE
├──nest-cli.json
├──package-lock.json
├──package.json
├──README.md
├──tsconfig.build.json
├──tsconfig.json
├──.gitignore
└──.prettierrc
```

## Principais Funcionalidades

- Cálculo da loja mais próxima com base no CEP do usuário
- Estimativa de distância e tempo de deslocamento
- Suporte a falhas com método alternativo de cálculo de distância (Haversine)
- Retorno da loja mais próxima e outras lojas dentro de um raio de especificado
- Calculo de frete através do CEP do usuário

## 🔧 Tecnologias

- **Node.js** - Ambiente de execução
- **TypeScript** - Linguagem de programação
- **Nest** - Framework para criação de server side apliccations
- **Mongoose** - ODM para MongoDB
- **Axios** - Cliente HTTP para requisições
- **Jest** - Framework de testes

## 📥 Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITÓRIO]
cd physical-stores-api

# Instale as dependências
npm install

# Compile o projeto
npm run start
```

## ⚙️ Configuração das Variáveis de Ambiente

Antes de iniciar a aplicação, certifique-se de configurar as variáveis de ambiente corretamente.  
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```ini
PORT=3000
MONGODB_URI=<urlparaseubanco>
NODE_ENV=development
GOOGLE_MAPS_API_KEY=<suachave>
MELHOR_ENVIO_TOKEN=<seutoken>
PDV_DELIVERY_FEE=15.00
PDV_MAX_DELIVERY_DISTANCE=50

```

## Testes

Utilizei o Jest para criar testes unitários para os serviço que se comunicam com APIs externas e também para o controlador de rotas para manipulação dos dados das rotas. 

**Rode esse comando e os testes serão analizados:**

```
npm run test
```

## 🔗 Endpoints

Enquanto o software estiver rodando é possível ter acesso a uma documentação das rotas através do [SWAGGER](localhost:3000/docs)

## 📊 Modelos de Dados

### Store (Loja)

```typescript
{
		"location": {
			"type": "Point",
			"coordinates": [
				-46.6333,
				-23.5505
			]
		},
		"_id": "68015bd046b45e277c9530d5",
		"storeName": "Loja Centro São Paulo",
		"takeOutInStore": true,
		"shippingTimeInDays": 1,
		"address1": "Avenida Paulista",
		"address2": "1000",
		"address3": "",
		"city": "São Paulo",
		"district": "Bela Vista",
		"state": "SP",
		"type": "LOJA",
		"country": "Brasil",
		"postalCode": "01310-100",
		"telephoneNumber": "(11) 4321-1234",
		"emailAddress": "sp.centro@minhaloja.com",
		"isActive": true,
		"createdAt": "2025-04-17T19:51:44.966Z",
		"updatedAt": "2025-04-17T19:51:44.966Z",
		"__v": 0
	},
```

## 🔌 Serviços Integrados

A API integra-se com os seguintes serviços externos:

1. **ViaCep** - Usado para validar informações de endereço
2. **Google Maps** - Para obtenção de coordenadas a partir de endereço
3. **Melhor Envio** - Para realizar o calculo do frete


## 📜 Scripts

- `npm start:dev` - Inicia a aplicação em modo de desenvolvimento e através de um script popula o banco de dados com lojas de exemplo
- `npm test` - Executa os testes unitários


## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por [FR-macedo](https://github.com/FR-macedo)