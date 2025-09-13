"use client"

import { Button } from "@/app/_components/ui/button"
import { 
  CalendarIcon, 
  HomeIcon, 
  LogOutIcon,
  Users,
  UserCog,
  Package,
  Store,
  DollarSign,
  BarChart3,
  Settings
} from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/app/_components/ui/sheet"
import Link from "next/link"
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar"
import { signOut } from "next-auth/react"

interface AdminSidebarSheetProps {
  user: {
    name: string | null
    email: string
    image: string | null
    role: string | null
  }
}

const AdminSidebarSheet = ({ user }: AdminSidebarSheetProps) => {
  const handleLogoutClick = () => signOut({ callbackUrl: "/auth/admin" })

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu Admin</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image ?? ""} />
          </Avatar>

          <div>
            <p className="font-bold">{user.name || "Admin"}</p>
            <p className="text-xs">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              {user.role === "OWNER" ? "Proprietário" : "Gerente"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin">
              <HomeIcon size={18} />
              Dashboard
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/customers">
              <Users size={18} />
              Clientes
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/barbers">
              <UserCog size={18} />
              Barbeiros
            </Link>
          </Button>
        </SheetClose>
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/services">
              <Package size={18} />
              Serviços
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/barbershops">
              <Store size={18} />
              Barbearias
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/finance">
              <DollarSign size={18} />
              Financeiro
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/reports">
              <BarChart3 size={18} />
              Relatórios
            </Link>
          </Button>
        </SheetClose>
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin/settings">
              <Settings size={18} />
              Configurações
            </Link>
          </Button>
        </SheetClose>
      </div>

      <div className="flex flex-col gap-2 py-5">
        <Button
          variant="ghost"
          className="justify-start gap-2"
          onClick={handleLogoutClick}
        >
          <LogOutIcon size={18} />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  )
}

export default AdminSidebarSheet