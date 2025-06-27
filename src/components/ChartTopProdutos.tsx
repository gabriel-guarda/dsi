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

const data = [
    { nome: 'Produto 1', vendas: 0 },
    { nome: 'Produto 2', vendas: 0 },
    { nome: 'Produto 3', vendas: 0 },
    { nome: 'Produto 4', vendas: 0 }
]

export function ChartTopProdutos() {
    return (
        <div className="w-full h-[300px] bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="#3b82f6">
                        <LabelList dataKey="vendas" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
