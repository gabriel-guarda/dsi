import { connectDB } from '@/lib/mongodb';
import MovimentacaoModel from '@/models/Movimentacao';
import { NextResponse } from 'next/server';

interface Item {
  status?: string;
  quantidade: number;
  // outros campos, se quiser
}

interface Movimentacao {
  tipo: string;
  itens?: Item[];
  // outros campos que precisar
}

export async function GET() {
  await connectDB();

  const movimentacoes = await MovimentacaoModel.find();

  const statusMap = new Map<string, number>();

  movimentacoes.forEach((mov: Movimentacao) => {
    mov.itens?.forEach((item: Item) => {
      const status = item.status || 'Ativo';
      const qnt = mov.tipo === 'saida' ? -item.quantidade : item.quantidade;

      if (!statusMap.has(status)) {
        statusMap.set(status, qnt);
      } else {
        statusMap.set(status, statusMap.get(status)! + qnt);
      }
    });
  });

  const resultado = Array.from(statusMap.entries()).map(([status, total]) => ({
    status,
    total,
  }));

  return NextResponse.json(resultado);
}
