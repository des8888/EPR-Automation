import test from "@playwright/test";
import FieldErrors from "../pages/fieldErrors";
import RequestPage from '../pages/Request';
import EPRFields from "../pages/EPRformFields";
import message from '../data/errorMessages.json';
import url from '../data/pageUrl.json';
import Login from "../pages/loginPage";

const reqLandingPage = url.users.requestor.requestLandingPage;

test.describe('Field Validation Errors', () => {
  test.beforeEach(async ({ page }) => {
    const loginFlow = new Login(page);
    await loginFlow.login(
      process.env.USER!,
      process.env.PW!,
      './auth/requestor.json',
      reqLandingPage
    );
  });


test("EPR Form Field Error message Validation", async({page})=>{
    const fieldErrors = new FieldErrors(page);
    const requestPage = new RequestPage(page);
    const TypeonEPRFormFields = new EPRFields(page);

    const landingPage = url.users.requestor.requestLandingPage

    await page.goto(landingPage);
    await requestPage.ClickNewRequest();
    await fieldErrors.NewRequestFormFieldsErrors();
    await page.reload();
    await TypeonEPRFormFields.InputOnFields();
    await fieldErrors.AddTransactionsFieldsErrors(page);
})
});