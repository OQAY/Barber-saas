# DIRETRIZES DE DESENVOLVIMENTO PROFISSIONAL - CLAUDE

## MINDSET PRINCIPAL
Trabalhe como um desenvolvedor experiente, priorizando:
- Código limpo e manutenível
- Pragmatismo sobre perfeição
- Entregar valor funcionando

## WORKFLOW DE DESENVOLVIMENTO

### AO INICIAR TAREFAS COMPLEXAS
1. Use TodoWrite para tarefas com 3+ etapas
2. Analise código existente antes de criar novo
3. Planeje a estrutura se for criar múltiplos arquivos
4. Comece simples, refatore depois

### ESTRUTURA DE PROJETO (quando apropriado)
```
project/
├── src/           # Código fonte
├── tests/         # Testes (quando necessário)
├── docs/          # Documentação (se solicitado)
└── config/        # Configurações
```
Para projetos pequenos, estrutura simples está OK.

## PADRÕES DE CÓDIGO REALISTAS

### LIMITES RAZOÁVEIS
- Arquivos: até 500-800 linhas (split se ficar confuso)
- Funções: até 50-80 linhas (menos é melhor, mas seja prático)
- Classes: até 300-400 linhas
- Componentes React: até 200-300 linhas

### QUANDO MODULARIZAR
- Quando o arquivo ficar difícil de navegar
- Quando houver clara separação de responsabilidades
- Quando o código for reutilizado 3+ vezes
- NÃO modularize prematuramente

### NOMENCLATURA
```javascript
// Nomes descritivos mas não exagerados
getUserData()       // Bom
fetchUserProfileDataFromDatabase()  // Muito longo
get()              // Muito genérico
```

### ERROR HANDLING
```javascript
// Básico está OK para projetos simples
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw error; // ou return null/default
}
```

## TESTES - ABORDAGEM PRÁTICA

### QUANDO ESCREVER TESTES
- Lógica de negócio crítica
- Funções com múltiplas condições
- APIs públicas
- Bugs corrigidos (regression tests)

### NÃO PRECISA TESTAR
- Componentes simples de UI
- Wrappers triviais
- Código que vai mudar em breve
- Protótipos/POCs

## GIT - USO REAL

### COMMITS
```bash
# Commits claros mas não precisa ser perfeito
git commit -m "add user authentication"     # OK
git commit -m "fix login bug"               # OK
git commit -m "refactor auth + add tests"   # OK também

# Evite apenas:
git commit -m "changes"                     # Muito genérico
git commit -m "asdfasdf"                    # Sem sentido
```

### FREQUÊNCIA
- Commit quando **uma funcionalidade** funciona
- Não precisa ser a cada 10 linhas
- 1-5 commits por dia é normal

### TAMANHO DE COMMITS
```bash
# BOM - commits focados
git commit -m "add login form"              # 3-8 arquivos
git commit -m "add form validation"         # 2-5 arquivos  
git commit -m "style login page"            # 1-3 arquivos

# RUIM - commits gigantes
git commit -m "add entire auth system"      # 50+ arquivos, 2000+ linhas
git commit -m "refactor everything"         # 100+ arquivos
```

### REGRA PRÁTICA
- **1 funcionalidade = 1 commit**
- **Máximo 20-30 arquivos** por commit
- **Se não consegue explicar em 1 frase**, é grande demais
- **Se levou mais de 1 dia**, deveria ter sido vários commits

### ESTILO DE COMMITS
```bash
# Mensagens claras são mais importantes que decoração
git commit -m "add user login"              # Direto e claro
git commit -m "fix header responsive bug"   # Específico

# Emojis: use se quiser, mas seja consistente
git commit -m "feat: add user login"        # Prefixos convencionais
git commit -m "🐛 fix: header bug"          # Com emoji (se time usar)

# Evite misturar estilos no mesmo projeto
git commit -m "add login"                   # Simples
git commit -m "SUPER NEW FEATURE!!!"        # Inconsistente e exagerado
```

### CONSISTÊNCIA
- **Escolha um estilo** e mantenha no projeto
- **Mensagem clara** > decoração bonita
- **Time define padrão**, não cada um fazendo diferente

### BRANCHES - ABORDAGEM PRÁTICA

#### QUANDO USAR BRANCHES
- **Features novas**: `git checkout -b feature/add-login`
- **Bugs**: `git checkout -b fix/header-mobile` 
- **Experimentos**: `git checkout -b experiment/new-ui`

#### QUANDO NÃO PRECISAR
- **Projetos solo pequenos**: trabalhar na main está OK
- **Protótipos/POCs**: foco é testar ideia, não processo
- **Hotfixes urgentes**: direto na main às vezes é mais rápido

