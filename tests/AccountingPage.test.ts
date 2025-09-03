import test from "@playwright/test";
import url from '../data/pageUrl.json'
import AccountingPage from "../pages/Accounting";
import RequestPage from "../pages/Request";
import SharedLocator from "../pages/common/shared-locators";
import ApprovalsPage from "../pages/Approvals";

const accountingPage = url.approvalsPage

test("Validation of table headers in Ongoing Tab", async({page})=>{
  const reqPage = new RequestPage(page);
  const acctPage = new AccountingPage(page);
  await page.goto(accountingPage)
  await reqPage.NewRequestBtn.waitFor({state:'visible'})
  await acctPage.OngoingCheckHeaders();
  console.log("Validation of table headers in Ongoing Tab on Accounting page ✅ PASSED")
})
test("Validation of table headers in Done Tab", async({page})=>{
  const reqPage = new RequestPage(page);
  const appPage = new ApprovalsPage(page)
  const acctPage = new AccountingPage(page);
  await page.goto(accountingPage)
  await appPage.DoneTabButton.click();
  await acctPage.DoneCheckHeaders();
  console.log("Validation of table headers in Done Tab on Accounting page ✅ PASSED")
})

test("Validating Category Filter", async({page})=>{
  const sharedLoc = new SharedLocator(page);
  await page.goto(accountingPage);
  await sharedLoc.SelectingCategory();
  await sharedLoc.GetCategoryDataonTable();
  console.log("Validating Category Filter on Accounting page ✅ PASSED")
})



test("Validating Sub-Category Filter", async({page})=>{
  const sharedLoc = new SharedLocator(page);
  await page.goto(accountingPage);
  await sharedLoc.GetSubCategoryDataonTable({page});
  console.log("Validating Sub-Category Filter on Accounting page ✅ PASSED")
})