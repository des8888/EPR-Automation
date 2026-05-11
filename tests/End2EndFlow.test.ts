import { test, expect, Browser } from '@playwright/test';
import chalk from 'chalk';
import RequestPage from '../pages/Request';
import EprFields from '../pages/EPRformFields';
import url from '../data/pageUrl.json';
import SharedLocator from '../pages/common/shared-locators';
import data from '../data/filterData.json';
import Login from '../pages/loginPage';
import EPR from '../data/eprData.json';
import login from '../data/login.json';
import AdminPage from '../pages/Admin';
import { afterEach } from 'node:test';
import { link } from 'fs';
import { clear, log } from 'console';


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
let resubmittedReturnedEPR = '';

test.describe.configure({ mode: 'parallel' });
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
//********************************************************************************** */
  test.skip('From create request up to MANCOM (amounting to 1M)', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);
    let TC1EPRNo = " " 
    await page.goto(url.loginURL);
    //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
    //Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC1EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(TC1EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Check EPR on other non Approver accounts", async()=>{
      //await loginFlow.login(login.AVP, login.AVPPW);
      await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.ClickLogout();

      //await loginFlow.login(login.VP, login.VPPW);
      await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.ClickLogout();

      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.ClickLogout();

      })

      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.MNGR, login.MNGRPW);
      await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC1EPRNo);
      await eprFormFields.ClickActionCol(TC1EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC1EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Check EPR on other non Approver accounts", async()=>{
      //await loginFlow.login(login.VP, login.VPPW);
      await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.ClickLogout();

      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.ClickLogout();

      })

      await test.step("Approved by Approver L2", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.AVP, login.AVPPW);
      await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC1EPRNo);
      await eprFormFields.ClickActionCol(TC1EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC1EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Check EPR on other non Approver accounts", async()=>{
      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.ClickLogout();

      })
      await test.step("Approved by Approver L3", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.VP, login.VPPW);
      await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC1EPRNo);
      await eprFormFields.ClickActionCol(TC1EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC1EPRNo);
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
      await shared.UseSearch(TC1EPRNo)//);
      await eprFormFields.ClickActionCol(TC1EPRNo);
      await eprFormFields.AcknowledgeARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC1EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC1EPRNo)
      await shared.AccGetStatus();

      await page.close()

      console.log(chalk.green('✅ Request to Approval up to MANCOM (up to 1M) ✅ PASSED'));
  });

});
//********************************************************************************** */
  test.skip('From create request up to Accounting (up to 100k)', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

      let TC2EPRNo = " "

    await page.goto(url.loginURL);
    // await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");

    await test.step('Validate Total amount after Deletion', async()=>{
        const requestPage = new RequestPage(page);
        const eprFormFields = new EprFields(page);

        // Navigate to landing page (session will persist from user-data-dir)
        await page.goto(reqLandingPage);

        // Perform actions
        await requestPage.ClickNewRequest();
        await requestPage.clickNewRequestBtn();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFieldsForRequestor1(page);
        await eprFormFields.SingleFileAttachment();
        for (let i = 1; i <= 3; i++) {
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.ChargeCostCenterDefault();
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

    await test.step("Create a Request", async()=>{
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtBelow100k();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC2EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(TC2EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
    ]);

      });

    //   await test.step("Check EPR on other non Approver accounts", async()=>{
    //   await loginFlow.login(login.AVP, login.AVPPW);
    //   await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
    //   await shared.ClickApprovals();
    //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    //   await shared.ValidateUseSearchforNoData(TC2EPRNo);
    //   await shared.ClickLogout();

    //   await loginFlow.login(login.VP, login.VPPW);
    //   await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
    //   await shared.ClickApprovals();
    //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    //   await shared.ValidateUseSearchforNoData(TC2EPRNo);
    //   await shared.ClickLogout();

    //   await loginFlow.login(login.AP, login.APPW);
    //   await shared.clickAccounting();
    //   await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
    //   await shared.ValidateUseSearchforNoData(TC2EPRNo);
    //   await shared.ClickLogout();

    //   })


      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC2EPRNo);
      await eprFormFields.ClickActionCol(TC2EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC2EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC2EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      //await test.step("Check EPR on other non Approver accounts", async()=>{
      //   await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(TC2EPRNo);
      //   await shared.ClickLogout();

      //   await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(TC2EPRNo);
      //   await shared.ClickLogout();

      //})

      await test.step("Approved by Accounting", async()=>{
      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC2EPRNo)//);
      await eprFormFields.ClickActionCol(TC2EPRNo);
      await eprFormFields.AcknowledgeARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC2EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearchAccounting();
      await shared.AccGetStatus();
      await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogout(),
        ]);
        await page.close();
      })
      console.log('✅ Request to Approval up to Department Manager (up to 100k) ✅ PASSED');
  });
