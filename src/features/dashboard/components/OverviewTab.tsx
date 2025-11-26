import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { DashboardData, VendasMes } from '@/lib/types'

interface OverviewTabProps {
  dashboard: DashboardData | null
  vendasMes: VendasMes[]
}

export function OverviewTab({ dashboard, vendasMes }: OverviewTabProps) {
  const churnData = dashboard ? [
    { name: 'Alto Risco', value: dashboard.churn_distribution.alto, color: '#ef4444' },
    { name: 'Risco Medio', value: dashboard.churn_distribution.medio, color: '#f97316' },
    { name: 'Baixo Risco', value: dashboard.churn_distribution.baixo, color: '#14b8a6' }
  ] : []

  const segmentData = dashboard ? [
    { name: 'Premium', value: dashboard.segment_distribution.Premium, color: '#8b5cf6' },
    { name: 'Sensivel a Promocoes', value: dashboard.segment_distribution['Sensivel a Promocoes'], color: '#3b82f6' },
    { name: 'Ocasional', value: dashboard.segment_distribution.Ocasional, color: '#14b8a6' }
  ] : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Distribuicao de Risco de Churn</CardTitle>
            <CardDescription className="text-slate-400">Probabilidade de cancelamento dos clientes</CardDescription>
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
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Segmentacao de Clientes</CardTitle>
            <CardDescription className="text-slate-400">Distribuicao por perfil de compra</CardDescription>
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
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Vendas por Mes</CardTitle>
          <CardDescription className="text-slate-400">Evolucao do faturamento ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendasMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mes" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Legend />
              <Bar dataKey="valor" name="Valor (R$)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
