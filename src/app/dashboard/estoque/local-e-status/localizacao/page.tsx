'use client'

import { useState, useEffect } from 'react'
import ModalCadastroLocal from '@/components/ModalCadastroLocal'

type Local = {
    nome: string
    tipo: string // Ex: Prateleira, Freezer...
}

export default function LocalizacaoPage() {
    const [locais, setLocais] = useState<Local[]>([])
    const [modalAberto, setModalAberto] = useState(false)

    useEffect(() => {
        // Simulando fetch — depois conectar com banco
        setLocais([
            { nome: 'Freezer 1', tipo: 'Freezer' },
            { nome: 'Adega A', tipo: 'Adega' },
            { nome: 'Prateleira 7', tipo: 'Prateleira' }
        ])
    }, [])

    const handleNovoLocal = (novo: Local) => {
        setLocais([...locais, novo])
        setModalAberto(false)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Locais de Armazenamento</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => setModalAberto(true)}
                >
                    + Adicionar Localização
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locais.map((local, index) => (
                    <div
                        key={index}
                        className="bg-white rounded shadow p-4 border hover:border-blue-500 transition"
                    >
                        <h2 className="text-lg font-semibold text-gray-700">{local.nome}</h2>
                        <p className="text-sm text-gray-500">{local.tipo}</p>
                    </div>
                ))}
            </div>

            {modalAberto && (
                <ModalCadastroLocal
                    onClose={() => setModalAberto(false)}
                    onSalvar={handleNovoLocal}
                />
            )}
        </div>
    )
}
