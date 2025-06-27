import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Movimentacao from '@/models/Movimentacao';
import { publishMovimentacao } from '@/lib/redisPublisher';

interface Item {
  codprod: string;
  status?: string;
  localizacao?: string;
  // adicione outros campos do item que você usa aqui, se houver
}

interface MovimentacaoBody {
  dataHora: string;
  nota: string;
  tipo: string;
  responsavel: string;
  clienteOuFornecedor?: string;
  documento?: string;
  itens: Item[];
  quantidade: number;
  valor: number;
}

export async function GET() {
  await connectDB();
  const movimentacoes = await Movimentacao.find().sort({ createdAt: -1 });
  return NextResponse.json(movimentacoes);
}

export async function POST(req: Request) {
  try {
    const body: MovimentacaoBody = await req.json();
    console.log('[DEBUG] Payload recebido:', body);

    const {
      dataHora,
      nota,
      tipo,
      responsavel,
      clienteOuFornecedor,
      documento,
      itens,
      quantidade,
      valor,
    } = body;

    await connectDB();
    const itensComCampos = itens.map((item: Item) => ({
      ...item,
      status: item.status || 'Ativo',
      localizacao: item.localizacao || '-',
    }));

    const novaMov = await Movimentacao.create({
      dataHora,
      nota,
      tipo,
      responsavel,
      clienteOuFornecedor: clienteOuFornecedor || '',
      documento: documento || '',
      itens: itensComCampos,
      quantidade,
      valor,
    });

    await publishMovimentacao(novaMov);

    return NextResponse.json(novaMov, { status: 201 });
  } catch (error) {
    console.error('❌ Erro ao criar movimentação:', error);
    console.log('[DEBUG] Erro capturado, não foi possível recuperar o corpo do request.');

    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { codprod, status, localizacao } = body;

    if (!codprod) {
      return NextResponse.json({ error: 'Código do produto não informado' }, { status: 400 });
    }

    // Atualiza todos os itens que tenham esse codprod (pode ser 1:N movimentações)
    const result = await Movimentacao.updateMany(
      { 'itens.codprod': codprod },
      {
        $set: {
          'itens.$[elem].status': status,
          'itens.$[elem].localizacao': localizacao,
        },
      },
      {
        arrayFilters: [{ 'elem.codprod': codprod }],
      }
    );

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('[PUT /movimentacoes] erro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar movimentação' }, { status: 500 });
  }
}
