import { test, expect, Browser } from '@playwright/test';
import RequestPage from '../pages/Request';
import EprFields from '../pages/EPRformFields';
import url from '../data/pageUrl.json';
import SharedLocator from '../pages/common/shared-locators';
import data from '../data/filterData.json';
import Login from '../pages/loginPage';
import EPR from '../data/eprData.json'
import login from '../data/login.json';
import { afterEach } from 'node:test';
import { link } from 'fs';
import { log } from 'console';


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

const reqLandingPage = url.users.requestor.requestLandingPage;
const approvalsPage = url.users.approver.approvalsPage;
let latestEPR = '';


test.describe('E2E Flow', () => {
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

  test('Request to Approval up to MANCOM (up to 1M)', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState("domcontentloaded");
    //Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      latestEPR = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(latestEPR);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Check EPR on other non Approver accounts", async()=>{
      await loginFlow.login(login.AVP, login.AVPPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(latestEPR);
await shared.ClickLogout();

      await loginFlow.login(login.VP, login.VPPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.ClickLogout();

        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.ClickLogout();

      })

      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.MNGR, login.MNGRPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Check EPR on other non Approver accounts", async()=>{
      await loginFlow.login(login.VP, login.VPPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.ClickLogout();

      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.ClickLogout();

      })

      await test.step("Approved by Approver L2", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.AVP, login.AVPPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Check EPR on other non Approver accounts", async()=>{
      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.ClickLogout();

      })
      await test.step("Approved by Approver L3", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.VP, login.VPPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);
      })

      await test.step("Approved by Accounting", async()=>{
      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR)//);
      await eprFormFields.ClickActionsColAccounting(latestEPR);
      await eprFormFields.AcknowledgeARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearchAccounting()//);
      await shared.AccGetStatus();
      await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogout(),
        ]);
      })

      console.log('✅ Request to Approval up to MANCOM (up to 1M) ✅ PASSED');
  });

  test('Request to Approval up to Department Manager (up to 100k)', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState("domcontentloaded");

    await test.step('Validate Total amount after Deletion', async()=>{
        const requestPage = new RequestPage(page);
        const eprFormFields = new EprFields(page);

        // Navigate to landing page (session will persist from user-data-dir)
        await page.goto(reqLandingPage);

        // Perform actions
        await requestPage.ClickNewRequest();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFields(page);
        for (let i = 1; i <= 3; i++) {
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.FillNetAmtBelow100k();
        await eprFormFields.ClickAddNewTransactions();
        }
        await eprFormFields.CountTotalAmount();
        await eprFormFields.ClickAddTransActionCol(latestEPR);
        await eprFormFields.ClickDelete();
        await eprFormFields.ClickConfirmDelete();
        await eprFormFields.CountTotalAmount();
        console.log("Validate Total amount after Deletion ✅ PASSED")
      })

      await test.step("Create a Request", async () => {
        await page.goto(reqLandingPage);
        await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
        await requestPage.ClickNewRequest();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFields(page);
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.FillNetAmtBelow100k();
        await eprFormFields.ClickAddNewTransactions();
        await eprFormFields.ClickNext();
        await eprFormFields.ClickSubmitRequest();
        await eprFormFields.ClickSubmit();
        await requestPage.waitForViewofViewAllReq();
        await page.waitForTimeout(5000);

        await eprFormFields.GetNewEPRNo();
        await requestPage.ClickViewAllReq();
        await shared.UseSearch(latestEPR);

        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);
      });

      await test.step("Check EPR on other non Approver accounts", async () => {
        // L2 Login check
        await loginFlow.login(login.AVP, login.AVPPW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        let noMessage1 = await shared.NoDataMessage.innerText();
        await expect(noMessage1).toBe(data.NoDataMessage);
        await shared.ClickLogout();

        // L3 Login check
        await loginFlow.login(login.VP, login.VPPW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        let noMessage2 = await shared.NoDataMessage.innerText();
        await expect(noMessage2).toBe(data.NoDataMessage);
await shared.ClickLogout();

        // Accounting check
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        let noMessage3 = await shared.NoDataMessage.innerText();
        await expect(noMessage3).toBe(data.NoDataMessage);
await shared.ClickLogout();
      });


      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.MNGR, login.MNGRPW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Check EPR on other non Approver accounts", async()=>{
          await loginFlow.login(login.AVP, login.AVPPW);
          await shared.ClickApprovals();
          await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();

          await loginFlow.login(login.VP, login.VPPW);
          await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();

      })

      await test.step("Approved by Accounting", async()=>{
      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR)//);
      await eprFormFields.ClickActionsColAccounting(latestEPR);
      await eprFormFields.AcknowledgeARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearchAccounting();
      await shared.AccGetStatus();
      await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogout(),
        ]);
      })
      console.log('✅ Request to Approval up to Department Manager (up to 100k) ✅ PASSED');
  });

  test.only('Request to Approval up to AsstVP (up to 500k)', async ({ page }) => {

  const requestPage = new RequestPage(page);
  const eprFormFields = new EprFields(page);
  const shared = new SharedLocator(page);
  const loginFlow = new Login(page);

    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState("domcontentloaded");
  // ───────────────────────────────────────────────
  // STEP 1: Requestor creates an EPR
  // ───────────────────────────────────────────────
 await test.step("Create a Request", async()=>{

      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtUpTo500k();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      latestEPR = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(latestEPR);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);
  });

  // ───────────────────────────────────────────────
  // STEP 2: Approver L1
  // ───────────────────────────────────────────────
  await test.step("Approved by Approver L1", async () => {
    await loginFlow.login(login.MNGR, login.MNGRPW);
    await shared.ClickApprovals();

    await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    await shared.UseSearch(latestEPR);

    await eprFormFields.ClickActionCol(latestEPR);
    await eprFormFields.ApproveARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(latestEPR);

    await shared.DoneTabButton.click();
    await shared.UseSearch(latestEPR);
    await shared.GetStatus();

    await Promise.all([
      page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
      shared.ClickLogout(),
    ]);
  });

  // ───────────────────────────────────────────────
  // STEP 3: Approver L2 (AVP)
  // ───────────────────────────────────────────────
  await test.step("Approved by Approver L2", async () => {
    await loginFlow.login(login.AVP, login.AVPPW);
    await shared.ClickApprovals();
    await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    await shared.UseSearch(latestEPR);

    await eprFormFields.ClickActionCol(latestEPR);
    await eprFormFields.ApproveARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(latestEPR);

    await shared.DoneTabButton.click();
    await shared.UseSearch(latestEPR);
    await shared.GetStatus();

    await shared.ClickLogout();
  });

  // ───────────────────────────────────────────────
  // STEP 4: Accounting Approval
  // ───────────────────────────────────────────────
  await test.step("Approved by Accounting", async () => {
    await loginFlow.login(login.AP, login.APPW);
    await shared.clickAccounting();
    await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
    await shared.UseSearch(latestEPR);

    await eprFormFields.ClickActionsColAccounting(latestEPR);
    await eprFormFields.AcknowledgeARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(latestEPR);

    await shared.DoneTabButton.click();
    await shared.UseSearchAccounting();
    await shared.AccGetStatus();

    await Promise.all([
      page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
      shared.ClickLogout(),
    ]);
  });

  console.log('✅ Request to Approval up to Department Asst VP (up to 500k) — PASSED');

});




  test('Rejection of Request L1', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    //Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
      // Perform actions
      await requestPage.ClickNewRequest();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(latestEPR);


      // Logout Requestor
await shared.ClickLogout();

      });

      await test.step("Rejected by Approver L1", async()=>{
      // Login as Approver 1
            await loginFlow.login(
        process.env.MNGR!,
        process.env.MNGRPW!,
        './auth/approver1.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.RejectARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      console.log('✅ Rejection of Request by L1 ✅ PASSED');
  });

  test('Rejection of Request by Accounting', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
      // Perform actions
      await requestPage.ClickNewRequest();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq()
      await shared.UseSearch(latestEPR);


      // Logout Requestor
      await shared.ClickLogout();

      });

      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
            await loginFlow.login(
        process.env.MNGR!,
        process.env.MNGRPW!,
        './auth/approver1.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Approved by Approver L2", async()=>{
      // Login as Approver 1
       await loginFlow.login(
        process.env.AVP!,
        process.env.AVPPW!,
        './auth/approver2.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })

      await test.step("Approved by Approver L3", async()=>{
      // Login as Approver 1
       await loginFlow.login(
        process.env.VP!,
        process.env.VPPW!,
        './auth/approver3.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Rejected by Accounting", async()=>{


        await loginFlow.login(
        process.env.AP!,
        process.env.APPW!,
        './auth/accounting.json',
        url.users.accounting.accountingPage
      );
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionsColAccounting();
      await eprFormFields.RejectARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearchAccounting();
      await shared.AccGetStatus();
      })

        console.log('✅ Rejection of Request by Accounting ✅ PASSED');
  });

  test('Return of Request L1', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
      // Perform actions
      await requestPage.ClickNewRequest();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq()
      await shared.UseSearch(latestEPR);


      // Logout Requestor
      await shared.ClickLogout();

      });

      await test.step("Returned by Approver L1", async()=>{
      // Login as Approver 1
        await loginFlow.login(
        process.env.MNGR!,
        process.env.MNGRPW!,
        './auth/approver1.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ReturnARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      console.log('✅ Rejection of Request by L1 ✅ PASSED');
  });

  test('Return of Request by Accounting', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
      // Perform actions
      await requestPage.ClickNewRequest();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(latestEPR);


      // Logout Requestor
      await shared.ClickLogout();

      });

      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
            await loginFlow.login(
        process.env.MNGR!,
        process.env.MNGRPW!,
        './auth/approver1.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Approved by Approver L2", async()=>{
      // Login as Approver 1
       await loginFlow.login(
        process.env.AVP!,
        process.env.AVPPW!,
        './auth/approver2.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })

      await test.step("Approved by Approver L3", async()=>{
      // Login as Approver 1
       await loginFlow.login(
        process.env.VP!,
        process.env.VPPW!,
        './auth/approver3.json',
        url.users.approver.approvalsPage
      );
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionCol(latestEPR);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearch(latestEPR);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Returned by Accounting", async()=>{


        await loginFlow.login(
        process.env.AP!,
        process.env.APPW!,
        './auth/accounting.json',
        url.users.accounting.accountingPage
      );
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(latestEPR);
      await eprFormFields.ClickActionsColAccounting();
      await eprFormFields.ReturnARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(latestEPR);
      await shared.DoneTabButton.click()
      await shared.UseSearchAccounting();
      await shared.AccGetStatus();
      })

        console.log('✅ Rejection of Request by Accounting ✅ PASSED');
  });
});