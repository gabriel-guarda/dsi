'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_FIXOS = ['Ativo', 'Inativo', 'Avariado', 'Vencido', 'Reservado']

interface Item {
    status?: string
    quantidade: number
}

interface Movimentacao {
    itens?: Item[]
}

export default function EstoquePorStatus() {
    const [contagem, setContagem] = useState<Record<string, number>>({})

    useEffect(() => {
        const fetchDados = async () => {
            const res = await fetch('/api/movimentacoes')
            const data: Movimentacao[] = await res.json()

            const contagemInicial = Object.fromEntries(STATUS_FIXOS.map(status => [status, 0]))

            data.forEach((mov: Movimentacao) => {
                mov.itens?.forEach((item: Item) => {
                    const status = item.status || 'Ativo'
                    if (contagemInicial[status] !== undefined) {
                        contagemInicial[status] += item.quantidade
                    }
                })
            })

            setContagem(contagemInicial)
        }

        fetchDados()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Estoque por Status</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATUS_FIXOS.map(status => (
                    <div key={status} className="bg-white rounded shadow p-4 flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-2">{status}</h2>
                        <p className="text-4xl font-bold text-blue-600">{contagem[status] || 0}</p>
                        <div className="mt-4 flex gap-2">
                            <Link
                                href={`/dashboard/estoque/status/${status.toLowerCase()}`}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                            >
                                Visualizar
                            </Link>
                            <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded text-sm">
                                Cadastrar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}