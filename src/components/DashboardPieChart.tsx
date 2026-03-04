"use client"

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts"

interface PieData {
    name: string
    value: number
}

interface DashboardPieChartProps {
    data: PieData[]
}

const COLORS = [
    '#ffffff', // Blanco
    '#fef08a', // Punta Amarilla
    '#eab308', // Amarillo
    '#a3e635', // Punta Verde
    '#22c55e', // Verde
    '#60a5fa', // Punta Azul
    '#3b82f6', // Azul
    '#fca5a5', // Punta Roja
    '#ef4444', // Rojo
    '#737373', // Punta Negra
    '#171717'  // Negro
]

const GRADUACIONES_ORDENADAS = [
    "Cinturón Blanco",
    "Cinturón Punta Amarilla",
    "Cinturón Amarillo",
    "Cinturón Punta Verde",
    "Cinturón Verde",
    "Cinturón Punta Azul",
    "Cinturón Azul",
    "Cinturón Punta Roja",
    "Cinturón Rojo",
    "Cinturón Punta Negra",
    "Cinturón Negro"
]

export function DashboardPieChart({ data }: DashboardPieChartProps) {
    // Asignar colores según el nombre del cinturón en el orden
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#27272a"
                    strokeWidth={2}
                >
                    {data.map((entry, index) => {
                        const colorIndex = GRADUACIONES_ORDENADAS.indexOf(entry.name)
                        return (
                            <Cell key={`cell-${index}`} fill={colorIndex !== -1 ? COLORS[colorIndex] : '#f97316'} />
                        )
                    })}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f4f4f5', borderRadius: '8px' }}
                    itemStyle={{ color: '#f4f4f5' }}
                    formatter={(value: any) => [`${value} alumnos`, 'Cantidad']}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value, entry: any) => <span className="text-zinc-400 text-xs">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
