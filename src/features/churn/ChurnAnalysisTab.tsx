import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ClienteDetailsDialog } from '@/features/clientes/ClienteDetailsDialog'
import type { Cliente } from '@/lib/types'

interface ChurnAnalysisTabProps {
  clientes: Cliente[]
}

export function ChurnAnalysisTab({ clientes }: ChurnAnalysisTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)

  const handleVerDetalhes = (clienteId: number) => {
    setSelectedClienteId(clienteId)
    setDialogOpen(true)
  }

  const getChurnColor = (prob: number) => {
    if (prob > 0.7) return 'bg-red-500'
    if (prob > 0.4) return 'bg-orange-500'
    return 'bg-teal-500'
  }

  const getChurnBadge = (prob: number) => {
    if (prob > 0.7) return <Badge className="bg-red-500 text-white">Alto Risco</Badge>
    if (prob > 0.4) return <Badge className="bg-orange-500 text-white">Risco Medio</Badge>
    return <Badge className="bg-teal-500 text-white">Baixo Risco</Badge>
  }

  const sortedClientes = [...clientes].sort((a, b) => b.churn_probability - a.churn_probability)

  return (
    <>
      <Card className="bg-slate-900/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Analise de Probabilidade de Churn</CardTitle>
          <CardDescription className="text-slate-400">Clientes ordenados por risco de cancelamento</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Cliente</TableHead>
                  <TableHead className="text-slate-300">Cidade</TableHead>
                  <TableHead className="text-slate-300">Engajamento</TableHead>
                  <TableHead className="text-slate-300">Probabilidade de Churn</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClientes.map((cliente) => (
                  <TableRow key={cliente.cliente_id} className="border-slate-700 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-100">{cliente.nome}</TableCell>
                    <TableCell className="text-slate-300">{cliente.cidade}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={cliente.pontuacao_engajamento * 10} 
                          className="w-20 bg-slate-700" 
                        />
                        <span className="text-sm text-slate-300">
                          {cliente.pontuacao_engajamento.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getChurnColor(cliente.churn_probability)}`} />
                        <span className="text-slate-300">
                          {(cliente.churn_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getChurnBadge(cliente.churn_probability)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                        onClick={() => handleVerDetalhes(cliente.cliente_id)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <ClienteDetailsDialog
        clienteId={selectedClienteId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode="details"
      />
    </>
  )
}