//********************************************************************************** */
  test.skip('From create request up to AsstVP (up to 500k)', async ({ page }) => {

  const requestPage = new RequestPage(page);
  const eprFormFields = new EprFields(page);
  const shared = new SharedLocator(page);
  const loginFlow = new Login(page);

  let TC3EPRNo = " "
    await page.goto(url.loginURL);
    // await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
  // ───────────────────────────────────────────────
  // STEP 1: Requestor creates an EPR
  // ───────────────────────────────────────────────
  await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtUpTo500k();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC3EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(TC3EPRNo);


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
    await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
    await shared.ClickApprovals();

    await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    await shared.UseSearch(TC3EPRNo);

    await eprFormFields.ClickActionCol(TC3EPRNo);
    await eprFormFields.ApproveARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(TC3EPRNo);

    await shared.DoneTabButton.click();
    await shared.UseSearch(TC3EPRNo);
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
    await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
    await shared.ClickApprovals();
    await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    await shared.UseSearch(TC3EPRNo);

    await eprFormFields.ClickActionCol(TC3EPRNo);
    await eprFormFields.ApproveARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(TC3EPRNo);

    await shared.DoneTabButton.click();
    await shared.UseSearch(TC3EPRNo);
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
    await shared.UseSearch(TC3EPRNo);

    await eprFormFields.ClickActionCol(TC3EPRNo);
    await eprFormFields.AcknowledgeARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(TC3EPRNo);

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


//********************************************************************************** */
  test.skip('From create request to Accounting Approval for PROC team (up to 1M)', async ({ page }) => {

  const requestPage = new RequestPage(page);
  const eprFormFields = new EprFields(page);
  const shared = new SharedLocator(page);
  const loginFlow = new Login(page);

  let TC4EPRNo = " ";

    await page.goto(url.loginURL);
    await loginFlow.login(login.ASST, login.ASSTPW);
    await page.waitForLoadState("domcontentloaded");
  // ───────────────────────────────────────────────
  // STEP 1: Requestor creates an EPR
  // ───────────────────────────────────────────────
 await test.step("Create a Request", async()=>{

      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFields(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterforPROC();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC4EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(TC4EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);
  });
  // ───────────────────────────────────────────────
  // STEP 1: Check on different account if EPR is existing
  // ───────────────────────────────────────────────
//  await test.step("Check EPR on other non Approver accounts", async () => {
//         // L2 Login check
//         await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
//         await shared.ClickApprovals();
//         await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
//         await shared.ValidateUseSearchforNoData(TC4EPRNo);
//         let noMessage1 = await shared.NoDataMessage.innerText();
//         await expect(noMessage1).toBe(data.NoDataMessage);
//         await shared.ClickLogout();

//         // L3 Login check
//         await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
//         await shared.ClickApprovals();
//         await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
//         await shared.ValidateUseSearchforNoData(TC4EPRNo);
//         let noMessage2 = await shared.NoDataMessage.innerText();
//         await expect(noMessage2).toBe(data.NoDataMessage);
// await shared.ClickLogout();

//         // Accounting check
//         await loginFlow.login(login.AP, login.APPW);
//         await shared.clickAccounting();
//         await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
//         await shared.ValidateUseSearchforNoData(TC4EPRNo);
//         let noMessage3 = await shared.NoDataMessage.innerText();
//         await expect(noMessage3).toBe(data.NoDataMessage);
// await shared.ClickLogout();
//       });

  // ───────────────────────────────────────────────
  // STEP 2: Approver L1
  // ───────────────────────────────────────────────
  await test.step("Approved by Approver L1", async () => {
    await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
    await shared.ClickApprovals();

    await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
    await shared.UseSearch(TC4EPRNo);

    await eprFormFields.ClickActionCol(TC4EPRNo);
    await eprFormFields.ApproveARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(TC4EPRNo);

    await shared.DoneTabButton.click();
    await shared.UseSearch(TC4EPRNo);
    await shared.GetStatus();

    await Promise.all([
      page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
      shared.ClickLogout(),
    ]);
  });

  // ───────────────────────────────────────────────
  // STEP 3: Approver L2 (AVP)
  // ───────────────────────────────────────────────
//   await test.step("Check EPR on other non Approver accounts", async () => {
//         // L2 Login check
//         await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
//         await shared.ClickApprovals();
//         await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
//         await shared.ValidateUseSearchforNoData(TC4EPRNo);
//         let noMessage1 = await shared.NoDataMessage.innerText();
//         await expect(noMessage1).toBe(data.NoDataMessage);
//         await shared.ClickLogout();

//         // L3 Login check
//         await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
//         await shared.ClickApprovals();
//         await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
//         await shared.ValidateUseSearchforNoData(TC4EPRNo);
//         let noMessage2 = await shared.NoDataMessage.innerText();
//         await expect(noMessage2).toBe(data.NoDataMessage);
// await shared.ClickLogout();
//       });

  // ───────────────────────────────────────────────
  // STEP 4: Accounting Approval
  // ───────────────────────────────────────────────
  await test.step("Approved by Accounting", async () => {
    await loginFlow.login(login.AP, login.APPW);
    await shared.clickAccounting();
    await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
    await shared.UseSearch(TC4EPRNo);

    await eprFormFields.ClickActionCol(TC4EPRNo);
    await eprFormFields.AcknowledgeARequest();

    await shared.ToastNotificationMessage();
    await shared.ValidateUseSearchforNoData(TC4EPRNo);

    await shared.DoneTabButton.click();
    await shared.UseSearchAccounting();
    await shared.AccGetStatus();

    await Promise.all([
      page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
      shared.ClickLogout(),
    ]);

    await page.close();
  });

  console.log('✅Request to Approval for PROC team (up to 1M) — PASSED');

});

//********************************************************************************** */
//REJECTIONS

  test.skip('Rejection of Request L1', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);
    
    let TC5EPRNo = ""
    await page.goto(url.loginURL);
    //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
    //Navigate to landing page (session is already logged in)
    await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC5EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(TC5EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Rejected by Approver L1", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.MNGR, login.MNGRPW);
      await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC5EPRNo);
      await eprFormFields.ClickActionCol(TC5EPRNo);
      await eprFormFields.RejectARequestwithNote();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC5EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC5EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })

      await test.step("Check if Rejected EPR is displayed on AP account", async()=>{
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
        await shared.DoneTabButton.click()
        await shared.ValidateUseSearchforNoData(TC5EPRNo);
      })
      await page.close();

      console.log('✅ Rejection of Request by L1 ✅ PASSED');
  });
