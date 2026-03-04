"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function registrarPago(alumnoId: string, mes: number, anio: number, monto: number) {
    try {
        await prisma.cuota.create({
            data: {
                alumnoId,
                mes,
                anio,
                monto,
            }
        })
        revalidatePath('/cuotas')
        revalidatePath('/') // Para actualizar el Dashboard
        return { success: true }
    } catch (error) {
        return { success: false, error: 'La cuota ya fue registrada o hubo un error.' }
    }
}

export async function anularPago(alumnoId: string, mes: number, anio: number) {
    try {
        const cuota = await prisma.cuota.findUnique({
            where: {
                alumnoId_mes_anio: {
                    alumnoId,
                    mes,
                    anio
                }
            }
        })
        if (cuota) {
            await prisma.cuota.delete({
                where: { id: cuota.id }
            })
            revalidatePath('/cuotas')
            revalidatePath('/')
        }
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Hubo un error al anular el pago.' }
    }
}
