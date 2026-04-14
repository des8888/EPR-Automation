import { expect, test } from '@playwright/test';
import url from '../data/pageUrl.json'
import RequestPage from "../pages/Request";
import SharedLocator from "../pages/common/shared-locators";
import ApprovalsPage from "../pages/Approvals";
import AccountingPage from '../pages/Accounting';
import chalk from 'chalk';
import EprFields from '../pages/EPRformFields';
import data from '../data/filterData.json';
import Login from '../pages/loginPage';
import EPR from '../data/eprData.json';
import login from '../data/login.json';
import AdminPage from '../pages/Admin';

const accountingPage = url.accountingPage

// test("Validation of table headers in Ongoing Tab", async({page})=>{
//   const reqPage = new RequestPage(page);
//   const acctPage = new AccountingPage(page);
//   await page.goto(accountingPage)
//   await acctPage.OngoingTab.waitFor({state:'visible'})
//   await acctPage.OngoingCheckHeaders();
//   console.log("Validation of table headers in Ongoing Tab on Accounting page ✅ PASSED")
// })
// test("Validation of table headers in Done Tab", async({page})=>{
//   const reqPage = new RequestPage(page);
//   const appPage = new ApprovalsPage(page)
//   const acctPage = new AccountingPage(page);
//   await page.goto(accountingPage)
//   await acctPage.OngoingTab.waitFor({state:'visible'})
//   await appPage.DoneTabButton.click();
//   await acctPage.DoneCheckHeaders();
//   console.log("Validation of table headers in Done Tab on Accounting page ✅ PASSED")
// })

// test("Validating Category Filter", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   const acctPage = new AccountingPage(page);
//   await page.goto(accountingPage);
//   await acctPage.OngoingTab.waitFor({state:'visible'})
//   await sharedLoc.SelectingCategory();
//   await sharedLoc.GetCategoryDataonTable();
//   console.log("Validating Category Filter on Accounting page ✅ PASSED")
// })

// test("Validating Sub-Category Filter", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   const acctPage = new AccountingPage(page);
//   await page.goto(accountingPage);
//   await acctPage.OngoingTab.waitFor({state:'visible'})
//   await sharedLoc.GetSubCategoryDataonTable({page});
//   console.log("Validating Sub-Category Filter on Accounting page ✅ PASSED")
// })
// test("Validating Category Filter on Done tab", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   const acctPage = new AccountingPage(page);
//   await page.goto(accountingPage);
//   await acctPage.DoneTab.waitFor({state:'visible'})
//   await acctPage.DoneTab.click();
//   await sharedLoc.SelectingCategory();
//   await sharedLoc.GetCategoryDataonTable();
//   console.log("Validating Category Filter on Accounting page ✅ PASSED")
// })
// test("Validating Sub-Category Filter on Done tab", async({page})=>{
//   const sharedLoc = new SharedLocator(page);
//   const acctPage = new AccountingPage(page);
//   await page.goto(accountingPage);
//     await acctPage.DoneTab.waitFor({state:'visible'})
//   await acctPage.DoneTab.click();
//   await sharedLoc.GetSubCategoryDataonTable({page});
//   console.log("Validating Sub-Category Filter on Accounting page ✅ PASSED")
// })



  test("Approved by Accounting", async({page})=>{

            const requestPage = new RequestPage(page);
            const eprFormFields = new EprFields(page);
            const shared = new SharedLocator(page);
            const loginFlow = new Login(page);

            await loginFlow.login(login.AP, login.APPW);
            await shared.clickAccounting();
            await page.waitForURL(url.users.accounting.accountingPage, { waitUntil: "domcontentloaded" });
            await shared.UseSearch(EPR.latestEPR)//);
            await eprFormFields.ClickActionsColAccounting(EPR.latestEPR);
            await eprFormFields.AcknowledgeARequest();
            await shared.ToastNotificationMessage();
            await shared.ValidateUseSearchforNoData(EPR.latestEPR);
            await shared.DoneTabButton.click()
            await shared.UseSearch(EPR.latestEPR)
            await shared.AccGetStatus();

      await page.close()

      console.log(chalk.green('✅ Approved by Accounting ✅ PASSED'));
  });

