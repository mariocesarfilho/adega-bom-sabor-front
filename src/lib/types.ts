export interface DashboardData {
  total_clientes: number
  total_produtos: number
  total_compras: number
  valor_total_vendas: number
  churn_distribution: { alto: number; medio: number; baixo: number }
  segment_distribution: { Premium: number; 'Sensivel a Promocoes': number; Ocasional: number }
  alertas_count: number
}

export interface Cliente {
  cliente_id: number
  nome: string
  idade: number
  cidade: string
  pontuacao_engajamento: number
  assinante_clube: boolean
  cancelou_assinatura: boolean
  churn_probability: number
  segmento: string
  segmento_descricao: string
  total_compras: number
  total_gasto: number
}

export interface Alerta {
  tipo: string
  severidade: string
  mensagem: string
  cliente_id?: number
  produto_id?: number
}

export interface Produto {
  produto_id: number
  nome: string
  pais: string
  safra: number
  tipo_uva: string
  score?: number
  motivo?: string
}

export interface VendasMes {
  mes: string
  valor: number
  quantidade: number
}

export interface CompraHistorico {
  compra_id: number
  produto_id: number
  valor: number
  quantidade: number
  data_compra: string
  produto_nome: string
}

export interface ClienteDetalhes extends Cliente {
  recomendacoes: Produto[]
  historico_compras: CompraHistorico[]
}
