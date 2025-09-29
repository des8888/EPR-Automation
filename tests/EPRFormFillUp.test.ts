import test from "@playwright/test";
import EPRFields from "../pages/EPRformFields";
import url from '../data/pageUrl.json'

test("Fill Up EPR Form", async({page})=>{
    const eprForms = new EPRFields(page);

    await page.goto(url.users.eprForm.url);
    await eprForms.InputOnFields();
    await eprForms.ClickAddTransBtn();
    await eprForms.InputFieldsonTransactions(page);
})