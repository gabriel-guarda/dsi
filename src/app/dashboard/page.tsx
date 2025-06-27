'use client'

import { ChartVendas } from '@/components/ChartVendas'
import { ChartEstoque } from '@/components/ChartEstoque'
import { ChartTopProdutos } from '@/components/ChartTopProdutos'
import { ChartProdutosVencimento } from '@/components/ChartProdutosVencimento'
import { ChartProdutosParados } from '@/components/ChartProdutosParados'


export default function DashboardPage() {
    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-xl font-semibold mb-4">📊 Vendas Mensais</h2>
                <ChartVendas />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">📦 Estoque por Categoria</h2>
                <ChartEstoque />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">🥇 Produtos Mais Vendidos</h2>
                <ChartTopProdutos />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">⏳ Produtos Próximos do Vencimento</h2>
                <ChartProdutosVencimento />
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-4">🕒 Produtos Parados no Estoque</h2>
                <ChartProdutosParados />
            </section>
        </div>
    )
}