import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Bell } from 'lucide-react'
import type { Alerta } from '@/lib/types'

interface AlertsTabProps {
  alertas: Alerta[]
}

function getAlertTypeLabel(tipo: string): string {
  switch (tipo) {
    case 'risco_churn':
      return 'Risco de Churn'
    case 'cliente_inativo':
      return 'Cliente Inativo'
    case 'fidelidade_uva':
      return 'Fidelidade'
    case 'demanda_crescente':
      return 'Demanda Crescente'
    default:
      return tipo
  }
}

export function AlertsTab({ alertas }: AlertsTabProps) {
  const alertasAltos = alertas.filter(a => a.severidade === 'alta')
  const alertasMedios = alertas.filter(a => a.severidade === 'media')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Alta Prioridade
            </CardTitle>
            <CardDescription className="text-slate-400">Acoes imediatas necessarias</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {alertasAltos.length > 0 ? (
                  alertasAltos.map((alerta, index) => (
                    <div key={index} className="bg-red-950/50 border border-red-800/50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                        <div>
                          <Badge className="bg-red-500 text-white mb-1">
                            {getAlertTypeLabel(alerta.tipo)}
                          </Badge>
                          <p className="text-sm text-slate-300">{alerta.mensagem}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">Nenhum alerta de alta prioridade</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Bell className="w-5 h-5" />
              Alertas de Media Prioridade
            </CardTitle>
            <CardDescription className="text-slate-400">Monitorar e planejar acoes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {alertasMedios.length > 0 ? (
                  alertasMedios.map((alerta, index) => (
                    <div key={index} className="bg-orange-950/50 border border-orange-800/50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Bell className="w-4 h-4 text-orange-400 mt-0.5" />
                        <div>
                          <Badge className="bg-orange-500 text-white mb-1">
                            {getAlertTypeLabel(alerta.tipo)}
                          </Badge>
                          <p className="text-sm text-slate-300">{alerta.mensagem}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">Nenhum alerta de media prioridade</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Resumo de Alertas</CardTitle>
          <CardDescription className="text-slate-400">Visao geral das notificacoes do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-950/50 border border-red-800/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-400">
                {alertasAltos.length}
              </div>
              <p className="text-sm text-red-400">Alta Prioridade</p>
            </div>
            <div className="bg-orange-950/50 border border-orange-800/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-400">
                {alertasMedios.length}
              </div>
              <p className="text-sm text-orange-400">Media Prioridade</p>
            </div>
            <div className="bg-blue-950/50 border border-blue-800/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-400">
                {alertas.filter(a => a.tipo === 'risco_churn').length}
              </div>
              <p className="text-sm text-blue-400">Risco de Churn</p>
            </div>
            <div className="bg-purple-950/50 border border-purple-800/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-400">
                {alertas.filter(a => a.tipo === 'cliente_inativo').length}
              </div>
              <p className="text-sm text-purple-400">Clientes Inativos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
