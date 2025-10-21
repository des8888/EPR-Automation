import { Page, Locator, BrowserContext } from '@playwright/test';
import dotenv from 'dotenv';
import url from "../data/pageUrl.json"

dotenv.config();


export default class Login {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator(`input`).first(); 
    this.password = page.locator(`//input[@type='password']`);
    this.submitButton = page.locator('button:has-text("Login")');
  }
  async login(username: string, password: string, storagePath: string, redirectUrl: string) {
  await this.page.goto(url.loginURL);
  await this.username.fill(username);
  await this.password.fill(password);
  await this.submitButton.click();
  await this.page.locator('text=Expense Payment Requests').waitFor({ state: 'visible', timeout: 300000 });
  await this.page.context().storageState({ path: storagePath });
}
  
}