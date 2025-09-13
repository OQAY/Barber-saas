import { MenuIcon } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import AdminSidebarSheet from "./admin-sidebar-sheet"

interface AdminHeaderProps {
  user: {
    name: string | null
    email: string
    image: string | null
    role: string | null
  }
}

const AdminHeader = ({ user }: AdminHeaderProps) => {
  return (
    <Card>
      <CardContent className="flex flex-grow items-center justify-between p-5">
        <Link href="/admin">
          <Image
            src="/logo.png"
            alt="logo FSW Barber Admin"
            width={120}
            height={18}
          />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <AdminSidebarSheet user={user} />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default AdminHeader