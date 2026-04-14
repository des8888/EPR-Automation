import url from '../data/pageUrl.json'
import ApprovalsPage from "../pages/Approvals";
import SharedLocator from "../pages/common/shared-locators";
import { test, expect } from '@playwright/test';
import RequestPage from '../pages/Request';
import eprFields from '../pages/EPRformFields';
import Login from '../pages/loginPage';
import login from '../data/login.json';
import chalk from 'chalk';
import EPR from '../data/eprData.json';

const approvalsPage = url.approvalsPage


test("Validating Category Filter", async({page})=>{
  const sharedLoc = new SharedLocator(page);
  await page.goto(approvalsPage);
  await sharedLoc.SelectingCategory();
  await sharedLoc.GetCategoryDataonTable();
  console.log("Validating Category Filter on Request page ✅ PASSED")

})

test("Validating Sub-Category Filter", async({page})=>{
  const sharedLoc = new SharedLocator(page);
  await page.goto(approvalsPage);
  await sharedLoc.GetSubCategoryDataonTable({page});
  await page.close();
  console.log("Validating Sub-Category Filter on Approvals page ✅ PASSED")
})


test("Validating Search Field Filter", async({page})=>{
  const sharedLoc = new SharedLocator(page);
  await page.goto(approvalsPage);
  await sharedLoc.ValidateSearchField(page);
  console.log("Validating Search Field Filter on Request page ✅ PASSED")
})

test("Validation of Date Filters", async({page})=>{
  const sharedLoc = new SharedLocator(page);
  await page.goto(approvalsPage);
  await sharedLoc.ValidateDateFilterForApprovals();
  console.log("Validation of Date Filter on Request page ✅ PASSED")
})

// test("Validating Return page after Viewing of EPR", async({page})=>{
//   const appPage = new ApprovalsPage(page);
//   await page.goto(approvalsPage);
//   await appPage.ValidateEPRReturnPage(page);
//   console.log("Validating Return page after Viewing of EPR on Approvals page ✅ PASSED")

//   await appPage.ValidateEPRReturnPageviaActionButton(page);
// })


// test("Validation of Requestor Name Filter", async({page})=>{
//   const appPage = new ApprovalsPage(page);
//   await page.goto(approvalsPage);
//   await appPage.ClickFunnelFilter();
//   await appPage.RequestorNameFilter();
//   await page.waitForTimeout(2000);
//   await appPage.SelectReqName();
//   await appPage.ClickApplyFilter();
//   await appPage.ColumnVisibility();
//   await appPage.ReqNameValidation();
//   console.log("Validation of Date Filter on Approvals page ✅ PASSED")
// })

// test("Validation of Status filter on Done Tab", async({page})=>{
//   const appPage = new ApprovalsPage(page);
//   await page.goto(reqLandingPage)
//   await appPage.ClickDoneTab();
//   await appPage.ClickFunnelFilter();
  
//   await reqPage.ClickApplyFilter();
//   await reqPage.ApproverNameonSummaryTabValidation();
//   console.log("Validation of Approver Name Filter on Summary Tab on Request page ✅ PASSED")
// })



  test("Approve EPR L1 to L3", async({page})=>{
        const requestPage = new RequestPage(page);
        const eprFormFields = new eprFields(page);
        const shared = new SharedLocator(page);
        const loginFlow = new Login(page);
        await test.step("Approved by Approver L1", async()=>{
            // Login as Approver 1
            //await loginFlow.login(login.MNGR, login.MNGRPW);
            await loginFlow.login(login.APPROVER1, login.APPROVER1PW);
            await shared.ClickApprovals();
            await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
            await shared.UseSearch(EPR.latestEPR);
            await eprFormFields.ClickActionCol(EPR.latestEPR);
            await eprFormFields.ApproveARequestwithNote();
            await shared.ToastNotificationMessage();
            await shared.ValidateUseSearchforNoData(EPR.latestEPR);
            await shared.DoneTabButton.click()
            await shared.UseSearch(EPR.latestEPR);
            await shared.GetStatus();

            // Logout Requestor
            await shared.ClickLogout();
        });
        await test.step("Approved by Approver L2", async()=>{
            // Login as Approver 1
            //await loginFlow.login(login.MNGR, login.MNGRPW);
            await loginFlow.login(login.APPROVER2, login.APPROVER2PW);
            await shared.ClickApprovals();
            await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
            await shared.UseSearch(EPR.latestEPR);
            await eprFormFields.ClickActionCol(EPR.latestEPR);
            await eprFormFields.ApproveARequestwithNote();
            await shared.ToastNotificationMessage();
            await shared.ValidateUseSearchforNoData(EPR.latestEPR);
            await shared.DoneTabButton.click()
            await shared.UseSearch(EPR.latestEPR);
            await shared.GetStatus();

            // Logout Requestor
            await shared.ClickLogout();
        })
        await test.step("Approved by Approver L3", async()=>{
            // Login as Approver 1
            //await loginFlow.login(login.MNGR, login.MNGRPW);
            await loginFlow.login(login.APPROVER3, login.APPROVER3PW);
            await shared.ClickApprovals();
            await page.waitForURL('**/approvals', { waitUntil: "domcontentloaded" });
            await shared.UseSearch(EPR.latestEPR);
            await eprFormFields.ClickActionCol(EPR.latestEPR);
            await eprFormFields.ApproveARequestwithNote();
            await shared.ToastNotificationMessage();
            await shared.ValidateUseSearchforNoData(EPR.latestEPR);
            await shared.DoneTabButton.click()
            await shared.UseSearch(EPR.latestEPR);
            await shared.GetStatus();

            // Logout Requestor
            await shared.ClickLogout();
        })
  })
