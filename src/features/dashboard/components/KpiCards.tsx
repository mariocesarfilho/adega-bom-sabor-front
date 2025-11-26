import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import type { DashboardData } from '@/lib/types'

interface KpiCardsProps {
  dashboard: DashboardData | null
}

export function KpiCards({ dashboard }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Total de Clientes</CardTitle>
          <Users className="w-5 h-5 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-100">{dashboard?.total_clientes || 0}</div>
          <p className="text-xs text-slate-500 mt-1">clientes cadastrados</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Total de Produtos</CardTitle>
          <Package className="w-5 h-5 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-100">{dashboard?.total_produtos || 0}</div>
          <p className="text-xs text-slate-500 mt-1">vinhos no catalogo</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Total de Vendas</CardTitle>
          <ShoppingCart className="w-5 h-5 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-100">{dashboard?.total_compras || 0}</div>
          <p className="text-xs text-slate-500 mt-1">compras realizadas</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Faturamento Total</CardTitle>
          <TrendingUp className="w-5 h-5 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-100">
            R$ {dashboard?.valor_total_vendas?.toLocaleString('pt-BR') || '0'}
          </div>
          <p className="text-xs text-slate-500 mt-1">em vendas</p>
        </CardContent>
      </Card>
    </div>
  )
}
