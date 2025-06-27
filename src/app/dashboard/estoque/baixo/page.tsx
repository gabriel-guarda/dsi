// src/app/dashboard/estoque/baixo/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
}

export default function EstoqueBaixoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        // Simulação de dados - substitua por uma chamada API real
        const dadosMockados: Produto[] = [
          { id: 1, nome: 'Produto A', categoria: 'Eletrônicos', estoque: 2, estoqueMinimo: 5 },
          { id: 2, nome: 'Produto B', categoria: 'Informática', estoque: 1, estoqueMinimo: 3 },
          { id: 3, nome: 'Produto C', categoria: 'Móveis', estoque: 0, estoqueMinimo: 2 },
        ];
        
        // Filtra apenas produtos com estoque abaixo do mínimo
        const estoqueBaixo = dadosMockados.filter(p => p.estoque < p.estoqueMinimo);
        setProdutos(estoqueBaixo);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⚠️ Estoque Baixo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map(produto => (
          <Card key={produto.id}>
            <CardContent className="p-4">
              <h3 className="font-medium">{produto.nome}</h3>
              <p className="text-sm text-gray-600">{produto.categoria}</p>
              <div className="mt-2">
                <p className="text-red-500 font-bold">
                  Estoque: {produto.estoque} (Mínimo: {produto.estoqueMinimo})
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {produtos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum produto com estoque baixo encontrado
        </div>
      )}
    </div>
  );
}