//*********************************************************************************** */
  test.skip('Rejection of Request by Accounting', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    let TC6EPRNo = ""

    await page.goto(url.loginURL);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC6EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(TC6EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC6EPRNo);
      await eprFormFields.ClickActionCol(TC6EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC6EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC6EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Approved by Approver L2", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC6EPRNo);
      await eprFormFields.ClickActionCol(TC6EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC6EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC6EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })

      await test.step("Approved by Approver L3", async()=>{
      // Login as Approver 1
      await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC6EPRNo);
      await eprFormFields.ClickActionCol(TC6EPRNo);
      await eprFormFields.ApproveARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC6EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC6EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Rejected by Accounting", async()=>{


      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC6EPRNo)//);
      await eprFormFields.ClickActionCol(TC6EPRNo);
      await eprFormFields.RejectARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC6EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC6EPRNo);
      await shared.AccGetStatus();
      })

        console.log('✅ Rejection of Request by Accounting ✅ PASSED');
  });

  //RETURNS
//*********************************************************************************** */
  test.skip('Return of Request L1', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    let ReturnReqEPR = ''
    await page.goto(url.loginURL);
    //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      ReturnReqEPR = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(ReturnReqEPR);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Returned by Approver L1", async()=>{
        const loginFlow = new Login(page);

        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(ReturnReqEPR);
        await eprFormFields.ClickActionCol(ReturnReqEPR);
        await eprFormFields.ReturnARequest();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(ReturnReqEPR);
        await shared.DoneTabButton.click()
        await shared.UseSearch(ReturnReqEPR);
        await shared.GetStatus();

        // Logout 
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

        })

      await test.step("Check if Rejected EPR is displayed on AP account", async()=>{
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
        await shared.DoneTabButton.click()
        await shared.ValidateUseSearchforNoData(ReturnReqEPR);
      })
      console.log('✅ Rejection of Request by L1 ✅ PASSED');
  });
//*********************************************************************************** */
  test.skip('Return of Request by Accounting', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);
    let ReturnReqAccounting = '';

    await page.goto(url.loginURL);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      ReturnReqAccounting = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq();
      await shared.UseSearch(ReturnReqAccounting);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Approved by Approver L1", async()=>{
      // Login as Approver 1
        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(ReturnReqAccounting);
        await eprFormFields.ClickActionCol(ReturnReqAccounting);
        await eprFormFields.ApproveARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(ReturnReqAccounting);
        await shared.DoneTabButton.click()
        await shared.UseSearch(ReturnReqAccounting);
        await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Approved by Approver L2", async()=>{
      // Login as Approver 1
        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(ReturnReqAccounting);
        await eprFormFields.ClickActionCol(ReturnReqAccounting);
        await eprFormFields.ApproveARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(ReturnReqAccounting);
        await shared.DoneTabButton.click()
        await shared.UseSearch(ReturnReqAccounting);
        await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })

      await test.step("Approved by Approver L3", async()=>{
      // Login as Approver 3
        await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(ReturnReqAccounting);
        await eprFormFields.ClickActionCol(ReturnReqAccounting);
        await eprFormFields.ApproveARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(ReturnReqAccounting);
        await shared.DoneTabButton.click()
        await shared.UseSearch(ReturnReqAccounting);
        await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogoutL1();

      })
      
      await test.step("Returned by Accounting", async()=>{
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
        await shared.UseSearch(ReturnReqAccounting);
        await eprFormFields.ClickActionCol(ReturnReqAccounting);
        await eprFormFields.ReturnARequest();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(ReturnReqAccounting);
        await shared.DoneTabButton.click()
        await shared.UseSearchAccounting();
        await shared.AccGetStatus();
      })

        console.log('✅ Rejection of Request by Accounting ✅ PASSED');
  });

   //EDIT RETURNED EPR
