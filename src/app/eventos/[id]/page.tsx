import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, CalendarDays, Trash2, Download, CheckCircle2, Circle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { inscribirAlumno, eliminarInscripcion, editarEvento, togglePagoInscripcion } from '../../actions/eventos'

const prisma = new PrismaClient()

export default async function EventoDetallePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
            inscripciones: {
                include: { alumno: { select: { nombre: true } } },
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!evento) notFound()

    // Alumnos que aún NO están inscriptos en este evento
    const alumnosInscriptosIds = evento.inscripciones.map(i => i.alumnoId)
    const alumnosSinInscribir = await prisma.alumno.findMany({
        where: { id: { notIn: alumnosInscriptosIds } },
        orderBy: { nombre: 'asc' }
    })

    const esExamen = evento.tipo === 'Examen'

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Encabezado */}
            <div className="flex items-start gap-4">
                <Link href="/eventos" className="rounded-full p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors mt-1">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight text-white">{evento.nombre}</h2>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${esExamen ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' : 'text-orange-500 border-orange-500/30 bg-orange-500/10'}`}>
                            {evento.tipo}
                        </span>
                    </div>
                    <p className="text-zinc-400 mt-1">
                        {format(evento.fecha, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                </div>
                {/* Botón de descarga de planilla (solo torneos y siempre disponible) */}
                <Link
                    href={`/eventos/${id}/planilla`}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Descargar Planilla
                </Link>
            </div>

            {/* Formulario de Edición del Evento */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">Editar Evento</h3>
                <form action={editarEvento} className="flex flex-wrap items-end gap-4">
                    <input type="hidden" name="id" value={evento.id} />

                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <label htmlFor="nombre" className="text-xs font-medium text-zinc-400">Nombre del Evento</label>
                        <input
                            type="text" id="nombre" name="nombre"
                            defaultValue={evento.nombre}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="fecha" className="text-xs font-medium text-zinc-400">Fecha</label>
                        <input
                            type="date" id="fecha" name="fecha"
                            defaultValue={evento.fecha.toISOString().split('T')[0]}
                            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

                    <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors">
                        Guardar Cambios
                    </button>
                </form>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Lista de inscriptos */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {esExamen ? <CalendarDays className="h-5 w-5 text-blue-500" /> : <Trophy className="h-5 w-5 text-orange-500" />}
                        Inscriptos ({evento.inscripciones.length})
                    </h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur overflow-hidden">
                        <table className="w-full text-sm text-zinc-400">
                            <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-zinc-300">Alumno</th>
                                    <th className="px-4 py-3 text-left font-medium">Grad.</th>
                                    <th className="px-4 py-3 text-center font-medium">Edad</th>
                                    {/* Columnas de pago según tipo de evento */}
                                    {esExamen ? (
                                        <>
                                            <th className="px-4 py-3 text-center font-medium text-blue-400">Examen</th>
                                            <th className="px-4 py-3 text-center font-medium text-purple-400">Cinturón</th>
                                        </>
                                    ) : (
                                        <th className="px-4 py-3 text-center font-medium text-orange-400">Pago</th>
                                    )}
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {evento.inscripciones.map((inscripcion) => (
                                    <tr key={inscripcion.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-zinc-200">{inscripcion.alumno.nombre}</td>
                                        <td className="px-4 py-3 text-xs">{inscripcion.graduacion}</td>
                                        <td className="px-4 py-3 text-center">{inscripcion.edadActual}</td>

                                        {esExamen ? (
                                            <>
                                                {/* Toggle pago examen */}
                                                <td className="px-4 py-3 text-center">
                                                    <form action={togglePagoInscripcion.bind(null, inscripcion.id, evento.id, 'pagoExamen', inscripcion.pagoExamen)}>
                                                        <button type="submit" title={inscripcion.pagoExamen ? 'Anular pago examen' : 'Marcar pago examen'} className="mx-auto block p-1 rounded-full hover:bg-zinc-800 transition-colors">
                                                            {inscripcion.pagoExamen
                                                                ? <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                                                : <Circle className="h-5 w-5 text-zinc-600 hover:text-zinc-400" />}
                                                        </button>
                                                    </form>
                                                </td>
                                                {/* Toggle pago cinturón */}
                                                <td className="px-4 py-3 text-center">
                                                    <form action={togglePagoInscripcion.bind(null, inscripcion.id, evento.id, 'pagoCinturon', inscripcion.pagoCinturon)}>
                                                        <button type="submit" title={inscripcion.pagoCinturon ? 'Anular pago cinturón' : 'Marcar pago cinturón'} className="mx-auto block p-1 rounded-full hover:bg-zinc-800 transition-colors">
                                                            {inscripcion.pagoCinturon
                                                                ? <CheckCircle2 className="h-5 w-5 text-purple-500" />
                                                                : <Circle className="h-5 w-5 text-zinc-600 hover:text-zinc-400" />}
                                                        </button>
                                                    </form>
                                                </td>
                                            </>
                                        ) : (
                                            /* Toggle pago torneo */
                                            <td className="px-4 py-3 text-center">
                                                <form action={togglePagoInscripcion.bind(null, inscripcion.id, evento.id, 'pagoTorneo', inscripcion.pagoTorneo)}>
                                                    <button type="submit" title={inscripcion.pagoTorneo ? 'Anular pago torneo' : 'Marcar pago torneo'} className="mx-auto block p-1 rounded-full hover:bg-zinc-800 transition-colors">
                                                        {inscripcion.pagoTorneo
                                                            ? <CheckCircle2 className="h-5 w-5 text-orange-500" />
                                                            : <Circle className="h-5 w-5 text-zinc-600 hover:text-zinc-400" />}
                                                    </button>
                                                </form>
                                            </td>
                                        )}

                                        <td className="px-4 py-3 text-right">
                                            <form action={eliminarInscripcion.bind(null, inscripcion.id, evento.id)}>
                                                <button type="submit" className="text-zinc-600 hover:text-red-400 p-1">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {evento.inscripciones.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                                            Aún no hay alumnos inscriptos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Formulario de Inscripción */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                        Inscribir Alumno
                    </h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur">
                        {alumnosSinInscribir.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-4">Todos los alumnos ya están inscriptos.</p>
                        ) : (
                            <form action={inscribirAlumno} className="space-y-4">
                                <input type="hidden" name="eventoId" value={evento.id} />

                                <div className="space-y-2">
                                    <label htmlFor="alumnoId" className="text-sm font-medium text-zinc-300">Alumno</label>
                                    <select required id="alumnoId" name="alumnoId" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                                        <option value="">-- Seleccionar --</option>
                                        {alumnosSinInscribir.map((a) => (
                                            <option key={a.id} value={a.id}>{a.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="edadActual" className="text-sm font-medium text-zinc-300">Edad Actual</label>
                                        <input required type="number" id="edadActual" name="edadActual" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: 18" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="graduacion" className="text-sm font-medium text-zinc-300">Graduación</label>
                                        <select id="graduacion" name="graduacion" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                                            <option>Cinturón Blanco</option>
                                            <option>Cinturón Amarillo</option>
                                            <option>Cinturón Naranja</option>
                                            <option>Cinturón Verde</option>
                                            <option>Cinturón Azul</option>
                                            <option>Cinturón Rojo</option>
                                            <option>I Dan</option>
                                            <option>II Dan</option>
                                            <option>III Dan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="categoriaFormas" className="text-sm font-medium text-zinc-300">Cat. Poomsae</label>
                                        <select id="categoriaFormas" name="categoriaFormas" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                                            <option>Infantiles (8-13)</option>
                                            <option>Juveniles (14-17)</option>
                                            <option>Adultos (18-30)</option>
                                            <option>Mayores (31+)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="categoriaCombate" className="text-sm font-medium text-zinc-300">Cat. Kyorugi</label>
                                        <input required type="text" id="categoriaCombate" name="categoriaCombate" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: Hasta 80kg" />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm">
                                        Inscribir Alumno
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
