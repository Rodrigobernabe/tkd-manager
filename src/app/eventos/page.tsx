import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Trophy, CalendarDays, Users, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { crearEvento, editarEvento } from '../actions/eventos'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Action server para eliminar evento
async function eliminarEventoAction(id: string) {
    "use server"
    await prisma.evento.delete({ where: { id } })
    revalidatePath('/eventos')
}

export default async function EventosPage() {
    const eventos = await prisma.evento.findMany({
        orderBy: { fecha: 'asc' },
        include: {
            _count: { select: { inscripciones: true } }
        }
    })

    const examenes = eventos.filter(e => e.tipo === 'Examen')
    const torneos = eventos.filter(e => e.tipo === 'Torneo')

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Torneos y Exámenes</h2>
                    <p className="text-zinc-400">Administra los eventos de la academia.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">

                {/* Listado de Eventos */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Exámenes */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-blue-500" />
                            Exámenes de Grado
                            <span className="ml-1 text-sm text-zinc-500 font-normal">({examenes.length})</span>
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {examenes.map((evento) => (
                                <div key={evento.id} className="group relative rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 shadow-sm backdrop-blur hover:border-blue-500/40 transition-colors">
                                    <Link href={`/eventos/${evento.id}`} className="absolute inset-0 rounded-xl z-10" />
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="rounded-lg bg-blue-500/10 p-2">
                                            <CalendarDays className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <form action={eliminarEventoAction.bind(null, evento.id)} className="relative z-20">
                                            <button type="submit" className="text-zinc-600 hover:text-red-400 p-1 transition-colors" title="Eliminar examen">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                    <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{evento.nombre}</h4>
                                    <p className="text-sm text-zinc-400 mb-3">
                                        {format(evento.fecha, "d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50 text-sm text-zinc-400">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{evento._count.inscripciones} Inscriptos</span>
                                    </div>
                                </div>
                            ))}
                            {examenes.length === 0 && (
                                <div className="sm:col-span-2 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500 text-sm">
                                    No hay exámenes programados. Creá uno →
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Torneos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-orange-500" />
                            Torneos
                            <span className="ml-1 text-sm text-zinc-500 font-normal">({torneos.length})</span>
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {torneos.map((evento) => (
                                <div key={evento.id} className="group relative rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 shadow-sm backdrop-blur hover:border-orange-500/40 transition-colors">
                                    <Link href={`/eventos/${evento.id}`} className="absolute inset-0 rounded-xl z-10" />
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="rounded-lg bg-orange-500/10 p-2">
                                            <Trophy className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <form action={eliminarEventoAction.bind(null, evento.id)} className="relative z-20">
                                            <button type="submit" className="text-zinc-600 hover:text-red-400 p-1 transition-colors" title="Eliminar torneo">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                    <h4 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{evento.nombre}</h4>
                                    <p className="text-sm text-zinc-400 mb-3">
                                        {format(evento.fecha, "d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50 text-sm text-zinc-400">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{evento._count.inscripciones} Inscriptos</span>
                                    </div>
                                </div>
                            ))}
                            {torneos.length === 0 && (
                                <div className="sm:col-span-2 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500 text-sm">
                                    No hay torneos programados. Creá uno →
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel lateral: Crear nuevo evento */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Plus className="h-5 w-5 text-orange-500" />
                        Nuevo Evento
                    </h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 backdrop-blur">
                        <form action={crearEvento} className="space-y-4">

                            <div className="space-y-2">
                                <label htmlFor="tipo" className="text-sm font-medium text-zinc-300">Tipo de Evento</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 cursor-pointer hover:border-blue-500/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10 transition-colors">
                                        <input type="radio" name="tipo" value="Examen" defaultChecked className="text-blue-500 focus:ring-blue-500 border-zinc-600 bg-zinc-800" />
                                        <span className="text-sm text-zinc-300">Examen</span>
                                    </label>
                                    <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 cursor-pointer hover:border-orange-500/50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/10 transition-colors">
                                        <input type="radio" name="tipo" value="Torneo" className="text-orange-500 focus:ring-orange-500 border-zinc-600 bg-zinc-800" />
                                        <span className="text-sm text-zinc-300">Torneo</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="nombre" className="text-sm font-medium text-zinc-300">Nombre del Evento</label>
                                <input
                                    required type="text" id="nombre" name="nombre"
                                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    placeholder="Ej: Examen de Grado - 1er Semestre"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fecha" className="text-sm font-medium text-zinc-300">Fecha del Evento</label>
                                <input
                                    required type="date" id="fecha" name="fecha"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm">
                                <Plus className="h-4 w-4" />
                                Crear Evento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
