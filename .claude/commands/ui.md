# /ui - Criar Interface Profissional

Você é um designer/desenvolvedor criando interfaces excepcionais. Siga este processo rigorosamente.

## 🎯 PROCESSO OBRIGATÓRIO DE UI/UX

### PASSO 1: ENTENDA O CONTEXTO
Antes de qualquer código, defina:
```
USUÁRIO:
- Quem: [idade, profissão, tech-savvy]
- Onde: [mobile 70% | desktop 30%]
- Quando: [pressa, trabalho, lazer]
- Objetivo: [o que quer fazer]

DISPOSITIVO PRINCIPAL:
- [ ] Mobile (use mobile-first)
- [ ] Desktop (casos específicos: ERP, dashboards complexos)
```

### PASSO 2: DEFINA A JORNADA
```
1. Como chega → 2. O que vê → 3. O que faz → 4. Como sabe que deu certo
```

### PASSO 3: SISTEMA DE DESIGN BASE

```css
:root {
  /* 1. CORES SEMÂNTICAS (não random) */
  --primary: #3b82f6;        /* Ação principal */
  --primary-dark: #2563eb;   /* Hover */
  --secondary: #8b5cf6;      /* Ação secundária */
  --success: #10b981;        /* Sucesso */
  --warning: #f59e0b;        /* Atenção */
  --danger: #ef4444;         /* Erro/Delete */
  --info: #06b6d4;          /* Informação */
  
  /* Neutros */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* 2. ESPAÇAMENTO (Sistema 8pt) */
  --s1: 0.25rem;  /* 4px */
  --s2: 0.5rem;   /* 8px */
  --s3: 0.75rem;  /* 12px */
  --s4: 1rem;     /* 16px */
  --s5: 1.25rem;  /* 20px */
  --s6: 1.5rem;   /* 24px */
  --s8: 2rem;     /* 32px */
  --s10: 2.5rem;  /* 40px */
  --s12: 3rem;    /* 48px */
  --s16: 4rem;    /* 64px */
  
  /* 3. TIPOGRAFIA (Escala modular) */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* 4. SOMBRAS (Elevação real) */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* 5. BORDAS */
  --radius-sm: 0.25rem;   /* 4px */
  --radius: 0.375rem;     /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Pill */
  
  /* 6. ANIMAÇÕES */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
  
  /* 7. BREAKPOINTS */
  --mobile: 480px;
  --tablet: 768px;
  --laptop: 1024px;
  --desktop: 1280px;
}
```

### PASSO 4: COMPONENTES OBRIGATÓRIOS

