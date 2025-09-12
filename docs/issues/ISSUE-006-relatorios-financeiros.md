# ISSUE-006: Relatórios Financeiros Básicos

**Status:** 🟡 Pendente  
**Prioridade:** IMPORTANTE  
**Estimativa:** 5-6 horas  
**Dependência:** ISSUE-001 (Autenticação Admin)

## 📋 Descrição
Implementar sistema de relatórios financeiros básicos para controle de faturamento, comissões, formas de pagamento e fechamento de caixa diário.

## 🎯 Objetivos
- [ ] Relatório de faturamento por período
- [ ] Controle de comissões dos barbeiros
- [ ] Análise por forma de pagamento
- [ ] Fechamento de caixa diário
- [ ] Exportação para PDF/Excel
- [ ] Gráficos de tendência
- [ ] Comparação entre períodos

## 📝 Tarefas Detalhadas

### 1. Estrutura de Arquivos
```
src/app/admin/financeiro/
├── page.tsx                    # Overview financeiro
├── faturamento/page.tsx        # Relatório faturamento
├── comissoes/page.tsx          # Comissões barbeiros
├── fechamento/page.tsx         # Fechamento caixa
└── _components/
    ├── revenue-summary.tsx     # Resumo receitas
    ├── payment-methods.tsx     # Formas pagamento
    ├── commission-calc.tsx     # Cálculo comissões
    ├── cash-flow.tsx          # Fluxo de caixa
    └── export-buttons.tsx      # Exportar relatórios
```

### 2. Dashboard Financeiro (`/admin/financeiro`)
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Resumo Financeiro - Dezembro 2024                    │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┬─────────┬─────────┬─────────┐             │
│ │  HOJE   │ SEMANA  │   MÊS   │   ANO   │             │
│ │ R$ 850  │ R$ 4.2k │ R$ 18k  │ R$ 180k │             │
│ │  ↑12%   │  ↑8%    │  ↑15%   │  ↑22%   │             │
│ └─────────┴─────────┴─────────┴─────────┘             │
│                                                         │
│ 📈 Gráfico Faturamento (30 dias)                       │
│ [====================================]                  │
│                                                         │
│ 💳 Formas de Pagamento         💰 Top Serviços        │
│ PIX: 45% ████████             Corte: R$ 8.500         │
│ Dinheiro: 30% ██████          Barba: R$ 4.200         │
│ Cartão: 25% █████             Combo: R$ 3.800         │
└─────────────────────────────────────────────────────────┘
```

### 3. Relatório de Faturamento

#### Filtros e Opções
```
Período: [01/12] até [31/12] [Aplicar]
Agrupar por: (•) Dia ( ) Semana ( ) Mês
Barbeiro: [Todos ▼]
Serviço: [Todos ▼]
```

#### Tabela Detalhada
```
Data        Qtd  Faturamento  Ticket Médio  Comissões   Líquido
01/12       15   R$ 1.275     R$ 85         R$ 510      R$ 765
02/12       18   R$ 1.530     R$ 85         R$ 612      R$ 918
03/12       12   R$ 1.020     R$ 85         R$ 408      R$ 612
...
TOTAL      450   R$ 38.250    R$ 85         R$ 15.300   R$ 22.950

