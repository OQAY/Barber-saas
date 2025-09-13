"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/_lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Scissors,
  Store,
  DollarSign,
  Settings,
  BarChart3,
  UserCog,
  Package
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Agendamentos",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Clientes",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Barbeiros",
    href: "/admin/barbers",
    icon: UserCog,
  },
  {
    title: "Serviços",
    href: "/admin/services",
    icon: Package,
  },
  {
    title: "Barbearias",
    href: "/admin/barbershops",
    icon: Store,
  },
  {
    title: "Financeiro",
    href: "/admin/finance",
    icon: DollarSign,
  },
  {
    title: "Relatórios",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
                          (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}