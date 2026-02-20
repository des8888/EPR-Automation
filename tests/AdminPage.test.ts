import {test, expect} from '@playwright/test'
import AdminPage from '../pages/Admin'
import Login from '../pages/loginPage';
import login from '../data/login.json';
import RequestPage from '../pages/Request';
import eprFields from '../pages/EPRformFields';
import url from '../data/pageUrl.json';
import SharedLocator from '../pages/common/shared-locators';


const adminPage = url.users.approver.adminPage;
const reqLandingPage = url.users.requestor.requestLandingPage;


test.beforeAll(async ({}, testInfo) => {
    const time = new Date().toString();
    testInfo.annotations.push({
        type: 'Test Suite Execution Started At',
        description: time,
    })
});

test.afterAll(async ({}, testInfo) => {
  const time = new Date().toString();
  testInfo.annotations.push({
    type: 'Test Suite Execution Finished At',
    description: time,
  });
});

//
// ─── ADMIN FLOW SUITE ─────────────────────────────────────────────────────
//


test.describe('Admin Flow', () => {
  
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

test('Create New Delegation', async ({page}) =>{
    const Admin = new AdminPage(page);
    const loginFlow = new Login(page);

// Login
    await page.goto(url.loginURL);
    await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
    await page.waitForLoadState('domcontentloaded');

    await page.goto(adminPage)
    await page.waitForURL('**/admin/approval-delegation');

    await Admin.createDelegation();
})

test.only('Create New Request', async ({ page }) => {
    let latestEPR = '';
    const Admin = new AdminPage(page);
    const requestPage = new RequestPage(page);
    const eprForm = new eprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    // Login
    await page.goto(url.loginURL);
    await loginFlow.login(login.USER, login.PW);
    await page.waitForLoadState('domcontentloaded');

    // Navigate to Request Landing Page
    await page.goto(reqLandingPage);
    await page.waitForURL('**/requests');

    //
    // ─── CREATE REQUEST FLOW ────────────────────────────────────────────────
    //

    await requestPage.ClickNewRequest();

    await eprForm.AddTransBtn().waitFor();

    await eprForm.InputOnFieldsForRequestor1(page);
    await eprForm.MultipleValidFileAttach();
    await eprForm.AddTransBtn().click();

    await eprForm.InputFieldsonTransactions2(page);
    await eprForm.FillNetAmtupTo1M();

    await eprForm.ClickAddNewTransactions();
    await eprForm.ClickNext();
    await eprForm.ClickSubmitRequest();
    await eprForm.ClickSubmit();

    // Wait for confirmation page
    await Admin.clickApprovalHierarchyBtn();
    await Admin.checkHierarchy();


    console.log(`\n✅ Successfully created and validated EPR: ${latestEPR}`);
});


});