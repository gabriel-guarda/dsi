'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

type EstoqueHeaderProps = {
  titulo: string
  exibirVoltar?: boolean
  exibirCadastrarCategoria?: boolean
  onCadastrarCategoria?: () => void // opcional: função a ser chamada no botão
}

export default function EstoqueHeader({
  titulo,
  exibirVoltar,
  exibirCadastrarCategoria,
  onCadastrarCategoria
}: EstoqueHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {exibirVoltar && (
          <button
            onClick={() => router.back()}
            className="text-blue-500 hover:underline text-sm"
          >
            ← Voltar
          </button>
        )}

        <h1 className="text-xl font-bold text-gray-800">{titulo}</h1>
      </div>

      {exibirCadastrarCategoria && (
        <button
          onClick={onCadastrarCategoria || (() => alert('Ação não implementada'))}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Nova Categoria
        </button>
      )}
    </header>
  )
}
