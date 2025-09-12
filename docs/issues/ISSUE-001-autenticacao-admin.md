# ISSUE-001: Sistema de Autenticação Admin

**Status:** 🔴 Pendente  
**Prioridade:** CRÍTICA  
**Estimativa:** 4-6 horas

## 📋 Descrição
Implementar sistema de autenticação separado para área administrativa, com controle de acesso baseado em roles (OWNER, MANAGER) e proteção de rotas.

## 🎯 Objetivos
- [ ] Criar página de login dedicada para admin
- [ ] Implementar middleware de proteção de rotas
- [ ] Adicionar verificação de roles no banco
- [ ] Criar layout específico para área admin
- [ ] Implementar logout seguro
- [ ] Adicionar "Lembrar de mim" (opcional)

## 📝 Tarefas Detalhadas

### 1. Estrutura de Arquivos
```
src/app/admin/
├── layout.tsx           # Layout com verificação de auth
├── login/
│   └── page.tsx        # Página de login
├── _middleware/
│   └── auth.ts         # Middleware de proteção
└── _components/
    └── admin-header.tsx # Header com info do admin
```

### 2. Página de Login (`/admin/login`)
- Formulário com email e senha
- Validação de campos
- Mensagens de erro claras
- Redirecionamento após login bem-sucedido
- Design diferenciado do login de cliente

### 3. Middleware de Autenticação
```typescript
// Verificar se usuário está logado
// Verificar se tem role OWNER ou MANAGER
// Redirecionar para login se não autorizado
```

### 4. Atualização do Schema Prisma
```prisma
model User {
  // ... campos existentes
  role UserRole @default(USER)
}

enum UserRole {
  USER
  BARBER
  MANAGER
  OWNER
}
```

### 5. Server Actions
- `authenticateAdmin`: Validar credenciais admin
- `getAdminSession`: Recuperar sessão admin
- `logoutAdmin`: Limpar sessão admin

### 6. Layout Admin
- Sidebar com menu de navegação
- Header com nome do admin e botão logout
- Breadcrumbs para navegação
- Tema visual diferenciado

## 🔧 Implementação Técnica

### Tecnologias
- **NextAuth**: Configurar provider específico para admin
- **bcrypt**: Hash de senhas
- **JWT**: Tokens de sessão
- **Cookies**: httpOnly e secure

### Fluxo de Autenticação
1. Admin acessa `/admin`
2. Middleware verifica sessão
3. Se não autenticado → redireciona para `/admin/login`
4. Login bem-sucedido → cria sessão → redireciona para `/admin`
5. Todas rotas `/admin/*` protegidas pelo middleware

## ✅ Critérios de Aceitação
- [ ] Admin consegue fazer login com email/senha
- [ ] Apenas roles OWNER/MANAGER acessam área admin
- [ ] Sessão persiste após refresh da página
- [ ] Logout limpa sessão completamente
- [ ] Rotas protegidas redirecionam para login
- [ ] Mensagens de erro apropriadas

## 🧪 Testes
- Login com credenciais válidas
- Login com credenciais inválidas
- Acesso sem autenticação
- Acesso com role USER (deve ser negado)
- Persistência de sessão
- Logout e redirecionamento

## 📚 Referências
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Middleware Next.js 14](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 💡 Notas
- Considerar 2FA no futuro
- Logs de acesso para auditoria
- Timeout de sessão configurável