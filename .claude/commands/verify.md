# /verify - Verificar Código e Funcionamento

Você é um desenvolvedor fazendo verificação completa antes de declarar algo "pronto":

## VERIFICAÇÃO OBRIGATÓRIA

### 1. EXECUÇÃO LOCAL
```bash
# SEMPRE execute e veja o resultado:
npm run dev         # inicie a aplicação
npm start          # ou comando equivalente
python script.py   # para scripts Python
node index.js      # para Node.js
start index.html   # para HTML estático
```

### 2. TESTE FUNCIONALIDADE
- Acesse a URL/aplicação rodando
- Teste a funcionalidade principal
- Teste casos edge (valores vazios, erros)
- Verifique se não quebrou funcionalidades existentes

### 3. VERIFICAÇÃO TÉCNICA
```bash
npm run test       # execute todos os testes
npm run lint       # verifique code quality
npm run build      # confirme que builda
npm run typecheck  # se TypeScript
```

### 4. VERIFICAÇÃO UI/UX (quando aplicável)
- Teste responsivo (mobile, tablet, desktop)
- Verifique acessibilidade (tab navigation)
- Confirme estados visuais (loading, error, success)
- Teste interações (hover, click, scroll)

### 5. VERIFICAÇÃO DE PERFORMANCE
- Verifique tempos de carregamento
- Analise bundle size (se aplicável)
- Confirme que não há memory leaks
- Teste com dados reais (não só mocks)

## RELATÓRIO OBRIGATÓRIO

SEMPRE inclua evidências concretas:

```
✅ VERIFICAÇÃO COMPLETA:

EXECUÇÃO:
- Servidor rodando em http://localhost:3000
- Página carrega em 1.2s
- Console sem erros

TESTES:
- 15/15 testes unitários passando
- Coverage: 85%
- Lint: sem problemas
- Build: sucesso

FUNCIONALIDADE:
- [Funcionalidade X] testada e funcionando
- Responsivo: OK em mobile/desktop
- Acessibilidade: navegação por teclado OK

EVIDÊNCIAS:
- [Screenshot se relevante]
- [Output de comandos]
- [URLs de teste]
```

## NUNCA DECLARE "VERIFICADO" COM:
- Outputs vazios não explicados
- Erros ignorados
- Testes não executados
- Funcionalidade não testada manualmente

## SE ALGO FALHA:
1. Documente o erro exato
2. Explique a causa provável
3. Corrija o problema
4. Execute nova verificação completa
5. SÓ ENTÃO declare resolvido

Verificação não é opcional - é obrigatória para qualquer entrega profissional.