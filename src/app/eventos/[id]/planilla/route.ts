import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const prisma = new PrismaClient()

// Ruta GET: genera y descarga una planilla CSV con los inscriptos del evento
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
            inscripciones: {
                include: { alumno: { select: { nombre: true, dni: true } } },
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!evento) {
        return new NextResponse('Evento no encontrado', { status: 404 })
    }

    const fechaEvento = format(evento.fecha, "dd-MM-yyyy", { locale: es })
    const nombreArchivo = `planilla_${evento.tipo.toLowerCase()}_${evento.nombre.replace(/\s+/g, '_')}_${fechaEvento}.csv`

    // Cabeceras del CSV según tipo de evento
    const esExamen = evento.tipo === 'Examen'
    const filasCabecera = esExamen
        ? ['Nro', 'Nombre', 'DNI', 'Edad', 'Graduacion', 'Cat. Poomsae', 'Cat. Kyorugi', 'Pago Examen', 'Pago Cinturon']
        : ['Nro', 'Nombre', 'DNI', 'Edad', 'Graduacion', 'Cat. Poomsae', 'Cat. Kyorugi', 'Pago Torneo']

    // Filas de datos de inscriptos
    const filas = evento.inscripciones.map((insc, index) => {
        const base = [
            index + 1,
            insc.alumno.nombre,
            insc.alumno.dni,
            insc.edadActual,
            insc.graduacion,
            insc.categoriaFormas,
            insc.categoriaCombate,
        ]
        if (esExamen) {
            return [...base, insc.pagoExamen ? 'SI' : 'NO', insc.pagoCinturon ? 'SI' : 'NO']
        } else {
            return [...base, insc.pagoTorneo ? 'SI' : 'NO']
        }
    })

    // Construir contenido CSV
    const contenidoCSV = [
        // Fila de información del evento
        [`Evento: ${evento.nombre}`],
        [`Fecha: ${fechaEvento}`],
        [`Tipo: ${evento.tipo}`],
        [`Total inscriptos: ${evento.inscripciones.length}`],
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