#### WORKFLOW PROFISSIONAL - MERGE CORRETO
```bash
# 1. Criar branch para feature
git checkout -b feature/user-auth

# 2. Trabalhar normalmente (commits pequenos)
git add . && git commit -m "add login form"
git add . && git commit -m "add validation"
git add . && git commit -m "style login page"

# 3. MERGE CORRETO - OBRIGATÓRIO USAR --no-ff
git checkout main
git merge --no-ff feature/user-auth -m "feat: implementa sistema completo de autenticação

- Adiciona formulário de login responsivo
- Implementa validação de campos
- Melhora estilos da página de login
- Testa funcionamento completo"

# 4. Limpeza (opcional)
git branch -d feature/user-auth
```

#### POR QUE USAR --no-ff?
```bash
# ❌ SEM --no-ff (história linear ruim)
* commit 3: style login page
* commit 2: add validation  
* commit 1: add login form
* commit anterior do main

# ✅ COM --no-ff (história rica profissional)
*   feat: implementa sistema completo de autenticação (MERGE)
|\  
| * style login page      ← BRANCH
| * add validation
| * add login form  
|/  
* commit anterior do main
```

#### BENEFÍCIOS DO --no-ff
- **Contexto claro**: cada feature tem início e fim visível
- **Rollback fácil**: pode desfazer feature inteira
- **Histórico profissional**: recruiter vê organização
- **Code review**: facilita revisão de mudanças
- **Release notes**: features agrupadas logicamente

#### NOMENCLATURA SIMPLES
```bash
feature/nome-da-feature    # Nova funcionalidade
fix/nome-do-bug           # Correção de bug  
refactor/nome-da-area     # Refatoração
experiment/nome-do-teste  # Testes/experimentos
```

#### REGRAS DE OURO PARA MERGE
```bash
# ✅ SEMPRE FAZER
git merge --no-ff feature/branch -m "descrição completa do merge"

# ❌ NUNCA FAZER  
git merge feature/branch              # Sem --no-ff = história linear
git reset --hard hash-anterior        # Destrutivo após merge público
git rebase -i                        # Perigoso em commits públicos
```

## BUILD E TOOLING

### CONFIGURAÇÃO BÁSICA
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```
Adicione mais conforme necessidade, não preventivamente.

### QUANDO ADICIONAR
- ESLint: quando o time crescer
- Prettier: se houver discussões sobre formatação
- TypeScript: projetos grandes ou com múltiplos devs
- Testes: quando bugs começarem a aparecer

## DOCUMENTAÇÃO

### ESSENCIAL
- README com instruções de setup
- Comentários em lógica complexa
- JSDoc para APIs públicas

### OPCIONAL
- Documentação extensa
- Diagramas de arquitetura
- Wikis detalhadas

## SEGURANÇA BÁSICA

### SEMPRE
- Variáveis de ambiente para secrets
- Validação de inputs do usuário
- Escape de outputs (XSS)

### QUANDO RELEVANTE
- Rate limiting
- CSRF tokens
- Auditoria completa

## PRAGMATISMO

### ESTÁ OK
- Código que funciona primeiro, otimizar depois
- console.log durante desenvolvimento
- Arquivos grandes se bem organizados
- Pular testes em protótipos
- Commits maiores às vezes
- TODO comments para melhorias futuras

### NÃO ESTÁ OK
- Código completamente ilegível
- Ignorar erros silenciosamente
- Secrets no código
- SQL injection vulnerabilities
- Copy/paste excessivo sem refatorar

## QUANDO USAR CADA ABORDAGEM

### PROJETOS PESSOAIS/PEQUENOS
- Foco em funcionar
- Estrutura simples
- Testes mínimos
- Documentação básica

### PROJETOS MÉDIOS/COMERCIAIS
- Estrutura organizada
- Testes para features principais
- Code review informal
- CI/CD básico

### PROJETOS ENTERPRISE
- Todas as best practices
- Cobertura de testes alta
- Code review obrigatório
- Documentação completa

## OBSERVAÇÕES WINDOWS

### EVITE
- Protocolos internos (_claude_fs_)
- Caminhos com caracteres especiais

### USE
- Comandos padrão (Read, Edit, Bash)
- Caminhos simples
- UTF-8 encoding

## VERIFICAÇÃO

### ANTES DE DECLARAR "PRONTO"
- Código roda sem erros
- Funcionalidade principal funciona
- Não quebrou nada existente

### NÃO PRECISA
- 100% perfeito
- Todos os edge cases cobertos
- Performance otimizada ao máximo

## PROCESSAMENTO DE REQUISITOS - OBRIGATÓRIO

### AO RECEBER QUALQUER PEDIDO DO USUÁRIO

1. **REESCREVA O ENTENDIMENTO**
```
Usuário: "faz um botão que muda de cor"

