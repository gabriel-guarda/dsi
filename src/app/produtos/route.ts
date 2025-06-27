import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Importa connectDB, não clientPromise
import Produto from '@/models/produtos';

export async function GET() {
  try {
    await connectDB(); // conecta ao MongoDB com Mongoose
    const produtos = await Produto.find();

    return NextResponse.json({ produtos });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
