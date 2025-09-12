import { test, expect } from '@playwright/test';

test.describe('Sistema de Reservas de Barbeiro', () => {
  test('deve mostrar o nome correto do barbeiro na reserva', async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('http://localhost:3000');
    
    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');
    
    // Clicar no botão Reservar do barbeiro Carlos Mendes
    await page.locator('text=Carlos Mendes').first().click();
    await page.click('a[href="/barbers/848ad5cd-f677-4d8b-87e7-d012a92eed5c"]');
    
    // Aguardar a página do barbeiro carregar
    await page.waitForURL('**/barbers/**');
    
    // Verificar se o nome do barbeiro está correto na página
    const barberName = await page.textContent('h1');
    expect(barberName).toContain('Carlos Mendes');
    
    // Verificar se a especialidade está visível
    const specialty = await page.textContent('text=Especialista em');
    console.log('Especialidade encontrada:', specialty);
    
    // Clicar em um serviço para reservar
    await page.locator('button:has-text("Reservar")').first().click();
    
    // Se não estiver logado, será redirecionado para login
    if (page.url().includes('/login')) {
      console.log('Redirecionado para login - fazendo login com test@test.com');
      
      // Fazer login
      await page.fill('input[type="email"]', 'test@test.com');
      await page.fill('input[type="password"]', 'test123');
      await page.click('button[type="submit"]');
      
      // Aguardar login e redirecionamento
      await page.waitForURL('**/barbers/**', { timeout: 10000 });
      
      // Tentar reservar novamente
      await page.locator('button:has-text("Reservar")').first().click();
    }
    
    // Aguardar o modal de reserva abrir
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    
    // Selecionar uma data
    await page.locator('.calendar-day:not([disabled])').first().click();
    
    // Selecionar um horário
    await page.locator('button:has-text("09:00")').first().click();
    
    // Confirmar a reserva
    await page.click('button:has-text("Confirmar")');
    
    // Aguardar a confirmação
    await page.waitForSelector('text=Reserva criada com sucesso', { timeout: 5000 });
    
    // Ir para a página de agendamentos
    await page.goto('http://localhost:3000/bookings');
    
    // Verificar se o nome do barbeiro Carlos Mendes aparece na reserva
    const bookingBarberName = await page.textContent('.booking-item');
    expect(bookingBarberName).toContain('Carlos Mendes');
    expect(bookingBarberName).not.toContain('Lucas Silva');
    
    console.log('✅ Teste passou! O nome do barbeiro está correto na reserva.');
  });
  
  test('deve mostrar lista de barbeiros na página inicial', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Verificar se os barbeiros estão listados
    const barbeiros = [
      'Ana Costa',
      'Carlos Mendes', 
      'Fernanda Alves',
      'Lucas Silva',
      'Maria Oliveira',
      'Pedro Santos',
      'Roberto Lima'
    ];
    
    for (const barbeiro of barbeiros) {
      const element = await page.locator(`text=${barbeiro}`).first();
      await expect(element).toBeVisible();
      console.log(`✅ Barbeiro ${barbeiro} encontrado`);
    }
  });
});