import Redis from 'ioredis'

interface MovimentacaoData {
    id: string
    dataHora: string
    tipo: 'entrada' | 'saida'
    responsavel: string
    clienteOuFornecedor: string
    itens: Array<{
        codprod: string
        produto: string
        quantidade: number
        valorUnitario: number
    }>
    quantidadeTotal: number
    valorTotal: number
}

// Instância única de Redis com suporte a rediss:// (SSL)
const redis = new Redis(process.env.REDIS_URL!, {
    tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
})

/**
 * Publica dados da movimentação no canal 'movimentacoes'
 * @param data - Objeto contendo os dados da movimentação
 */
export async function publishMovimentacao(data: MovimentacaoData) {
    try {
        const payload = JSON.stringify(data)
        await redis.publish('movimentacoes', payload)
        console.log('📢 Publicado no Redis:', payload)
    } catch (error) {
        console.error('❌ Erro ao publicar no Redis:', error)
    }
}