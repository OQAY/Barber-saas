# ISSUE-003: Dashboard Principal

**Status:** 🔴 Pendente  
**Prioridade:** CRÍTICA  
**Estimativa:** 5-6 horas  
**Dependência:** ISSUE-001 (Autenticação Admin)

## 📋 Descrição
Criar dashboard principal do painel admin com métricas em tempo real, visualizações de dados importantes e acesso rápido às principais funcionalidades.

## 🎯 Objetivos
- [ ] Cards com métricas do dia
- [ ] Gráfico de faturamento
- [ ] Lista de próximos agendamentos
- [ ] Status dos barbeiros
- [ ] Atalhos para ações rápidas
- [ ] Notificações importantes
- [ ] Responsivo mobile/desktop

## 📝 Tarefas Detalhadas

### 1. Estrutura de Arquivos
```
src/app/admin/
├── page.tsx                      # Dashboard
└── _components/dashboard/
    ├── stats-cards.tsx          # Cards de métricas
    ├── revenue-chart.tsx        # Gráfico faturamento
    ├── upcoming-bookings.tsx    # Próximos agendamentos
    ├── barber-status.tsx        # Status barbeiros
    ├── quick-actions.tsx        # Botões de ação
    └── recent-activity.tsx      # Atividades recentes
```

### 2. Cards de Métricas (Topo)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ FATURAMENTO  │ AGENDAMENTOS │    TICKET    │     TAXA     │
│    HOJE      │     HOJE     │    MÉDIO     │   OCUPAÇÃO   │
│   R$ 1.250   │    12/15     │    R$ 85     │     80%      │
│   ↑ 15%      │   3 pendentes│   ↑ R$ 5     │   ↑ 10%      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 3. Layout Desktop (Grid)
```
┌─────────────────────────────┬──────────────────┐
│   Gráfico Faturamento (7d)  │ Próximos Agend.  │
│                             │  09:00 - João    │
│         📊                  │  09:30 - Maria   │
│                             │  10:00 - Pedro   │
├─────────────────────────────┼──────────────────┤
│    Status Barbeiros         │  Ações Rápidas   │
│  🟢 Lucas - Ocupado         │  [+ Walk-in]     │
│  🟡 João - Disponível       │  [Ver Agenda]    │
│  🔴 Pedro - Ausente         │  [Rel. Dia]     │
└─────────────────────────────┴──────────────────┘
```

### 4. Componentes Detalhados

#### Stats Cards
```typescript
interface StatCard {
  title: string
  value: string | number
  change?: number // percentual
  changeType?: 'increase' | 'decrease'
  icon: IconType
  color: 'blue' | 'green' | 'yellow' | 'red'
}
```

#### Gráfico de Faturamento
- Últimos 7 dias (padrão)
- Opções: 7d, 30d, 3m, 6m, 1a
- Comparação com período anterior
- Linha de meta (opcional)

#### Próximos Agendamentos
- Lista dos próximos 5-10
- Horário, cliente, barbeiro, serviço
- Badge de status
- Click para ver detalhes

#### Status dos Barbeiros
```typescript
type BarberStatus = 
  | 'available'    // 🟢 Verde
  | 'busy'        // 🟡 Amarelo
  | 'break'       // 🟠 Laranja
  | 'offline'     // 🔴 Vermelho
```

### 5. Server Actions
```typescript
// dashboard-actions.ts
- getDashboardMetrics(date)
- getRevenueData(period)
- getUpcomingBookings(limit)
- getBarbersStatus()
- getRecentActivity(limit)
```

### 6. Dados em Tempo Real
- Atualização automática a cada 30s
- WebSocket para notificações (futuro)
- Loading states durante refresh
- Cache de dados para performance

## 🔧 Implementação Técnica

### Bibliotecas
- **Recharts**: Gráficos interativos
- **date-fns**: Manipulação de datas
- **react-query**: Cache e refetch
- **shadcn/ui**: Cards, Skeleton, Badge

### Queries Otimizadas
```sql
-- Métricas do dia
WITH daily_metrics AS (
  SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN status = 'COMPLETED' THEN price ELSE 0 END) as revenue,
    AVG(CASE WHEN status = 'COMPLETED' THEN price ELSE 0 END) as avg_ticket,
    COUNT(DISTINCT barberId) as active_barbers
  FROM bookings b
  JOIN barbershop_services s ON b.serviceId = s.id
  WHERE DATE(b.date) = CURRENT_DATE
)
SELECT * FROM daily_metrics;
```

### Performance
- Lazy loading de componentes pesados
- Memoização de cálculos
- Debounce em atualizações
- Skeleton loaders

## ✅ Critérios de Aceitação
- [ ] Dashboard carrega em < 2 segundos
- [ ] Métricas atualizadas em tempo real
- [ ] Gráfico interativo e responsivo
- [ ] Mobile-friendly
- [ ] Dados precisos e atualizados
- [ ] Tratamento de erros adequado

## 🧪 Testes
- Dashboard sem dados (novo negócio)
- Dashboard com muito volume
- Refresh de dados
- Responsividade mobile
- Diferentes períodos no gráfico
- Timezone correto

## 📊 KPIs Exibidos
- **Faturamento**: Hoje, semana, mês
- **Agendamentos**: Total, confirmados, cancelados
- **Taxa ocupação**: % horários preenchidos
- **Ticket médio**: Valor médio por atendimento
- **No-show rate**: % de faltas
- **Novos clientes**: Quantidade no período

## 💡 Notas
- Dark mode opcional
- Exportar dashboard como PDF
- Personalização de métricas
- Metas configuráveis
- Comparação com períodos anteriores