[Exportar PDF] [Exportar Excel] [Imprimir]
```

### 4. Gestão de Comissões

#### Por Barbeiro
```
┌─────────────────────────────────────────────────────────┐
│ Barbeiro: Lucas Silva - Dezembro/2024                   │
├─────────────────────────────────────────────────────────┤
│ Serviços Realizados: 120                                │
│ Faturamento Gerado: R$ 10.200                          │
│ Comissão Base (40%): R$ 4.080                          │
│                                                         │
│ Detalhamento:                                           │
│ • Cortes: 80 x R$ 45 = R$ 3.600 (40% = R$ 1.440)      │
│ • Barbas: 30 x R$ 40 = R$ 1.200 (40% = R$ 480)        │
│ • Combos: 10 x R$ 85 = R$ 850 (40% = R$ 340)          │
│                                                         │
│ Adiantamentos: -R$ 500                                  │
│ Bônus Meta: +R$ 200                                    │
│ ─────────────────────────                              │
│ Total a Pagar: R$ 3.780                                │
│                                                         │
│ [Gerar Recibo] [Marcar como Pago] [Histórico]          │
└─────────────────────────────────────────────────────────┘
```

### 5. Fechamento de Caixa

#### Abertura/Fechamento
```
┌─────────────────────────────────────────────────────────┐
│ 💵 Fechamento de Caixa - 15/12/2024                    │
├─────────────────────────────────────────────────────────┤
│ Abertura: R$ 200,00                                    │
│                                                         │
│ ENTRADAS                                                │
│ Dinheiro: R$ 450,00                                    │
│ PIX: R$ 680,00                                         │
│ Cartão Débito: R$ 320,00                               │
│ Cartão Crédito: R$ 280,00                              │
│ ─────────────────────                                  │
│ Total Entradas: R$ 1.730,00                            │
│                                                         │
│ SAÍDAS                                                  │
│ Vale Barbeiro João: R$ 50,00                           │
│ Compra Produtos: R$ 120,00                             │
│ Sangria: R$ 500,00                                     │
│ ─────────────────────                                  │
│ Total Saídas: R$ 670,00                                │
│                                                         │
│ Saldo Final: R$ 1.260,00                               │
│ Dinheiro em Caixa: R$ 180,00                           │
│                                                         │
│ Observações: [_____________________]                    │
│                                                         │
│ [Fechar Caixa] [Salvar Rascunho]                       │
└─────────────────────────────────────────────────────────┘
```

### 6. Server Actions
```typescript
// finance-actions.ts
- getRevenueReport(startDate, endDate, filters)
- getCommissionReport(barberId, month)
- getPaymentMethodsBreakdown(period)
- createCashClosing(data)
- getCashFlow(period)
- exportToExcel(reportType, data)
- exportToPDF(reportType, data)
- calculateCommissions(barberId, bookings)
```

### 7. Métricas e KPIs

#### Indicadores Principais
- **Faturamento**: Diário, semanal, mensal, anual
- **Ticket Médio**: Por período e barbeiro
- **Taxa de Crescimento**: MoM, YoY
- **Margem Líquida**: Após comissões e custos
- **ROI**: Por tipo de serviço

#### Análises Comparativas
```
        Dez/2024  Nov/2024  Variação
Faturamento  R$ 18k    R$ 15k    +20%
Atendimentos   450       420      +7%
Ticket Médio   R$ 40     R$ 36    +11%
Comissões      R$ 7.2k   R$ 6k    +20%
```

## 🔧 Implementação Técnica

### Bibliotecas
- **Recharts**: Gráficos interativos
- **jsPDF**: Geração de PDF
- **xlsx**: Exportação Excel
- **date-fns**: Manipulação de datas

### Queries Otimizadas
```sql
-- Faturamento por período
SELECT 
  DATE(b.date) as day,
  COUNT(*) as total_bookings,
  SUM(s.price) as revenue,
  AVG(s.price) as avg_ticket
FROM bookings b
JOIN barbershop_services s ON b.serviceId = s.id
WHERE b.status = 'COMPLETED'
  AND b.date BETWEEN ? AND ?
GROUP BY DATE(b.date)
ORDER BY day DESC;

-- Comissões por barbeiro
SELECT 
  br.name,
  COUNT(*) as services,
  SUM(s.price) as total_revenue,
  SUM(s.price * br.commissionPercent / 100) as commission
FROM bookings b
JOIN barbers br ON b.barberId = br.id
JOIN barbershop_services s ON b.serviceId = s.id
WHERE b.status = 'COMPLETED'
  AND MONTH(b.date) = ?
GROUP BY br.id;
```

## ✅ Critérios de Aceitação
- [ ] Relatórios precisos e atualizados
- [ ] Filtros funcionando corretamente
- [ ] Exportação PDF/Excel funcionando
- [ ] Cálculo de comissões correto
- [ ] Fechamento de caixa completo
- [ ] Gráficos interativos
- [ ] Performance < 3s para carregar

## 🧪 Testes
- Relatório com grande volume de dados
- Exportação de período longo
- Cálculo com diferentes % comissão
- Fechamento com múltiplas sangrias
- Comparação entre períodos
- Timezone correto

## 💡 Notas
- Backup automático de fechamentos
- Auditoria de alterações
- Integração com contador
- Dashboard para sócios
- Previsão de faturamento