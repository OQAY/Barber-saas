# COMANDO BARBER - CONTEXTO OPERACIONAL

## 📋 SOBRE O PROJETO

**Nome:** Barber-saas (FSW Barber)
**Tipo:** Sistema de agendamento para barbearia
**Arquitetura:** Next.js 14 + App Router, Prisma + PostgreSQL, NextAuth
**Status:** Transformação multi-barbershop → single-barbershop (30% completo)

## 🏗️ ARQUITETURA ATUAL

### **Stack Tecnológica:**
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Server Actions
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Auth:** NextAuth (Google OAuth + email/password)
- **UI:** Mobile-first, Grid responsivo

### **Estrutura de Pastas Semântica:**
```
src/app/
├── _components/
│   ├── establishments/    # Componentes de barbearia
│   ├── staff/            # Componentes de barbeiros
│   ├── booking/          # Sistema de agendamentos
│   └── ui/               # shadcn/ui components
├── _actions/             # Server Actions
├── _lib/                 # Utilitários e configurações
└── barbers/              # Páginas de barbeiros
```

## 🎯 ESTADO ATUAL DO PROJETO

### **✅ IMPLEMENTADO (Fase 1 + 2 Parcial):**
- ✅ Database schema com Barber model completo
- ✅ 7 barbeiros reais populados no seed
- ✅ Home page exibe barbeiros (não barbearias)
- ✅ Grid 3x3 mobile-first responsivo
- ✅ Filtros por especialidade funcionando
- ✅ Reorganização de componentes por domínio

### **🚨 BLOQUEADOR CRÍTICO:**
- **404 na página `/barbers/[id]`** - quebra todo fluxo de agendamento
- **URLs com UUID gigante** - UX terrível
- **Sistema de slugs pendente** - `/barbers/lucas-silva`

### **❌ NÃO IMPLEMENTADO:**
- ❌ Página detalhe do barbeiro
- ❌ Sistema de agendamento com barbeiro específico
- ❌ Painel do barbeiro (Fase 3)
- ❌ Dashboard administrativo (Fase 4)

## 🔄 PADRÕES DE TRABALHO

### **Git Workflow:**
```bash
# Padrão 2024 identificado no projeto:
feat: add feature description
fix: solve specific problem  
chore: maintenance task
refactor: code reorganization

# Commits pequenos e específicos
git add arquivo-específico
git commit -m "feat: specific scope"
```

### **Desenvolvimento:**
1. **Ler estado real** antes de implementar
2. **Verificar dados do seed** para informações corretas
3. **Testar fluxo completo** do usuário
4. **Atualizar documentação** com implementação real

### **Dados Reais do Projeto:**
- **Barbearia:** "Barbearia Premium"
- **7 Barbeiros:** Lucas Silva, Pedro Santos, Maria Oliveira, Carlos Mendes, Ana Costa, Roberto Lima, Fernanda Alves
- **Especialidades:** Cabelo, Barba, Acabamento, Sobrancelha, Massagem, Hidratação
- **Botão:** "Reservar" (não "Agendar")

## 🚨 PROBLEMAS CONHECIDOS

### **1. URL com UUID Gigante:**
```
❌ ATUAL: /barbers/5aea6417-94ea-46b2-821c-388a48d8aacc
✅ DESEJADO: /barbers/lucas-silva
```

### **2. Página 404:**
- Clique em "Reservar" → 404
- Falta implementar `/barbers/[slug]/page.tsx`

### **3. Sistema de Avaliações Fake:**
- Badge "5,0" hardcoded
- Não há sistema real de avaliações

## 📊 PRÓXIMAS PRIORIDADES

### **🚨 IMEDIATO:**
1. Adicionar campo `slug` ao schema Barber
2. Migrar barbeiros existentes para gerar slugs
3. Criar `/barbers/[slug]/page.tsx`
4. Atualizar links para usar slugs

### **📅 CURTO PRAZO:**
5. Sistema de agendamento com barbeiro específico
6. Calendário de disponibilidade por barbeiro
7. Completar Fase 2 (60% → 100%)

### **🎯 MÉDIO PRAZO:**
8. Painel do barbeiro (Fase 3)
9. Dashboard administrativo (Fase 4)

## 💡 INSIGHTS IMPORTANTES

### **"Funciona no localhost ≠ Está completo"**
- Sempre testar fluxo completo do usuário
- Verificar todos os links e navegação
- Confirmar dados reais vs documentação

### **Documentação Fica Obsoleta Rápido**
- Revisar wireframes vs implementação real
- Atualizar status de cada funcionalidade
- Marcar o que é aspiracional vs implementado

### **Priorizar Desbloqueadores**
- 1 página 404 quebra todo o sistema
- UX ruim impacta adoção do usuário
- Resolver bloqueadores antes de features

---

**📌 LEMBRETE:** Este projeto está em transformação ativa. Sempre verificar estado atual antes de implementar novas features. O Issue #3 documenta o roadmap completo.