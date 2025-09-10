# Issue #1: Conflitos no Sistema de Autenticação Híbrida

## 📋 **Resumo do Problema**

O FSW Barber possui um sistema de autenticação híbrido (NextAuth + Custom JWT) que pode gerar conflitos na experiência do usuário quando existem contas duplicadas ou sobrepostas entre diferentes provedores.

## 🚨 **Problemas Identificados**

### **1. Conflito de Contas com Mesmo Email**
**Cenário:** Usuário tem conta Google e tenta registrar conta customizada com mesmo email

**Problema Atual:**
- Sistema permite criar duas contas com mesmo email
- User não consegue acessar dados de ambas as contas
- Confusão sobre qual método de login usar

**Impacto:** Alto - Perda de dados do usuário e frustração

### **2. Sistema de Recuperação de Senha Incompleto**
**Cenário:** Usuário esquece senha mas não sabe se conta é Google ou Custom

**Problema Atual:**
- Não há sistema "Esqueci minha senha"
- Usuário não sabe qual método de autenticação foi usado
- Impossível recuperar acesso à conta custom

**Impacto:** Alto - Perda permanente de acesso à conta

### **3. Busca por Telefone Inexistente**
**Cenário:** Usuário lembra telefone mas esqueceu email associado

**Problema Atual:**
- Não há forma de buscar conta por telefone
- Usuário não consegue recuperar email associado
- Pode criar conta duplicada com mesmo telefone

**Impacto:** Médio - Duplicação de dados e confusão

## 🎯 **Estratégias de Solução**

### **Estratégia 1: Unificação de Contas** 
**Prioridade:** 🔴 Alta

**Implementação:**
```typescript
// Detecção durante registro
async function registerUser(email, password, userData) {
  const existingUser = await findUserByEmail(email);
  
  if (existingUser && existingUser.provider === 'google') {
    // Converter conta Google para híbrida
    return await upgradeToHybridAccount(existingUser, password, userData);
  }
  
  // Criar nova conta custom
  return await createCustomAccount(email, password, userData);
}

async function upgradeToHybridAccount(user, password, userData) {
  const hashedPassword = await bcrypt.hash(password, 12);
  
  return await updateUser(user.id, {
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    provider: 'hybrid', // Google + Custom
    isVerified: true // Já verificado pelo Google
  });
}
```

**UX Flow:**
1. User digita email existente no registro
2. Sistema detecta: "Encontramos conta Google com este email"
3. Opções: "Conectar conta Google" ou "Adicionar senha a esta conta"
4. Se escolher adicionar senha → converte para híbrida

### **Estratégia 2: Sistema de Recuperação Inteligente**
**Prioridade:** 🟡 Média

**Implementação:**
```typescript
// API: /api/auth/forgot-password
export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const user = await findUserByEmail(email);
  
  if (!user) {
    return NextResponse.json({ error: "Email não encontrado" }, { status: 404 });
  }
  
  switch(user.provider) {
    case 'google':
      return NextResponse.json({ 
        message: "Esta conta usa Google. Clique em 'Entrar com Google'",
        provider: 'google'
      });
      
    case 'custom':
    case 'hybrid':
      const resetToken = generateResetToken();
      await saveResetToken(user.id, resetToken);
      await sendPasswordResetEmail(email, resetToken);
      
      return NextResponse.json({ 
        message: "Email de recuperação enviado",
        provider: user.provider
      });
  }
}
```

