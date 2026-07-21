import { expect, test, type Page } from '@playwright/test'

async function gotoPrivacy(page: Page) {
  await page.goto('/privacidad/')
  await expect(page.locator('.privacy-page')).toBeVisible()
}

test('privacy page exposes TOC and in-page anchors', async ({ page }) => {
  await gotoPrivacy(page)

  await expect(page.getByRole('heading', { name: 'Política de privacidad' })).toBeVisible()

  const tocLinks = page.locator('.privacy-toc a')
  await expect(tocLinks).toHaveCount(11)

  const sicLink = tocLinks.filter({ hasText: 'Autoridad de protección de datos' })
  await sicLink.scrollIntoViewIfNeeded()
  await sicLink.evaluate((link) => link.click())
  await expect(page).toHaveURL(/#priv-sic$/)
  await expect(page.locator('#priv-sic')).toBeVisible()
})

test('privacy page links back to home', async ({ page }) => {
  await gotoPrivacy(page)

  await page.getByRole('link', { name: '← Volver al inicio' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: /Un espacio seguro para entenderte/i })).toBeVisible()
})
