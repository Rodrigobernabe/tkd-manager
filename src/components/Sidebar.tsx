"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Wallet,
    ShoppingBag,
    Trophy,
    HeartHandshake
} from "lucide-react"
import clsx from "clsx"

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Alumnos", href: "/alumnos", icon: Users },
    { name: "Cuotas", href: "/cuotas", icon: Wallet },
    { name: "Tienda", href: "/tienda", icon: ShoppingBag },
    { name: "Eventos", href: "/eventos", icon: Trophy },
    { name: "Recaudaciones", href: "/recaudaciones", icon: HeartHandshake },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-8 text-zinc-100">
            <div className="mb-10 flex w-full items-center justify-center">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="text-orange-500">TKD</span> Manager
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                    isActive ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"
                                )}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto rounded-lg bg-zinc-900 p-4 ring-1 ring-zinc-800">
                <p className="text-xs font-semibold text-zinc-400">Estado de Sistema</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-500">DB Sincronizada</span>
                </div>
            </div>
        </div>
    )
}
