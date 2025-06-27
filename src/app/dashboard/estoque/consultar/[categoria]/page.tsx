'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EstoqueHeader from '@/components/EstoqueHeader'
import ModalEditProduto from '@/components/ModalEditProduto'

type ProdutoEstoque = {
  codprod: string
  produto: string
  quantidade: number
  status: string
  localizacao: string
}

interface Item {
  categoria?: string
  codprod?: string
  produto: string
  quantidade: number
  status?: string
  localizacao?: string
}

interface Movimentacao {
  tipo: string
  itens?: Item[]
}

export default function ConsultaEstoqueCategoriaPage() {
  const params = useParams()
  const categoriaRaw = params?.categoria
  const categoria = Array.isArray(categoriaRaw) ? categoriaRaw[0] : categoriaRaw

  const [modalAberto, setModalAberto] = useState(false)
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEstoque | null>(null)

  useEffect(() => {
    if (!categoria) return

    const fetchMovimentacoes = async () => {
      try {
        const res = await fetch('/api/movimentacoes')
        if (!res.ok) throw new Error('Erro na resposta da API')

        const data: Movimentacao[] = await res.json()
        const categoriaSelecionada = categoria.toLowerCase()

        const daCategoria = data
          .filter(mov =>
            mov.itens?.some(i => i.categoria?.toLowerCase() === categoriaSelecionada)
          )
          .flatMap(mov =>
            mov.itens
              ?.filter(i => i.categoria?.toLowerCase() === categoriaSelecionada)
              .map(i => ({
                codprod: i.codprod || '-',
                produto: i.produto,
                quantidade: mov.tipo === 'saida' ? -i.quantidade : i.quantidade,
                status: i.status || 'Ativo',
                localizacao: i.localizacao || '-'
              })) ?? []
          ) ?? []

        const agrupado: { [produto: string]: ProdutoEstoque } = {}
        daCategoria.forEach(item => {
          if (!agrupado[item.produto]) {
            agrupado[item.produto] = { ...item }
          } else {
            agrupado[item.produto].quantidade += item.quantidade
          }
        })

        setProdutos(Object.values(agrupado))
      } catch (err) {
        console.error('Erro ao buscar movimentações:', err)
      }
    }

    fetchMovimentacoes()
  }, [categoria])

  const handleEditar = (produto: ProdutoEstoque) => {
    setProdutoSelecionado(produto)
    setModalAberto(true)
  }

  if (!categoria) {
    return <div>Categoria inválida ou não informada.</div>
  }

  return (
    <div>
      <EstoqueHeader
        titulo={`Categoria: ${categoria}`}
        exibirVoltar
        exibirCadastrarCategoria
      />

      <h2 className="text-xl font-bold mb-4 text-gray-800">Produtos - Estoque</h2>

      {modalAberto && produtoSelecionado && (
        <ModalEditProduto
          produto={produtoSelecionado}
          onClose={() => setModalAberto(false)}
          onSalvar={(produtoEditado: ProdutoEstoque) => {
            const atualizados = produtos.map(p =>
              p.codprod === produtoEditado.codprod ? produtoEditado : p
            )
            setProdutos(atualizados)
            setModalAberto(false)
          }}
        />
      )}

      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-slate-200">
            <th className="text-left px-4 py-2">Código</th>
            <th className="text-left px-4 py-2">Produto</th>
            <th className="text-left px-4 py-2">Quantidade</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Localização</th>
            <th className="text-left px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.codprod} className="border-b hover:bg-slate-50">
              <td className="px-4 py-2">{produto.codprod}</td>
              <td className="px-4 py-2">{produto.produto}</td>
              <td className="px-4 py-2">{produto.quantidade}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    produto.status === 'Ativo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {produto.status}
                </span>
              </td>
              <td className="px-4 py-2">{produto.localizacao}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEditar(produto)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded mr-2"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
