"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function inscribirAlumno(formData: FormData) {
    const eventoId = formData.get('eventoId') as string
    const alumnoId = formData.get('alumnoId') as string
    const edadActual = parseInt(formData.get('edadActual') as string)
    const graduacion = formData.get('graduacion') as string
    const categoriaFormas = formData.get('categoriaFormas') as string
    const categoriaCombate = formData.get('categoriaCombate') as string

    try {
        await prisma.inscripcionEvento.create({
            data: {
                eventoId,
                alumnoId,
                edadActual,
                graduacion,
                categoriaFormas,
                categoriaCombate
            }
        })
    } catch (error) {
        // maneja error
    }
    revalidatePath(`/eventos/${eventoId}`)
}

export async function eliminarInscripcion(id: string, eventoId: string) {
    await prisma.inscripcionEvento.delete({ where: { id } })
    revalidatePath(`/eventos/${eventoId}`)
}

// Crea un nuevo evento (Torneo o Examen)
export async function crearEvento(formData: FormData) {
    const nombre = formData.get('nombre') as string
    const fecha = new Date(formData.get('fecha') as string)
    const tipo = formData.get('tipo') as string

    await prisma.evento.create({
        data: { nombre, fecha, tipo }
    })

    revalidatePath('/eventos')
}

// Edita el nombre y/o la fecha de un evento
export async function editarEvento(formData: FormData) {
    const id = formData.get('id') as string
    const nombre = formData.get('nombre') as string
    const fecha = new Date(formData.get('fecha') as string)

    await prisma.evento.update({
        where: { id },
        data: { nombre, fecha }
    })

    revalidatePath(`/eventos/${id}`)
    revalidatePath('/eventos')
}

// Alterna el estado de pago de una inscripción (pagoExamen, pagoCinturon o pagoTorneo)
export async function togglePagoInscripcion(
    inscripcionId: string,
    eventoId: string,
    campo: 'pagoExamen' | 'pagoCinturon' | 'pagoTorneo',
    valorActual: boolean
) {
    await prisma.inscripcionEvento.update({
        where: { id: inscripcionId },
        data: { [campo]: !valorActual }
    })

    revalidatePath(`/eventos/${eventoId}`)
}
