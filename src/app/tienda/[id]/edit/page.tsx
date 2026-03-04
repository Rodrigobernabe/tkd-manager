import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { editarProducto } from '../../../actions/tienda'

const prisma = new PrismaClient()

export default async function EditarProductoPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const producto = await prisma.producto.findUnique({ where: { id } })

    if (!producto) notFound()

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/tienda" className="rounded-full p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Editar Artículo</h2>
                    <p className="text-zinc-400">Modificá los precios o el link de proveedor.</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-sm backdrop-blur">
                <form action={editarProducto} className="space-y-6">
                    <input type="hidden" name="id" value={producto.id} />

                    <div className="space-y-3">
                        <label htmlFor="descripcion" className="text-sm font-medium text-zinc-300">Descripción / Nombre</label>
                        <input
                            required type="text" id="descripcion" name="descripcion"
                            defaultValue={producto.descripcion}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="precioCosto" className="text-sm font-medium text-zinc-300">Precio Costo ($)</label>
                            <input
                                required type="number" step="0.01" id="precioCosto" name="precioCosto"
                                defaultValue={producto.precioCosto} min="0"
                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="precioVenta" className="text-sm font-medium text-zinc-300">Precio Venta ($)</label>
                            <input
                                required type="number" step="0.01" id="precioVenta" name="precioVenta"
                                defaultValue={producto.precioVenta} min="0"
                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="linkProveedor" className="text-sm font-medium text-zinc-300">Link ML / Proveedor (Opcional)</label>
                        <input
                            type="url" id="linkProveedor" name="linkProveedor"
                            defaultValue={producto.linkProveedor || ''}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="https://www.mercadolibre.com.ar/..."
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-500 transition-colors shadow-sm">
                            <Save className="h-5 w-5" />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
