import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Wine, Users, ShoppingCart, AlertTriangle, TrendingUp, Package, Bell, User, Star } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface DashboardData {
  total_clientes: number
  total_produtos: number
  total_compras: number
  valor_total_vendas: number
  churn_distribution: { alto: number; medio: number; baixo: number }
  segment_distribution: { Premium: number; 'Sensivel a Promocoes': number; Ocasional: number }
  alertas_count: number
}

interface Cliente {
  cliente_id: number
  nome: string
  idade: number
  cidade: string
  pontuacao_engajamento: number
  assinante_clube: boolean
  churn_probability: number
  segmento: string
  segmento_descricao: string
  total_compras: number
  total_gasto: number
}

interface Alerta {
  tipo: string
  severidade: string
  mensagem: string
  cliente_id?: number
  produto_id?: number
}

interface Produto {
  produto_id: number
  nome: string
  pais: string
  safra: number
  tipo_uva: string
  estoque: number
  preco: number
  score?: number
  motivo?: string
}

interface VendasMes {
  mes: string
  valor: number
  quantidade: number
}

interface ClienteDetalhes extends Cliente {
  recomendacoes: Produto[]
  historico_compras: Array<{
    compra_id: number
    produto_id: number
    valor: number
    quantidade: number
    data_compra: string
    produto_nome: string
  }>
}

