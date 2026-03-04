'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function agregarProducto(formData: FormData) {
    const descripcion = formData.get('descripcion') as string
    const precioCosto = Number(formData.get('precioCosto'))
    const precioVenta = Number(formData.get('precioVenta'))
    const linkProveedor = formData.get('linkProveedor') as string || null

    if (!descripcion) return

    await prisma.producto.create({
        data: {
            descripcion,
            precioCosto,
            precioVenta,
            linkProveedor
        }
    })

    revalidatePath('/tienda')
}

export async function editarProducto(formData: FormData) {
    const id = formData.get('id') as string
    const descripcion = formData.get('descripcion') as string
    const precioCosto = Number(formData.get('precioCosto'))
    const precioVenta = Number(formData.get('precioVenta'))
    const linkProveedor = formData.get('linkProveedor') as string || null

    if (!id || !descripcion) return

    await prisma.producto.update({
        where: { id },
        data: {
            descripcion,
            precioCosto,
            precioVenta,
            linkProveedor
        }
    })

    revalidatePath('/tienda')
    redirect('/tienda')
}

export async function actualizarStock(id: string, nuevaCantidad: number) {
    if (nuevaCantidad < 0) return

    await prisma.producto.update({
        where: { id },
        data: { cantidad: nuevaCantidad }
    })

    revalidatePath('/tienda')
}

export async function eliminarProducto(formData: FormData) {
    const id = formData.get('id') as string

    if (!id) return

    await prisma.producto.delete({
        where: { id }
    })

    revalidatePath('/tienda')
}
