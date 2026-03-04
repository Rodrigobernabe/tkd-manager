import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const prisma = new PrismaClient()

// Ruta GET: genera y descarga una planilla CSV con los productos del inventario
export async function GET(
    _request: NextRequest
) {
    const productos = await prisma.producto.findMany({
        orderBy: { descripcion: 'asc' }
    })

    const fechaActual = format(new Date(), "dd-MM-yyyy", { locale: es })
    const nombreArchivo = `lista_precios_${fechaActual}.csv`

    const filasCabecera = ['Nro', 'Articulo', 'Precio Costo', 'Precio Venta', 'Ganancia Unitaria', 'Link Proveedor']

    // Filas de datos de productos
    const filas = productos.map((prod, index) => {
        const ganancia = prod.precioVenta - prod.precioCosto

        return [
            index + 1,
            prod.descripcion,
            `$${prod.precioCosto}`,
            `$${prod.precioVenta}`,
            `$${ganancia}`,
            prod.linkProveedor || 'N/A'
        ]
    })

    // Construir contenido CSV
    const contenidoCSV = [
        [`Lista de Precios del Inventario`],
        [`Fecha de Emision: ${fechaActual}`],
        [`Total de Articulos: ${productos.length}`],
        [],    // Línea en blanco
        filasCabecera,
        ...filas
    ]
        .map(fila => fila.join(';'))
        .join('\r\n')

    // Devolver el CSV como descarga
    return new NextResponse(contenidoCSV, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
        }
    })
}
