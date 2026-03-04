"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function crearAlumno(formData: FormData) {
    const nombre = formData.get('nombre') as string
    const dni = formData.get('dni') as string
    const fechaNacimiento = new Date(formData.get('fechaNacimiento') as string)
    const direccion = formData.get('direccion') as string
    const sede = formData.get('sede') as string
    const estadoSeguro = formData.get('estadoSeguro') === 'on'
    const fichaMedica = formData.get('fichaMedica') as string
    const notas = formData.get('notas') as string
    const montoCuota = Number(formData.get('montoCuota')) || 0
    const graduacion = formData.get('graduacion') as string || "Cinturón Blanco"

    await prisma.alumno.create({
        data: {
            nombre,
            dni,
            fechaNacimiento,
            direccion,
            sede,
            estadoSeguro,
            fichaMedica,
            notas: notas || null,
            montoCuota,
            graduacion
        }
    })

    revalidatePath('/alumnos')
    redirect('/alumnos')
}

export async function editarAlumno(id: string, formData: FormData) {
    const nombre = formData.get('nombre') as string
    const dni = formData.get('dni') as string
    const fechaNacimiento = new Date(formData.get('fechaNacimiento') as string)
    const direccion = formData.get('direccion') as string
    const sede = formData.get('sede') as string
    const estadoSeguro = formData.get('estadoSeguro') === 'on'
    const fichaMedica = formData.get('fichaMedica') as string
    const notas = formData.get('notas') as string
    const montoCuota = Number(formData.get('montoCuota')) || 0
    const graduacion = formData.get('graduacion') as string || "Cinturón Blanco"

    await prisma.alumno.update({
        where: { id },
        data: {
            nombre,
            dni,
            fechaNacimiento,
            direccion,
            sede,
            estadoSeguro,
            fichaMedica,
            notas: notas || null,
            montoCuota,
            graduacion
        }
    })

    revalidatePath('/alumnos')
    redirect('/alumnos')
}

export async function toggleEstadoAlumno(id: string, activo: boolean) {
    await prisma.alumno.update({
        where: { id },
        data: { activo: !activo }
    })
    revalidatePath('/alumnos')
}

export async function eliminarAlumno(id: string) {
    await prisma.alumno.delete({ where: { id } })
    revalidatePath('/alumnos')
}
