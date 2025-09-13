import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { Badge } from "@/app/_components/ui/badge"
import { Clock, Phone } from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: string
  date: Date
  user: {
    name: string | null
    image: string | null
    phone: string | null
  }
  service: {
    name: string
  }
  barber: {
    name: string
  }
}

interface NextClientsProps {
  bookings: Booking[]
}

export default function NextClients({ bookings }: NextClientsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Próximos Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.user.image || ""} />
                    <AvatarFallback>
                      {booking.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{booking.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.service.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default">
                    {format(booking.date, "HH:mm")}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.barber.name}
                  </p>
                </div>
              </div>
              {booking.user.phone && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {booking.user.phone}
                  </span>
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum cliente nas próximas 2 horas
          </p>
        )}
      </CardContent>
    </Card>
  )
}