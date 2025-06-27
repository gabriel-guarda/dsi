import Redis from 'ioredis'

interface Movimentacao {
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

const redis = new Redis(process.env.REDIS_URL!)

// Subscribe to the channel
redis.subscribe('movimentacoes', (err, count) => {
    if (err) {
        console.error('❌ Erro ao se inscrever no canal de movimentações:', err)
        return
    }
    console.log(`📡 Inscrito no canal "movimentacoes" com ${count} assinaturas.`)
})

// Handle incoming messages
redis.on('message', (channel, message) => {
    if (channel === 'movimentacoes') {
        try {
            const movimentacao: Movimentacao = JSON.parse(message)
            console.log('📥 Nova movimentação recebida via Redis:', movimentacao)

            // Here you can:
            // - Store in cache
            // - Update dashboard
            // - Write to another collection
            // - Trigger webhook or email
        } catch (error) {
            console.error('❌ Erro ao processar mensagem do Redis:', error)
        }
    }
})

// Handle connection errors
redis.on('error', (error) => {
    console.error('❌ Erro na conexão com Redis:', error)
})