const COLORS = ['#ef4444', '#f59e0b', '#22c55e']
const SEGMENT_COLORS = ['#8b5cf6', '#3b82f6', '#10b981']

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [vendasMes, setVendasMes] = useState<VendasMes[]>([])
  const [selectedCliente, setSelectedCliente] = useState<ClienteDetalhes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [dashboardRes, clientesRes, alertasRes, vendasRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard`),
        fetch(`${API_URL}/api/clientes`),
        fetch(`${API_URL}/api/alertas`),
        fetch(`${API_URL}/api/analytics/vendas-por-mes`)
      ])
      
      setDashboard(await dashboardRes.json())
      setClientes(await clientesRes.json())
      setAlertas(await alertasRes.json())
      setVendasMes(await vendasRes.json())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const fetchClienteDetalhes = async (clienteId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/clientes/${clienteId}`)
      const data = await res.json()
      setSelectedCliente(data)
    } catch (error) {
      console.error('Error fetching cliente details:', error)
    }
  }

  const getChurnColor = (prob: number) => {
    if (prob > 0.7) return 'bg-red-500'
    if (prob > 0.4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getChurnBadge = (prob: number) => {
    if (prob > 0.7) return <Badge variant="destructive">Alto Risco</Badge>
    if (prob > 0.4) return <Badge className="bg-yellow-500">Risco Medio</Badge>
    return <Badge className="bg-green-500">Baixo Risco</Badge>
  }

  const getSegmentBadge = (segmento: string) => {
    switch (segmento) {
      case 'Premium':
        return <Badge className="bg-purple-500">{segmento}</Badge>
      case 'Sensivel a Promocoes':
        return <Badge className="bg-blue-500">{segmento}</Badge>
      default:
        return <Badge className="bg-emerald-500">{segmento}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Wine className="w-16 h-16 mx-auto text-purple-600 animate-pulse" />
          <p className="mt-4 text-lg text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  const churnData = dashboard ? [
    { name: 'Alto Risco', value: dashboard.churn_distribution.alto, color: '#ef4444' },
    { name: 'Risco Medio', value: dashboard.churn_distribution.medio, color: '#f59e0b' },
    { name: 'Baixo Risco', value: dashboard.churn_distribution.baixo, color: '#22c55e' }
  ] : []

  const segmentData = dashboard ? [
    { name: 'Premium', value: dashboard.segment_distribution.Premium, color: '#8b5cf6' },
    { name: 'Sensivel a Promocoes', value: dashboard.segment_distribution['Sensivel a Promocoes'], color: '#3b82f6' },
    { name: 'Ocasional', value: dashboard.segment_distribution.Ocasional, color: '#10b981' }
  ] : []

  const alertasAltos = alertas.filter(a => a.severidade === 'alta')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wine className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Adega Bom Sabor</h1>
              <p className="text-purple-200 text-sm">Sistema de Apoio a Decisao</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6" />
              {alertasAltos.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alertasAltos.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Clientes</CardTitle>
              <Users className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard?.total_clientes}</div>
              <p className="text-xs text-gray-500 mt-1">clientes cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Produtos</CardTitle>
              <Package className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard?.total_produtos}</div>
              <p className="text-xs text-gray-500 mt-1">vinhos no catalogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Vendas</CardTitle>
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard?.total_compras}</div>
              <p className="text-xs text-gray-500 mt-1">compras realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Faturamento Total</CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ {dashboard?.valor_total_vendas.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-gray-500 mt-1">em vendas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Visao Geral</TabsTrigger>
            <TabsTrigger value="churn">Analise de Churn</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentacao</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuicao de Risco de Churn</CardTitle>
                  <CardDescription>Probabilidade de cancelamento dos clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={churnData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {churnData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segmentacao de Clientes</CardTitle>
                  <CardDescription>Distribuicao por perfil de compra</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vendas por Mes</CardTitle>
                <CardDescription>Evolucao do faturamento ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendasMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Bar dataKey="valor" name="Valor (R$)" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="churn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analise de Probabilidade de Churn</CardTitle>
                <CardDescription>Clientes ordenados por risco de cancelamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead>Engajamento</TableHead>
                        <TableHead>Probabilidade de Churn</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acoes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientes
                        .sort((a, b) => b.churn_probability - a.churn_probability)
                        .map((cliente) => (
                          <TableRow key={cliente.cliente_id}>
                            <TableCell className="font-medium">{cliente.nome}</TableCell>
                            <TableCell>{cliente.cidade}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={cliente.pontuacao_engajamento * 10} className="w-20" />
                                <span className="text-sm">{cliente.pontuacao_engajamento.toFixed(1)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getChurnColor(cliente.churn_probability)}`} />
                                <span>{(cliente.churn_probability * 100).toFixed(0)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{getChurnBadge(cliente.churn_probability)}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => fetchClienteDetalhes(cliente.cliente_id)}
                                  >
                                    Ver Detalhes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <User className="w-5 h-5" />
                                      {selectedCliente?.nome}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Detalhes do cliente e recomendacoes personalizadas
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedCliente && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">Cidade</p>
                                          <p className="font-medium">{selectedCliente.cidade}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Idade</p>
                                          <p className="font-medium">{selectedCliente.idade} anos</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Segmento</p>
                                          {getSegmentBadge(selectedCliente.segmento)}
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Risco de Churn</p>
                                          {getChurnBadge(selectedCliente.churn_probability)}
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Total Gasto</p>
                                          <p className="font-medium">R$ {selectedCliente.total_gasto.toLocaleString('pt-BR')}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Total de Compras</p>
                                          <p className="font-medium">{selectedCliente.total_compras}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                          <Star className="w-4 h-4 text-yellow-500" />
                                          Recomendacoes de Vinhos
                                        </h4>
                                        <div className="space-y-2">
                                          {selectedCliente.recomendacoes?.slice(0, 3).map((rec) => (
                                            <div key={rec.produto_id} className="bg-gray-50 p-3 rounded-lg">
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <p className="font-medium">{rec.nome}</p>
                                                  <p className="text-sm text-gray-500">{rec.tipo_uva} - {rec.pais} ({rec.safra})</p>
                                                </div>
                                                <p className="font-semibold text-purple-600">R$ {rec.preco.toFixed(2)}</p>
                                              </div>
                                              <p className="text-xs text-gray-400 mt-1">{rec.motivo}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segmentation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    Premium
                  </CardTitle>
                  <CardDescription>Clientes de alto valor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard?.segment_distribution.Premium}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Compras frequentes e alto engajamento. Foco em produtos exclusivos e experiencias VIP.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Sensivel a Promocoes
                  </CardTitle>
                  <CardDescription>Respondem bem a ofertas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard?.segment_distribution['Sensivel a Promocoes']}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Compram principalmente em promocoes. Estrategia: campanhas de desconto direcionadas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    Ocasional
                  </CardTitle>
                  <CardDescription>Compras esporadicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard?.segment_distribution.Ocasional}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Potencial de crescimento. Estrategia: programas de fidelidade e incentivos.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clientes por Segmento</CardTitle>
                <CardDescription>Lista detalhada de clientes em cada segmento</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Segmento</TableHead>
                        <TableHead>Total Compras</TableHead>
                        <TableHead>Total Gasto</TableHead>
                        <TableHead>Engajamento</TableHead>
                        <TableHead>Acoes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientes.map((cliente) => (
                        <TableRow key={cliente.cliente_id}>
                          <TableCell className="font-medium">{cliente.nome}</TableCell>
                          <TableCell>{getSegmentBadge(cliente.segmento)}</TableCell>
                          <TableCell>{cliente.total_compras}</TableCell>
                          <TableCell>R$ {cliente.total_gasto.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={cliente.pontuacao_engajamento * 10} className="w-20" />
                              <span className="text-sm">{cliente.pontuacao_engajamento.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => fetchClienteDetalhes(cliente.cliente_id)}
                                >
                                  Recomendacoes
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{selectedCliente?.nome}</DialogTitle>
                                  <DialogDescription>{selectedCliente?.segmento_descricao}</DialogDescription>
                                </DialogHeader>
                                {selectedCliente && (
                                  <div className="space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      Vinhos Recomendados
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedCliente.recomendacoes?.map((rec) => (
                                        <div key={rec.produto_id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                          <div>
                                            <p className="font-medium">{rec.nome}</p>
                                            <p className="text-sm text-gray-500">{rec.tipo_uva} - {rec.pais} ({rec.safra})</p>
                                          </div>
                                          <p className="font-semibold text-purple-600">R$ {rec.preco.toFixed(2)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Alertas de Alta Prioridade
                  </CardTitle>
                  <CardDescription>Acoes imediatas necessarias</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {alertas
                        .filter(a => a.severidade === 'alta')
                        .map((alerta, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                              <div>
                                <Badge variant="destructive" className="mb-1">
                                  {alerta.tipo === 'risco_churn' ? 'Risco de Churn' : 'Estoque Baixo'}
                                </Badge>
                                <p className="text-sm">{alerta.mensagem}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <Bell className="w-5 h-5" />
                    Alertas de Media Prioridade
                  </CardTitle>
                  <CardDescription>Monitorar e planejar acoes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {alertas
                        .filter(a => a.severidade === 'media')
                        .map((alerta, index) => (
                          <div key={index} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Bell className="w-4 h-4 text-yellow-500 mt-0.5" />
                              <div>
                                <Badge className="bg-yellow-500 mb-1">
                                  {alerta.tipo === 'risco_churn' ? 'Risco de Churn' : 'Estoque Baixo'}
                                </Badge>
                                <p className="text-sm">{alerta.mensagem}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumo de Alertas</CardTitle>
                <CardDescription>Visao geral das notificacoes do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {alertas.filter(a => a.severidade === 'alta').length}
                    </div>
                    <p className="text-sm text-red-600">Alta Prioridade</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {alertas.filter(a => a.severidade === 'media').length}
                    </div>
                    <p className="text-sm text-yellow-600">Media Prioridade</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {alertas.filter(a => a.tipo === 'risco_churn').length}
                    </div>
                    <p className="text-sm text-blue-600">Risco de Churn</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {alertas.filter(a => a.tipo === 'estoque_baixo').length}
                    </div>
                    <p className="text-sm text-purple-600">Estoque Baixo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          Adega Bom Sabor - Sistema de Apoio a Decisao | Desenvolvido com IA
        </div>
      </footer>
    </div>
  )
}

export default App
