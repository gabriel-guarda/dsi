'use client'

import React, { useState } from 'react'

type Produto = {
    id: number
    nome: string
    descricao: string
    valorVenda: number
    categoria: string
    subcategoria: string
    estoque: number
    ativo: boolean
}

type FiltroAtivo = 'todos' | 'ativos' | 'inativos'

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [busca, setBusca] = useState('')
    const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>('todos')
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        descricao: '',
        valorVenda: '',
        categoria: '',
        subcategoria: '',
        ativo: true
    })
    const [showModal, setShowModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
    // Simulação de pedidos para receber
    const pedidosParaReceber = 5

    // Resumo
    const produtosEstoqueBaixo = produtos.filter(p => p.estoque < 3).length
    const produtosAtivos = produtos.filter(p => p.ativo).length

    // Filtros
    const produtosFiltrados = produtos
        .filter(p =>
            p.nome.toLowerCase().includes(busca.toLowerCase()) ||
            p.descricao.toLowerCase().includes(busca.toLowerCase())
        )
        .filter(p => {
            if (filtroAtivo === 'ativos') return p.ativo
            if (filtroAtivo === 'inativos') return !p.ativo
            return true
        })

    function handleNovoProdutoChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setNovoProduto(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }))
        } else if (type === 'number') {
            setNovoProduto(prev => ({
                ...prev,
                [name]: Number(value)
            }))
        } else {
            setNovoProduto(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    function adicionarProduto(e: React.FormEvent) {
        e.preventDefault()
        if (!novoProduto.nome.trim()) return
        setProdutos([
            ...produtos,
            {
                id: Date.now(),
                nome: novoProduto.nome,
                descricao: novoProduto.descricao,
                valorVenda: Number(novoProduto.valorVenda) || 0,
                categoria: novoProduto.categoria,
                subcategoria: novoProduto.subcategoria,
                estoque: 0,
                ativo: novoProduto.ativo
            }
        ])
        setNovoProduto({
            nome: '',
            descricao: '',
            valorVenda: '',
            categoria: '',
            subcategoria: '',
            ativo: true
        })
        setShowModal(false)
    }

    function abrirModalEditar(produto: Produto) {
        setProdutoEditando({ ...produto })
        setShowEditModal(true)
    }

    function handleEditarProdutoChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        if (!produtoEditando) return
        const { name, value, type } = e.target
        setProdutoEditando(prev =>
            prev
                ? {
                      ...prev,
                      [name]:
                          type === 'checkbox' && e.target instanceof HTMLInputElement
                              ? e.target.checked
                              : type === 'number'
                              ? Number(value)
                              : value,
                  }
                : prev
        )
    }

    function salvarEdicaoProduto(e: React.FormEvent) {
    e.preventDefault();
    if (!produtoEditando) return;
    
    setProdutos(produtos =>
        produtos.map(p => (p.id === produtoEditando.id ? produtoEditando : p))
    );
    
    setShowEditModal(false);
    setProdutoEditando(null);
}

    function excluirProduto(id: number) {
        setProdutos(produtos => produtos.filter(p => p.id !== id))
    }

    return (
        <main>
            <h1>📦 Produtos</h1>
            {/* Resumo */}
            <div style={{ marginBottom: 16, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                <span style={{ marginRight: 16 }}>🔴 Estoque baixo: <b>{produtosEstoqueBaixo}</b></span>
                <span style={{ marginRight: 16 }}>📦 Pedidos para receber: <b>{pedidosParaReceber}</b></span>
                <span>🟢 Produtos ativos: <b>{produtosAtivos}</b></span>
            </div>

            {/* Barra de busca e filtros */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 8 }}>
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#888'
                    }}>🔍</span>
                    <input
                        style={{ paddingLeft: 28 }}
                        placeholder="Procurar produto..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                    />
                </div>
                <select 
                    value={filtroAtivo} 
                    onChange={e => setFiltroAtivo(e.target.value as FiltroAtivo)}
                >
                    <option value="todos">Todos</option>
                    <option value="ativos">Ativos</option>
                    <option value="inativos">Inativos</option>
                </select>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ marginLeft: 'auto' }}
                >
                    + Adicionar novo produto
                </button>
            </div>

            {/* Listagem */}
            <table border={1} cellPadding={6} cellSpacing={0} style={{ width: '100%', marginBottom: 24 }}>
                <thead style={{ background: '#eee' }}>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor de Venda</th>
                        <th>Categoria</th>
                        <th>Subcategoria</th>
                        <th>Estoque</th>
                        <th>Ativo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtosFiltrados.map(produto => (
                        <tr key={produto.id}>
                            <td>{produto.nome} <br /><small>{produto.descricao}</small></td>
                            <td>R$ {produto.valorVenda.toFixed(2)}</td>
                            <td>{produto.categoria}</td>
                            <td>{produto.subcategoria}</td>
                            <td>{produto.estoque}</td>
                            <td>{produto.ativo ? 'Sim' : 'Não'}</td>
                            <td>
                                <button onClick={() => abrirModalEditar(produto)}>Editar</button>
                                <button onClick={() => excluirProduto(produto.id)} style={{ marginLeft: 4, color: 'red' }}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    {produtosFiltrados.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center' }}>Nenhum produto encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal de novo produto */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        padding: 24,
                        borderRadius: 8,
                        minWidth: 320,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                        <h2>Novo Produto</h2>
                        <form onSubmit={adicionarProduto}>
                            <input
                                name="nome"
                                placeholder="Nome"
                                value={novoProduto.nome}
                                onChange={handleNovoProdutoChange}
                                required
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="descricao"
                                placeholder="Descrição"
                                value={novoProduto.descricao}
                                onChange={handleNovoProdutoChange}
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="valorVenda"
                                placeholder="Valor de Venda"
                                type="number"
                                value={novoProduto.valorVenda}
                                onChange={handleNovoProdutoChange}
                                style={{ marginRight: 8, width: 120 }}
                            />
                            <input
                                name="categoria"
                                placeholder="Categoria"
                                value={novoProduto.categoria}
                                onChange={handleNovoProdutoChange}
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="subcategoria"
                                placeholder="Subcategoria"
                                value={novoProduto.subcategoria}
                                onChange={handleNovoProdutoChange}
                                style={{ marginRight: 8 }}
                            />
                            <label style={{ marginRight: 8 }}>
                                <input
                                    name="ativo"
                                    type="checkbox"
                                    checked={novoProduto.ativo}
                                    onChange={handleNovoProdutoChange}
                                /> Ativo
                            </label>
                            <div style={{ marginTop: 16 }}>
                                <button type="submit" style={{ marginRight: 8 }}>Cadastrar</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de edição de produto */}
            {showEditModal && produtoEditando && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        padding: 24,
                        borderRadius: 8,
                        minWidth: 320,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                        <h2>Editar Produto</h2>
                        <form onSubmit={salvarEdicaoProduto}>
                            <input
                                name="nome"
                                placeholder="Nome"
                                value={produtoEditando.nome}
                                onChange={handleEditarProdutoChange}
                                required
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="descricao"
                                placeholder="Descrição"
                                value={produtoEditando.descricao}
                                onChange={handleEditarProdutoChange}
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="valorVenda"
                                placeholder="Valor de Venda"
                                type="number"
                                value={produtoEditando.valorVenda}
                                onChange={handleEditarProdutoChange}
                                style={{ marginRight: 8, width: 120 }}
                            />
                            <input
                                name="categoria"
                                placeholder="Categoria"
                                value={produtoEditando.categoria}
                                onChange={handleEditarProdutoChange}
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="subcategoria"
                                placeholder="Subcategoria"
                                value={produtoEditando.subcategoria}
                                onChange={handleEditarProdutoChange}
                                style={{ marginRight: 8 }}
                            />
                            <input
                                name="estoque"
                                placeholder="Estoque"
                                type="number"
                                value={produtoEditando.estoque}
                                onChange={handleEditarProdutoChange}
                                style={{ marginRight: 8, width: 80 }}
                            />
                            <label style={{ marginRight: 8 }}>
                                <input
                                    name="ativo"
                                    type="checkbox"
                                    checked={produtoEditando.ativo}
                                    onChange={handleEditarProdutoChange}
                                /> Ativo
                            </label>
                            <div style={{ marginTop: 16 }}>
                                <button type="submit" style={{ marginRight: 8 }}>Salvar</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}