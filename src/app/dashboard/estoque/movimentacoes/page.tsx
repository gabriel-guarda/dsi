// src/app/dashboard/estoque/movimentacoes/page.tsx
'use client'

import { useState, useEffect } from 'react'
import ModalNovaMovimentacao from '@/components/ModalNovaMovimentacao'
import React from 'react'

interface Produto {
    codprod: string
    nome: string
    categoria: string
    quantidade?: number
    valorUnitario?: number
}

interface Item {
    codprod: string
    nome: string
    quantidade: number
    valorUnitario: number
    totalItem: number
    categoria: string
    lote?: string
    validade?: string
    fabricacao?: string
    editavel?: boolean
}

interface Movimentacao {
    _id: string
    codprod: string
    dataHora: string
    nota: string
    tipo: 'entrada' | 'saida'
    responsavel: string
    itens: Item[]
    quantidade: number
    valor: number
    clienteOuFornecedor?: string
    documento?: string
}

interface ApiProduto {
    codprod: string
    nome?: string
    produto?: string
    categoria: string
}

export default function MovimentacoesPage() {
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
    const [categorias, setCategorias] = useState<string[]>([])
    const [produtosExistentes, setProdutosExistentes] = useState<Produto[]>([])
    const [showModal, setShowModal] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [loading, setLoading] = useState({
        movimentacoes: true,
        categorias: true,
        produtos: true
    })

    const fetchMovimentacoes = async () => {
        try {
            const res = await fetch('/api/movimentacoes')
            if (!res.ok) throw new Error('Erro na resposta da API')
            const data = await res.json()
            setMovimentacoes(data || [])
        } catch (err) {
            console.error('Erro ao buscar movimentações:', err)
            setMovimentacoes([])
        } finally {
            setLoading(prev => ({ ...prev, movimentacoes: false }))
        }
    }

    const fetchCategorias = async () => {
        try {
            const res = await fetch('/api/categorias')
            if (!res.ok) throw new Error('Erro ao buscar categorias')
            const data = await res.json()
            setCategorias(data || [])
        } catch (err) {
            console.error('Erro ao buscar categorias:', err)
            setCategorias([])
        } finally {
            setLoading(prev => ({ ...prev, categorias: false }))
        }
    }

    const fetchProdutos = async () => {
        try {
            const res = await fetch('/api/produtos')
            if (!res.ok) throw new Error('Erro ao buscar produtos')
            const data: ApiProduto[] = await res.json()
            
            const produtosTransformados: Produto[] = data.map(p => ({
                codprod: p.codprod,
                nome: p.nome || p.produto || '', // Fallback to empty string if both are missing
                categoria: p.categoria
            }))
            
            setProdutosExistentes(produtosTransformados || [])
        } catch (err) {
            console.error('Erro ao buscar produtos:', err)
            setProdutosExistentes([])
        } finally {
            setLoading(prev => ({ ...prev, produtos: false }))
        }
    }

    useEffect(() => {
        fetchMovimentacoes()
        fetchCategorias()
        fetchProdutos()
    }, [])

    const addMovimentacao = (movimentacao: Movimentacao) => {
        setMovimentacoes(prev => [movimentacao, ...prev])
    }

    if (loading.movimentacoes || loading.categorias || loading.produtos) {
        return <div className="p-4">Carregando...</div>
    }

    return (
        <div className="p-4">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Movimentações de Estoque</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    + Nova Movimentação
                </button>
            </div>

            {showModal && (
                <ModalNovaMovimentacao
                    categorias={categorias}
                    produtosExistentes={produtosExistentes}
                    onClose={() => setShowModal(false)}
                    onSalvou={addMovimentacao}
                />
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Data/Hora</th>
                            <th className="p-3 text-left">Nota</th>
                            <th className="p-3 text-left">Tipo</th>
                            <th className="p-3 text-right">Qtd</th>
                            <th className="p-3 text-right">Valor</th>
                            <th className="p-3 text-left">Responsável</th>
                            <th className="p-3 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.length > 0 ? (
                            movimentacoes.map((item) => (
                                <React.Fragment key={item._id}>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            {item.dataHora
                                                ? new Date(item.dataHora).toLocaleString('pt-BR')
                                                : <span className="text-red-500 italic">Sem data</span>}
                                        </td>
                                        <td className="p-3">{item.nota || 'Sem nota'}</td>
                                        <td className="p-3">
                                            <span className={`${item.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full text-xs`}>
                                                {item.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">{item.quantidade || 0}</td>
                                        <td className="p-3 text-right">
                                            R$ {item.valor?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="p-3">{item.responsavel || 'Não informado'}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => setExpanded(expanded === item._id ? null : item._id)}
                                                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm transition-colors"
                                            >
                                                {expanded === item._id ? 'Ocultar' : 'Detalhes'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === item._id && (
                                        <tr>
                                            <td colSpan={7} className="p-4 bg-gray-50">
                                                <div className="mb-2">
                                                    <h3 className="font-bold mb-2">Itens:</h3>
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-gray-200">
                                                                <th className="p-2 text-left">Código</th>
                                                                <th className="p-2 text-left">Produto</th>
                                                                <th className="p-2 text-left">Categoria</th>
                                                                <th className="p-2 text-right">Qtd</th>
                                                                <th className="p-2 text-right">Vlr Unit.</th>
                                                                <th className="p-2 text-right">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.itens?.map((i, idx) => (
                                                                <tr key={idx} className="border-b">
                                                                    <td className="p-2">{i.codprod}</td>
                                                                    <td className="p-2">{i.nome}</td>
                                                                    <td className="p-2">{i.categoria || '-'}</td>
                                                                    <td className="p-2 text-right">
                                                                        {item.tipo === 'saida' ? '-' : ''}{i.quantidade}
                                                                    </td>
                                                                    <td className="p-2 text-right">R$ {i.valorUnitario.toFixed(2)}</td>
                                                                    <td className="p-2 text-right">R$ {(i.totalItem || i.quantidade * i.valorUnitario).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {item.clienteOuFornecedor && (
                                                    <p className="text-sm">
                                                        <span className="font-semibold">Cliente/Fornecedor:</span> {item.clienteOuFornecedor}
                                                    </p>
                                                )}
                                                {item.documento && (
                                                    <p className="text-sm">
                                                        <span className="font-semibold">Documento:</span> {item.documento}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    Nenhuma movimentação encontrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}