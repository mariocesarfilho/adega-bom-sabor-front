import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wine, Bell, Loader2 } from 'lucide-react'
import { getDashboard, getClientes, getAlertas, getVendasPorMes } from '@/lib/api'
import { KpiCards } from '@/features/dashboard/components/KpiCards'
import { OverviewTab } from '@/features/dashboard/components/OverviewTab'
import { ChurnAnalysisTab } from '@/features/churn/ChurnAnalysisTab'
import { SegmentationTab } from '@/features/segmentation/SegmentationTab'
import { AlertsTab } from '@/features/alerts/AlertsTab'
import type { DashboardData, Cliente, Alerta, VendasMes } from '@/lib/types'

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [vendasMes, setVendasMes] = useState<VendasMes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dashboardData, clientesData, alertasData, vendasData] = await Promise.all([
        getDashboard(),
        getClientes(),
        getAlertas(),
        getVendasPorMes()
      ])
      
      setDashboard(dashboardData)
      setClientes(clientesData)
      setAlertas(alertasData)
      setVendasMes(vendasData)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Erro ao carregar dados. Verifique se o backend esta rodando.')
    } finally {
      setLoading(false)
    }
  }

  const alertasAltos = alertas.filter(a => a.severidade === 'alta')

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto text-cyan-400 animate-spin" />
          <p className="mt-4 text-lg text-slate-400">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wine className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Sistema de Apoio a Decisao para Adega Bom Sabor</h1>
              <p className="text-slate-400 text-sm">Analise de Churn, Segmentacao e Recomendacoes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
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
        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <KpiCards dashboard={dashboard} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700 p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400"
            >
              Visao Geral
            </TabsTrigger>
            <TabsTrigger 
              value="churn"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400"
            >
              Analise de Churn
            </TabsTrigger>
            <TabsTrigger 
              value="segmentation"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400"
            >
              Segmentacao
            </TabsTrigger>
            <TabsTrigger 
              value="alerts"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400"
            >
              Alertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab dashboard={dashboard} vendasMes={vendasMes} />
          </TabsContent>

          <TabsContent value="churn">
            <ChurnAnalysisTab clientes={clientes} />
          </TabsContent>

          <TabsContent value="segmentation">
            <SegmentationTab clientes={clientes} dashboard={dashboard} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsTab alertas={alertas} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-slate-900 border-t border-slate-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          Adega Bom Sabor - Sistema de Apoio a Decisão
        </div>
      </footer>
    </div>
  )
}

export default App
