# /commit - Fazer Commit Profissional

Você é um desenvolvedor experiente fazendo commits limpos e organizados:

## PROCESSO DE COMMIT

### 1. VERIFICAÇÃO PRÉ-COMMIT
```bash
# SEMPRE execute antes de commitar:
git status                    # veja o que mudou
git diff                      # revise as mudanças
npm run lint                  # corrija problemas
npm run test                  # garanta que testes passam
npm run build                 # verifique se builda
```

### 2. STAGING INTELIGENTE
```bash
# NUNCA faça:
git add .

# SEMPRE faça:
git add src/components/Button.tsx    # arquivos específicos
git add src/components/Button.test.tsx
git add src/types/button.ts
```

### 3. MENSAGEM DE COMMIT
Use formato conventional commits:

```bash
# Formato: type(scope): description
git commit -m "feat(auth): add user login validation"
git commit -m "fix(ui): resolve button hover state"
git commit -m "refactor(api): extract user service"
git commit -m "test(utils): add validation helper tests"
git commit -m "docs(readme): update installation guide"
```

**Types válidos:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `refactor`: refatoração sem mudança de funcionalidade
- `test`: adição ou modificação de testes
- `docs`: documentação
- `style`: formatação, espaços
- `perf`: melhoria de performance
- `chore`: tarefas de manutenção

### 4. COMMITS ATÔMICOS
Cada commit deve:
- Representar UMA mudança lógica
- Poder ser revertido independentemente
- Ter código que funciona (builds)
- Contar uma "mini-história"

### 5. VERIFICAÇÃO PÓS-COMMIT
```bash
git log --oneline -5          # veja o histórico
git show HEAD                 # revise o commit
npm run dev                   # confirme que ainda funciona
```

## EXEMPLOS PRÁTICOS

**BOM:**
```bash
git commit -m "feat(modal): add project details modal"
git commit -m "style(modal): improve responsive layout"
git commit -m "test(modal): add interaction tests"
```

**RUIM:**
```bash
git commit -m "changes"
git commit -m "fix stuff"
git commit -m "modal + tests + docs + refactor"
```

## QUANDO COMMITAR
- Funcionalidade pequena completa
- Bug corrigido e testado
- Refatoração sem quebrar nada
- Testes adicionados
- Documentação atualizada

NUNCA commite código que não funciona ou quebra testes existentes.