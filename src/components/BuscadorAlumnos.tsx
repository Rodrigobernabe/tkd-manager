'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export function BuscadorAlumnos() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [estado, setEstado] = useState(searchParams.get('estado') || 'todos')

    // Debounce the search query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString())
                if (query) {
                    params.set('q', query)
                } else {
                    params.delete('q')
                }

                if (estado !== 'todos') {
                    params.set('estado', estado)
                } else {
                    params.delete('estado')
                }

                router.push(`/alumnos?${params.toString()}`)
            })
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query, estado, router, searchParams])

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o DNI..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 backdrop-blur"
                />
            </div>
            <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 backdrop-blur"
            >
                <option value="todos">Todos los Estados</option>
                <option value="activos">Solo Activos</option>
                <option value="inactivos">Solo Inactivos</option>
            </select>
        </div>
    )
}
