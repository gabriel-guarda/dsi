'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList
} from 'recharts'
import { useState } from 'react'

const MOCK_DATA = [
    { nome: 'Produto 1', diasSemVenda: 45 },
    { nome: 'Produto 2', diasSemVenda: 60 },
    { nome: 'Produto 3', diasSemVenda: 35 },
    { nome: 'Produto 4', diasSemVenda: 70 },
    { nome: 'Produto 5', diasSemVenda: 90 }
]

export function ChartProdutosParados() {
    const [filtroDias, setFiltroDias] = useState(30)

    const produtosFiltrados = MOCK_DATA.filter(
        (produto) => produto.diasSemVenda >= filtroDias
    )

    return (
        <div className="w-full bg-white p-4 rounded shadow space-y-4">
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                    Filtrar por:
                </label>
                <select
                    value={filtroDias}
                    onChange={(e) => setFiltroDias(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    <option value={15}>Últimos 15 dias</option>
                    <option value={30}>Últimos 30 dias</option>
                    <option value={60}>Últimos 60 dias</option>
                    <option value={90}>Últimos 90 dias</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={produtosFiltrados} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" />
                    <Tooltip formatter={(v) => `${v} dias`} />
                    <Bar dataKey="diasSemVenda" fill="#f43f5e">
                        <LabelList dataKey="diasSemVenda" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
