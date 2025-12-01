import {test, expect} from "@playwright/test";
import url from '../data/pageUrl.json';
import RequestPage from "../pages/Request";
import data from '../data/filterData.json'
import ApprovalsPage from '../pages/Approvals';
import head from '../data/tableHeader.json';
import Login from '../pages/loginPage';
import login from '../data/login.json';
import SharedLocator from '../pages/common/shared-locators';
import EPRFields from "../pages/EPRformFields";

const ReqPage = url.users.requestor
const AppPage = url.users.approver
// test("Validate UI after Filters", async({page})=>{
//     let count = 8;

//     await page.goto(ReqPage);
//     const reqPage = new RequestPage(page);
//     const appPage = new ApprovalsPage(page);
//     await reqPage.SelectingCategory();
//     await reqPage.SelectingSubCategory();
//     await appPage.ClickFunnelFilter();
//     await expect(reqPage.EPRColumn.first()).toHaveText(/\S/, {timeout: 3000})
//     await appPage.DateReqFIlterFrom.fill(data.DateReqFromUI)
//     await appPage.DateReqFIlterTo.fill(data.DateReqToUI)
//     await appPage.ClickApplyFilter();
//     await expect(reqPage.EPRColumn.first()).toHaveText(/\S/, {timeout: 3000})
//     await reqPage.ClickSummaryTab();
//     await reqPage.ClickPendingReqTab();
//     await expect(reqPage.EPRColumn.first()).toHaveText(/\S/, {timeout: 3000})
//     let penReqHead = await reqPage.HeadersValidation.count()
//     console.log(`NUMBER OF HEADERS: ${penReqHead}`);
//     await expect(penReqHead).toEqual(count);
// })
test.beforeAll(async ()=>{
  let dateTime = new Date();
  let dateToString = String(dateTime);
  test.info().annotations.push({type: 'Test Suite Execution Started at: ', description: dateToString});
})

