import { PrismaClient } from '@prisma/client'
import { HeartHandshake, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { registrarRecaudacion, eliminarRecaudacion } from '../actions/recaudaciones'

const prisma = new PrismaClient()

export default async function RecaudacionesPage() {
    // Cargar recaudaciones con el alumno asociado (si lo tiene)
    const recaudaciones = await prisma.recaudacionFondo.findMany({
        orderBy: { fecha: 'desc' },
        include: { alumno: { select: { nombre: true } } }
    })

    // Lista de alumnos para el selector del formulario
    const alumnos = await prisma.alumno.findMany({
        select: { id: true, nombre: true },
        orderBy: { nombre: 'asc' }
    })

    const totalRecaudado = recaudaciones.reduce((acc, r) => acc + r.aporte, 0)

    // Agrupar por actividad para el resumen
    const porActividad = recaudaciones.reduce<Record<string, number>>((acc, r) => {
        acc[r.actividad] = (acc[r.actividad] || 0) + r.aporte
        return acc
    }, {})

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Recaudaciones y Emprendimientos</h2>
                <p className="text-zinc-400">Gestiona las actividades a beneficio para costear viajes y torneos.</p>
            </div>

            {/* Resúmenes */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-purple-500/10 p-3">
                            <HeartHandshake className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Total Recaudado</p>
                            <h3 className="text-2xl font-bold text-white">${totalRecaudado.toLocaleString('es-AR')}</h3>
                        </div>
                    </div>
                </div>

                {/* Resumen por Actividad */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-medium text-zinc-400 mb-3">Por Actividad</p>
                    <div className="space-y-2">
                        {Object.entries(porActividad).map(([act, total]) => (
                            <div key={act} className="flex justify-between text-sm">
                                <span className="text-zinc-300">{act}</span>
                                <span className="font-medium text-emerald-500">${total.toLocaleString('es-AR')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Tabla de Registros */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Historial de Aportes</h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-sm backdrop-blur overflow-hidden">
                        <table className="w-full text-sm text-zinc-400">
                            <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                                <tr>
                                    <th className="px-5 py-4 text-left font-medium text-zinc-300">Colaborador</th>
                                    <th className="px-5 py-4 text-left font-medium">Pertenece a</th>
                                    <th className="px-5 py-4 text-left font-medium">Actividad</th>
                                    <th className="px-5 py-4 text-center font-medium">Fecha</th>
                                    <th className="px-5 py-4 text-right font-medium text-emerald-500">Aporte</th>
                                    <th className="px-5 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {recaudaciones.map((r) => (
                                    <tr key={r.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-5 py-4 font-medium text-zinc-200">{r.colaborador}</td>
                                        <td className="px-5 py-4">
                                            {r.alumno ? (
                                                <span className="text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5">
                                                    Familia {r.alumno.nombre.split(' ')[1] || r.alumno.nombre}
                                                </span>
                                            ) : (
                                                <span className="text-xs rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5">
                                                    Sabon
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300 ring-1 ring-inset ring-zinc-700">
                                                {r.actividad}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center text-xs">
                                            {format(r.fecha, "d MMM yyyy", { locale: es })}
                                        </td>
                                        <td className="px-5 py-4 text-right font-semibold text-emerald-500">
                                            ${r.aporte.toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <form action={eliminarRecaudacion.bind(null, r.id)}>
                                                <button type="submit" className="text-zinc-600 hover:text-red-400 p-1">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {recaudaciones.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-zinc-500">
                                            No hay aportes registrados aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Registrar Aporte</h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 backdrop-blur">
                        <form action={registrarRecaudacion} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="colaborador" className="text-sm font-medium text-zinc-300">Nombre del Colaborador / Donante</label>
                                <input required type="text" id="colaborador" name="colaborador" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: Mirta González" />
                            </div>

                            {/* Asociar a un alumno o a Sabon */}
                            <div className="space-y-2">
                                <label htmlFor="alumnoId" className="text-sm font-medium text-zinc-300">¿Pertenece a la familia de...?</label>
                                <select id="alumnoId" name="alumnoId" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                                    <option value="">Sabon (Academia / Propio)</option>
                                    {alumnos.map((a) => (
                                        <option key={a.id} value={a.id}>{a.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="actividad" className="text-sm font-medium text-zinc-300">Actividad</label>
                                <select id="actividad" name="actividad" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                                    <option>Venta de Empanadas</option>
                                    <option>Bingo Familiar</option>
                                    <option>Venta de Locro</option>
                                    <option>Rifa Benéfica</option>
                                    <option>Donación Directa</option>
                                    <option>Otro</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="aporte" className="text-sm font-medium text-zinc-300">Monto del Aporte ($)</label>
                                <input required type="number" step="0.01" id="aporte" name="aporte" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: 5000.00" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fecha" className="text-sm font-medium text-zinc-300">Fecha del Aporte</label>
                                <input required type="date" id="fecha" name="fecha" defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                            </div>

                            <button type="submit" className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm">
                                Registrar Aporte
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
