'use client'

import { useState } from 'react'

type ProdutoEstoque = {
    codprod: string
    produto: string
    quantidade: number
    status: string
    localizacao: string
}

interface ModalEditProdutoProps {
    produto: ProdutoEstoque
    onClose: () => void
    onSalvar: (produto: ProdutoEstoque) => void
}

export default function ModalEditProduto({ produto, onClose, onSalvar }: ModalEditProdutoProps) {
    const [status, setStatus] = useState(produto.status)
    const [localizacao, setLocalizacao] = useState(produto.localizacao)

    const handleSalvar = async () => {
        const atualizado = { ...produto, status, localizacao }

        try {
            const res = await fetch('/api/movimentacoes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(atualizado)
            })

            if (!res.ok) throw new Error('Erro ao salvar alterações')

            onSalvar(atualizado) // Atualiza na UI
            onClose()
        } catch (error) {
            console.error('Erro ao atualizar produto:', error)
            alert('Erro ao salvar no banco.')
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[400px] flex flex-col gap-4">
                <h2 className="text-xl font-bold">Editar Produto</h2>

                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Localização</label>
                    <input
                        type="text"
                        value={localizacao}
                        onChange={(e) => setLocalizacao(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    )
}
