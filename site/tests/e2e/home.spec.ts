import { expect, test, type Page } from '@playwright/test'

async function gotoHome(page: Page) {
  await page.goto('/')
  await expect(page.locator('#main-content')).toBeVisible()
}

test('home renders, CTA navigates and FAQ expands', async ({ page }) => {
  await gotoHome(page)

  await expect(page.getByRole('heading', { name: /Un espacio seguro para entenderte/i })).toBeVisible()

  const heroCta = page.getByRole('link', { name: 'Agendar primera conversación' }).first()
  await expect(heroCta).toHaveAttribute('href', '#contacto')
  await heroCta.click()
  await expect(page).toHaveURL(/#contacto$/)

  const faqTrigger = page.locator('.faq-trigger').nth(1)
  await faqTrigger.scrollIntoViewIfNeeded()
  await faqTrigger.evaluate((button) => button.click())
  await expect(faqTrigger).toHaveAttribute('aria-expanded', 'true')

  const panelId = await faqTrigger.getAttribute('aria-controls')
  if (!panelId) {
    throw new Error('El acordeón FAQ no tiene panel asociado.')
  }
  await expect(page.locator(`#${panelId}`)).toBeVisible()
})

test('contact form draft persists and can be cleared', async ({ page }) => {
  await gotoHome(page)

  const contactValue = page.locator('input[name="contactValue"]')
  const message = page.locator('textarea[name="messageShort"]')

  await contactValue.fill('paciente@correo.com')
  await message.fill('Quiero conocer disponibilidad esta semana.')

  await page.reload()

  await expect(contactValue).toHaveValue('paciente@correo.com')
  await expect(message).toHaveValue('Quiero conocer disponibilidad esta semana.')

  const clearButton = page.locator('[data-clear-local-data]')
  await clearButton.scrollIntoViewIfNeeded()
  await clearButton.evaluate((button) => button.click())

  await expect(contactValue).toHaveValue('')
  await expect(message).toHaveValue('')
  await expect(page.locator('[data-lead-status]')).toContainText('Se eliminaron los datos guardados')
})

test('mobile menu opens and closes after navigation click', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await gotoHome(page)

  const menuButton = page.getByRole('button', { name: 'Abrir menú' })
  await expect(menuButton).toBeVisible()

  await menuButton.click()
  await expect(page.locator('body')).toHaveClass(/nav-open/)

  await page.locator('#primary-nav a[href="#servicios"]').click()
  await expect(page).toHaveURL(/#servicios$/)
  await expect(page.locator('body')).not.toHaveClass(/nav-open/)
})
