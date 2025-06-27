'use client'

import Link from 'next/link'

export default function LocalEStatusPage() {
    const cards = [
        {
            titulo: 'Status dos Produtos',
            descricao: 'Gerencie os status dos produtos em estoque.',
            link: '/dashboard/estoque/status',
        },
        {
            titulo: 'Localização',
            descricao: 'Configure áreas de armazenamento como ruas, prateleiras e câmaras.',
            link: '/dashboard/estoque/local-e-status/localizacao',
        },
        {
            titulo: 'Busca Avançada',
            descricao: 'Encontre produtos por código, nome, status, local ou nota fiscal.',
            link: '/dashboard/estoque/local-e-status/busca-avancada',
        },
    ]

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800"> Local e Status</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.titulo}
                        href={card.link}
                        className="p-6 bg-white rounded shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">{card.titulo}</h2>
                        <p className="text-gray-600">{card.descricao}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
