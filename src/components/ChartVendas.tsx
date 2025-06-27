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
    { mes: 'Jan', vendas: 0 },
    { mes: 'Fev', vendas: 0 },
    { mes: 'Mar', vendas: 0 },
    { mes: 'Abr', vendas: 0 },
    { mes: 'Mai', vendas: 0 },
    { mes: 'Jun', vendas: 0 }
]

export function ChartVendas() {
    return (
        <div className="w-full h-[300px] bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
