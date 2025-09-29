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
    this.submitButton = page.locator('button:has-text("SUBMIT")');
  }
  // async InputCredentialsRequestor() {
  //   await this.page.goto(url.loginURL);
  //   await this.username.fill(process.env.USER!);  // env variable for username
  //   await this.password.fill(process.env.PW!);    // env variable for password
  //   await this.submitButton.click();

    
  // await this.page.waitForURL(url.users.requestor.requestLandingPage);  // ✅ ensure login is successful

  // await this.page.context().storageState({ path: './auth/storageState.json' });
  // }

  // async InputCredsApprover1(){
  //   await this.page.goto(url.loginURL);
  //   await this.username.fill(process.env.L1!);  // env variable for username
  //   await this.password.fill(process.env.L1PW!);    // env variable for password
  //   await this.submitButton.click();

    
  // await this.page.waitForURL(url.users.requestor.requestLandingPage);  // ✅ ensure login is successful

  // await this.page.context().storageState({ path: './auth/approver1.json' });
  // }

  async login(username: string, password: string, storagePath: string, redirectUrl: string) {
  await this.page.goto(url.loginURL);
  await this.username.fill(username);
  await this.password.fill(password);
  await this.submitButton.click();
  await this.page.waitForURL(redirectUrl);
  await this.page.context().storageState({ path: storagePath });
}
  
}
