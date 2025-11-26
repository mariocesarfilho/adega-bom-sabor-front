import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { User, Star, Loader2 } from 'lucide-react'
import { getClienteDetalhes } from '@/lib/api'
import type { ClienteDetalhes } from '@/lib/types'

interface ClienteDetailsDialogProps {
  clienteId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'details' | 'recommendations'
}

export function ClienteDetailsDialog({ 
  clienteId, 
  open, 
  onOpenChange,
  mode = 'details'
}: ClienteDetailsDialogProps) {
  const [details, setDetails] = useState<ClienteDetalhes | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clienteId) {
      setLoading(true)
      setError(null)
      getClienteDetalhes(clienteId)
        .then(setDetails)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [open, clienteId])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setDetails(null)
      setError(null)
    }
    onOpenChange(newOpen)
  }

  const getChurnBadge = (prob: number) => {
    if (prob > 0.7) return <Badge className="bg-red-500 text-white">Alto Risco</Badge>
    if (prob > 0.4) return <Badge className="bg-yellow-500 text-white">Risco Medio</Badge>
    return <Badge className="bg-green-500 text-white">Baixo Risco</Badge>
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-100">
            <User className="w-5 h-5 text-cyan-400" />
            {loading ? 'Carregando...' : details?.nome || 'Cliente'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {mode === 'details' 
              ? 'Detalhes do cliente e recomendacoes personalizadas'
              : details?.segmento_descricao || 'Vinhos recomendados para este cliente'}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        )}

        {error && (
          <div className="text-red-400 text-center py-4">
            Erro ao carregar dados: {error}
          </div>
        )}

        {!loading && !error && details && (
          <div className="space-y-4">
            {mode === 'details' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Cidade</p>
                  <p className="font-medium text-slate-100">{details.cidade}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Idade</p>
                  <p className="font-medium text-slate-100">{details.idade} anos</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Segmento</p>
                  {getSegmentBadge(details.segmento)}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Risco de Churn</p>
                  {getChurnBadge(details.churn_probability)}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Gasto</p>
                  <p className="font-medium text-slate-100">
                    R$ {details.total_gasto?.toLocaleString('pt-BR') || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total de Compras</p>
                  <p className="font-medium text-slate-100">{details.total_compras || 0}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-100">
                <Star className="w-4 h-4 text-yellow-500" />
                Recomendacoes de Vinhos
              </h4>
              <div className="space-y-2">
                {details.recomendacoes && details.recomendacoes.length > 0 ? (
                  details.recomendacoes.slice(0, mode === 'details' ? 3 : 5).map((rec) => (
                    <div key={rec.produto_id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div>
                        <p className="font-medium text-slate-100">{rec.nome}</p>
                        <p className="text-sm text-slate-400">
                          {rec.tipo_uva} - {rec.pais} ({rec.safra})
                        </p>
                      </div>
                      {rec.motivo && (
                        <p className="text-xs text-cyan-400 mt-1">{rec.motivo}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">
                    Nenhuma recomendacao disponivel para este cliente.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