//*********************************************************************************** */
  test.skip('EDIT RETURNED EPR AND RESUBMISSION', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    let TC7EPRNo = ""

    await page.goto(url.loginURL);
    // await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState("domcontentloaded");
    // Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{

      
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForReturningEPRRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC7EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq()
      await shared.UseSearch(TC7EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Returned by Approver L1", async()=>{
        const loginFlow = new Login(page);

        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.waitForSelectMultiBtn();
        await page.waitForTimeout(1000);
        await shared.UseSearch(TC7EPRNo);
        await eprFormFields.ClickActionCol(TC7EPRNo);
        await eprFormFields.ReturnARequest();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(TC7EPRNo);
        await shared.DoneTabButton.click()
        await shared.UseSearch(TC7EPRNo);
        await shared.GetStatus();

        // Logout 
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

        })

      await test.step("Check if Returned EPR is displayed on AP account", async()=>{
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL('**accounting?tab=pending-approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoDatainDoneTab(TC7EPRNo);

                // Logout 
        await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);
      })

      await test.step("Compare EPR details", async()=>{
        await loginFlow.login(login.USER, login.PW);
        await requestPage.SummaryTab.click()
        await shared.EPRColumn.waitFor({state:'visible', timeout: 5000})
        await shared.UseSearch(TC7EPRNo);
        await eprFormFields.ClickActionCol(TC7EPRNo)
        await eprFormFields.EditReturnedRequest();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.CompareEPRDetails();
      })

      await test.step("Edit Form for resubmission", async()=>{
        await eprFormFields.EditReturnedEPRforResubmission(TC7EPRNo);
        await eprFormFields.ClickNext();
        await eprFormFields.ClickSubmitRequest();
        await eprFormFields.ClickSubmit();
        await requestPage.waitForViewofViewAllReq();
        await page.waitForTimeout(5000);
        resubmittedReturnedEPR = await eprFormFields.GetNewEPRNo();
        console.log(`The new ressubmitted EPR #: ${resubmittedReturnedEPR} from EPR: ${TC7EPRNo}`)
        console.log("✅ RESSUBMISSION of RETURNED EPR PASSED ✅")
      })
      await page.close();


      console.log('✅ EDIT RETURNED EPR AND RESUBMISSION ✅ PASSED');
  });


    //APPROVAL DELEGATION E2E
//*********************************************************************************** */
  test.skip('Approval Delegation E2E', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);
    const admin = new AdminPage(page)

    let TC8EPRNo = ""

    await page.goto(url.loginURL);
    // await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);

      await test.step("Create New Delegation", async()=>{

      await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      await page.waitForLoadState("domcontentloaded");
      await page.goto(url.users.approver.adminPage);
      await page.waitForURL('**/approval-delegation', { waitUntil: "domcontentloaded" });
      // Perform actions
      await admin.createDelegation(); //approver3
      await shared.ToastNotificationMessage();


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });
      await test.step("Create a Request", async()=>{

      await loginFlow.login(login.USER, login.PW);
      await page.goto(reqLandingPage);
      await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });
      // Perform actions
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForReturningEPRRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.ChargeCostCenterDefault();
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      await page.waitForTimeout(5000);
      TC8EPRNo = await eprFormFields.GetNewEPRNo();
      await requestPage.ClickViewAllReq()
      await shared.UseSearch(TC8EPRNo);


      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });

      await test.step("Check EPR if visible on default approver, Approver L1", async()=>{
        const loginFlow = new Login(page);

        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.waitForSelectMultiBtn();
        await page.waitForTimeout(1000);
        await shared.ValidateUseSearchforNoData(TC8EPRNo);

        // Logout 
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

      })

      await test.step("Check EPR if visible on default approver, Approver L2", async()=>{
        const loginFlow = new Login(page);

        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.waitForSelectMultiBtn();
        await page.waitForTimeout(1000);
        await shared.ValidateUseSearchforNoData(TC8EPRNo);

        // Logout 
      await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

      })

      await test.step("Approved by Approver3 L1", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.MNGR, login.MNGRPW);
      await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC8EPRNo);
      await eprFormFields.ClickActionCol(TC8EPRNo);
      await eprFormFields.ApproveARequestwithNote();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC8EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC8EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Approved by Approver2 L2", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.MNGR, login.MNGRPW);
      await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC8EPRNo);
      await eprFormFields.ClickActionCol(TC8EPRNo);
      await eprFormFields.ApproveARequestwithNote();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC8EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC8EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Approved by Approver3 L1", async()=>{
      // Login as Approver 1
      //await loginFlow.login(login.MNGR, login.MNGRPW);
      await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      await shared.ClickApprovals();
      await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC8EPRNo);
      await eprFormFields.ClickActionCol(TC8EPRNo);
      await eprFormFields.ApproveARequestwithNote();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC8EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC8EPRNo);
      await shared.GetStatus();

      // Logout Requestor
      await shared.ClickLogout();

      })

      await test.step("Approved by Accounting", async()=>{
      await loginFlow.login(login.AP, login.APPW);
      await shared.clickAccounting();
      await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      await shared.UseSearch(TC8EPRNo)//);
      await eprFormFields.ClickActionCol(TC8EPRNo);
      await eprFormFields.AcknowledgeARequest();
      await shared.ToastNotificationMessage();
      await shared.ValidateUseSearchforNoData(TC8EPRNo);
      await shared.DoneTabButton.click()
      await shared.UseSearch(TC8EPRNo)
      await shared.AccGetStatus();

      console.log(chalk.green('✅ Request to Approval up to MANCOM (up to 1M) ✅ PASSED'));
  });

      await page.close();


      console.log('✅ Approval Delegation E2E ✅ PASSED');
  });

