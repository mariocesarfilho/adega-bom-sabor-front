import type { DashboardData, Cliente, ClienteDetalhes, Alerta, VendasMes } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API_URL}/api/dashboard`)
  if (!res.ok) throw new Error('Failed to fetch dashboard')
  return res.json()
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(`${API_URL}/api/clientes`)
  if (!res.ok) throw new Error('Failed to fetch clientes')
  return res.json()
}

export async function getClienteDetalhes(clienteId: number): Promise<ClienteDetalhes> {
  const res = await fetch(`${API_URL}/api/clientes/${clienteId}`)
  if (!res.ok) throw new Error('Failed to fetch cliente details')
  return res.json()
}

export async function getAlertas(): Promise<Alerta[]> {
  const res = await fetch(`${API_URL}/api/alertas`)
  if (!res.ok) throw new Error('Failed to fetch alertas')
  return res.json()
}

export async function getVendasPorMes(): Promise<VendasMes[]> {
  const res = await fetch(`${API_URL}/api/analytics/vendas-por-mes`)
  if (!res.ok) throw new Error('Failed to fetch vendas')
  return res.json()
}