**Serviço de Email (Resend - Gratuito):**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  await resend.emails.send({
    from: 'noreply@fswbarber.com',
    to: email,
    subject: 'Recuperação de Senha - FSW Barber',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou recuperação de senha para sua conta FSW Barber.</p>
        <a href="${resetUrl}" 
           style="background: #3b82f6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Redefinir Senha
        </a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou isso, ignore este email.</p>
      </div>
    `
  });
}
```

### **Estratégia 3: Busca por Telefone**
**Prioridade:** 🟢 Baixa

**Implementação:**
```typescript
// API: /api/auth/find-account
export async function POST(request: NextRequest) {
  const { phone } = await request.json();
  const user = await findUserByPhone(phone);
  
  if (!user) {
    return NextResponse.json({ error: "Telefone não encontrado" }, { status: 404 });
  }
  
  return NextResponse.json({
    email: maskEmail(user.email), // joão****@gmail.com
    hasPassword: !!user.password,
    provider: user.provider,
    canResetPassword: user.provider !== 'google'
  });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, 3) + '*'.repeat(local.length - 3);
  return `${maskedLocal}@${domain}`;
}
```

**UX Flow:**
1. Link "Esqueci meu email" na tela de login
2. User digita telefone
3. Sistema mostra email mascarado: "joão****@gmail.com"
4. Opção: "Enviar link de acesso por email"
5. Email enviado com token de login automático

### **Estratégia 4: Login Inteligente**
**Prioridade:** 🟡 Média

**Implementação:**
```typescript
// Componente de Login Adaptativo
export default function SmartLoginForm() {
  const [email, setEmail] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  
  const checkAccountType = async (email: string) => {
    const response = await fetch('/api/auth/check-account', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      const info = await response.json();
      setAccountInfo(info);
    }
  };
  
  return (
    <form>
      <Input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => checkAccountType(email)}
        placeholder="Email"
      />
      
      {accountInfo && (
        <div className="mt-4 space-y-2">
          {accountInfo.hasPassword && (
            <Button type="button">Entrar com Senha</Button>
          )}
          {accountInfo.hasGoogle && (
            <Button type="button">Entrar com Google</Button>
          )}
          {accountInfo.provider === 'google' && !accountInfo.hasPassword && (
            <p className="text-sm text-gray-600">
              Esta conta usa apenas Google
            </p>
          )}
        </div>
      )}
    </form>
  );
}
```

## 🛠️ **Implementação por Fases**

### **Fase 1: Correções Críticas** (Sprint 1)
- [ ] Unificação de contas Google → Híbrida
- [ ] Detecção de conflitos no registro
- [ ] UX para conectar contas existentes

### **Fase 2: Sistema de Recuperação** (Sprint 2)
- [ ] API de "Esqueci minha senha"
- [ ] Integração com Resend para emails
- [ ] Páginas de reset de senha
- [ ] Detecção inteligente de tipo de conta

### **Fase 3: Funcionalidades Avançadas** (Sprint 3)
- [ ] Busca por telefone
- [ ] Login inteligente/adaptativo
- [ ] Dashboard de gerenciamento de conta
- [ ] Opção de desconectar provedores

## 📊 **Métricas de Sucesso**

**Antes da Implementação:**
- Conflitos de conta: Não medido (problema silencioso)
- Suporte relacionado a login: ~30% dos tickets
- Abandono no registro: ~15%

**Após Implementação (Metas):**
- Conflitos de conta: 0%
- Suporte relacionado a login: <10% dos tickets  
- Abandono no registro: <8%
- Taxa de recuperação de senha: >90%

## 🔗 **Dependências Técnicas**

### **Serviços Externos:**
- **Resend** (Email): 3000 emails/mês gratuitos
- **Banco de dados**: Novas tabelas para tokens de reset
- **Variáveis de ambiente**: RESEND_API_KEY

### **Alterações de Schema:**
```sql
-- Tabela para tokens de reset
CREATE TABLE password_reset_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Atualizar tabela users
ALTER TABLE users ADD COLUMN provider VARCHAR(50) DEFAULT 'email';
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false;
```

## 🎛️ **Configuração**

### **Variáveis de Ambiente:**
```env
# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxx

# URLs
NEXTAUTH_URL=http://localhost:3000
RESET_PASSWORD_URL=http://localhost:3000/reset-password

# Tokens
RESET_TOKEN_EXPIRY=3600 # 1 hora em segundos
```

### **Pacotes Necessários:**
```json
{
  "dependencies": {
    "resend": "^3.0.0",
    "crypto": "built-in",
    "@types/crypto": "^1.0.0"
  }
}
```

## 📝 **Notas de Implementação**

1. **Segurança:** Tokens de reset devem expirar em 1 hora máximo
2. **UX:** Sempre informar o usuário sobre qual tipo de conta ele tem
3. **Performance:** Cache de verificação de contas por 5 minutos
4. **Logs:** Registrar todas as tentativas de unificação de contas
5. **Testes:** Criar cenários de teste para todos os fluxos híbridos

## 📚 **Referências**

- [Resend Documentation](https://resend.com/docs)
- [NextAuth Callbacks](https://next-auth.js.org/configuration/callbacks)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Account Linking Patterns](https://auth0.com/docs/manage-users/user-accounts/user-account-linking)

---

**Status:** 📋 Documentado - Aguardando implementação
**Última atualização:** 2025-09-09
**Responsável:** Desenvolvimento FSW Barber