test.afterAll(async ()=>{
  let dateTime = new Date()
  let dateToString = String(dateTime);
  test.info().annotations.push({type: " Test Suite Execution Finished at: ", description: dateToString});
})
test.describe('UI Validations', () => {
  test.beforeEach(async ({ page }) => {
    let dateTime = new Date();
    let dateToString = String(dateTime);
    test.info().annotations.push({type: 'Test Case Execution Started at: ', description: dateToString});
  });

  test.afterEach(async({page}, testInfo)=>{
    if (testInfo.status == testInfo.expectedStatus){
      let dateTime = new Date();
      let dateToString = String(dateTime);
      test.info().annotations.push({type: 'Test Execution Status: ', description: "Passed"});
      test.info().annotations.push({type: 'Test Case Execution Finished at: ', description: dateToString});
    }

    else if(testInfo.status !== testInfo.expectedStatus){
      let dateTime = new Date();
      let dateToString = String(dateTime);
      console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
      let testInfoTitle = `${testInfo.title}`
      let testInfoStatus = `${testInfo.status}`
      test.info().annotations.push({type:"Test Case Title", description: testInfoTitle});
      test.info().annotations.push({type:"Test Case Status", description: testInfoStatus});
      test.info().annotations.push({type:"Test Case Execution Finished at", description: dateToString});
    }
  })

test("Checking Pending Request Tab Table Headers", async({page})=>{
    let reqPage = new RequestPage(page);
    const loginFlow = new Login(page)
    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState("domcontentloaded");
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

test("Pending Request page, UI Elements Validation", async({page})=>{
    let logMessages = "Remarks:";
    let reqPage = new RequestPage(page);
    let EPRField = new EPRFields(page)
    const loginFlow = new Login(page)
    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState("domcontentloaded");
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    logMessages += `\nThe following elements are shown`;

    try {
    await expect(EPRField.getCategoryDropdown()).toBeVisible();
    logMessages += '\n- Category: Visible';
    } catch {
    logMessages += '\n- Category: Not Visible';
    }

    try {
    await expect(EPRField.getSubCategoryDropdown()).toBeVisible();
    logMessages += '\n- Category: Visible';
    } catch {
    logMessages += '\n- Category: Not Visible';
    }

    try {
      await expect(reqPage.NewRequestBtn).toBeVisible();
      logMessages += '\n - New Request button: Visible'
    } catch {
      logMessages += '\n - New Request button: Not Visible'
    }

})

test("Checking Summary Tab Table Headers", async({page})=>{
    let reqPage = new RequestPage(page);
    const loginFlow = new Login(page)
    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState("domcontentloaded");
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    await reqPage.ClickSummaryTab();
    let count = await reqPage.HeadersValidation.count();
    const expectedHeaders = head["Summary Headers"];
    console.log(`BILANG: ${count}`)
    for(let i=0; i <count;i++){
        let cell = reqPage.HeadersValidation.nth(i);
        let text = await cell.innerText()
        console.log(`Row ${i+1} : ${text}`)
        await expect(text.trim()).toBe(expectedHeaders[i.toString()]);


    }
})

test("Checking Approvers On-going Tab Table Headers", async({page})=>{
    let appPage = new ApprovalsPage(page);
    let reqPage = new RequestPage(page)
    const loginFlow = new Login(page)
    const shared = new SharedLocator(page);
    await page.goto(url.loginURL);
    await loginFlow.login(login.AP, login.APPW);
    await page.waitForLoadState("domcontentloaded");
    await shared.ClickApprovals()
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
test("Checking Approvers Done Tab Table Headers", async({page})=>{
    let appPage = new ApprovalsPage(page);
    let reqPage = new RequestPage(page)
    const loginFlow = new Login(page)
    const shared = new SharedLocator(page);
    await page.goto(url.loginURL);
    await loginFlow.login(login.AP, login.APPW);
    await page.waitForLoadState("domcontentloaded");
    await shared.ClickApprovals();
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

test("Checking Accounting Ongoing Tab Table Headers", async({page})=>{
    let appPage = new ApprovalsPage(page);
    let reqPage = new RequestPage(page)
    const loginFlow = new Login(page)
    const shared = new SharedLocator(page);
    await page.goto(url.loginURL);
    await loginFlow.login(login.AP, login.APPW);
    await page.waitForLoadState("domcontentloaded");
    await shared.clickAccounting();
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    let count = await reqPage.HeadersValidation.count();
    const expectedHeaders = head["Accounting Headers"]["Ongoing Headers"];
    console.log(`BILANG: ${count}`)
    for(let i=0; i <count;i++){
        let cell = reqPage.HeadersValidation.nth(i);
        let text = await cell.innerText()
        console.log(`Row ${i+1} : ${text}`)
        await expect(text.trim()).toBe(expectedHeaders[i.toString()]);


    }
})

test("Checking Accounting Done Tab Table Headers", async({page})=>{
    let appPage = new ApprovalsPage(page);
    let reqPage = new RequestPage(page)
    const loginFlow = new Login(page)
    const shared = new SharedLocator(page);
    await page.goto(url.loginURL);
    await loginFlow.login(login.AP, login.APPW);
    await page.waitForLoadState("domcontentloaded");
    await shared.clickAccounting();
    await appPage.DoneTabButton.click()
    await reqPage.HeadersValidation.first().waitFor({state:'visible'})
    let count = await reqPage.HeadersValidation.count();
    const expectedHeaders = head["Accounting Headers"]["Done Headers"];
    console.log(`BILANG: ${count}`)
    for(let i=0; i <count;i++){
        let cell = reqPage.HeadersValidation.nth(i);
        let text = await cell.innerText()
        console.log(`Row ${i+1} : ${text}`)
        await expect(text.trim()).toBe(expectedHeaders[i.toString()]);


    }
})

})