Meu entendimento:
- Criar um botão interativo
- Implementar mudança de cor ao clicar/hover
- Definir estados visuais diferentes
- Garantir feedback visual ao usuário
```

2. **PLANEJE ANTES DE EXECUTAR**
```
Vou fazer:
1. Criar estrutura HTML do botão
2. Adicionar estilos CSS com transições
3. Implementar JavaScript para interação
4. TESTAR se funciona
5. VERIFICAR resultado visualmente
```

3. **EXECUTE E TESTE SEMPRE**
```bash
# ERRADO - Não verificar
> cria arquivo
> "Pronto!"

# CERTO - Sempre verificar
> cria arquivo
> npm run dev
> verifica no browser/console
> confirma funcionamento
> "Testado e funcionando em localhost:3000"
```

## VERIFICAÇÃO DE RESULTADOS - CRÍTICO

### NUNCA DECLARE "CONCLUÍDO" SEM:

1. **EXECUTAR O CÓDIGO**
```bash
npm run dev         # ou
python script.py    # ou
node index.js       # ou
start index.html
```

2. **VER O OUTPUT REAL**
```bash
# Se o output for vazio/erro:
> "Erro: [descrição]. Vou corrigir..."

# Se funcionar:
> "Verificado: [mostrar output real]"
```

3. **CONFIRMAR VISUALMENTE (quando aplicável)**
```bash
# Para UI/Web:
start http://localhost:3000
# Verificar se elementos aparecem
# Testar interações
# Confirmar comportamento
```

### EXEMPLOS DE VERIFICAÇÃO FALSA (NUNCA FAZER)

```bash
# ERRADO
> bash(start http://localhost:8080)
> (no output)
> "Problema resolvido!"

# CERTO
> bash(start http://localhost:8080)
> bash(curl http://localhost:8080)
> "Servidor respondendo com HTML. Página carregando corretamente."
```

## QUANDO ALGO DÁ ERRADO

### PROCESSO DE DEBUG
1. **LER O ERRO COMPLETO**
2. **ENTENDER A CAUSA**
3. **CORRIGIR**
4. **TESTAR NOVAMENTE**
5. **SÓ ENTÃO declarar resolvido**

### NUNCA:
- Assumir que funcionou sem ver
- Ignorar outputs vazios
- Declarar sucesso com erros pendentes
- Pular etapa de verificação

## COMUNICAÇÃO COM USUÁRIO

### SEJA ESPECÍFICO
```bash
# VAGO
"Feito!"
"Pronto!"
"Resolvido!"

# ESPECÍFICO
"Botão criado e testado. Muda de azul para vermelho ao clicar."
"API rodando na porta 3000. Endpoints /users e /products funcionando."
"Bug corrigido: formulário agora valida email antes de enviar."
```

### MOSTRE EVIDÊNCIAS
```bash
# Sempre inclua:
- Output do terminal
- Resultado de testes
- URL onde está rodando
- Screenshot se relevante
```

---

## RESUMO

**Seja um desenvolvedor PRAGMÁTICO, não um perfeccionista.**

Entregue código que:
1. Funciona
2. É razoavelmente limpo
3. Pode ser mantido
4. Resolve o problema do usuário

Não perca tempo com:
- Over-engineering
- Abstração prematura
- Perfeição desnecessária
- Regras arbitrárias

**O melhor código é o que entrega valor.**

## UI/UX - PROCESSO OBRIGATÓRIO PARA FRONTEND

### ANTES DE ESCREVER QUALQUER CSS/HTML

1. **ENTENDA O USUÁRIO**
```
Quem vai usar? (idade, contexto, device)
O que quer fazer? (objetivo principal)
Onde vai usar? (mobile, desktop, tablet)
Quando vai usar? (pressa, relaxado, multitasking)
```

2. **DEFINA A EXPERIÊNCIA**
```
Estado inicial: Como o usuário chega?
Fluxo principal: Qual o caminho feliz?
Estados de erro: O que acontece quando falha?
Feedback: Como o usuário sabe que deu certo?
```

3. **SISTEMA DE DESIGN BÁSICO**
```css
:root {
  /* Cores com propósito */
  --color-primary: #3b82f6;      /* Ação principal */
  --color-success: #10b981;      /* Sucesso/confirmação */
  --color-warning: #f59e0b;      /* Atenção */
  --color-error: #ef4444;        /* Erro/perigo */
  --color-neutral: #6b7280;      /* Textos secundários */
  
  /* Espaçamento consistente */
  --space-xs: 4px;   --space-sm: 8px;
  --space-md: 16px;  --space-lg: 24px;
  --space-xl: 32px;  --space-2xl: 48px;
  
  /* Typography hierárquica */
  --text-xs: 12px;   --text-sm: 14px;
  --text-base: 16px; --text-lg: 18px;
  --text-xl: 20px;   --text-2xl: 24px;
  
  /* Shadows com profundidade */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Timing de animações */
  --timing-fast: 150ms;
  --timing-normal: 300ms;
  --timing-slow: 500ms;
  
  /* Breakpoints */
  --bp-mobile: 480px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
}
```

### COMPONENTES COM PERSONALIDADE

#### BOTÕES (exemplo obrigatório)
```css
.button {
  /* Base consistente */
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: 8px;
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.025em;
  min-height: 44px; /* touch target */
  cursor: pointer;
  transition: all var(--timing-normal) cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Estados visuais claros */
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: translateY(0);
    transition-duration: var(--timing-fast);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Variants com significado */
  &--primary {
    background: var(--color-primary);
    color: white;
  }
  
  &--danger {
    background: var(--color-error);
    color: white;
  }
  
  &--ghost {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }
}
```

### LAYOUT RESPONSIVO INTELIGENTE

#### QUANDO USAR MOBILE-FIRST (90% dos casos)
- Sites públicos, e-commerce, blogs, landing pages
- Aplicações B2C (consumidor final)
- PWAs e apps modernos
- Qualquer projeto para público geral

#### QUANDO USAR DESKTOP-FIRST (10% dos casos)
- ERPs e sistemas enterprise internos
- Dashboards complexos com muitos dados
- Ferramentas de edição (vídeo, imagem, código)
- Aplicações que EXIGEM tela grande

```css
/* PADRÃO: Mobile-first sempre */
.container {
  /* Mobile base */
  padding: var(--space-md);
  
  /* Tablet+ */
  @media (min-width: 768px) {
    padding: var(--space-lg);
    max-width: 768px;
    margin: 0 auto;
  }
  
  /* Desktop+ */
  @media (min-width: 1024px) {
    max-width: 1200px;
    padding: var(--space-xl);
  }
}

/* Grid responsivo */
.card-grid {
  display: grid;
  gap: var(--space-lg);
  
  /* Responsive sem media queries */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### MICRO-INTERAÇÕES OBRIGATÓRIAS

```css
/* Loading states */
.loading {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

/* Focus visível para acessibilidade */
.interactive:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Hover com feedback */
.card {
  transition: all var(--timing-normal) ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
```

### ACESSIBILIDADE OBRIGATÓRIA

```html
<!-- Labels claros -->
<label for="email">Email Address</label>
<input id="email" type="email" required aria-describedby="email-error">
<div id="email-error" role="alert">Please enter a valid email</div>

<!-- ARIA states -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>

<!-- Skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### PROCESSO UI/UX COMPLETO

```
1. WIREFRAME mental (mesmo simples):
   [Header] [Nav] [Content] [Footer]

2. DEFINA HIERARQUIA visual:
   O que é mais importante? (tamanho, cor, posição)

3. PENSE EM ESTADOS:
   - Loading
   - Empty state
   - Error state
   - Success state

4. TESTE RESPONSIVO:
   - 320px (mobile pequeno)
   - 768px (tablet)
   - 1200px (desktop)

5. TESTE ACESSIBILIDADE:
   - Tab navigation
   - Screen reader
   - High contrast
```

### FERRAMENTAS DE REFERÊNCIA

```css
/* Paletas harmoniosas */
/* https://coolors.co - para cores */
/* https://type-scale.com - para typography */
/* https://shadows.brumm.af - para shadows */

/* Sistema de cores semântico */
--color-text-primary: #111827;     /* Texto principal */
--color-text-secondary: #6b7280;   /* Texto secundário */
--color-background: #ffffff;       /* Fundo principal */
--color-surface: #f9fafb;         /* Cards, modals */
--color-border: #e5e7eb;          /* Bordas sutis */
```

### QUANDO ALGO "NÃO FICA BOM"

```
1. Analise a hierarquia visual:
   - O que deveria ter destaque tem destaque?

2. Verifique espaçamento:
   - Elementos relacionados estão próximos?
   - Há breathing room suficiente?

3. Avalie contraste:
   - Texto legível?
   - Botões se destacam?

4. Teste o fluxo:
   - É intuitivo?
   - Usuário se perde?
```