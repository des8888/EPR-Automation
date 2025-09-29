import { test, expect } from '@playwright/test';
import RequestPage from '../pages/Request';
import EprFields from '../pages/EPRformFields';
import url from '../data/pageUrl.json';
import Login from '../pages/loginPage';
import SharedLocator from '../pages/common/shared-locators';
import data from '../data/filterData.json'

const reqLandingPage = url.users.requestor.requestLandingPage;
const approvalsPage = url.users.approver.approvalsPage;

test.describe('E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginFlow = new Login(page);
    await loginFlow.login(
      process.env.USER!,
      process.env.PW!,
      './auth/requestor.json',
      reqLandingPage
    );
  });

  test('Request to Approval up to Department Manager (up to 100k)', async ({ page }) => {
    let requestNumber: string;
    const requestPage = new RequestPage(page);
    const eprFormFields = new EprFields(page);
    const shared = new SharedLocator(page);
    const loginFlow = new Login(page);

    // Navigate to landing page (session is already logged in)
    await test.step("Create a Request", async()=>{

    
    await page.goto(reqLandingPage);

    // Perform actions
    await requestPage.ClickNewRequest();
    await eprFormFields.AddTransBtn().waitFor();
    await eprFormFields.InputOnFields(page);
    await eprFormFields.AddTransBtn().click();
    await eprFormFields.InputFieldsonTransactions2(page);
    await eprFormFields.ClickAddNewTransactions();
    await eprFormFields.ClickNext();
    await eprFormFields.ClickSubmitRequest();
    await eprFormFields.ClickSubmit();
    await requestPage.waitForViewofViewAllReq();
    await page.waitForTimeout(5000);
    requestNumber = await eprFormFields.GetNewEPRNo();
    await requestPage.ClickViewAllReq.click();
    await shared.UseSearch(requestNumber);


    // Logout Requestor
    await shared.ClickLogout();

    });

    await test.step("Check EPR on other non Approver accounts", async()=>{
      await loginFlow.login(
      process.env.L2!,
      process.env.L2PW!,
      './auth/approver2.json',
      url.users.approver.approvalsPage
    );
    await page.goto(approvalsPage);
    await shared.UseSearch(requestNumber);
    let noMessage1 = await shared.NoDataMessage.innerText(); 
    await expect(noMessage1).toBe(data.NoDataMessage);
    await shared.ClickLogout();

      await loginFlow.login(
      process.env.L3!,
      process.env.L3PW!,
      './auth/approver3.json',
      url.users.approver.approvalsPage
      );
    await page.goto(approvalsPage);  
    await shared.UseSearch(requestNumber);
    let noMessage2 = await shared.NoDataMessage.innerText(); 
    await expect(noMessage2).toBe(data.NoDataMessage);
    await shared.ClickLogout();

      await loginFlow.login(
      process.env.AP!,
      process.env.APPW!,
      './auth/accounting.json',
      url.users.accounting.accountingPage
      );
    await page.goto(url.users.accounting.accountingPage) 
    await shared.UseSearch(requestNumber);
    let noMessage3 = await shared.NoDataMessage.innerText(); 
    await expect(noMessage3).toBe(data.NoDataMessage);
    await shared.ClickLogout();

    })

    await test.step("Approved by Approver L1", async()=>{
    // Login as Approver 1
    await loginFlow.login(
      process.env.L1!,
      process.env.L1PW!,
      './auth/approver1.json',
      url.users.requestor.requestLandingPage
    );

    await shared.ClickApprovals();
    await shared.UseSearch(requestNumber);
    await eprFormFields.ClickActionCol();
    await eprFormFields.ApproveARequest();
    await shared.ToastNotificationMessage();
    await shared.ValidateEPRafterApproveonOngoingtable(requestNumber);
    await shared.DoneTabButton.click()
    await shared.UseSearch(requestNumber);
    await shared.GetStatus();

    // Logout Requestor
    await shared.ClickLogoutL1();

    })

    await test.step("Approved by Accounting", async()=>{


      await loginFlow.login(
      process.env.AP!,
      process.env.APPW!,
      './auth/accounting.json',
      url.users.accounting.accountingPage
    );

    await shared.UseSearch(requestNumber);
    await eprFormFields.ClickActionsColAccounting();
    await eprFormFields.AcknowledgeARequest();
    await shared.ToastNotificationMessage();
    await shared.ValidateEPRafterApproveonOngoingtable(requestNumber);
    await shared.DoneTabButton.click()
    await shared.UseSearch(requestNumber);
    await shared.AccGetStatus();
    })

    console.log('✅ Request to Approval up to Department Manager (up to 100k) ✅ PASSED');
  });



});
