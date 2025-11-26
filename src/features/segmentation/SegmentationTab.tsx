import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ClienteDetailsDialog } from '@/features/clientes/ClienteDetailsDialog'
import type { Cliente, DashboardData } from '@/lib/types'

interface SegmentationTabProps {
  clientes: Cliente[]
  dashboard: DashboardData | null
}

export function SegmentationTab({ clientes, dashboard }: SegmentationTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)

  const handleRecomendacoes = (clienteId: number) => {
    setSelectedClienteId(clienteId)
    setDialogOpen(true)
  }

  const getSegmentBadge = (segmento: string) => {
    switch (segmento) {
      case 'Premium':
        return <Badge className="bg-purple-500 text-white">{segmento}</Badge>
      case 'Sensivel a Promocoes':
        return <Badge className="bg-blue-500 text-white">{segmento}</Badge>
      default:
        return <Badge className="bg-emerald-500 text-white">{segmento}</Badge>
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/70 border-slate-700 border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                Premium
              </CardTitle>
              <CardDescription className="text-slate-400">Clientes de alto valor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">
                {dashboard?.segment_distribution.Premium || 0}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Compras frequentes e alto engajamento. Foco em produtos exclusivos e experiencias VIP.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 border-slate-700 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Sensivel a Promocoes
              </CardTitle>
              <CardDescription className="text-slate-400">Respondem bem a ofertas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">
                {dashboard?.segment_distribution['Sensivel a Promocoes'] || 0}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Compram principalmente em promocoes. Estrategia: campanhas de desconto direcionadas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 border-slate-700 border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Ocasional
              </CardTitle>
              <CardDescription className="text-slate-400">Compras esporadicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">
                {dashboard?.segment_distribution.Ocasional || 0}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Potencial de crescimento. Estrategia: programas de fidelidade e incentivos.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Clientes por Segmento</CardTitle>
            <CardDescription className="text-slate-400">Lista detalhada de clientes em cada segmento</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Cliente</TableHead>
                    <TableHead className="text-slate-300">Segmento</TableHead>
                    <TableHead className="text-slate-300">Total Compras</TableHead>
                    <TableHead className="text-slate-300">Total Gasto</TableHead>
                    <TableHead className="text-slate-300">Engajamento</TableHead>
                    <TableHead className="text-slate-300">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.cliente_id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-slate-100">{cliente.nome}</TableCell>
                      <TableCell>{getSegmentBadge(cliente.segmento)}</TableCell>
                      <TableCell className="text-slate-300">{cliente.total_compras}</TableCell>
                      <TableCell className="text-slate-300">
                        R$ {cliente.total_gasto.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={cliente.pontuacao_engajamento * 10} 
                            className="w-20 bg-sky-50" 
                          />
                          <span className="text-sm text-slate-300">
                            {cliente.pontuacao_engajamento.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-slate-600 text-slate-700 hover:bg-slate-700 hover:text-slate-100"
                          onClick={() => handleRecomendacoes(cliente.cliente_id)}
                        >
                          Recomendações
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <ClienteDetailsDialog
        clienteId={selectedClienteId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode="recommendations"
      />
    </>
  )
}
