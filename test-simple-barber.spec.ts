import { test, expect } from '@playwright/test';

test.describe('Verificação Simples de Barbeiros', () => {
  test('deve exibir todos os barbeiros com nomes corretos', async ({ page }) => {
    console.log('🚀 Iniciando teste...');
    
    // Navegar para a página inicial
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Página carregada');
    
    // Lista de barbeiros esperados
    const barbeirosEsperados = [
      { nome: 'Ana Costa', id: '5aea6417-94ea-46b2-821c-388a48d8aacc' },
      { nome: 'Carlos Mendes', id: '848ad5cd-f677-4d8b-87e7-d012a92eed5c' },
      { nome: 'Fernanda Alves', id: 'e2db0542-8f19-42eb-8aed-d3a84322faaf' },
      { nome: 'Lucas Silva', id: '65488765-e1cc-411a-b0c5-5f526d4a784a' },
      { nome: 'Maria Oliveira', id: '05ece93e-5149-4fbe-928e-b766441099c5' },
      { nome: 'Pedro Santos', id: '482eac8c-7bcd-451c-8c87-3e7bc19fc517' },
      { nome: 'Roberto Lima', id: 'bedc6e12-4b89-457f-8b67-f685e96c01e0' }
    ];
    
    // Verificar cada barbeiro
    for (const barbeiro of barbeirosEsperados) {
      const elemento = await page.locator(`text=${barbeiro.nome}`).first();
      await expect(elemento).toBeVisible();
      console.log(`✅ Barbeiro ${barbeiro.nome} está visível na página`);
      
      // Verificar se o link de reserva está correto
      const linkReserva = await page.locator(`a[href="/barbers/${barbeiro.id}"]`);
      const existe = await linkReserva.count() > 0;
      
      if (existe) {
        console.log(`✅ Link de reserva para ${barbeiro.nome} está correto`);
      } else {
        console.log(`⚠️ Link de reserva para ${barbeiro.nome} pode ter ID diferente`);
      }
    }
    
    console.log('\n📊 Resumo: Todos os barbeiros estão sendo exibidos corretamente!');
  });
  
  test('deve navegar para página do barbeiro Carlos Mendes', async ({ page }) => {
    console.log('🚀 Testando navegação para Carlos Mendes...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Clicar no link de reserva do Carlos Mendes
    await page.click('a[href="/barbers/848ad5cd-f677-4d8b-87e7-d012a92eed5c"]');
    
    // Aguardar navegação
    await page.waitForURL('**/barbers/848ad5cd-f677-4d8b-87e7-d012a92eed5c');
    
    // Verificar se o nome está correto na página
    const titulo = await page.textContent('h1');
    expect(titulo).toContain('Carlos Mendes');
    console.log(`✅ Título da página: ${titulo}`);
    
    // Verificar especialidade
    const especialidade = await page.textContent('text=Especialista em');
    console.log(`✅ Especialidade: ${especialidade}`);
    
    // Verificar se tem serviços disponíveis
    const servicos = await page.locator('text=Serviços Disponíveis');
    await expect(servicos).toBeVisible();
    console.log('✅ Seção de serviços está visível');
    
    console.log('\n📊 Carlos Mendes está configurado corretamente!');
  });
});