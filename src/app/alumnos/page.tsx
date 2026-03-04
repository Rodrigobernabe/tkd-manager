import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, UserCheck, UserX } from 'lucide-react'
import { eliminarAlumno, toggleEstadoAlumno } from '../actions/alumnos'
import { BuscadorAlumnos } from '../../components/BuscadorAlumnos'

const prisma = new PrismaClient()

export default async function AlumnosPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; estado?: string }>
}) {
    const { q, estado } = await searchParams

    const where: any = {}

    if (q) {
        where.OR = [
            { nombre: { contains: q } },
            { dni: { contains: q } }
        ]
    }

    if (estado === 'activos') {
        where.activo = true
    } else if (estado === 'inactivos') {
        where.activo = false
    }

    const alumnos = await prisma.alumno.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Gestión de Alumnos</h2>
                    <p className="text-zinc-400">Administra los practicantes, sus datos médicos y estados.</p>
                </div>
                <Link
                    href="/alumnos/nuevo"
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Alumno
                </Link>
            </div>

            <BuscadorAlumnos />

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-sm backdrop-blur overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-medium text-zinc-300">Nombre Completo</th>
                                <th className="px-6 py-4 font-medium">DNI</th>
                                <th className="px-6 py-4 font-medium">Sede</th>
                                <th className="px-6 py-4 font-medium">Seguro</th>
                                <th className="px-6 py-4 font-medium">Ficha Médica</th>
                                <th className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {alumnos.map((alumno) => (
                                <tr key={alumno.id} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-200">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${alumno.activo ? 'bg-emerald-500' : 'bg-red-500'}`} title={alumno.activo ? 'Activo' : 'Inactivo'} />
                                            <span className={!alumno.activo ? 'line-through text-zinc-500' : ''}>
                                                {alumno.nombre}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{alumno.dni}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300 ring-1 ring-inset ring-zinc-700">
                                            {alumno.sede}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {alumno.estadoSeguro ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                                                Al Día
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">
                                                Vencido
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{alumno.fichaMedica}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <form action={toggleEstadoAlumno.bind(null, alumno.id, alumno.activo)}>
                                                <button className={`p-1 transition-colors ${alumno.activo ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-500 hover:text-emerald-400'}`} title={alumno.activo ? 'Marcar Inactivo' : 'Marcar Activo'}>
                                                    {alumno.activo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                </button>
                                            </form>
                                            <Link href={`/alumnos/${alumno.id}/edit`} className="text-zinc-500 hover:text-blue-400 p-1">
                                                <Edit2 className="h-4 w-4" />
                                            </Link>
                                            <form action={eliminarAlumno.bind(null, alumno.id)}>
                                                <button className="text-zinc-500 hover:text-red-400 p-1" title="Eliminar">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {alumnos.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        No hay alumnos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
