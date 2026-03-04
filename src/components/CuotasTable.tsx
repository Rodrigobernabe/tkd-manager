"use client"

import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { registrarPago, anularPago } from "@/app/actions/cuotas"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type AlumnoConCuotas = {
    id: string
    nombre: string
    montoCuota: number
    cuotas: { mes: number; monto: number }[]
}

export function CuotasTable({
    alumnos,
    anioActual,
    recaudacionPorMes,
}: {
    alumnos: AlumnoConCuotas[]
    anioActual: number
    recaudacionPorMes: Record<number, number>
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    const handleToggle = (alumno: AlumnoConCuotas, mesIndex: number, isPagado: boolean) => {
        startTransition(async () => {
            if (isPagado) {
                await anularPago(alumno.id, mesIndex, anioActual)
            } else {
                await registrarPago(alumno.id, mesIndex, anioActual, alumno.montoCuota)
            }
            router.refresh()
        })
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-sm backdrop-blur overflow-hidden relative">
            {isPending && (
                <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                        <tr>
                            <th className="px-4 py-4 font-medium text-zinc-300 min-w-[200px] sticky left-0 bg-zinc-900 z-20">Alumno</th>
                            {meses.map((m) => (
                                <th key={m} className="px-2 py-4 font-medium text-center">{m}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {alumnos.map((a) => (
                            <tr key={a.id} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-zinc-200 sticky left-0 bg-zinc-950/50 group-hover:bg-zinc-900/50 z-10">
                                    {a.nombre}
                                </td>
                                {meses.map((_, i) => {
                                    const mesNumero = i + 1;
                                    const pago = a.cuotas.find(c => c.mes === mesNumero)
                                    const isPagado = !!pago;

                                    return (
                                        <td key={i} className="px-2 py-3 text-center">
                                            <button
                                                onClick={() => handleToggle(a, mesNumero, isPagado)}
                                                disabled={isPending}
                                                title={isPagado ? `Anular Pago ($${a.montoCuota.toLocaleString('es-AR')})` : `Registrar Pago ($${a.montoCuota.toLocaleString('es-AR')})`}
                                                className="p-1 rounded-full hover:bg-zinc-800 transition-colors mx-auto block"
                                            >
                                                {isPagado ? (
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-zinc-600 hover:text-zinc-400" />
                                                )}
                                            </button>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                    {/* Fila de Recaudación Mensual */}
                    <tfoot>
                        <tr className="border-t-2 border-zinc-700 bg-zinc-900/80">
                            <td className="px-4 py-3 text-xs font-semibold text-orange-400 sticky left-0 bg-zinc-900 z-10 uppercase tracking-wider">
                                Recaudado
                            </td>
                            {meses.map((_, i) => {
                                const mes = i + 1;
                                const total = recaudacionPorMes[mes] || 0;
                                return (
                                    <td key={i} className="px-2 py-3 text-center">
                                        {total > 0 ? (
                                            <span className="text-xs font-semibold text-emerald-400">
                                                ${total.toLocaleString('es-AR')}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-zinc-600">-</span>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
