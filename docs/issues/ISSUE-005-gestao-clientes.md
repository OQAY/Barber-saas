# ISSUE-005: Gestão de Clientes

**Status:** 🟡 Pendente  
**Prioridade:** IMPORTANTE  
**Estimativa:** 4-5 horas  
**Dependência:** ISSUE-001 (Autenticação Admin)

## 📋 Descrição
Implementar sistema de gestão de clientes com histórico de atendimentos, dados de contato, frequência de visitas, programa de fidelidade e comunicação via WhatsApp.

## 🎯 Objetivos
- [ ] Listar todos clientes com busca
- [ ] Ver perfil detalhado do cliente
- [ ] Histórico de atendimentos
- [ ] Dados de contato e aniversário
- [ ] Frequência e última visita
- [ ] Tags e segmentação
- [ ] Envio de mensagens WhatsApp
- [ ] Programa de fidelidade

## 📝 Tarefas Detalhadas

### 1. Estrutura de Arquivos
```
src/app/admin/clientes/
├── page.tsx                    # Lista de clientes
├── [id]/
│   ├── page.tsx               # Perfil do cliente
│   └── historico/page.tsx     # Histórico detalhado
└── _components/
    ├── client-table.tsx        # Tabela de clientes
    ├── client-profile.tsx      # Card perfil
    ├── client-history.tsx      # Timeline atendimentos
    ├── client-tags.tsx         # Sistema de tags
    └── loyalty-card.tsx        # Cartão fidelidade
```

### 2. Lista de Clientes (`/admin/clientes`)
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Buscar cliente...        [Filtros ▼] [Exportar CSV]  │
├─────────────────────────────────────────────────────────┤
│ Nome ↓    Telefone      Última Visita  Freq.  Ações     │
│ ─────────────────────────────────────────────────────   │
│ João S.   11 99999...   15/12/2024     📊8x   [👁️💬📝]  │
│ Maria L.  11 88888...   10/12/2024     📊15x  [👁️💬📝]  │
│ Pedro A.  11 77777...   01/12/2024     📊3x   [👁️💬📝]  │
│           ⚠️ Cliente inativo há 30+ dias                │
└─────────────────────────────────────────────────────────┘
```

### 3. Perfil do Cliente

#### Informações Principais
```
┌──────────────────────────────────────────┐
│ 👤 João Silva                            │
│ 📱 (11) 99999-9999                       │
│ 📧 joao.silva@email.com                  │
│ 🎂 15/03/1990 (34 anos)                 │
│                                          │
│ Tags: [VIP] [Pontual] [Indica amigos]   │
│                                          │
│ Primeira visita: 15/01/2024             │
│ Última visita: 15/12/2024               │
│ Total de visitas: 8                     │
│ Ticket médio: R$ 85,00                  │
│ Gasto total: R$ 680,00                  │
└──────────────────────────────────────────┘
```

#### Histórico de Atendimentos
```
┌──────────────────────────────────────────┐
│ 📅 Histórico de Atendimentos            │
├──────────────────────────────────────────┤
│ 15/12/2024 - 14:00                      │
│ Corte + Barba | Lucas | R$ 85,00 ✅     │
│ "Cliente satisfeito, pediu mesmo corte" │
│                                          │
│ 20/11/2024 - 15:30                      │
│ Corte | João | R$ 45,00 ✅              │
│                                          │
│ 05/11/2024 - 10:00                      │
│ Corte + Barba | Lucas | R$ 85,00 ❌     │
│ "Cancelou - motivo pessoal"             │
└──────────────────────────────────────────┘
```

### 4. Sistema de Tags
```typescript
interface ClientTag {
  id: string
  name: string
  color: string
  icon?: string
}

// Tags pré-definidas
const defaultTags = [
  { name: 'VIP', color: 'gold' },
  { name: 'Novo', color: 'green' },
  { name: 'Inativo', color: 'red' },
  { name: 'Pontual', color: 'blue' },
  { name: 'Atrasa', color: 'orange' },
  { name: 'Indica', color: 'purple' }
]
```

### 5. Programa de Fidelidade
```
┌──────────────────────────────────────────┐
│ 💎 Cartão Fidelidade                     │
├──────────────────────────────────────────┤
│ [✅][✅][✅][✅][✅][✅][✅][⭕][⭕][🎁]     │
│                                          │
│ 7/10 cortes realizados                  │
│ Próximo benefício: 10º corte grátis     │
│                                          │
│ Benefícios disponíveis:                 │
│ • 5% desconto (usar agora)              │
│ • Produto grátis no aniversário         │
└──────────────────────────────────────────┘
```

### 6. Comunicação WhatsApp
```
┌──────────────────────────────────────────┐
│ 💬 Enviar WhatsApp                       │
├──────────────────────────────────────────┤
│ Templates:                               │
│ [Lembrete] [Aniversário] [Promoção]     │
│ [Retorno] [Agradecimento] [Custom]      │
│                                          │
│ Mensagem:                                │
│ ┌────────────────────────────────┐      │
│ │ Olá João! 👋                    │      │
│ │ Já faz 30 dias desde sua        │      │
│ │ última visita. Que tal agendar  │      │
│ │ seu próximo corte?              │      │
│ └────────────────────────────────┘      │
│                                          │
│ [Enviar agora] [Agendar envio]          │
└──────────────────────────────────────────┘
```

### 7. Server Actions
```typescript
// client-actions.ts
- getAllClients(filters, pagination)
- getClientById(id)
- getClientHistory(clientId)
- updateClientTags(clientId, tags)
- getInactiveClients(days)
- getBirthdayClients(month)
- sendWhatsAppMessage(clientId, message)
- getLoyaltyStatus(clientId)
- redeemLoyaltyReward(clientId, rewardId)
```

## 🔧 Implementação Técnica

### Filtros Avançados
- Por frequência (novo, regular, VIP)
- Por última visita (7d, 30d, 60d+)
- Por aniversário (este mês)
- Por gasto total
- Por tags

### Schema Atualizado
```prisma
model User {
  // ... campos existentes
  birthday      DateTime?
  tags          String[]
  loyaltyPoints Int @default(0)
  notes         String?
  referredBy    String? // ID de quem indicou
}
```

### Segmentação Automática
```typescript
// Classificação automática
if (visits >= 10) tag = 'VIP'
if (lastVisit > 60days) tag = 'Inativo'
if (visits === 1) tag = 'Novo'
if (cancelRate > 30%) tag = 'Frequente Cancela'
```

## ✅ Critérios de Aceitação
- [ ] Lista com busca e filtros funcionando
- [ ] Perfil completo do cliente
- [ ] Histórico cronológico correto
- [ ] Sistema de tags funcionando
- [ ] WhatsApp abre com mensagem
- [ ] Fidelidade calculada corretamente
- [ ] Exportação para CSV

## 🧪 Testes
- Buscar cliente por nome/telefone
- Filtrar clientes inativos
- Adicionar/remover tags
- Calcular pontos de fidelidade
- Enviar mensagem WhatsApp
- Exportar lista de aniversariantes

## 📊 Métricas
- Total de clientes ativos
- Taxa de retorno (30/60/90 dias)
- Lifetime value médio
- Taxa de indicação
- NPS por segmento

## 💡 Notas
- LGPD: permitir exclusão de dados
- Importação de clientes via CSV
- Integração com CRM externo
- Campanhas de email marketing
- Análise RFM (Recency, Frequency, Monetary)