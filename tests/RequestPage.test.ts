import { test, expect } from '@playwright/test';
import RequestPage from '../pages/Request';
import eprFields from '../pages/EPRformFields';
import url from '../data/pageUrl.json';
import SharedLocator from '../pages/common/shared-locators';
import Login from '../pages/loginPage';
import login from '../data/login.json';

const reqLandingPage = url.users.requestor.requestLandingPage;

//
// ─── GLOBAL HOOKS ─────────────────────────────────────────────────────────────
//

test.beforeAll(async ({}, testInfo) => {
  const time = new Date().toString();
  testInfo.annotations.push({
    type: 'Test Suite Execution Started At',
    description: time,
  });
});

test.afterAll(async ({}, testInfo) => {
  const time = new Date().toString();
  testInfo.annotations.push({
    type: 'Test Suite Execution Finished At',
    description: time,
  });
});

//
// ─── REQUESTOR FLOW SUITE ─────────────────────────────────────────────────────
//

test.describe('Requestor Flow', () => {
  
  test.beforeEach(async ({ page }, testInfo) => {
    const time = new Date().toString();
    testInfo.annotations.push({
      type: 'Test Case Execution Started At',
      description: time,
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    const time = new Date().toString();

    if (testInfo.status === testInfo.expectedStatus) {
      testInfo.annotations.push({
        type: 'Test Execution Status',
        description: 'Passed',
      });
    } else {
      testInfo.annotations.push(
        { type: 'Test Case Title', description: testInfo.title },
        { type: 'Test Case Status', description: testInfo.status },
      );
    }

    testInfo.annotations.push({
      type: 'Test Case Execution Finished At',
      description: time,
    });
  });

  //
  // ─── TEST CASE: CREATE NEW REQUEST ───────────────────────────────────────────
  //

  test.only('Create New Request', async ({ page }) => {
    let latestEPR = '';

    const requestPage = new RequestPage(page);
    const eprForm = new eprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    // Login
    await page.goto(url.loginURL);
    await loginFlow.login(login.ASSTMNGR, login.ASSTMNGRPW);
    await page.waitForLoadState('domcontentloaded');

    // Navigate to Request Landing Page
    await page.goto(reqLandingPage);
    await page.waitForURL('**/requests');

    //
    // ─── CREATE REQUEST FLOW ────────────────────────────────────────────────
    //

    await requestPage.ClickNewRequest();

    await eprForm.AddTransBtn().waitFor();

    await eprForm.InputOnFields(page);
    await eprForm.AddTransBtn().click();

    await eprForm.InputFieldsonTransactions2(page);
    await eprForm.FillNetAmtupTo1M();

    await eprForm.ClickAddNewTransactions();
    await eprForm.ClickNext();
    await eprForm.ClickSubmitRequest();
    await eprForm.ClickSubmit();

    // Wait for confirmation page
    await requestPage.waitForViewofViewAllReq();

    // Get newly created EPR number
    latestEPR = await eprForm.GetNewEPRNo();

    // Navigate to View All Requests and search
    await requestPage.ClickViewAllReq();
    await shared.UseSearch(latestEPR);

    console.log(`\n✅ Successfully created and validated EPR: ${latestEPR}`);
});




// test("Create New Request 10 times", async ({ page }) => {
//   const shared = new SharedLocator(page);
//   let requestNumber: string;
//   for (let i = 1; i <= 10; i++) {
//     console.log(`▶ Creating request #${i}`);

//     const requestPage = new RequestPage(page);
//     const eprFormFields = new eprFields(page);

//     // Navigate to landing page (session will persist from user-data-dir)
//     await page.goto(reqLandingPage);

//     // Perform actions
//     await requestPage.ClickNewRequest();
//       await eprFormFields.AddTransBtn().waitFor();
//       await eprFormFields.InputOnFields(page);
//       await eprFormFields.AddTransBtn().click();
//       await eprFormFields.InputFieldsonTransactions2(page);
//       await eprFormFields.FillNetAmtBelow100k();
//       await eprFormFields.ClickAddNewTransactions();
//       await eprFormFields.ClickNext();
//       await eprFormFields.ClickSubmitRequest();
//       await eprFormFields.ClickSubmit();
//       await requestPage.waitForViewofViewAllReq();
//       await page.waitForTimeout(5000);
//       requestNumber = await eprFormFields.GetNewEPRNo();
//       await requestPage.ClickViewAllReq();
//       await shared.UseSearch(requestNumber);

//     console.log(`✅ Request #${i} creation ✅ PASSED`);
//   }
// });

// test("Validating Category Filter", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   await page.goto(reqLandingPage);
//   await sharedLoc.SelectingCategory();
//   await sharedLoc.GetCategoryDataonTable();
//   console.log("Validating Category Filter on Request page ✅ PASSED")
// })



// test("Validating Sub-Category Filter", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   await page.goto(reqLandingPage);
//   await sharedLoc.GetSubCategoryDataonTable({page});
//   console.log("Validating Sub-Category Filter on Request page ✅ PASSED")
// })


// test("Validating Search Field Filter", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   await page.goto(reqLandingPage);
//   await sharedLoc.ValidateSearchField(page);
//   console.log("Validating Search Field Filter on Request page ✅ PASSED")
// })


// test("Validating Return page after Viewing of EPR", async({page})=>{
//   const requestPage = new RequestPage(page);
//   await page.goto(reqLandingPage);
//   await requestPage.ValidateEPRReturnPage(page);
//   console.log("Validating Return page after Viewing of EPR on Request page ✅ PASSED")
// })


// test("Validation of Date Filters", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   await page.goto(reqLandingPage);
//   await sharedLoc.ValidateDateFilter();
//   console.log("Validation of Date Filter on Request page ✅ PASSED")
// })



// test("Validation of Approver Name filter", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   const reqPage = new RequestPage(page);
//   await page.goto(reqLandingPage)
//   await sharedLoc.ClickFunnelFilter();
//   await reqPage.ApproverNameFilter();
//   await reqPage.SelectAppName();
//   await reqPage.ClickApplyFilter();
//   await reqPage.ApproverNameonPendingReqValidation();
//   console.log("Validation of Approver Name Filter on Pending Req Tab on Request page ✅ PASSED")
//   await reqPage.ClickSummaryTab()
//   await reqPage.ApproverNameonPendingReqValidation();
//   console.log("Validation of Approver Name Filter on SUMMARY Tab on Request page ✅ PASSED")
// })




// test("Validation of Status filter on Summary Tab", async({page})=>{
//   const reqPage = new RequestPage(page);
//   await page.goto(reqLandingPage)
//   await reqPage.ClickSummaryTab();
//   await reqPage.ClickFunnelFilter();
  
//   await reqPage.ClickApplyFilter();
//   await reqPage.ApproverNameonSummaryTabValidation();
//   console.log("Validation of Approver Name Filter on Summary Tab on Request page ✅ PASSED")
// })


// test('Validate Total amount after Deletion', async({page})=>{
//   const requestPage = new RequestPage(page);
//     const eprFormFields = new eprFields(page);

//     // Navigate to landing page (session will persist from user-data-dir)
//     await page.goto(reqLandingPage);

//     // Perform actions
//     await requestPage.ClickNewRequest();
//     await eprFormFields.AddTransBtn().waitFor();
//     await eprFormFields.InputOnFields(page);
//     for (let i = 1; i <= 2; i++) {
//     await eprFormFields.AddTransBtn().click();
//     await eprFormFields.InputFieldsonTransactions(page);
//     await eprFormFields.ClickAddNewTransactions();
//     }
//     await eprFormFields.CountTotalAmount();
//     await eprFormFields.ClickActionCol();
//     await eprFormFields.ClickDelete();
//     await eprFormFields.ClickConfirmDelete();
//     await eprFormFields.CountTotalAmount();
//     console.log("Validate Total amount after Deletion ✅ PASSED")
// })
});