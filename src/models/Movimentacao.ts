import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema(
    {
        codprod: { type: String, required: true }, // ← ESSENCIAL!
        produto: { type: String, required: true },
        quantidade: { type: Number, required: true },
        valorUnitario: { type: Number, required: true },
        totalItem: { type: Number, required: true },
        categoria: { type: String },
        lote: { type: String },
        validade: { type: Date },
        fabricacao: { type: Date },
        status: { type: String, default: 'Ativo' },
        localizacao: { type: String, default: '-' }
    },
    { _id: false }
);


const MovimentacaoSchema = new Schema(
    {
        dataHora: { type: Date, required: true },
        nota: { type: String, required: true },
        tipo: { type: String, enum: ['entrada', 'saida'], required: true },
        responsavel: { type: String, required: false }, // ou simplesmente remova o `required`
        clienteOuFornecedor: { type: String, default: null },
        itens: [ItemSchema],
        quantidade: { type: Number, required: true },
        valor: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const Movimentacao = models.Movimentacao || model('Movimentacao', MovimentacaoSchema);
export default Movimentacao;
