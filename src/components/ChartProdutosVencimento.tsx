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
    { nome: 'Produto 1', diasParaVencer: 0 },
    { nome: 'Produto 2', diasParaVencer: 0 },
    { nome: 'Produto 3', diasParaVencer: 0 },
    { nome: 'Produto 4', diasParaVencer: 0 }
]


export function ChartProdutosVencimento() {
    return (
        <div className="w-full h-[300px] bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" />
                    <Tooltip formatter={(v) => `${v} dias`} />
                    <Bar dataKey="diasParaVencer" fill="#f97316">
                        <LabelList dataKey="diasParaVencer" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
