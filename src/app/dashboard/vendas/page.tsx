'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface Venda {
  id: number
  data: string
  cliente: string
  produto: string
  quantidade: number
  valor: number
}

interface DadoGrafico {
  data: string
  valor: number
}

const vendasMockadas: Venda[] = [
  { id: 1, data: '20/05/2025', cliente: 'Consumidor Final', produto: 'Produto 1', quantidade: 2, valor: 100 },
  { id: 2, data: '21/05/2025', cliente: 'Consumidor Final', produto: 'Produto 2', quantidade: 1, valor: 50 },
  { id: 3, data: '22/05/2025', cliente: 'Consumidor Final', produto: 'Produto 3', quantidade: 3, valor: 600 },
  { id: 4, data: '22/05/2025', cliente: 'Consumidor Final', produto: 'Produto 4', quantidade: 5, valor: 250 },
]

export default function VendasPage() {
  const totalVendido = vendasMockadas.reduce((acc, v) => acc + v.valor, 0)
  const totalPedidos = vendasMockadas.length
  const ticketMedio = totalVendido / totalPedidos

  const dadosGrafico = vendasMockadas.reduce((acc: DadoGrafico[], venda) => {
    const existente = acc.find((item) => item.data === venda.data)
    if (existente) {
      existente.valor += venda.valor
    } else {
      acc.push({ data: venda.data, valor: venda.valor })
    }
    return acc
  }, [])

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">💰 Vendas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Vendido</p>
            <p className="text-xl font-semibold">R$ {totalVendido.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pedidos</p>
            <p className="text-xl font-semibold">{totalPedidos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Ticket Médio</p>
            <p className="text-xl font-semibold">R$ {ticketMedio.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">📊 Vendas por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">🧾 Histórico de Vendas</h2>
          <div className="overflow-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2 border-b">Data</th>
                  <th className="p-2 border-b">Nome Fantasia</th>
                  <th className="p-2 border-b">Produto</th>
                  <th className="p-2 border-b">Qtd</th>
                  <th className="p-2 border-b">Valor</th>
                </tr>
              </thead>
              <tbody>
                {vendasMockadas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{venda.data}</td>
                    <td className="p-2 border-b">{venda.cliente}</td>
                    <td className="p-2 border-b">{venda.produto}</td>
                    <td className="p-2 border-b">{venda.quantidade}</td>
                    <td className="p-2 border-b">R$ {venda.valor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}