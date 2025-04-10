# Physical Stores API

API RESTful que fornece dados de geolocalização de lojas físicas, permitindo encontrar as lojas mais próximas com base no CEP do usuário.

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Serviços Integrados](#serviços-integrados)
- [Scripts](#scripts)
- [Testes](#testes)
- [Licença](#licença)

## 🔍 Visão Geral

Physical Stores API é uma aplicação Node.js desenvolvida em TypeScript que permite encontrar lojas físicas próximas a um determinado CEP. A API utiliza múltiplos serviços de geolocalização para calcular distâncias e rotas entre o endereço do usuário e as lojas cadastradas.

## Estrutura do Projeto

```
Repo
├──docs
│   └──TODO
│   │   └──Tarefas.md
├──src
│   ├──common
│   │   ├──exceptions
│   │   │   └──global-exception.filter.ts
│   │   ├──formatters
│   │   └──utils
│   ├──config
│   │   └──configuration.ts
│   ├──modules
│   │   └──store
│   │   │   ├──dto
│   │   │   ├──entities
│   │   │   ├──repository
│   │   │   └──store.module.ts
│   ├──providers
│   │   ├──google
│   │   ├──nominatim
│   │   └──viacep
│   ├──scripts
│   ├──app.controller.spec.ts
│   ├──app.controller.ts
│   ├──app.module.ts
│   ├──app.service.ts
│   └──main.ts
├──test
│   ├──app.e2e-spec.ts
│   └──jest-e2e.json
├──eslint.config.mjs
├──nest-cli.json
├──package-lock.json
├──package.json
├──README.md
├──tsconfig.build.json
├──tsconfig.json
├──.gitignore
└──.prettierrc
```

### Principais Funcionalidades

- Cálculo da loja mais próxima com base no CEP do usuário
- Estimativa de distância e tempo de deslocamento
- Suporte a falhas com método alternativo de cálculo de distância (Haversine)
- Retorno da loja mais próxima e outras lojas dentro de um raio de 100km

## 🔧 Tecnologias

- **Node.js** - Ambiente de execução
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **Mongoose** - ODM para MongoDB
- **Winston** - Sistema de logs
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
npm run build
```

## ⚙️ Configuração das Variáveis de Ambiente

Antes de iniciar a aplicação, certifique-se de configurar as variáveis de ambiente corretamente.  
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```ini
PORT=3333
MONGODB_URI=mongodb://localhost:27017/physical-stores
EMAIL=email@something.com
OPEN_ROUTE_SERVICE_API_KEY=yourkey
```

## 🚀 Uso

```bash
# Desenvolvimento
npm run dev

# Produção
tsc
npm start
```

### Seed de Lojas

Para popular o banco de dados com lojas de exemplo:

```bash
npm run seed:stores
```

## 🔗 Endpoints

### GET /api/stores/nearest/:cep

Retorna a loja mais próxima e outras lojas dentro de um raio de 100km a partir do CEP informado.

**Parâmetros:**
- `cep` (obrigatório): CEP do usuário no formato 00000000 ou 00000-000

**Exemplo de Resposta:**
```json
{
  "message": "Lojas encontradas com sucesso",
  "nearestStore": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Loja Centro",
    "address": {
      "cep": "01001-000",
      "street": "Praça da Sé",
      "number": "1",
      "neighborhood": "Sé",
      "city": "São Paulo",
      "state": "SP"
    },
    "location": {
      "latitude": -23.550520,
      "longitude": -46.633309
    },
    "distance": 2.3,
    "duration": 8.4
  },
  "otherStores": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Loja Paulista",
      "address": {
        "cep": "01310-100",
        "street": "Avenida Paulista",
        "number": "1000",
        "neighborhood": "Bela Vista",
        "city": "São Paulo",
        "state": "SP"
      },
      "location": {
        "latitude": -23.565568,
        "longitude": -46.652623
      },
      "distance": 4.5,
      "duration": 12.8
    }
  ]
}
```

## 📊 Modelos de Dados

### Store (Loja)

```typescript
{
  name: string;             // Nome da loja
  cep: string;              // CEP da loja
  street: string;           // Logradouro
  number: string;           // Número
  neighborhood: string;     // Bairro
  city: string;             // Cidade
  state: string;            // Estado (UF)
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}
```

## 🔌 Serviços Integrados

A API integra-se com os seguintes serviços externos:

1. **ViaCep** - Para obtenção de endereços a partir de CEP
2. **Nominatim (OpenStreetMap)** - Para obtenção de coordenadas a partir de endereço
3. **OpenRouteService** - Para cálculo de rotas e distâncias entre pontos

Em caso de falha nos serviços, a API utiliza o algoritmo de Haversine para cálculo de distância em linha reta.

## 📜 Scripts

- `npm start` - Inicia a aplicação em produção
- `npm run dev` - Inicia a aplicação em modo de desenvolvimento
- `npm run build` - Compila o projeto TypeScript
- `npm test` - Executa os testes unitários
- `npm run seed:stores` - Popula o banco de dados com lojas de exemplo
- `npm run lint` - Executa o linter para verificar o código


## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por [FR-macedo](https://github.com/FR-macedo)