//Navigation Validation Test
//*********************************************************************************** */
  test.skip('Navigation Validation Test', async ({ page }) => {
    
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);
    const admin = new AdminPage(page)

    await page.goto(url.loginURL);
    // await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);

    await test.step("Request Navigations", async()=>{

      await loginFlow.login(login.USER, login.PW);
      await expect(page).toHaveURL(/requests/)
      console.log(chalk.green('=== ✔️ URL is /requests/ ==='));
      //drafts
      await requestPage.ClickNewRequest();
      await requestPage.clickDrafts();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(url.users.requestor.drafts)
      await expect(requestPage.EPRDraftsTxt).toHaveText('EPR Drafts')
      await shared.validateURL(/drafts/, "URL is /drafts/");
      //epr creation
      await page.goto(url.users.requestor.requestLandingPage)
      await requestPage.ClickNewRequest();
      await requestPage.clickNewRequestBtn();
      await expect(page).toHaveURL(/new/)
      console.log(chalk.green('=== ✔️ URL is /new/ ==='));    
      await eprFormFields.AddTransBtn().waitFor();
      await eprFormFields.InputOnFieldsForRequestor1(page);
      await eprFormFields.SingleFileAttachment();
      await eprFormFields.AddTransBtn().click();
      await eprFormFields.InputFieldsonTransactions2(page);
      await eprFormFields.FillNetAmtupTo1M();
      await eprFormFields.ClickAddNewTransactions();
      await eprFormFields.ClickNext();
      await eprFormFields.ClickSubmitRequest();
      await eprFormFields.ClickSubmit();
      await requestPage.waitForViewofViewAllReq();
      latestEPR = await eprFormFields.GetNewEPRNo();
      //click submit another
      await eprFormFields.clickSubmitAnotherEPR();
      await eprFormFields.AddTransBtn().waitFor()
      await shared.validateURL(/new/, "URL is /new/");
      // Approval hierarchy
      await page.evaluate(() => window.history.back());
      await page.waitForLoadState('networkidle');
      await shared.clickViewApprovalHierarchyBtn();
      await expect(shared.ApprovalHierarchysidepanelisVisible).toBeVisible();
      console.log(chalk.green('=== ✔️ Approval Hierarchy side panel is visible ==='));
      await shared.closeApprovalHierarchysidepanel();
      await requestPage.waitForViewofViewAllReq();
      //ViewAllReq
      await shared.clickViewAllRequetsBtn();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(url.users.requestor.viewAllRequests)
      await shared.validateURL(/requests/, "URL is /requests/");

      //clicking EPR link
      await shared.EPRColumn.click();
      //approval hierarchy
      await requestPage.waitForViewofViewAllReq();
      await shared.clickViewApprovalHierarchyBtn();
      await shared.ApprovalHierarchysidepanelisVisible.isVisible();
      console.log(chalk.green('=== ✔️ Approval Hierarchy side panel is visible ==='));
      await shared.closeApprovalHierarchysidepanel();
      
      //ViewAllReq
      await shared.clickViewAllRequetsBtn();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(url.users.requestor.viewAllRequests)
      await shared.validateURL(/requests/, "URL is /requests/");

      // Logout Requestor
        await Promise.all([
          page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
          shared.ClickLogoutL1(),
        ]);

      });
      await page.close();


      console.log('✅ Request Navigations ✅ PASSED');
  });

