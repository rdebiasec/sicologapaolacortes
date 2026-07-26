import { expect, test, type Page } from '@playwright/test'

async function gotoHome(page: Page) {
  await page.goto('/')
  await expect(page.locator('#main-content')).toBeVisible()
}

async function openLeadDraft(page: Page) {
  await page.locator('#contacto').scrollIntoViewIfNeeded()
  const details = page.locator('details.lead-form-details')
  await details.scrollIntoViewIfNeeded()
  // Open via DOM to avoid sticky mobile chrome intercepting the tap target.
  await details.evaluate((el: HTMLDetailsElement) => {
    el.open = true
  })
  await expect(page.locator('#contacto-form')).toBeVisible()
}

test('home renders, hero CTA and FAQ expand', async ({ page }) => {
  await gotoHome(page)

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Cuando todo se siente demasiado/i
    })
  ).toBeVisible()

  await expect(page.getByText(/Virtual mundial/i).first()).toBeVisible()

  const heroCta = page.getByRole('link', { name: 'Quiero dar el primer paso' }).first()
  const href = await heroCta.getAttribute('href')
  expect(href).toMatch(/^(#contacto|https:\/\/wa\.me\/)/)
  if (href?.startsWith('#')) {
    await heroCta.click()
    await expect(page).toHaveURL(/#contacto$/)
  } else {
    await expect(heroCta).toHaveAttribute('target', '_blank')
    await expect(href || '').toContain('wa.me/')
  }

  const heroImg = page.locator('.hero-photo-card img').first()
  await expect(heroImg).toBeVisible()
  await expect
    .poll(async () => heroImg.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0)

  const faqTrigger = page.locator('.faq-trigger').nth(1)
  await faqTrigger.scrollIntoViewIfNeeded()
  await faqTrigger.evaluate((button) => (button as HTMLButtonElement).click())
  await expect(faqTrigger).toHaveAttribute('aria-expanded', 'true')

  const panelId = await faqTrigger.getAttribute('aria-controls')
  if (!panelId) {
    throw new Error('El acordeón FAQ no tiene panel asociado.')
  }
  await expect(page.locator(`#${panelId}`)).toBeVisible()
})

test('method tool and voice quotes render', async ({ page }) => {
  await gotoHome(page)
  await expect(page.getByRole('heading', { name: /POPLA/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /En sus palabras/i })).toBeVisible()
  await expect(page.getByText(/consulta prioritaria/i).first()).toBeVisible()
})

test('navbar WhatsApp CTA stays readable', async ({ page }) => {
  await gotoHome(page)

  const navCta = page.locator('#primary-nav .btn-primary').first()
  await expect(navCta).toBeVisible()
  await expect(navCta).toContainText(/Agendar por WhatsApp|Ver opciones de contacto/i)

  const color = await navCta.evaluate((el) => getComputedStyle(el).color)
  // Expect near-white text on the primary CTA (rgb/rgba).
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  expect(match).toBeTruthy()
  const [, r, g, b] = match!.map(Number)
  expect(r).toBeGreaterThan(230)
  expect(g).toBeGreaterThan(230)
  expect(b).toBeGreaterThan(230)
})

test('contact form draft persists and can be cleared', async ({ page }) => {
  await gotoHome(page)
  await openLeadDraft(page)

  const contactValue = page.locator('input[name="contactValue"]')
  const message = page.locator('textarea[name="messageShort"]')

  await contactValue.fill('paciente@correo.com')
  await message.fill('Quiero conocer disponibilidad esta semana.')

  await page.reload()
  await openLeadDraft(page)

  await expect(contactValue).toHaveValue('paciente@correo.com')
  await expect(message).toHaveValue('Quiero conocer disponibilidad esta semana.')

  const clearButton = page.locator('[data-clear-local-data]')
  await clearButton.scrollIntoViewIfNeeded()
  await clearButton.evaluate((button) => (button as HTMLButtonElement).click())

  await expect(contactValue).toHaveValue('')
  await expect(message).toHaveValue('')
  await expect(page.locator('[data-lead-status]')).toContainText('Se eliminaron los datos guardados')
})

test('mobile menu opens and closes after navigation click', async ({ page }, testInfo) => {
  // Keep this check on phone-sized viewports only.
  const isMobileProject = /iPhone|Pixel/i.test(testInfo.project.name)
  if (!isMobileProject) {
    await page.setViewportSize({ width: 390, height: 844 })
  }

  await gotoHome(page)

  const menuButton = page.getByRole('button', { name: 'Abrir menú' })
  await expect(menuButton).toBeVisible()

  await menuButton.click()
  await expect(page.locator('body')).toHaveClass(/nav-open/)

  await page.locator('#primary-nav a[href="#servicios"]').click()
  await expect(page).toHaveURL(/#servicios$/)
  await expect(page.locator('body')).not.toHaveClass(/nav-open/)
})
