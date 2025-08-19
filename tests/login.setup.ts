import { test as setup, expect } from '@playwright/test';
import url from '../data/pageUrl.json';
import dotenv from 'dotenv';
import Login from '../pages/loginPage';
import fs from 'fs';
import RequestPage from '../pages/Request';

dotenv.config();

// Ensure .auth directory exists
if (!fs.existsSync('.auth')) {
  fs.mkdirSync('.auth');
}
setup('write login session data', async ({ page }) => {
  const reqPage = new RequestPage(page);
  const loginPage = new Login(page);

  await page.goto(url.loginURL);

  const [popup] = await Promise.all([
    page.context().waitForEvent('page'),
    loginPage.GoogleLogin.click(),
  ]);

  await popup.waitForLoadState();
  await popup.fill('input[type="email"]', process.env.USER!);
  await popup.click('button:has-text("Next")');
  await popup.waitForTimeout(1000);
  await popup.fill('input[type="password"]', process.env.PW!);
  await popup.click('button:has-text("Next")');
  await popup.waitForEvent('close');

  await expect(reqPage.NewRequestButton).toBeVisible({ timeout: 10000 });

  // Save Storage State
  await page.context().storageState({ path: '.auth/storageState.json' });
});
