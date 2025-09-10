# Issue #2: Melhorias na Estrutura do Projeto

## 📋 Resumo
Refatoração da organização de arquivos e estrutura do projeto para melhor escalabilidade e manutenibilidade, baseada na análise da estrutura atual.

## 🎯 Objetivos
- Eliminar redundâncias na estrutura de pastas
- Organizar componentes por domínio/responsabilidade
- Preparar arquitetura para crescimento futuro
- Manter convenções Next.js 14 e boas práticas

## 🔍 Problemas Identificados

### 1. Duplicação de Estrutura de Libs
**Problema:** Existe tanto `src/app/_lib/` quanto `src/lib/` causando confusão sobre onde colocar novos utilitários.

**Impacto:** 
- Desenvolvedores não sabem onde adicionar novos utilities
- Possível duplicação de código
- Inconsistência na importação de módulos

**Solução Proposta:**
- Consolidar tudo em `src/app/_lib/`
- Remover `src/lib/` e migrar conteúdo se necessário
- Documentar convenção no CLAUDE.md

### 2. Organização de Componentes Pode Ficar Confusa
**Problema:** Todos os componentes estão em `src/app/_components/` sem agrupamento por domínio.

**Estado Atual:**
- barbershop-item.tsx
- booking-item.tsx  
- booking-summary.tsx
- service-items.tsx
- sign-in-dialog.tsx
- header.tsx, footer.tsx
- Etc...

**Impacto Futuro:**
- Pasta `_components/` pode ficar com 20+ arquivos
- Difícil encontrar componentes relacionados
- Falta de clara separação de responsabilidades

**Solução Proposta:**
- Criar subpastas por domínio dentro de `_components/`
- Agrupar componentes relacionados
- Manter `ui/` para shadcn/ui components

### 3. Ausência de Estruturas de Suporte para Crescimento
**Problema:** Faltam estruturas que serão necessárias conforme o projeto crescer.

**Estruturas Ausentes:**
- Pasta para custom hooks quando aparecerem
- Organização para tipos TypeScript compartilhados
- Estrutura para constantes mais complexas

## 📋 Tarefas para Implementação

### Tarefa 1: Consolidação das Libs
- [ ] Analisar conteúdo de `src/lib/` 
- [ ] Migrar arquivos necessários para `src/app/_lib/`
- [ ] Remover pasta `src/lib/` se vazia
- [ ] Atualizar imports em arquivos que referenciam a pasta antiga
- [ ] Atualizar documentação no CLAUDE.md

### Tarefa 2: Reorganização de Componentes
- [ ] Criar estrutura de subpastas em `_components/`:
  - `barbershop/` - componentes relacionados a barbearias
  - `booking/` - componentes de agendamento
  - `auth/` - componentes de autenticação
  - `layout/` - header, footer, sidebar
  - `common/` - componentes genéricos reutilizáveis
- [ ] Mover componentes para respectivas pastas
- [ ] Atualizar imports em todos os arquivos que referenciam os componentes
- [ ] Manter `ui/` intocada (shadcn/ui)

### Tarefa 3: Preparação para Estruturas Futuras
- [ ] Criar pasta `_hooks/` (vazia inicialmente, com README.md explicando uso)
- [ ] Criar pasta `_types/` se houver types compartilhados entre 3+ arquivos
- [ ] Documentar convenções no CLAUDE.md

### Tarefa 4: Atualização de Documentação
- [ ] Atualizar CLAUDE.md com nova estrutura
- [ ] Criar guia de onde colocar novos arquivos
- [ ] Documentar convenções de naming

## 🎯 Critérios de Sucesso

### Antes da Refatoração
- Desenvolvedor confuso sobre onde colocar novo utility
- Componentes misturados em uma pasta única
- Duplicação de estrutura de libs

### Depois da Refatoração  
- Clara separação de responsabilidades
- Fácil localização de componentes relacionados
- Estrutura preparada para crescimento
- Documentação atualizada e clara

## ⚠️ Considerações de Implementação

### Impacto no Desenvolvimento
- **Alto:** Muitos imports precisarão ser atualizados
- **Médio:** Desenvolvedores precisarão se adaptar à nova estrutura
- **Baixo:** Funcionalidade não será afetada

### Estratégia de Implementação
1. **Fazer em uma branch separada** para não quebrar desenvolvimento
2. **Implementar por etapas** (libs primeiro, depois componentes)
3. **Testar build e funcionalidades** após cada etapa
4. **Atualizar documentação** em paralelo às mudanças

### Testes Necessários
- [ ] `npm run build` deve funcionar sem erros
- [ ] `npm run dev` deve inicializar corretamente  
- [ ] Todas as páginas devem carregar sem erro de import
- [ ] Funcionalidades existentes devem continuar funcionando

## 📅 Prioridade
**Média** - Não é urgente, mas importante para manutenibilidade futura.

## 🏷️ Labels Sugeridas
- `refactor`
- `structure`
- `developer-experience`
- `maintenance`

## 💡 Observações Adicionais
Esta refatoração deve ser feita quando:
- Não há desenvolvimento ativo de features críticas
- Equipe tem tempo para revisar e testar mudanças
- Há consenso de que vale o esforço vs benefício

A estrutura atual **funciona bem** - esta é uma melhoria preventiva, não uma correção de bug.