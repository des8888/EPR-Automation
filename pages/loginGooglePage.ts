import { Page, Locator, BrowserContext } from '@playwright/test';

export default class LoginGoogle {
  readonly page: Page;
  readonly GoogleLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.GoogleLogin = page.locator("button.MuiButtonBase-root.css-1njozku");
  }

  async InputCredentials(context: BrowserContext) {
    await this.GoogleLogin.click(); // Trigger the popup

    // The rest of the code that handles popup should go here...
  }
}