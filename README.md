# Adega Bom Sabor - Frontend Dashboard

Dashboard interativo para o Sistema de Apoio a Decisao (SAD) da Adega Bom Sabor.

## Funcionalidades

### Dashboard Principal
- KPIs: Total de clientes, produtos, vendas e faturamento
- Graficos de distribuicao de churn e segmentacao
- Evolucao de vendas por mes

### Analise de Churn
- Visualizacao de probabilidade de cancelamento por cliente
- Indicadores visuais de risco (alto, medio, baixo)
- Detalhes do cliente com recomendacoes personalizadas

### Segmentacao de Clientes
- Tres segmentos: Premium, Sensivel a Promocoes, Ocasional
- Descricao de estrategias para cada segmento
- Lista detalhada de clientes por segmento

### Alertas Estrategicos (IA Simbolica)
- Risco de Churn: Clientes com alta probabilidade de cancelamento
- Cliente Inativo: Clientes sem compras ha mais de 60 dias
- Fidelidade: Clientes com preferencia consistente por tipo de uva
- Demanda Crescente: Produtos com aumento de demanda (conceitual)

## Tecnologias

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (estilizacao)
- Recharts (graficos interativos)
- Shadcn/ui (componentes UI)
- Lucide React (icones)

## Pre-requisitos

- Node.js 18+ (recomendado: 20+)
- npm ou yarn
- Backend rodando em http://localhost:8000

## Instalacao

### Windows

#### 1. Instalar Node.js
Baixe e instale do site oficial: https://nodejs.org/

Recomendamos a versao LTS (20.x).

#### 2. Clonar o repositorio
```cmd
git clone https://github.com/mariocesarfilho/adega-bom-sabor-front.git
cd adega-bom-sabor-front
```

#### 3. Instalar dependencias
```cmd
npm install
```

#### 4. Configurar variaveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:8000
```

#### 5. Executar em modo desenvolvimento
```cmd
npm run dev
```

O frontend estara disponivel em http://localhost:5173

### Linux / Mac

#### 1. Instalar Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Mac (usando Homebrew):**
```bash
brew install node@20
```

#### 2. Clonar o repositorio
```bash
git clone https://github.com/mariocesarfilho/adega-bom-sabor-front.git
cd adega-bom-sabor-front
```

#### 3. Instalar dependencias
```bash
npm install
```

#### 4. Configurar variaveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

#### 5. Executar em modo desenvolvimento
```bash
npm run dev
```

O frontend estara disponivel em http://localhost:5173

## Build para Producao

```bash
npm run build
```

Os arquivos de producao serao gerados na pasta `dist/`.

Para visualizar o build localmente:
```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── App.tsx              # Componente principal com todas as views
├── main.tsx             # Entry point da aplicacao
├── index.css            # Estilos globais (Tailwind)
├── components/          # Componentes UI (Shadcn)
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── progress.tsx
│       ├── scroll-area.tsx
│       ├── table.tsx
│       └── tabs.tsx
├── hooks/               # Custom hooks
└── lib/                 # Utilitarios
```

## Conexao com o Backend

O frontend se conecta ao backend atraves da variavel de ambiente `VITE_API_URL`.

### Endpoints Utilizados
- `GET /api/dashboard` - Dados do dashboard
- `GET /api/clientes` - Lista de clientes com churn e segmento
- `GET /api/clientes/{id}` - Detalhes do cliente com recomendacoes
- `GET /api/alertas` - Alertas estrategicos
- `GET /api/analytics/vendas-por-mes` - Vendas agregadas por mes

## Notas IMPORTANTES

### Dados Reais
- O sistema utiliza dados REAIS das planilhas Excel fornecidas
- **NAO ha campos de preco ou estoque nos produtos**
- O preco esta na tabela de compras (valor da transacao)
- Os labels de churn sao REAIS (campo `cancelou_assinatura`)

### Alertas de IA Simbolica
Os alertas sao baseados em regras SE-ENTAO:
- Risco de Churn: Baseado no modelo de ML treinado com dados reais
- Cliente Inativo: Cliente sem compras ha mais de 60 dias
- Fidelidade: Cliente que comprou mesmo tipo de uva nos ultimos 3 meses
- Demanda Crescente: Produto com aumento de vendas (conceitual, sem estoque real)

## Licenca

Este projeto foi desenvolvido como prototipo para a Adega Bom Sabor.