#### 🔘 BOTÕES (Todos os estados)
```css
.btn {
  /* Base sólida */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s2);
  padding: var(--s3) var(--s6);
  min-height: 44px; /* Touch target */
  
  /* Visual */
  font-weight: 600;
  font-size: var(--text-base);
  line-height: 1;
  letter-spacing: 0.025em;
  text-decoration: none;
  white-space: nowrap;
  
  /* Interação */
  cursor: pointer;
  user-select: none;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  transition: all var(--duration-base) var(--ease-out);
  
  /* Estados */
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    transition-duration: var(--duration-fast);
  }
  
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Variantes */
  &--primary {
    background: var(--primary);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
  }
  
  &--secondary {
    background: var(--gray-200);
    color: var(--gray-800);
    
    &:hover:not(:disabled) {
      background: var(--gray-300);
    }
  }
  
  &--ghost {
    background: transparent;
    color: var(--primary);
    border-color: currentColor;
    
    &:hover:not(:disabled) {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
  }
  
  &--danger {
    background: var(--danger);
    color: white;
    
    &:hover:not(:disabled) {
      background: #dc2626;
    }
  }
  
  /* Tamanhos */
  &--sm {
    padding: var(--s2) var(--s4);
    font-size: var(--text-sm);
    min-height: 36px;
  }
  
  &--lg {
    padding: var(--s4) var(--s8);
    font-size: var(--text-lg);
    min-height: 52px;
  }
  
  /* Loading */
  &--loading {
    position: relative;
    color: transparent !important;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid white;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### 📝 FORMULÁRIOS (Acessíveis)
```css
.form-group {
  margin-bottom: var(--s6);
  
  label {
    display: block;
    margin-bottom: var(--s2);
    font-weight: 500;
    font-size: var(--text-sm);
    color: var(--gray-700);
    
    .required {
      color: var(--danger);
      margin-left: var(--s1);
    }
  }
  
  input,
  textarea,
  select {
    width: 100%;
    padding: var(--s3) var(--s4);
    font-size: var(--text-base);
    line-height: 1.5;
    color: var(--gray-900);
    background: white;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    transition: all var(--duration-fast) var(--ease-out);
    
    &:hover {
      border-color: var(--gray-400);
    }
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &:disabled {
      background: var(--gray-50);
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    &[aria-invalid="true"] {
      border-color: var(--danger);
      
      &:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .help-text {
    margin-top: var(--s2);
    font-size: var(--text-sm);
    color: var(--gray-600);
  }
  
  .error-message {
    margin-top: var(--s2);
    font-size: var(--text-sm);
    color: var(--danger);
    display: flex;
    align-items: center;
    gap: var(--s2);
    
    &::before {
      content: '⚠';
    }
  }
}
```

#### 🃏 CARDS (Versáteis)
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--duration-base) var(--ease-out);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  &__header {
    padding: var(--s6);
    border-bottom: 1px solid var(--gray-100);
    
    h3 {
      margin: 0;
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--gray-900);
    }
  }
  
  &__body {
    padding: var(--s6);
  }
  
  &__footer {
    padding: var(--s4) var(--s6);
    background: var(--gray-50);
    border-top: 1px solid var(--gray-100);
    display: flex;
    justify-content: flex-end;
    gap: var(--s3);
  }
  
  /* Variante clicável */
  &--clickable {
    cursor: pointer;
    
    &:active {
      transform: scale(0.98);
    }
  }
}
```

### PASSO 5: LAYOUT RESPONSIVO

```css
/* MOBILE-FIRST SEMPRE (exceto ERPs complexos) */
.container {
  width: 100%;
  padding: var(--s4);
  margin: 0 auto;
  
  /* Tablet */
  @media (min-width: 768px) {
    padding: var(--s6);
    max-width: 768px;
  }
  
  /* Laptop */
  @media (min-width: 1024px) {
    padding: var(--s8);
    max-width: 1024px;
  }
  
  /* Desktop */
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
}

/* Grid inteligente */
.grid {
  display: grid;
  gap: var(--s6);
  
  /* Auto-responsive sem media queries */
  &--auto {
    grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  }
  
  /* Com breakpoints específicos */
  &--responsive {
    grid-template-columns: 1fr;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

### PASSO 6: ESTADOS VISUAIS

```css
/* Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--radius);
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--s16) var(--s8);
  
  &__icon {
    font-size: var(--text-4xl);
    color: var(--gray-400);
    margin-bottom: var(--s4);
  }
  
  &__title {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--s2);
  }
  
  &__description {
    color: var(--gray-600);
    margin-bottom: var(--s6);
  }
}

/* Error State */
.error-state {
  padding: var(--s4);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: var(--danger);
  
  &__title {
    font-weight: 600;
    margin-bottom: var(--s2);
  }
}

/* Success State */
.success-state {
  padding: var(--s4);
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  color: var(--success);
}
```

### PASSO 7: MICRO-INTERAÇÕES

```css
/* Links */
a {
  color: var(--primary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

/* Tooltips */
[data-tooltip] {
  position: relative;
  
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    padding: var(--s2) var(--s3);
    background: var(--gray-900);
    color: white;
    font-size: var(--text-sm);
    white-space: nowrap;
    border-radius: var(--radius);
    opacity: 0;
    pointer-events: none;
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  &:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(-12px);
  }
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Focus trap para modais */
.focus-trap {
  &:focus {
    outline: none;
  }
}
```

### PASSO 8: ACESSIBILIDADE

```html
<!-- Estrutura semântica -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <ul>
      <li><a href="#home">Home</a></li>
    </ul>
  </nav>
</header>

<main role="main" id="main-content">
  <article>
    <h1>Título Principal</h1>
  </article>
</main>

<footer role="contentinfo">
  <p>&copy; 2024</p>
</footer>

<!-- Formulário acessível -->
<form>
  <div class="form-group">
    <label for="email">
      Email <span class="required" aria-label="required">*</span>
    </label>
    <input 
      type="email" 
      id="email" 
      name="email"
      required
      aria-required="true"
      aria-invalid="false"
      aria-describedby="email-help email-error"
    />
    <span id="email-help" class="help-text">
      We'll never share your email
    </span>
    <span id="email-error" class="error-message" role="alert" hidden>
      Please enter a valid email
    </span>
  </div>
  
  <button type="submit" class="btn btn--primary">
    Submit
  </button>
</form>

<!-- Skip navigation -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: var(--s2) var(--s4);
  text-decoration: none;
  border-radius: var(--radius);
  
  &:focus {
    top: var(--s2);
  }
}
</style>
```

### PASSO 9: DARK MODE (Opcional mas valorizado)

```css
/* Detecta preferência do sistema */
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #18181b;
    --gray-100: #27272a;
    --gray-200: #3f3f46;
    --gray-300: #52525b;
    --gray-400: #71717a;
    --gray-500: #a1a1aa;
    --gray-600: #d4d4d8;
    --gray-700: #e4e4e7;
    --gray-800: #f4f4f5;
    --gray-900: #fafafa;
    
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  }
  
  body {
    background: var(--gray-900);
    color: var(--gray-100);
  }
  
  .card {
    background: var(--gray-800);
    box-shadow: var(--shadow);
  }
}

/* Toggle manual */
[data-theme="dark"] {
  /* mesmas variáveis do dark mode */
}
```

## 📋 CHECKLIST DE ENTREGA

### ANTES DE DECLARAR "UI PRONTA"

**Visual:**
- [ ] Hierarquia clara (tamanhos, cores, espaços)
- [ ] Contraste adequado (WCAG AA: 4.5:1 texto, 3:1 grandes)
- [ ] Espaçamento consistente (sistema 8pt)
- [ ] Estados visuais (hover, focus, active, disabled, loading)

**Responsividade:**
- [ ] Mobile: 320px, 375px, 414px
- [ ] Tablet: 768px, 834px
- [ ] Desktop: 1024px, 1280px, 1440px
- [ ] Sem scroll horizontal
- [ ] Touch targets ≥ 44px

**Interação:**
- [ ] Feedback imediato em ações
- [ ] Loading states
- [ ] Error handling visual
- [ ] Success feedback
- [ ] Micro-animações suaves

**Acessibilidade:**
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] Focus visível
- [ ] ARIA labels corretos
- [ ] Alt text em imagens
- [ ] Contraste suficiente

**Performance:**
- [ ] CSS otimizado (<50kb)
- [ ] Animações em GPU (transform, opacity)
- [ ] Fonts otimizadas
- [ ] Images lazy loading

## 🚀 EXEMPLO COMPLETO

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Profissional</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Skip Link -->
  <a href="#main" class="skip-link">Pular para conteúdo</a>
  
  <!-- Header -->
  <header class="header">
    <div class="container">
      <nav class="nav" aria-label="Principal">
        <a href="/" class="logo">Logo</a>
        <ul class="nav__list">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <!-- Main -->
  <main id="main" class="main">
    <div class="container">
      <!-- Hero -->
      <section class="hero">
        <h1>Título Principal</h1>
        <p>Descrição clara do valor</p>
        <button class="btn btn--primary btn--lg">
          Começar Agora
        </button>
      </section>
      
      <!-- Cards Grid -->
      <section class="grid grid--auto">
        <article class="card card--clickable">
          <div class="card__body">
            <h3>Feature 1</h3>
            <p>Descrição</p>
          </div>
        </article>
      </section>
    </div>
  </main>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 Company</p>
    </div>
  </footer>
</body>
</html>
```

## RESULTADO ESPERADO

Uma interface que:
1. **Funciona** em qualquer dispositivo
2. **Comunica** claramente
3. **Responde** rapidamente
4. **Agrada** visualmente
5. **Acessível** para todos

NUNCA entregue UI sem testar em múltiplos dispositivos e confirmar todos os estados visuais.