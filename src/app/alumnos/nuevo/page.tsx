import { crearAlumno } from '../../actions/alumnos'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NuevoAlumnoPage() {
    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/alumnos" className="rounded-full p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white">Nuevo Alumno</h2>
                    <p className="text-sm text-zinc-400">Agrega un nuevo practicante al sistema.</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
                <form action={crearAlumno} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                        <label htmlFor="nombre" className="text-sm font-medium text-zinc-300">Nombre Completo</label>
                        <input required type="text" id="nombre" name="nombre" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: Juan Pérez" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="dni" className="text-sm font-medium text-zinc-300">DNI</label>
                        <input required type="number" id="dni" name="dni" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: 35123456" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="fechaNacimiento" className="text-sm font-medium text-zinc-300">Fecha de Nacimiento</label>
                        <input required type="date" id="fechaNacimiento" name="fechaNacimiento" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="direccion" className="text-sm font-medium text-zinc-300">Dirección</label>
                        <input required type="text" id="direccion" name="direccion" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Calle Falsa 123" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="sede" className="text-sm font-medium text-zinc-300">Sede de Entrenamiento</label>
                        <select id="sede" name="sede" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                            <option value="Palacio de los Deportes">Palacio de los Deportes</option>
                            <option value="Sede Principal">Sede Principal</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="fichaMedica" className="text-sm font-medium text-zinc-300">Estado Ficha Médica</label>
                        <select id="fichaMedica" name="fichaMedica" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                            <option value="Pendiente">Pendiente</option>
                            <option value="Completa">Completa</option>
                            <option value="Incompleta">Incompleta</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="montoCuota" className="text-sm font-medium text-zinc-300">Monto de Cuota Mensual ($)</label>
                        <input required type="number" id="montoCuota" name="montoCuota" defaultValue="15000" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: 15000" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="graduacion" className="text-sm font-medium text-zinc-300">Graduación (Cinturón)</label>
                        <select id="graduacion" name="graduacion" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                            <option value="Cinturón Blanco">Cinturón Blanco</option>
                            <option value="Cinturón Punta Amarilla">Cinturón Punta Amarilla</option>
                            <option value="Cinturón Amarillo">Cinturón Amarillo</option>
                            <option value="Cinturón Punta Verde">Cinturón Punta Verde</option>
                            <option value="Cinturón Verde">Cinturón Verde</option>
                            <option value="Cinturón Punta Azul">Cinturón Punta Azul</option>
                            <option value="Cinturón Azul">Cinturón Azul</option>
                            <option value="Cinturón Punta Roja">Cinturón Punta Roja</option>
                            <option value="Cinturón Rojo">Cinturón Rojo</option>
                            <option value="Cinturón Punta Negra">Cinturón Punta Negra</option>
                            <option value="Cinturón Negro">Cinturón Negro (Dan)</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 space-y-2 flex items-center gap-3">
                        <input type="checkbox" id="estadoSeguro" name="estadoSeguro" className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900" />
                        <label htmlFor="estadoSeguro" className="text-sm font-medium text-zinc-300 pb-1">Seguro Deportivo Activo (Pagado)</label>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label htmlFor="notas" className="text-sm font-medium text-zinc-300">Notas Adicionales</label>
                        <textarea id="notas" name="notas" rows={3} className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: Cinturón Rojo, alergia al polvo..."></textarea>
                    </div>

                    <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                        <Link href="/alumnos" className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                            Cancelar
                        </Link>
                        <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm">
                            Guardar Alumno
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
