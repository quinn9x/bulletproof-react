import { expect, test } from '@playwright/test';

test('user can log in and access discussions', async ({ page }) => {
  await page.goto('/auth/login');

  await expect(
    page.getByRole('heading', { name: 'Log in to your account' }),
  ).toBeVisible();

  await page.getByLabel('Email Address').fill('john@example.com');
  await page.getByLabel('Password').fill('password');

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/app$/);

  await page.goto('/app/discussions');

  await expect(page).toHaveURL(/\/app\/discussions/);
});
