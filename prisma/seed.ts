import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando carga de datos semilla (Mock Data)...')

  // Limpiar base de datos
  await prisma.alumno.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.evento.deleteMany()
  await prisma.recaudacionFondo.deleteMany()

  // 1. Alumnos
  const alumnosData = [
    { nombre: 'Juan Pérez', dni: '35123456', fechaNacimiento: new Date('1990-05-15'), direccion: 'Calle Falsa 123', estadoSeguro: true, fichaMedica: 'Completa', sede: 'Sede Principal', montoCuota: 18000 },
    { nombre: 'María González', dni: '40987654', fechaNacimiento: new Date('2000-11-20'), direccion: 'Av. Libertador 456', estadoSeguro: false, fichaMedica: 'Pendiente', sede: 'Palacio de los Deportes', montoCuota: 15000 },
    { nombre: 'Lucas Torres', dni: '45345678', fechaNacimiento: new Date('2010-02-10'), direccion: 'San Martín 789', estadoSeguro: true, fichaMedica: 'Completa', sede: 'Sede Principal', montoCuota: 12000 },
    { nombre: 'Ana Ramírez', dni: '38765432', fechaNacimiento: new Date('1995-08-05'), direccion: 'Belgrano 101', estadoSeguro: true, fichaMedica: 'Pendiente', notas: 'Cinturón Verde', sede: 'Palacio de los Deportes', montoCuota: 15000 },
    { nombre: 'Pedro Gómez', dni: '42111222', fechaNacimiento: new Date('2005-04-22'), direccion: 'Sarmiento 202', estadoSeguro: false, fichaMedica: 'Incompleta', sede: 'Sede Principal', montoCuota: 15000 }
  ]

  const alumnos = []
  for (const a of alumnosData) {
    const alumno = await prisma.alumno.create({ data: a })
    alumnos.push(alumno)
    console.log(`Alumno creado: ${alumno.nombre}`)
  }

  // 2. Cuotas (Datos para el año actual)
  const currentYear = new Date().getFullYear();

  for (const alumno of alumnos) {
    // Algunos alumnos pagan todo el año, otros menos meses
    const mesesPagados = Math.floor(Math.random() * 12) + 1;

    for (let mes = 1; mes <= mesesPagados; mes++) {
      // Modificamos un poco la fecha de pago para dar realismo (ej: pagó el mes 2 en feb)
      const fechaPago = new Date(currentYear, mes - 1, Math.floor(Math.random() * 10) + 1);

      await prisma.cuota.create({
        data: {
          alumnoId: alumno.id,
          mes: mes,
          anio: currentYear,
          monto: alumno.montoCuota,
          fechaPago: fechaPago
        }
      });
    }
    console.log(`Cuotas creadas para: ${alumno.nombre} (${mesesPagados} meses)`)
  }

  // 3. Tienda / Indumentaria
  const productosData = [
    { descripcion: 'Dobok Granmarc', cantidad: 10, precioCosto: 35000, precioVenta: 55000, linkProveedor: 'https://granmarc.com' },
    { descripcion: 'Protector Cabezal', cantidad: 5, precioCosto: 15000, precioVenta: 25000 },
    { descripcion: 'Zapatos de Sparring', cantidad: 8, precioCosto: 22000, precioVenta: 35000 },
    { descripcion: 'Cinturón Blanco', cantidad: 20, precioCosto: 2000, precioVenta: 5000 }
  ]

  for (const prod of productosData) {
    await prisma.producto.create({ data: prod })
  }
  console.log('Productos de tienda creados.')

  // 4. Torneos y Exámenes
  const evento1 = await prisma.evento.create({
    data: { nombre: 'Torneo Nacional 2026', fecha: new Date('2026-06-15'), tipo: 'Torneo' }
  })
  const evento2 = await prisma.evento.create({
    data: { nombre: 'Examen de Gups', fecha: new Date('2026-04-10'), tipo: 'Examen' }
  })

  // Inscribir 2 alumnos al torneo
  await prisma.inscripcionEvento.create({
    data: { eventoId: evento1.id, alumnoId: alumnos[0].id, edadActual: 36, graduacion: 'I Dan', categoriaFormas: 'Adultos', categoriaCombate: 'Hasta 80kg' }
  })
  await prisma.inscripcionEvento.create({
    data: { eventoId: evento1.id, alumnoId: alumnos[2].id, edadActual: 16, graduacion: 'Cinturón Rojo', categoriaFormas: 'Juveniles', categoriaCombate: 'Hasta 65kg' }
  })
  console.log('Eventos e inscripciones creados.')

  // 5. Recaudaciones
  await prisma.recaudacionFondo.create({
    data: { colaborador: 'Familia González', actividad: 'Venta de Empanadas', aporte: 25000, fecha: new Date('2026-02-15') }
  })
  await prisma.recaudacionFondo.create({
    data: { colaborador: 'Pérez Hermanos', actividad: 'Bingo Familiar', aporte: 50000, fecha: new Date('2026-03-01') }
  })
  await prisma.recaudacionFondo.create({
    data: { colaborador: 'Anonimo', actividad: 'Venta de Locro', aporte: 15000, fecha: new Date('2026-05-01') }
  })
  console.log('Recaudaciones de fondos creadas.')

  console.log('Semilla completada con éxito!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
