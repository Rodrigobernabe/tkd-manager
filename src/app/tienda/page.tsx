import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { ExternalLink, ShoppingBag, Plus, Trash2, Edit2, Download } from 'lucide-react'
import { agregarProducto, eliminarProducto } from '../actions/tienda'

const prisma = new PrismaClient()

export default async function TiendaPage() {
    const productos = await prisma.producto.findMany({
        orderBy: { descripcion: 'asc' }
    })

    const capitalInvertido = productos.reduce((acc, p) => acc + p.precioCosto, 0)
    const gananciaEsperada = productos.reduce((acc, p) => acc + (p.precioVenta - p.precioCosto), 0)

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Tienda e Indumentaria</h2>
                    <p className="text-zinc-400">Control de stock de doboks, protecciones y equipamiento.</p>
                </div>
                {/* Botón de descarga de planilla CSV */}
                <Link
                    href={`/tienda/planilla`}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors shrink-0"
                >
                    <Download className="h-4 w-4" />
                    Descargar Precios
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-medium text-zinc-400">Capital Base (Costos Unitarios)</p>
                    <h3 className="text-2xl font-bold text-white mt-1">${capitalInvertido.toLocaleString('es-AR')}</h3>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-medium text-emerald-500">Ganancia Base Esperada</p>
                    <h3 className="text-2xl font-bold text-white mt-1">${gananciaEsperada.toLocaleString('es-AR')}</h3>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Tabla de Productos */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Inventario Actual</h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-sm backdrop-blur overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-5 py-4 font-medium text-zinc-300">Artículo</th>
                                        <th className="px-5 py-4 font-medium text-right">Costo</th>
                                        <th className="px-5 py-4 font-medium text-right">Venta</th>
                                        <th className="px-5 py-4 font-medium text-center">ML</th>
                                        <th className="px-5 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {productos.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-5 py-4 font-medium text-zinc-200">{prod.descripcion}</td>
                                            <td className="px-5 py-4 text-right text-zinc-400">
                                                ${prod.precioCosto.toLocaleString('es-AR')}
                                            </td>
                                            <td className="px-5 py-4 text-right font-semibold text-emerald-400">
                                                ${prod.precioVenta.toLocaleString('es-AR')}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {prod.linkProveedor ? (
                                                    <Link
                                                        href={prod.linkProveedor}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Ver en MercadoLibre / Proveedor"
                                                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 border border-orange-500/30 bg-orange-500/10 rounded-md px-2 py-1 hover:bg-orange-500/20 transition-colors"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        ML
                                                    </Link>
                                                ) : (
                                                    <span className="text-zinc-600 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/tienda/${prod.id}/edit`} className="text-zinc-600 hover:text-blue-400 p-1 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <form action={eliminarProducto}>
                                                        <input type="hidden" name="id" value={prod.id} />
                                                        <button type="submit" className="text-zinc-600 hover:text-red-400 p-1 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {productos.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">
                                                No hay productos en el inventario.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Formulario de nuevo artículo */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Nuevo Artículo</h3>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 backdrop-blur">
                        <form action={agregarProducto} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="descripcion" className="text-sm font-medium text-zinc-300">Descripción / Nombre</label>
                                <input required type="text" id="descripcion" name="descripcion" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ej: Protector Bucal" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="precioCosto" className="text-sm font-medium text-zinc-300">Precio Costo ($)</label>
                                    <input required type="number" step="0.01" id="precioCosto" name="precioCosto" defaultValue="0" min="0" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="precioVenta" className="text-sm font-medium text-zinc-300">Precio Venta ($)</label>
                                    <input required type="number" step="0.01" id="precioVenta" name="precioVenta" defaultValue="0" min="0" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="linkProveedor" className="text-sm font-medium text-zinc-300">Link ML / Proveedor (Opcional)</label>
                                <input type="url" id="linkProveedor" name="linkProveedor" className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="https://www.mercadolibre.com.ar/..." />
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm">
                                <Plus className="h-4 w-4" />
                                Agregar Artículo
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
