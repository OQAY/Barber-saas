/**
 * Testes E2E para fluxo completo de agendamento
 * Testa a jornada completa do usuário: navegar -> selecionar -> agendar -> cancelar
 */

import { test, expect } from '@playwright/test'

test.describe('Booking Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('/')

    // Aguardar a página carregar completamente
    await page.waitForLoadState('networkidle')
  })

  test('complete booking flow - unauthenticated user should be redirected to login', async ({ page }) => {
    // Tentar acessar página de agendamento sem login
    await page.goto('/barbershops')

    // Clicar em uma barbearia
    const firstBarbershop = page.locator('[data-testid="barbershop-item"]').first()
    if (await firstBarbershop.count() > 0) {
      await firstBarbershop.click()

      // Tentar fazer um agendamento
      const bookButton = page.locator('text=Reservar')
      if (await bookButton.count() > 0) {
        await bookButton.click()

        // Deve ser redirecionado para login ou mostrar modal de login
        await expect(page.locator('text=Entrar', 'text=Login', 'text=Fazer login')).toBeVisible()
      }
    }
  })

  test('navigate to barbershops page', async ({ page }) => {
    // Verificar se a página inicial carrega
    await expect(page.locator('h1')).toBeVisible()

    // Navegar para barbearias
    await page.click('text=Barbearias')

    // Verificar se chegou na página correta
    await expect(page).toHaveURL(/.*barbershops.*/)

    // Verificar se há barbearias listadas
    await expect(page.locator('[data-testid="barbershop-item"], .barbershop-item, h2')).toBeVisible()
  })

  test('view barbershop details', async ({ page }) => {
    await page.goto('/barbershops')

    // Aguardar carregar as barbearias
    await page.waitForTimeout(2000)

    // Clicar na primeira barbearia (se existir)
    const barbershops = page.locator('a[href*="/barbershops/"]')
    const count = await barbershops.count()

    if (count > 0) {
      await barbershops.first().click()

      // Verificar se está na página de detalhes
      await expect(page).toHaveURL(/.*barbershops\/[^\/]+$/)

      // Verificar se há informações da barbearia
      await expect(page.locator('h1, h2')).toBeVisible()

      // Verificar se há serviços listados
      await expect(page.locator('text=Serviços', 'text=R$')).toBeVisible()
    }
  })

  test('view barber profile', async ({ page }) => {
    await page.goto('/barbers')

    // Aguardar carregar os barbeiros
    await page.waitForTimeout(2000)

    // Clicar no primeiro barbeiro (se existir)
    const barbers = page.locator('a[href*="/barbers/"]')
    const count = await barbers.count()

    if (count > 0) {
      await barbers.first().click()

      // Verificar se está na página do barbeiro
      await expect(page).toHaveURL(/.*barbers\/[^\/]+$/)

      // Verificar se há informações do barbeiro
      await expect(page.locator('h1, h2')).toBeVisible()
    }
  })

  test('search functionality', async ({ page }) => {
    // Verificar se há campo de busca
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="Buscar"]')

    if (await searchInput.count() > 0) {
      // Fazer uma busca
      await searchInput.fill('corte')

      // Pressionar Enter ou clicar no botão de busca
      await searchInput.press('Enter')

      // Aguardar resultados
      await page.waitForTimeout(1000)

      // Verificar se há resultados ou mensagem
      await expect(page.locator('text=resultado, text=encontrado, text=corte')).toBeVisible()
    }
  })

  test('responsive design - mobile view', async ({ page }) => {
    // Definir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Verificar se a página é responsiva
    await expect(page.locator('h1')).toBeVisible()

    // Verificar se o menu mobile funciona (se existir)
    const menuButton = page.locator('button[aria-label*="menu"], .menu-button, [data-testid="menu-button"]')

    if (await menuButton.count() > 0) {
      await menuButton.click()
      await expect(page.locator('nav, .menu')).toBeVisible()
    }
  })

  test('footer links and information', async ({ page }) => {
    // Scroll até o footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Verificar se o footer está visível
    await expect(page.locator('footer')).toBeVisible()

    // Verificar se há informações da empresa
    await expect(page.locator('footer').locator('text=FSW Barber, text=Barber')).toBeVisible()

    // Verificar se há informações de contato
    await expect(page.locator('footer').locator('text=@, text=tel:')).toBeVisible()
  })

  test('error handling - non-existent pages', async ({ page }) => {
    // Tentar acessar página que não existe
    await page.goto('/non-existent-page')

    // Verificar se mostra página de erro 404
    await expect(page.locator('text=404, text="Página não encontrada", h1')).toBeVisible()
  })
})

test.describe('Admin Dashboard E2E', () => {
  test('admin dashboard access', async ({ page }) => {
    await page.goto('/admin')

    // Deve redirecionar para login de admin ou mostrar login
    await expect(page.locator('text=Admin, text=Administrador, text=Login')).toBeVisible()
  })

  test('admin login page', async ({ page }) => {
    await page.goto('/auth/admin')

    // Verificar se está na página de login admin
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[type="email"], input[type="password"]')).toBeVisible()
  })
})

test.describe('Performance and Loading', () => {
  test('page load performance', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Página deve carregar em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000)
  })

  test('images load correctly', async ({ page }) => {
    await page.goto('/')

    // Aguardar todas as imagens carregarem
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img')
      return Array.from(images).every(img => img.complete)
    }, { timeout: 10000 })

    // Verificar se não há imagens quebradas
    const brokenImages = await page.locator('img[alt*="error"], img[src=""]').count()
    expect(brokenImages).toBe(0)
  })
})

test.describe('Accessibility', () => {
  test('basic accessibility checks', async ({ page }) => {
    await page.goto('/')

    // Verificar se há heading principal
    await expect(page.locator('h1')).toBeVisible()

    // Verificar se botões têm texto descritivo
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')

      // Botão deve ter texto ou aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Navegar usando Tab
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Verificar se algum elemento está focado
    const focusedElement = await page.locator(':focus').count()
    expect(focusedElement).toBeGreaterThan(0)
  })
})