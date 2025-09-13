"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { PlayCircle, CheckCircle2, XCircle } from "lucide-react"

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2">
          <PlayCircle className="h-4 w-4 text-blue-600" />
          Atendendo
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          Concluído
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <XCircle className="h-4 w-4 text-red-600" />
          Cliente Faltou
        </Button>
      </CardContent>
    </Card>
  )
}