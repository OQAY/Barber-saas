# ISSUE-002: Gestão de Agendamentos

**Status:** 🔴 Pendente  
**Prioridade:** CRÍTICA  
**Estimativa:** 6-8 horas  
**Dependência:** ISSUE-001 (Autenticação Admin)

## 📋 Descrição
Implementar sistema completo de gestão de agendamentos no painel admin, permitindo visualizar, filtrar, editar status, remarcar e adicionar novos agendamentos (walk-in).

## 🎯 Objetivos
- [ ] Listar todos agendamentos com filtros
- [ ] Mudar status dos agendamentos
- [ ] Adicionar agendamento manual (walk-in)
- [ ] Remarcar agendamentos
- [ ] Cancelar com motivo
- [ ] Visualização por barbeiro
- [ ] Indicadores visuais de status

## 📝 Tarefas Detalhadas

### 1. Estrutura de Arquivos
```
src/app/admin/agendamentos/
├── page.tsx                    # Lista de agendamentos
├── _components/
│   ├── bookings-table.tsx     # Tabela principal
│   ├── booking-filters.tsx    # Filtros
│   ├── booking-status.tsx     # Badge de status
│   ├── add-booking-modal.tsx  # Modal walk-in
│   └── reschedule-modal.tsx   # Modal remarcar
```

### 2. Página Principal (`/admin/agendamentos`)

#### Filtros
- Data (hoje, amanhã, semana, mês, período customizado)
- Barbeiro (dropdown com todos barbeiros)
- Status (Agendado, Em andamento, Concluído, Cancelado)
- Serviço (dropdown com serviços)
- Cliente (busca por nome/telefone)

#### Tabela de Agendamentos
```
| Horário | Cliente | Telefone | Barbeiro | Serviço | Valor | Status | Ações |
|---------|---------|----------|----------|---------|-------|--------|-------|
| 09:00   | João    | 11999... | Lucas    | Corte   | R$45  | ✅     | [...] |
```

#### Ações Rápidas (por linha)
- ✅ Confirmar
- ❌ Cancelar
- 🔄 Remarcar
- ✏️ Editar
- 👁️ Ver detalhes
- 💬 WhatsApp

### 3. Modal Adicionar Walk-in
```typescript
interface WalkInBooking {
  clientName: string
  clientPhone?: string
  barberId: string
  serviceId: string
  date: Date
  time: string
  notes?: string
}
```

### 4. Status dos Agendamentos
- **🟡 Agendado**: Amarelo - Aguardando
- **🔵 Confirmado**: Azul - Cliente confirmou
- **🟢 Em andamento**: Verde - Sendo atendido
- **✅ Concluído**: Cinza - Finalizado
- **❌ Cancelado**: Vermelho - Cancelado

### 5. Server Actions
```typescript
// booking-actions.ts
- getBookingsByDate(date, filters)
- updateBookingStatus(bookingId, status, reason?)
- createWalkInBooking(data)
- rescheduleBooking(bookingId, newDate, newTime)
- sendWhatsAppReminder(bookingId)
```

### 6. Funcionalidades Especiais

#### Timeline do Dia
- Visualização por barbeiro em colunas
- Drag & drop para remarcar (futuro)
- Blocos de horário ocupado/livre
- Conflitos destacados em vermelho

#### Indicadores Importantes
- ⚠️ Cliente atrasado (15+ min)
- 🔥 Primeira vez do cliente
- 💎 Cliente VIP/Frequente
- 📝 Tem observações

## 🔧 Implementação Técnica

### Componentes
- **TanStack Table**: Tabela com sort, filter, pagination
- **date-fns**: Manipulação de datas
- **react-day-picker**: Seletor de data
- **shadcn/ui**: Dialog, Select, Badge, Button

### Queries Otimizadas
```sql
-- Buscar agendamentos com joins
SELECT 
  b.*,
  u.name as clientName,
  u.phone as clientPhone,
  br.name as barberName,
  s.name as serviceName,
  s.price as servicePrice
FROM bookings b
JOIN users u ON b.userId = u.id
JOIN barbers br ON b.barberId = br.id
JOIN barbershop_services s ON b.serviceId = s.id
WHERE b.date = ? AND b.status = ?
ORDER BY b.date, b.time
```

## ✅ Critérios de Aceitação
- [ ] Lista mostra todos agendamentos do dia
- [ ] Filtros funcionam corretamente
- [ ] Status pode ser alterado com confirmação
- [ ] Walk-in pode ser adicionado rapidamente
- [ ] Remarcação atualiza disponibilidade
- [ ] Cancelamento exige motivo
- [ ] WhatsApp abre com mensagem pronta

## 🧪 Testes
- Filtrar por data específica
- Filtrar por múltiplos critérios
- Mudar status de agendamento
- Adicionar walk-in com conflito de horário
- Remarcar para horário ocupado
- Cancelar e verificar liberação do horário

## 📊 Métricas
- Taxa de no-show
- Taxa de cancelamento
- Tempo médio de atendimento
- Ocupação por barbeiro

## 💡 Notas
- Considerar notificação em tempo real
- Integração com Google Calendar
- Exportar para Excel
- Impressão de agenda do dia