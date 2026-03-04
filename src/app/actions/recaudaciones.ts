"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function registrarRecaudacion(formData: FormData) {
    const colaborador = formData.get('colaborador') as string
    const actividad = formData.get('actividad') as string
    const aporte = parseFloat(formData.get('aporte') as string)
    const fecha = new Date(formData.get('fecha') as string)
    // alumnoId puede ser vacío ("") si el colaborador es "Sabon"
    const alumnoIdRaw = formData.get('alumnoId') as string
    const alumnoId = alumnoIdRaw && alumnoIdRaw !== '' ? alumnoIdRaw : null

    await prisma.recaudacionFondo.create({
        data: { colaborador, actividad, aporte, fecha, alumnoId }
    })

    revalidatePath('/recaudaciones')
}

export async function eliminarRecaudacion(id: string) {
    await prisma.recaudacionFondo.delete({ where: { id } })
    revalidatePath('/recaudaciones')
}
