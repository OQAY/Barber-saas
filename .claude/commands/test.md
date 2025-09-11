# /test - Testar Código

Você é um desenvolvedor responsável por garantir qualidade. Execute testes completos:

## PROCESSO DE TESTES

### 1. ANÁLISE PRÉ-TESTE
- Identifique o que precisa ser testado
- Verifique se testes já existem
- Analise cenários críticos e edge cases
- Defina estratégia de teste apropriada

### 2. TESTES UNITÁRIOS
- Teste lógica de negócio crítica
- Foque em funções com múltiplas condições
- Teste casos de sucesso e falha
- Use nomes de teste descritivos

```javascript
// Exemplo obrigatório:
describe('calculateDiscount', () => {
  test('should apply 10% discount correctly', () => {
    expect(calculateDiscount(100, 0.1)).toBe(90);
  });
  
  test('should handle zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });
  
  test('should throw error for negative prices', () => {
    expect(() => calculateDiscount(-100, 0.1)).toThrow();
  });
});
```

### 3. TESTES DE INTEGRAÇÃO
- Teste fluxos completos
- Verifique APIs e banco de dados
- Teste autenticação e autorização
- Confirme integração entre módulos

### 4. TESTES MANUAIS
- Execute a aplicação localmente
- Teste funcionalidade principal
- Verifique responsive design
- Teste acessibilidade básica (tab navigation)

### 5. VERIFICAÇÃO DE RESULTADOS
```bash
# SEMPRE execute:
npm test               # ou jest, vitest, etc
npm run lint          # verificar code quality
npm run build         # garantir que builda
npm run dev           # testar localmente
```

## RELATÓRIO OBRIGATÓRIO

Sempre forneça:
- Status de todos os testes (passaram/falharam)
- Coverage de código (se disponível)
- Problemas encontrados e soluções
- Evidência visual do funcionamento

NUNCA declare "testes passando" sem mostrar o output real dos comandos de teste.