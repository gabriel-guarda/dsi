'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts'

const data = [
    { categoria: 'Bebidas', quantidade: 0 },
    { categoria: 'Lanches', quantidade: 0 },
    { categoria: 'Doces', quantidade: 0 },
    { categoria: 'Utensílios', quantidade: 0 },
    { categoria: 'Limpeza', quantidade: 0 }
]

export function ChartEstoque() {
    return (
        <div className="w-full h-[300px] bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
