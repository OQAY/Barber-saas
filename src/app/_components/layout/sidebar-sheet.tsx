"use client"

import { Button } from "../ui/button"
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { quickSearchOptions } from "../../_constants/search"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Avatar, AvatarImage } from "../ui/avatar"
import { useAuth } from "../../_lib/auth-provider"

const SidebarSheet = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const handleLogoutClick = () => logout()

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.image ?? ""} />
            </Avatar>

            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-xs">{user.email}</p>
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
        <Button className="justify-start gap-2" variant="ghost" asChild>
          <Link href="/bookings">
            <CalendarIcon size={18} />
            Agendamentos
          </Link>
        </Button>
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

      {isAuthenticated && (
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
