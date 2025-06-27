'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [openEstoque, setOpenEstoque] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/Login')
        }
    }, [status, router])

    if (status === 'loading') {
        return <p style={{ padding: '2rem' }}>Carregando...</p>
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside
                style={{
                    width: '220px',
                    background: '#1e293b',
                    color: '#fff',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
            >
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl leading-none">📊</span>
                    <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 leading-none">
                        SmartEvent
                    </h1>
                </div>

                <nav className="flex flex-col gap-4">
                    <Link href="/dashboard" className="text-white">🏠 Início</Link>
                    <Link href="/dashboard/produtos" className="text-white">📦 Produtos</Link>
                    <Link href="/dashboard/vendas" className="text-white">💰 Vendas</Link>

                    {/* Estoque com submenu */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => setOpenEstoque(!openEstoque)}
                            className="text-white flex items-center justify-between"
                        >
                            <span className="flex gap-2">📈 Estoque</span>
                            <span className={`transition-transform ${openEstoque ? 'rotate-90' : ''}`}>
                                ▶
                            </span>
                        </button>

                        {openEstoque && (
                            <div className="flex flex-col gap-2 pl-4 mt-2">
                                <Link href="/dashboard/estoque/consultar" className="text-white hover:underline">
                                    Consultar Estoque
                                </Link>
                                <Link href="/dashboard/estoque/movimentacoes" className="text-white hover:underline">
                                    Movimentações
                                </Link>
                                <Link href="/dashboard/estoque/local-e-status" className="text-white hover:underline">
                                    Local. e Status
                                </Link>
                                <Link href="/dashboard/estoque/baixo" className="text-white hover:underline">
                                    ⚠️ Itens com Estoque Baixo
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/relatorios" className="text-white">📑 Relatórios</Link>
                </nav>

                <button
                    onClick={() => signOut({ callbackUrl: '/Login' })}
                    style={{
                        marginTop: 'auto',
                        background: '#ef4444',
                        color: '#fff',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Sair
                </button>
            </aside>

            <main style={{ flex: 1, padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>
                        Bem-vindo, <span style={{ fontWeight: 600 }}>{session?.user?.name || session?.user?.email}</span>!
                    </h1>
                </div>
                {children}
            </main>
        </div>
    )
}