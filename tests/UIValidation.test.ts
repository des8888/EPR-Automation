import {test, expect} from "@playwright/test";
import url from '../data/pageUrl.json';
import RequestPage from "../pages/Request";
import data from '../data/filterData.json'
import ApprovalsPage from '../pages/Approvals';
import head from '../data/tableHeader.json';

const ReqPage = url.requestLandingPage
const AppPage = url.approvalsPage
test("Validate UI after Filters", async({page})=>{
    let count = 8;

    await page.goto(ReqPage);
    const reqPage = new RequestPage(page);
    const appPage = new ApprovalsPage(page);
    await reqPage.SelectingCategory();
    await reqPage.SelectingSubCategory();
    await appPage.ClickFunnelFilter();
    await expect(reqPage.EPRColumn.first()).toHaveText(/\S/, {timeout: 3000})
    await appPage.DateReqFIlterFrom.fill(data.DateReqFromUI)
    await appPage.DateReqFIlterTo.fill(data.DateReqToUI)
    await appPage.ClickApplyFilter();
    await expect(reqPage.EPRColumn.first()).toHaveText(/\S/, {timeout: 3000})
    await reqPage.ClickSummaryTab();
    await reqPage.ClickPendingReqTab();
    await expect(reqPage.EPRColumn.first()).toHaveText(/\S/, {timeout: 3000})
    let penReqHead = await reqPage.HeadersValidation.count()
    console.log(`NUMBER OF HEADERS: ${penReqHead}`);
    await expect(penReqHead).toEqual(count);
})

test("Checking Pending Request Tab Table Headers", async({page})=>{
    let reqPage = new RequestPage(page);
    await page.goto(ReqPage);
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    let count = await reqPage.HeadersValidation.count();
    const expectedHeaders = head["Pending Request Headers"];
    console.log(`BILANG: ${count}`)
    for(let i=0; i <count;i++){
        let cell = reqPage.HeadersValidation.nth(i);
        let text = await cell.innerText()
        console.log(`Row ${i+1} : ${text}`)
        await expect(text.trim()).toBe(expectedHeaders[i.toString()]);


    }
})

test("Checking On-going Tab Table Headers", async({page})=>{
    let appPage = new ApprovalsPage(page);
    let reqPage = new RequestPage(page)
    await page.goto(AppPage);
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    let count = await reqPage.HeadersValidation.count();
    const expectedHeaders = head["Ongoing Headers"];
    console.log(`BILANG: ${count}`)
    for(let i=0; i <count;i++){
        let cell = reqPage.HeadersValidation.nth(i);
        let text = await cell.innerText()
        console.log(`Row ${i+1} : ${text}`)
        await expect(text.trim()).toBe(expectedHeaders[i.toString()]);


    }
})
test("Checking Done Tab Table Headers", async({page})=>{
    let appPage = new ApprovalsPage(page);
    let reqPage = new RequestPage(page)
    await page.goto(AppPage);
    await appPage.DoneTabButton.click()
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    let count = await reqPage.HeadersValidation.count();
    const expectedHeaders = head["Done Headers"];
    console.log(`BILANG: ${count}`)
    for(let i=0; i <count;i++){
        let cell = reqPage.HeadersValidation.nth(i);
        let text = await cell.innerText()
        console.log(`Row ${i+1} : ${text}`)
        await expect(text.trim()).toBe(expectedHeaders[i.toString()]);


    }
})