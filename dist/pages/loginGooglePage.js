export default class LoginGoogle {
    page;
    GoogleLogin;
    constructor(page) {
        this.page = page;
        this.GoogleLogin = page.locator("button.MuiButtonBase-root.css-1njozku");
    }
    async InputCredentials(context) {
        await this.GoogleLogin.click(); // Trigger the popup
        // The rest of the code that handles popup should go here...
    }
}
