export interface Item {
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

export interface Movimentacao {
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