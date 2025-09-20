# 🧪 Guia de Testes - FSW Barber

## 📋 Comandos de Teste

### Testes Unitários (Jest)
```bash
# Executar todos os testes unitários
npm run test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar teste específico
npm run test -- --testNamePattern="create booking"
```

### Testes E2E (Playwright)
```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar testes E2E com interface visual
npm run test:e2e:ui

# Executar testes E2E visível no navegador
npm run test:e2e:headed

# Executar testes E2E específicos
npx playwright test booking-flow
```

### Executar Todos os Testes
```bash
# Executar testes unitários + E2E
npm run test:all

# Executar testes para CI/CD
npm run test:ci
```

## 🧪 Tipos de Testes Implementados

### 1. Testes de Validação (Zod)
- **Localização**: `src/app/_lib/__tests__/validations.test.ts`
- **Cobertura**: Validação de emails, senhas, dados de booking
- **Exemplo**:
```typescript
test('should reject invalid email format', () => {
  const result = validateData(emailSchema, 'invalid-email')
  expect(result.success).toBe(false)
})
```

### 2. Testes de Server Actions
- **Localização**: `src/app/_actions/__tests__/`
- **Cobertura**: create-booking, cancel-booking
- **Exemplo**:
```typescript
test('should create booking with valid data', async () => {
  const result = await createBooking(validData)
  expect(result).toBeDefined()
})
```

### 3. Testes de Dashboard
- **Localização**: `src/app/admin/__tests__/dashboard.test.tsx`
- **Cobertura**: Cálculos de estatísticas, renderização de dados
- **Exemplo**:
```typescript
test('should calculate revenue growth correctly', async () => {
  expect(screen.getByText('+25% vs mês anterior')).toBeInTheDocument()
})
```

### 4. Testes E2E (End-to-End)
- **Localização**: `tests/e2e/booking-flow.spec.ts`
- **Cobertura**: Fluxos completos de usuário
- **Exemplo**:
```typescript
test('complete booking flow', async ({ page }) => {
  await page.goto('/barbershops')
  await page.click('[data-testid="barbershop-item"]')
  // ... fluxo completo
})
```

## 📊 Cobertura de Testes

### Metas de Cobertura
- **Linhas**: 50%
- **Funções**: 50%
- **Branches**: 50%
- **Statements**: 50%

### Áreas Críticas com 100% de Cobertura
- ✅ Validações de entrada (Zod schemas)
- ✅ Server Actions principais (create/cancel booking)
- ✅ Cálculos de estatísticas do dashboard
- ✅ Error handling e logging

## 🎯 O Que Está Sendo Testado

### ✅ **Funcionalidades Críticas de Negócio**
1. **Agendamento de Serviços**
   - Validação de dados de entrada
   - Verificação de horários disponíveis
   - Autorização de usuário
   - Cálculo de preços

2. **Cancelamento de Agendamentos**
   - Verificação de propriedade do agendamento
   - Validação de status (não cancelar já cancelados)
   - Update vs Delete (auditoria)

3. **Dashboard Administrativo**
   - Cálculos de receita mensal
   - Taxa de ocupação
   - Crescimento percentual
   - Contagem de agendamentos por status

4. **Validações de Segurança**
   - Sanitização de inputs
   - Validação de emails e senhas
   - Verificação de UUIDs
   - Regras de negócio (horários, datas)

### ✅ **Fluxos de Usuário (E2E)**
1. **Navegação**
   - Página inicial → Barbearias → Detalhes
   - Navegação responsiva
   - Acessibilidade básica

2. **Busca e Filtros**
   - Busca por serviços
   - Resultados de busca

3. **Error Handling**
   - Páginas 404
   - Estados de erro
   - Recuperação de erros

## 🚀 Executando Testes Localmente

### Pré-requisitos
```bash
# Instalar dependências
npm install

# Para testes E2E, instalar navegadores
npx playwright install
```

### Desenvolvimento com Testes
```bash
# Terminal 1: Servidor de desenvolvimento
npm run dev

# Terminal 2: Testes em modo watch
npm run test:watch

# Terminal 3: Testes E2E quando necessário
npm run test:e2e:ui
```

## 📈 CI/CD Pipeline

### GitHub Actions
O pipeline executa automaticamente:

1. **Lint & Type Check**
2. **Unit Tests** com cobertura
3. **Build Test**
4. **E2E Tests**
5. **Security Audit**
6. **Deploy** (apenas no main)

### Quality Gate
O deployment só acontece se **TODOS** os testes passarem:
- ✅ Linting
- ✅ Type checking
- ✅ Unit tests (>50% cobertura)
- ✅ E2E tests
- ✅ Build successful

## 🔧 Configuração de Testes

### Jest Configuration
- **Arquivo**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Mocks**: `src/app/_lib/__mocks__/`

### Playwright Configuration
- **Arquivo**: `playwright.config.ts`
- **Setup Global**: `tests/global-setup.ts`
- **Browsers**: Chrome, Firefox, Safari, Mobile

## 🎯 Casos de Teste Importantes

### Server Actions
```typescript
// ✅ Cenários testados
- Usuário autenticado vs não autenticado
- Dados válidos vs inválidos
- Horários disponíveis vs ocupados
- Barbeiros ativos vs inativos
- Erros de banco de dados
- Autorização (próprio agendamento vs outros)
```

### Validações
```typescript
// ✅ Cenários testados
- Emails válidos e inválidos
- Senhas curtas vs adequadas
- Datas futuras vs passadas
- Horários comerciais vs fora do expediente
- UUIDs válidos vs inválidos
- Sanitização de strings
```

### Dashboard
```typescript
// ✅ Cenários testados
- Cálculos com dados reais
- Divisão por zero
- Crescimento positivo vs negativo
- Estados sem dados
- Formatação de moeda
- Agregações do banco
```

## 📋 Melhores Práticas

### Para Desenvolvedores
1. **Sempre executar testes antes de commit**
2. **Escrever testes para bugs corrigidos**
3. **Manter cobertura acima de 50%**
4. **Testar cenários de erro, não só sucesso**
5. **Usar dados de mock consistentes**

### Estrutura de Testes
```
tests/
├── e2e/                    # Testes End-to-End
│   └── booking-flow.spec.ts
src/
├── app/
│   ├── _actions/__tests__/  # Testes de Server Actions
│   ├── _lib/__tests__/      # Testes de utilitários
│   └── admin/__tests__/     # Testes de componentes
```

---

**Resultado**: Sistema de testes enterprise completo com cobertura das funcionalidades críticas! 🎉