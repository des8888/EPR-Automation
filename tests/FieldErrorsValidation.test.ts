import test from "@playwright/test";
import FieldErrors from "../pages/fieldErrors";
import RequestPage from '../pages/Request';
import EPRFields from "../pages/EPRformFields";
import message from '../data/errorMessages.json';
import url from '../data/pageUrl.json';

test("EPR Form Field Error message Validation", async({page})=>{
    const fieldErrors = new FieldErrors(page);
    const requestPage = new RequestPage(page);
    const TypeonEPRFormFields = new EPRFields(page);

    const landingPage = url.requestLandingPage

    await page.goto(landingPage);
    await requestPage.ClickNewRequest();
    await fieldErrors.NewRequestFormFieldsErrors();
    await page.reload();
    await TypeonEPRFormFields.InputOnFields();
    await fieldErrors.AddTransactionsFieldsErrors(page);
})