//CROSS DEPARTMENT REQUEST
//*********************************************************************************** */
  test.skip('CROSS DEPARTMENT Request to Approval up to MANCOM (up to 1M)', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

      let TC9EPRNo = ""

      await page.goto(url.loginURL);
      //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await loginFlow.login(login.USER, login.PW);
      await page.waitForLoadState("domcontentloaded");
      //Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{
        await page.goto(reqLandingPage);
        await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

        // Perform actions
        await requestPage.ClickNewRequest();
        await requestPage.clickNewRequestBtn();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFieldsForRequestor1(page);
        await eprFormFields.SingleFileAttachment();
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.ChargeCostCenterforCrossDept();
        await eprFormFields.ValidateDIfferentChargeCostBanner();
        await eprFormFields.AddJustification();
        await eprFormFields.FillNetAmtupTo1M();
        await eprFormFields.ClickAddNewTransactions();
        await eprFormFields.ClickNext();
        await eprFormFields.ClickSubmitRequest();
        await eprFormFields.ClickSubmit();
        await requestPage.waitForViewofViewAllReq();
        await page.waitForTimeout(5000);
        TC9EPRNo = await eprFormFields.GetNewEPRNo();
        await requestPage.ClickViewAllReq();
        await shared.UseSearch(TC9EPRNo);


        // Logout Requestor
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

        });

      // await test.step("Check EPR on other non Approver accounts", async()=>{
      //   //await loginFlow.login(login.AVP, login.AVPPW);
      //   await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(TC9EPRNo);
      //   await shared.ClickLogout();


      //   await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(TC9EPRNo);
      //   await shared.ClickLogout();

      //   //await loginFlow.login(login.VP, login.VPPW);
      //   await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(TC9EPRNo);
      //   await shared.ClickLogout();

      //   await loginFlow.login(login.AP, login.APPW);
      //   await shared.clickAccounting();
      //   await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(TC9EPRNo);
      //   await shared.ClickLogout();

      //   });

      await test.step("Approved by DIST Dept Head", async()=>{
        // Login as Approver 1
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.DIST_DEPT_HEAD, login.DIST_DEPT_HEAD_PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(TC9EPRNo);
        await eprFormFields.ClickActionCol(TC9EPRNo);
        await eprFormFields.ApproveConfirmationVPofDifferentChargeCost();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(TC9EPRNo);
        await shared.DoneTabButton.click()
        await shared.UseSearch(TC9EPRNo);
        await shared.GetStatus();

        // Logout Requestor
        await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);
        })
      await test.step("Approved by Approver L1", async()=>{
        // Login as Approver 1
        //await loginFlow.login(login.MNGR, login.MNGRPW);
        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(TC9EPRNo);
        await eprFormFields.ClickActionCol(TC9EPRNo);
        await eprFormFields.ApproveARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(TC9EPRNo);
        await shared.DoneTabButton.click()
        await shared.UseSearch(TC9EPRNo);
        await shared.GetStatus();

        // Logout Requestor
        await shared.ClickLogout();

        })

      await test.step("Approved by Approver L2", async()=>{
        // Login as Approver 1
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(TC9EPRNo);
        await eprFormFields.ClickActionCol(TC9EPRNo);
        await eprFormFields.ApproveARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(TC9EPRNo);
        await shared.DoneTabButton.click()
        await shared.UseSearch(TC9EPRNo);
        await shared.GetStatus();

        // Logout Requestor
        await shared.ClickLogout();

        })
      await test.step("Approved by Approver L3", async()=>{
        // Login as Approver 1
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(TC9EPRNo);
        await eprFormFields.ClickActionCol(TC9EPRNo);
        await eprFormFields.ApproveARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(TC9EPRNo);
        await shared.DoneTabButton.click()
        await shared.UseSearch(TC9EPRNo);
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
        await shared.UseSearch(TC9EPRNo)//);
        await eprFormFields.ClickActionCol(TC9EPRNo);
        await eprFormFields.AcknowledgeARequest();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(TC9EPRNo);
        await shared.DoneTabButton.click()
        await shared.UseSearch(TC9EPRNo)
        await shared.AccGetStatus();

        await page.close()

        console.log(chalk.green('✅ CROSS DEPARTMENT Request to Approval up to MANCOM (up to 1M) ✅ PASSED'));
    });

      
  });

  test.skip('CROSS DEPARTMENT Request to Rejection up to VP cost center (1M amount)', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

      await page.goto(url.loginURL);
      //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await loginFlow.login(login.USER, login.PW);
      await page.waitForLoadState("domcontentloaded");
      //Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{
        await page.goto(reqLandingPage);
        await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

        // Perform actions
        await requestPage.ClickNewRequest();
        await requestPage.clickNewRequestBtn();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFieldsForRequestor1(page);
        await eprFormFields.SingleFileAttachment();
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.ChargeCostCenterforCrossDept();
        await eprFormFields.ValidateDIfferentChargeCostBanner();
        await eprFormFields.AddJustification();
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

      // await test.step("Check EPR on other non Approver accounts", async()=>{
      //   //await loginFlow.login(login.AVP, login.AVPPW);
      //   await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(latestEPR);
      //   await shared.ClickLogout();


      //   await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(latestEPR);
      //   await shared.ClickLogout();

      //   //await loginFlow.login(login.VP, login.VPPW);
      //   await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
      //   await shared.ClickApprovals();
      //   await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(latestEPR);
      //   await shared.ClickLogout();

      //   await loginFlow.login(login.AP, login.APPW);
      //   await shared.clickAccounting();
      //   await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
      //   await shared.ValidateUseSearchforNoData(latestEPR);
      //   await shared.ClickLogout();

      //   });

      await test.step("Reject by DIST Dept Head", async()=>{
        // Login as Approver 1
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.DIST_DEPT_HEAD, login.DIST_DEPT_HEAD_PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(latestEPR);
        await eprFormFields.ClickActionCol(latestEPR);
        await eprFormFields.RejectARequestwithNote();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.DoneTabButton.click()
        await shared.UseSearch(latestEPR);
        await shared.GetStatus();
        await requestPage.clickEPRNoCol();
        await shared.clickViewApprovalHierarchyBtn()
        await shared.GetVPApprovalHierarchyDetails(page);
        })

        await page.close()

        console.log(chalk.green('✅ CROSS DEPARTMENT Request to Rejection up to VP cost center (1M amount) ✅ PASSED'));
  });

  test('User(DIST) Create a Request for Cost Center VP using his Deafult Cost Center', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

      let ccVPEPR = ''
      await page.goto(url.loginURL);
      //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await loginFlow.login(login.DIST_DEPT_HEAD, login.DIST_DEPT_HEAD_PW);
      await page.waitForLoadState("domcontentloaded");
      //Navigate to landing page (session is already logged in)
      await test.step("Create a Request", async()=>{
        await page.goto(reqLandingPage);
        await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

        // Perform actions
        await requestPage.ClickNewRequest();
        await requestPage.clickNewRequestBtn();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFieldsForRequestor1(page);
        await eprFormFields.SingleFileAttachment();
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.ChargeCostCenterDefault();
        await eprFormFields.FillNetAmtupTo1M();
        await eprFormFields.ClickAddNewTransactions();
        await eprFormFields.ClickNext();
        await eprFormFields.ClickSubmitRequest();
        await eprFormFields.ClickSubmit();
        await requestPage.waitForViewofViewAllReq();
        await page.waitForTimeout(5000);
        ccVPEPR = await eprFormFields.GetNewEPRNo();
        await requestPage.ClickViewAllReq();
        await requestPage.ClickSummaryTab()
        await shared.UseSearch(ccVPEPR);
        await requestPage.clickEPRNoCol();
        await shared.clickViewApprovalHierarchyBtn()
        await shared.ValidateApprovalHierarchy(page);

        // Logout Requestor
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

      });

        await test.step("Check EPR on other non Approver accounts, Approver L1", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(ccVPEPR);
        await shared.ClickLogout();
        });
        await test.step("Check EPR on other non Approver accounts, Approver L2", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(ccVPEPR);
        await shared.ClickLogout();
        });
        await test.step("Check EPR on other non Approver accounts, Approver L3", async()=>{
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(ccVPEPR);
        await shared.ClickLogout();
        });

        await test.step("Approved by Accounting", async()=>{
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
        await shared.UseSearch(ccVPEPR)//);
        await eprFormFields.ClickActionCol(ccVPEPR);
        await eprFormFields.AcknowledgeARequest();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(ccVPEPR);
        await shared.DoneTabButton.click()
        await shared.UseSearch(ccVPEPR)
        await shared.AccGetStatus();

        await page.close()
    });
        console.log(chalk.green('✅ Create Request of SLT VP ✅ PASSED'));
  });


  test('Create a Request to SLT VP & AP Approval up to MANCOM (up to 1M)', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

      await page.goto(url.loginURL);
      //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await page.waitForLoadState("domcontentloaded");
      //Navigate to landing page (session is already logged in)
        await test.step("Create a Request", async()=>{

        
        await page.goto(reqLandingPage);
        await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

        // Perform actions
        await requestPage.ClickNewRequest();
        await requestPage.clickNewRequestBtn();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFields(page);
        await eprFormFields.SingleFileAttachment();
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.ChargeCostCenterDefault();
        await eprFormFields.FillNetAmtupTo1M();
        await eprFormFields.ClickAddNewTransactions();
        await eprFormFields.ClickNext();
        await eprFormFields.ClickSubmitRequest();
        await eprFormFields.ClickSubmit();
        await requestPage.waitForViewofViewAllReq();
        await page.waitForTimeout(5000);
        latestEPR = await eprFormFields.GetNewEPRNo();
        await requestPage.ClickViewAllReq();
        await requestPage.ClickSummaryTab();
        await shared.UseSearch(latestEPR);


        // Logout Requestor
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

        });

        await test.step("Check EPR on other non Approver accounts, Approver L1", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
        });
        await test.step("Check EPR on other non Approver accounts, Approver L2", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
        });
        await test.step("Check EPR on other non Approver accounts, Approver L3", async()=>{
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
        });

        await test.step("Approved by Accounting", async()=>{
        await loginFlow.login(login.AP, login.APPW);
        await shared.clickAccounting();
        await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
        await shared.UseSearch(latestEPR)//);
        await eprFormFields.ClickActionCol(latestEPR);
        await eprFormFields.AcknowledgeARequest();
        await shared.ToastNotificationMessage();
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.DoneTabButton.click()
        await shared.UseSearch(latestEPR)
        await shared.AccGetStatus();

        await page.close()

        console.log(chalk.green('✅ SLT Request to AP Approval up to MANCOM (up to 1M) ✅ PASSED'));
    });

  });


  test('Cross Department SLT VP Request to AP Approval (up to 1M)', async ({ page }) => {
      
      const requestPage = new RequestPage(page);
      const eprFormFields = new EprFields(page);
      const shared = new SharedLocator(page);
      const loginFlow = new Login(page);

      await page.goto(url.loginURL);
      //await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
      await page.waitForLoadState("domcontentloaded");
      //Navigate to landing page (session is already logged in)


      await test.step("Create a Request", async()=>{

        await page.goto(reqLandingPage);
        await page.waitForURL('**/requests', { waitUntil: "domcontentloaded" });

        // Perform actions
        await requestPage.ClickNewRequest();
        await requestPage.clickNewRequestBtn();
        await eprFormFields.AddTransBtn().waitFor();
        await eprFormFields.InputOnFields(page);
        await eprFormFields.SingleFileAttachment();
        await eprFormFields.AddTransBtn().click();
        await eprFormFields.InputFieldsonTransactions2(page);
        await eprFormFields.ChargeCostCenterforCrossDept();
        await eprFormFields.FillNetAmtupTo1M();
        await eprFormFields.ClickAddNewTransactions();
        await eprFormFields.ClickNext();
        await eprFormFields.ClickSubmitRequest();
        await eprFormFields.ClickSubmit();
        await requestPage.waitForViewofViewAllReq();
        await page.waitForTimeout(5000);
        latestEPR = await eprFormFields.GetNewEPRNo();
        await requestPage.ClickViewAllReq();
        await requestPage.ClickSummaryTab();
        await shared.UseSearch(latestEPR);


        // Logout Requestor
          await Promise.all([
            page.waitForURL(url.loginURL, { waitUntil: "domcontentloaded" }),
            shared.ClickLogoutL1(),
          ]);

        });

      await test.step("Check EPR on other non Approver accounts, Approver L1", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
      });
      await test.step("Check EPR on other non Approver accounts, Approver L2", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
      });

      await test.step("Check EPR on other non Approver accounts, Approver L3", async()=>{
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
      });

      await test.step("Approved by DIST Dept Head", async()=>{
        // Login as Approver 1
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.DIST_DEPT_HEAD, login.DIST_DEPT_HEAD_PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.UseSearch(latestEPR);
        await eprFormFields.ClickActionCol(latestEPR);
        await eprFormFields.ApproveARequestwithNote();
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

      await test.step("Check EPR on other non Approver accounts, Approver L1", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
      });
      await test.step("Check EPR on other non Approver accounts, Approver L2", async()=>{
        //await loginFlow.login(login.AVP, login.AVPPW);
        await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
      });

      await test.step("Check EPR on other non Approver accounts, Approver L3", async()=>{
        //await loginFlow.login(login.VP, login.VPPW);
        await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
        await shared.ClickApprovals();
        await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
        await shared.ValidateUseSearchforNoData(latestEPR);
        await shared.ClickLogout();
      });

      await test.step("Approved by Accounting", async()=>{
          await loginFlow.login(login.AP, login.APPW);
          await shared.clickAccounting();
          await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
          await shared.UseSearch(latestEPR)//);
          await eprFormFields.ClickActionCol(latestEPR);
          await eprFormFields.AcknowledgeARequest();
          await shared.ToastNotificationMessage();
          await shared.ValidateUseSearchforNoData(latestEPR);
          await shared.DoneTabButton.click()
          await shared.UseSearch(latestEPR)
          await shared.AccGetStatus();

          await page.close()

        console.log(chalk.green('✅ SLT Request to AP Approval up to MANCOM (up to 1M) ✅ PASSED'));
    });
  });
});