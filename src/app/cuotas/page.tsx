import { PrismaClient } from '@prisma/client'
import { CuotasTable } from '@/components/CuotasTable'

const prisma = new PrismaClient()

export default async function CuotasPage() {
    const anioActual = new Date().getFullYear();

    // Obtener alumnos con sus cuotas pagadas en el año actual
    const alumnos = await prisma.alumno.findMany({
        select: {
            id: true,
            nombre: true,
            montoCuota: true,
            cuotas: {
                where: { anio: anioActual },
                select: { mes: true, monto: true }
            }
        },
        orderBy: { nombre: 'asc' }
    });

    // Calcular recaudación por mes (suma de montos pagados ese mes)
    const recaudacionPorMes: Record<number, number> = {}
    for (let mes = 1; mes <= 12; mes++) {
        recaudacionPorMes[mes] = 0
    }
    for (const alumno of alumnos) {
        for (const cuota of alumno.cuotas) {
            recaudacionPorMes[cuota.mes] = (recaudacionPorMes[cuota.mes] || 0) + cuota.monto
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Control de Cuotas - {anioActual}</h2>
                    <p className="text-zinc-400">Marque los meses abonados por los alumnos haciendo clic en los círculos.</p>
                </div>
            </div>

            <CuotasTable alumnos={alumnos} anioActual={anioActual} recaudacionPorMes={recaudacionPorMes} />
        </div>
    )
}
