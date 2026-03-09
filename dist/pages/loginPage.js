import dotenv from 'dotenv';
dotenv.config();
export default class Login {
    page;
    username;
    password;
    submitButton;
    constructor(page) {
        this.page = page;
        this.username = page.getByPlaceholder("Enter your Email Address");
        this.password = page.getByPlaceholder("Enter your Password");
        this.submitButton = page.locator('button:has-text("Login")');
    }
    async enterUsername(username) {
        await this.username.fill(username);
    }
    async enterPassword(password) {
        await this.password.fill(password);
        await this.submitButton.click();
    }
    //   async login(username: string, password: string, storagePath: string, redirectUrl: string) {
    //   await this.page.goto(url.loginURL);
    //   await this.username.fill(username);
    //   await this.password.fill(password);
    //   await this.submitButton.click();
    //   await this.page.locator('text=Expense Payment Requests').waitFor({ state: 'visible', timeout: 300000 });
    //   await this.page.context().storageState({ path: storagePath });
    // }
    //Other function
    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.page.locator(`//button[@id='new-request-button']`).waitFor({ state: 'visible', timeout: 300000 });
    }
}
