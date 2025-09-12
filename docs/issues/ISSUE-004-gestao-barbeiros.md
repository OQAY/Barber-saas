# ISSUE-004: Gestão de Barbeiros

**Status:** 🟡 Pendente  
**Prioridade:** IMPORTANTE  
**Estimativa:** 5-6 horas  
**Dependência:** ISSUE-001 (Autenticação Admin)

## 📋 Descrição
Implementar CRUD completo para gestão de barbeiros, incluindo cadastro, edição, horários de trabalho, especialidades, comissões e controle de disponibilidade.

## 🎯 Objetivos
- [ ] Listar todos barbeiros
- [ ] Adicionar novo barbeiro
- [ ] Editar informações do barbeiro
- [ ] Ativar/desativar barbeiro
- [ ] Configurar horário de trabalho
- [ ] Definir especialidades
- [ ] Configurar comissões
- [ ] Upload de foto

## 📝 Tarefas Detalhadas

### 1. Estrutura de Arquivos
```
src/app/admin/barbeiros/
├── page.tsx                     # Lista de barbeiros
├── novo/page.tsx               # Adicionar barbeiro
├── [id]/
│   ├── page.tsx               # Editar barbeiro
│   └── comissoes/page.tsx     # Relatório comissões
└── _components/
    ├── barber-form.tsx         # Formulário
    ├── barber-card.tsx         # Card na lista
    ├── schedule-config.tsx     # Config horários
    └── commission-table.tsx    # Tabela comissões
```

### 2. Lista de Barbeiros (`/admin/barbeiros`)
```
┌─────────────────────────────────────────────────────────┐
│ [+ Novo Barbeiro]           🔍 Buscar...   [Filtros ▼]  │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐   │
│ │ 📷  Lucas Silva                          [Editar] │   │
│ │     Especialidades: Corte, Barba, Visagismo      │   │
│ │     Horário: Seg-Sex 9h-18h | Sáb 9h-13h        │   │
│ │     Comissão: 40% | Status: 🟢 Ativo            │   │
│ └──────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 📷  João Santos                          [Editar] │   │
│ │     Especialidades: Corte, Coloração             │   │
│ │     Horário: Ter-Sáb 10h-19h                     │   │
│ │     Comissão: 35% | Status: 🔴 Inativo          │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3. Formulário de Barbeiro

#### Informações Básicas
```typescript
interface BarberForm {
  // Dados pessoais
  name: string
  email: string
  phone: string
  photo?: File
  bio?: string
  
  // Profissional
  specialties: string[]
  yearsExperience?: number
  instagram?: string
  
  // Financeiro
  commissionPercent: number
  fixedSalary?: number
  
  // Status
  isActive: boolean
  role: 'BARBER' | 'MANAGER'
}
```

#### Configuração de Horários
```
        Segunda  Terça  Quarta  Quinta  Sexta  Sábado  Domingo
Entrada [09:00] [09:00] [09:00] [09:00] [09:00] [09:00] [Folga]
Almoço  [12:00] [12:00] [12:00] [12:00] [12:00] [-----] [-----]
Retorno [13:00] [13:00] [13:00] [13:00] [13:00] [-----] [-----]
Saída   [18:00] [18:00] [18:00] [18:00] [18:00] [13:00] [Folga]

[✓] Aplicar mesmo horário para todos os dias úteis
[✓] Folga aos domingos
```

### 4. Gestão de Comissões

#### Configurações
- Percentual base (ex: 40%)
- Percentual diferenciado por serviço
- Bônus por meta
- Vale/adiantamento

#### Relatório Mensal
```
Barbeiro: Lucas Silva
Período: Dezembro/2024

Serviços Realizados: 120
Faturamento Bruto: R$ 4.800,00
Comissão (40%): R$ 1.920,00
Vales: -R$ 200,00
Total a Receber: R$ 1.720,00

[Detalhes] [Exportar PDF] [Marcar como Pago]
```

### 5. Server Actions
```typescript
// barber-actions.ts
- getAllBarbers(filters?)
- getBarberById(id)
- createBarber(data)
- updateBarber(id, data)
- toggleBarberStatus(id)
- uploadBarberPhoto(id, file)
- getBarberCommissions(id, month)
- payCommission(barberId, amount)
```

### 6. Funcionalidades Especiais

#### Disponibilidade em Tempo Real
- Calendário com dias de folga
- Férias programadas
- Atestados médicos
- Substituições

#### Especialidades e Certificações
- Lista de especialidades
- Certificados (upload PDF)
- Cursos realizados
- Avaliação dos clientes

## 🔧 Implementação Técnica

### Upload de Imagem
- **UploadThing** ou **Cloudinary**
- Resize automático
- Crop quadrado
- Compressão

### Validações
- Email único
- Telefone válido
- Horários não conflitantes
- Comissão entre 0-100%

### Schema Atualizado
```prisma
model Barber {
  // ... campos existentes
  commissionPercent Float @default(40)
  fixedSalary      Float?
  yearsExperience  Int?
  instagram        String?
  certificates     Json?  // Array de URLs
  vacationDays     Json?  // Array de datas
}
```

## ✅ Critérios de Aceitação
- [ ] CRUD completo funcionando
- [ ] Upload de foto funcionando
- [ ] Horários salvos corretamente
- [ ] Cálculo de comissão preciso
- [ ] Filtros e busca funcionando
- [ ] Validações apropriadas
- [ ] Responsivo mobile

## 🧪 Testes
- Criar barbeiro com todos campos
- Criar barbeiro com campos mínimos
- Editar horário de trabalho
- Desativar e reativar barbeiro
- Upload de foto grande
- Cálculo de comissão com vales

## 📊 Métricas
- Total de barbeiros ativos
- Média de atendimentos/barbeiro
- Taxa de ocupação individual
- Ranking de faturamento
- Satisfação por barbeiro

## 💡 Notas
- Integração com Instagram API
- QR Code para perfil do barbeiro
- Histórico de alterações
- Backup de dados sensíveis