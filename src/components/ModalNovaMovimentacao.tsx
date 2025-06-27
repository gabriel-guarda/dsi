'use client'

import { useState } from 'react'
import { Movimentacao } from '@/types/movimentacao'

interface ItemFormatado {
    codprod: string
    produto: string
    categoria: string
    quantidade: number
    valorUnitario: number
    totalItem: number
    lote: string
    fabricacao?: Date
    validade?: Date
}

interface MovimentacaoPayload {
    dataHora: string
    nota: string
    tipo: string
    responsavel: string
    clienteOuFornecedor: string
    itens: ItemFormatado[]
    quantidade: number
    valor: number
}

interface ModalNovaMovimentacaoProps {
    onClose: () => void
    onSalvou: (novaMovimentacao: Movimentacao) => void
    categorias: string[]
    produtosExistentes: {
        codprod: string
        nome: string
        categoria: string
    }[]
}

interface Item {
    codprod: string
    produto: string
    categoria: string
    quantidade: string
    valorUnitario: string
    lote: string
    fabricacao: string
    validade: string
    editavel: boolean
}

export default function ModalNovaMovimentacao({
    onClose,
    onSalvou,
    categorias,
    produtosExistentes,
}: ModalNovaMovimentacaoProps) {
    const [form, setForm] = useState({
        dataHora: new Date().toISOString().slice(0, 16),
        nota: '',
        tipo: 'entrada',
        responsavel: '',
        clienteOuFornecedor: '',
    })

    const [itens, setItens] = useState<Item[]>([])

    const adicionarItem = () => {
        setItens([
            ...itens,
            {
                codprod: '',
                produto: '',
                categoria: '',
                quantidade: '',
                valorUnitario: '',
                lote: '',
                fabricacao: '',
                validade: '',
                editavel: true,
            },
        ])
    }

    type ItemKey = keyof Omit<Item, 'editavel'>

    const atualizarItem = (index: number, key: ItemKey, value: string) => {
        const novosItens = [...itens]

        if (key === 'codprod') {
            const produtoEncontrado = produtosExistentes.find(p => p.codprod === value)

            novosItens[index] = {
                ...novosItens[index],
                codprod: value,
                produto: produtoEncontrado ? produtoEncontrado.nome : '',
                categoria: produtoEncontrado ? produtoEncontrado.categoria : '',
                editavel: !produtoEncontrado,
            }
        } else {
            novosItens[index] = { ...novosItens[index], [key]: value }
        }

        setItens(novosItens)
    }

    const removerItem = (index: number) => {
        setItens(itens.filter((_, i) => i !== index))
    }

    const calcularTotal = () => {
        return itens.reduce(
            (acc, item) =>
                acc + Number(item.quantidade || 0) * Number(item.valorUnitario || 0),
            0
        ) * (form.tipo === 'saida' ? -1 : 1)
    }

    const calcularQuantidadeTotal = () => {
        return itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0) * (form.tipo === 'saida' ? -1 : 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const camposInvalidos = itens.some(item => !item.codprod || !item.produto || !item.categoria)
        if (camposInvalidos) {
            alert('Preencha todos os campos obrigatórios dos itens.')
            return
        }

        const itensFormatados = itens.map(i => ({
            codprod: i.codprod,
            produto: i.produto,
            categoria: i.categoria,
            quantidade: Number(i.quantidade),
            valorUnitario: Number(i.valorUnitario),
            totalItem: Number(i.quantidade) * Number(i.valorUnitario),
            lote: i.lote,
            fabricacao: i.fabricacao ? new Date(i.fabricacao) : undefined,
            validade: i.validade ? new Date(i.validade) : undefined,
        }))

        const payload: MovimentacaoPayload = {
            dataHora: form.dataHora,
            nota: form.nota,
            tipo: form.tipo,
            responsavel: form.responsavel.trim() || 'Não informado',
            clienteOuFornecedor: form.clienteOuFornecedor,
            itens: itensFormatados,
            quantidade: calcularQuantidadeTotal(),
            valor: calcularTotal(),
        }

        try {
            const res = await fetch('/api/movimentacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Erro ao salvar movimentação')

            const novaMov = await res.json()
            onSalvou(novaMov)
            onClose()
        } catch (err) {
            console.error('Erro no envio:', err)
            alert('Erro inesperado ao salvar.')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-lg flex flex-col gap-4 w-[700px] max-h-[90vh] overflow-auto"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Data/Hora</label>
                        <input
                            type="datetime-local"
                            value={form.dataHora}
                            onChange={(e) => setForm({...form, dataHora: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Tipo</label>
                        <select
                            value={form.tipo}
                            onChange={(e) => setForm({...form, tipo: e.target.value})}
                            className="w-full p-2 border rounded"
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Nota Fiscal</label>
                        <input
                            type="text"
                            value={form.nota}
                            onChange={(e) => setForm({...form, nota: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Responsável</label>
                        <input
                            type="text"
                            value={form.responsavel}
                            onChange={(e) => setForm({...form, responsavel: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-1">Cliente/Fornecedor</label>
                        <input
                            type="text"
                            value={form.clienteOuFornecedor}
                            onChange={(e) => setForm({...form, clienteOuFornecedor: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-medium mb-2">Itens</h3>
                    <button
                        type="button"
                        onClick={adicionarItem}
                        className="mb-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        + Adicionar Item
                    </button>

                    {itens.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 mb-4 p-3 border rounded">
                            <div className="col-span-2">
                                <label className="block text-xs">Código</label>
                                <input
                                    type="text"
                                    value={item.codprod}
                                    onChange={(e) => atualizarItem(index, 'codprod', e.target.value)}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="block text-xs">Produto</label>
                                <input
                                    type="text"
                                    value={item.produto}
                                    onChange={(e) => atualizarItem(index, 'produto', e.target.value)}
                                    className="w-full p-1 border rounded"
                                    disabled={!item.editavel}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs">Categoria</label>
                                <select
                                    value={item.categoria}
                                    onChange={(e) => atualizarItem(index, 'categoria', e.target.value)}
                                    className="w-full p-1 border rounded"
                                    disabled={!item.editavel}
                                >
                                    <option value="">Selecione</option>
                                    {categorias.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs">Qtd</label>
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs">Valor</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={item.valorUnitario}
                                    onChange={(e) => atualizarItem(index, 'valorUnitario', e.target.value)}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs">Lote</label>
                                <input
                                    type="text"
                                    value={item.lote}
                                    onChange={(e) => atualizarItem(index, 'lote', e.target.value)}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                            <div className="col-span-1 flex items-end">
                                <button
                                    type="button"
                                    onClick={() => removerItem(index)}
                                    className="p-1 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                    <div className="flex justify-between">
                        <span>Total de Itens:</span>
                        <span>{itens.length}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span>Valor Total:</span>
                        <span>R$ {calcularTotal().toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    )
}