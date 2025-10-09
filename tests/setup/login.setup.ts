import { test as setup, expect } from '@playwright/test';
import url from '../../data/pageUrl.json';
import dotenv from 'dotenv';
import LoginGoogle from '../../pages/loginGooglePage';
import fs from 'fs';
import RequestPage from '../../pages/Request';

dotenv.config();

// Ensure .auth directory exists
if (!fs.existsSync('.auth')) {
  fs.mkdirSync('.auth');
}
setup('write login session data', async ({ page }) => {
  const reqPage = new RequestPage(page);
  const loginPage = new LoginGoogle(page);

  await page.goto(url.loginURL);

  const [popup] = await Promise.all([
    page.context().waitForEvent('page'),
    loginPage.GoogleLogin.click(),
  ]);

  await popup.waitForLoadState();
  await popup.fill('input[type="email"]', process.env.GOOGLEUSER!);
  await popup.click('button:has-text("Next")');
  await popup.waitForTimeout(1000);
  await popup.fill('input[type="password"]', process.env.GPASS!);
  await popup.click('button:has-text("Next")');
  await popup.waitForEvent('close');

  await expect(reqPage.NewRequestBtn).toBeVisible({ timeout: 10000 });

  // Save Storage State
  await page.context().storageState({ path: '.auth/storageState.json' });
});



//using SESSION FILE
// import { chromium } from '@playwright/test';
// import Login, { accounts } from '../../pages/loginPage';
// import fs from 'fs';
// import path from 'path';

// export default async function globalSetup() {
//   const browser = await chromium.launch();

//   for (const key of Object.keys(accounts)) {
//     const account = accounts[key as keyof typeof accounts];

//     // Resolve absolute path for storage file
//     const storagePath = path.resolve(account.storage);
//     const storageDir = path.dirname(storagePath);

//     // Ensure folder exists
//     if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

//     // Open a new page for login
//     const page = await browser.newPage();
//     const login = new Login(page);
//     console.log(`🔐 Logging in as: ${account.username}...`);

//     await login.login(account.username, account.password, storagePath, account.redirectUrl);

//     console.log(`✅ ${key} login successful — saved to ${storagePath}`);
//     await page.close();
//   }

//   await browser.close();
// }



