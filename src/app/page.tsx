import { PrismaClient } from '@prisma/client'
import {
  Users,
  TrendingUp,
  ShoppingBag,
  DollarSign
} from 'lucide-react'
import { DashboardChart } from '@/components/DashboardChart'
import { DashboardPieChart } from '@/components/DashboardPieChart'

const prisma = new PrismaClient()

async function getDashboardData() {
  const anioActual = new Date().getFullYear();
  const mesActual = new Date().getMonth() + 1; // 1-12
  const alumnosTotales = await prisma.alumno.count({ where: { activo: true } });

  // Ingresos del mes actual
  const cuotasMes = await prisma.cuota.aggregate({
    _sum: {
      monto: true
    },
    where: {
      mes: mesActual,
      anio: anioActual
    }
  });

  // Total acumulado histórico en Recaudaciones
  const recaudaciones = await prisma.recaudacionFondo.aggregate({
    _sum: {
      aporte: true
    }
  });

  // Datos para el gráfico: Agrupamos las cuotas por mes
  const cuotasAnio = await prisma.cuota.groupBy({
    by: ['mes'],
    _sum: {
      monto: true
    },
    where: {
      anio: anioActual
    }
  });

  const chartData = Array.from({ length: 12 }).map((_, i) => {
    const mesIndex = i + 1;
    const ingresoMes = cuotasAnio.find(c => c.mes === mesIndex)?._sum.monto || 0;
    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return {
      nombre: mesesNombres[i],
      ingresos: ingresoMes
    }
  });

  // Distribución de graduaciones (porcentaje / contabilidad de academia)
  const alumnosActivos = await prisma.alumno.findMany({ where: { activo: true } });
  const countsByGrad: Record<string, number> = {};
  alumnosActivos.forEach(a => {
    countsByGrad[a.graduacion as string] = (countsByGrad[a.graduacion as string] || 0) + 1;
  });

  const pieData = Object.entries(countsByGrad).map(([name, value]) => ({
    name,
    value
  }));

  return {
    alumnosTotales,
    ingresosMes: cuotasMes._sum.monto || 0,
    fondoRecaudaciones: recaudaciones._sum.aporte || 0,
    chartData,
    pieData
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Panel de Control</h2>
        <p className="text-zinc-400">Resumen y métricas principales de la academia.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Alumnos */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-500/10 p-3">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Alumnos</p>
              <h3 className="text-2xl font-bold text-white">{data.alumnosTotales}</h3>
            </div>
          </div>
        </div>

        {/* Card Ingresos Mes */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <DollarSign className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Ingresos Cuotas (Mes Actual)</p>
              <h3 className="text-2xl font-bold text-white">
                ${data.ingresosMes.toLocaleString('es-AR')}
              </h3>
            </div>
          </div>
        </div>

        {/* Card Ganancia Inventario / Fondo Recaudaciones */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Fondo Total Histórico (Recaudaciones)</p>
              <h3 className="text-2xl font-bold text-white">
                ${data.fondoRecaudaciones.toLocaleString('es-AR')}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico Cuotas */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Flujo de Ingresos (Cuotas)</h3>
              <p className="text-sm text-zinc-400">Evolución mensual durante el año actual.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="h-[350px] w-full mt-auto">
            <DashboardChart data={data.chartData} />
          </div>
        </div>

        {/* Gráfico Graduaciones */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Distribución de Graduaciones</h3>
              <p className="text-sm text-zinc-400">Porcentaje de cinturones en los alumnos listados como activos.</p>
            </div>
            <Users className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="h-[350px] w-full mt-auto">
            <DashboardPieChart data={data.pieData} />
          </div>
        </div>
      </div>
    </div>
  )
}
