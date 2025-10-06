"use client"

import { Button } from "../ui/button"
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, LayoutDashboard } from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { quickSearchOptions } from "../../_constants/search"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarImage } from "../ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import TestBookingsDialog from "../dashboard/test-bookings-dialog"

const SidebarSheet = () => {
  const { data } = useSession()
  const handleLogoutClick = () => signOut()
  const [barbers, setBarbers] = useState<Array<{ id: string; name: string }>>([])
  const [isAdmin, setIsAdmin] = useState(false)

  // Verificar se é admin e buscar barbeiros
  useEffect(() => {
    const checkAdminAndFetchBarbers = async () => {
      if (data?.user) {
        // Verificar role do usuário
        const response = await fetch('/api/user/role')
        if (response.ok) {
          const { role } = await response.json()
          const isAdminRole = role === 'BARBER' || role === 'MANAGER' || role === 'OWNER'
          setIsAdmin(isAdminRole)

          if (isAdminRole) {
            // Buscar barbeiros para o teste
            const barbersResponse = await fetch('/api/barbers')
            if (barbersResponse.ok) {
              const barbersData = await barbersResponse.json()
              setBarbers(barbersData)
            }
          }
        }
      }
    }

    checkAdminAndFetchBarbers()
  }, [data?.user])

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data.user?.image ?? ""} />
            </Avatar>

            <div>
              <p className="font-bold">{data.user.name}</p>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bold">Olá, faça seu login!</h2>
            <SheetClose asChild>
              <Button size="icon" asChild>
                <Link href="/login">
                  <LogInIcon />
                </Link>
              </Button>
            </SheetClose>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          </Button>
        </SheetClose>
        {isAdmin && (
          <SheetClose asChild>
            <Button className="justify-start gap-2" variant="ghost" asChild>
              <Link href="/dashboard">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </Button>
          </SheetClose>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose key={option.title} asChild>
            <Button className="justify-start gap-2" variant="ghost" asChild>
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  alt={option.title}
                  src={option.imageUrl}
                  height={18}
                  width={18}
                />
                {option.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>

      {/* Seção Admin - Ferramentas de Teste */}
      {isAdmin && barbers.length > 0 && (
        <div className="flex flex-col gap-2 border-b border-solid py-5">
          <p className="text-xs text-muted-foreground px-3 pb-2">Ferramentas Admin</p>
          <TestBookingsDialog barbers={barbers} />
        </div>
      )}

      {data?.user && (
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
      )}
    </SheetContent>
  )
}

export default SidebarSheet
