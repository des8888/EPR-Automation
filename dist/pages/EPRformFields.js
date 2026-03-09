import { expect } from "@playwright/test";
import dets from '../data/inputFormData.json';
import { saveEPRToFile } from "../utils/fileUtils";
import chalk from "chalk";
export default class EPRFields {
    page;
    Company;
    CompanySelect;
    Payee;
    PayeeSearch;
    PayeeSelect;
    BillingFrom;
    BillingFromDate;
    BillingTo;
    BillingToDate;
    DueDate;
    DueSelectDate;
    ModeofPayment;
    MoPList;
    MopListData;
    Category;
    CategoryList;
    CategoryListData;
    CategoryListData2;
    SubCat;
    SubCategory;
    SubCategoryList;
    SubCategoryListData;
    SubCategory2;
    SubCategory2List;
    SubCategory2ListData;
    FileAttach;
    RefNo;
    Particulars;
    AddTransactionsBtn;
    SubCat3;
    SubCat3Data;
    Description;
    Location;
    LocationData;
    Product;
    ProductData;
    Project;
    ProjectData;
    ChargeCostCenter;
    ChargeCostCenterData;
    CapexOpexCogs;
    CapexOpexCogsData;
    NetAmnt;
    Vatable;
    EWT;
    sidepanelAddTrans;
    sidepanelCloseButton;
    subCat3Col;
    AmountCol;
    TotalAmount;
    //Actions column on Trans table
    ActionsCol;
    AccActionsCol;
    ActionApprove;
    ActionReject;
    ActionReturn;
    ActionAcknowledge;
    AcknowledgeReq;
    ApproveReq;
    ApproveField;
    RejectReq;
    RejectField;
    ReturnReq;
    ReturnField;
    Edit;
    Delete;
    ConfirmDelete;
    //Request submission
    Next;
    SubmitReq;
    SubmitBtn;
    EPRNewNumber;
    constructor(page) {
        this.page = page;
        this.Company = page.getByRole('textbox', { name: 'Select a Company' });
        this.CompanySelect = page.getByRole('button', { name: `${dets.Company}` });
        this.Payee = page.getByRole('textbox', { name: 'Select a Payee' });
        this.PayeeSearch = page.getByRole('textbox', { name: 'Search...' });
        this.PayeeSelect = page.getByRole('button', { name: `${dets.Payee}` });
        this.BillingFrom = page.getByRole('button', { name: 'Choose date' }).first();
        this.BillingFromDate = page.getByRole('gridcell', { name: `${dets.BillingFrom}` });
        this.BillingTo = page.getByRole('button', { name: 'Choose date' }).nth(1);
        this.BillingToDate = page.getByRole('gridcell', { name: `${dets.BillingTo}` }).first();
        this.DueDate = page.getByRole('button', { name: 'Choose date', exact: true });
        this.DueSelectDate = page.getByRole('gridcell', { name: `${dets.DueDate}` });
        this.ModeofPayment = page.getByRole('textbox', { name: 'Select Mode of Payment' });
        this.MoPList = page.locator(".MuiList-root.MuiList-padding.css-1bwj75t");
        const randomNum = Math.floor(Math.random() * 5) + 1;
        this.MopListData = page.getByRole('button').nth(randomNum);
        this.Category = page.getByRole('textbox', { name: 'Select a Category' });
        this.CategoryList = page.locator(".MuiList-root.MuiList-padding.css-1bwj75t");
        this.SubCat = page.getByRole('textbox', { name: 'Select a Sub Category' });
        const randomNum2 = Math.floor(Math.random() * 9) + 1;
        this.CategoryListData = page.getByRole('button').nth(randomNum2);
        this.CategoryListData2 = page.getByRole('button');
        this.SubCategory = page.getByRole('textbox', { name: 'Select Sub Category 1' });
        this.SubCategoryList = page.getByRole('button').filter({ hasText: /^[A-Z\s]+$/, });
        this.SubCategoryListData = page.locator(".MuiList-root.MuiList-padding div[role='button']:visible");
        //const randomNum3 = Math.floor(Math.random() * 10) + 1;
        // const subCategoryListContainer = page.locator(".MuiList-root.MuiList-padding");
        // this.SubCategoryListData = page
        // .locator(".MuiList-root.MuiList-padding div[role='button']")
        // .filter({ hasText: /^[A-Z\s]+$/ });
        this.SubCategory2 = page.getByRole('textbox', { name: 'Select Sub Category 2' });
        this.SubCategory2List = page.getByRole('button').filter({ hasText: /^[A-Z\s]+$/, });
        //this.SubCategory2ListData = page.getByRole('button', { name: 'COCOSHELL' })
        // this.SubCategory2ListData = page
        // .locator(".MuiList-root.MuiList-padding div[role='button']")
        // .filter({ hasText: /^[A-Z\s]+$/ });
        this.SubCategory2ListData = page.locator(".MuiList-root.MuiList-padding div[role='button']:visible");
        this.RefNo = page.locator('input[name="refNo"]');
        this.Particulars = page.locator('input[name="particulars"]');
        this.FileAttach = page.locator(`input[type="file"]`);
        this.AddTransactionsBtn = page.getByRole('button', { name: 'Add a Transaction' });
        this.SubCat3 = page.getByRole('combobox', { name: 'Select Sub Category' });
        this.subCat3Col = page.locator("//tbody/tr[1]/td[1]");
        this.SubCat3Data = page.getByRole('option', { name: /.*/ }).first();
        this.Description = page.locator("input[name$='description']");
        this.Location = page.getByRole('combobox', { name: 'Select Location' });
        this.LocationData = page.getByRole('option', { name: dets.Location });
        this.Product = page.getByRole('combobox', { name: 'Select Product' });
        this.ProductData = page.getByRole('option', { name: dets.Product });
        this.Project = page.getByRole('combobox', { name: 'Select Project' });
        this.ProjectData = page.getByRole('option', { name: dets.Project });
        this.ChargeCostCenter = page.getByRole('combobox', { name: 'Select Cost Center' });
        this.ChargeCostCenterData = page.getByRole('option', { name: dets.ChargeCostCenter });
        this.CapexOpexCogs = page.getByRole('combobox', { name: 'Select Expense Type' });
        this.CapexOpexCogsData = page.getByRole('option', { name: dets.Capex });
        this.NetAmnt = page.locator("input[placeholder$='Enter Amount']");
        this.Vatable = page.locator("input[value='false'][name='vatable']");
        this.EWT = page.locator("input[value='false'][name='ewt']");
        this.sidepanelAddTrans = page.getByRole('button', { name: 'Add Transaction' });
        this.AmountCol = page.locator('//tbody/tr/td[8]');
        this.TotalAmount = page.locator(`//div[@class='MuiTypography-root MuiTypography-h6 css-r3iov6']`);
        //Actions column on trans table
        //this.ActionsCol = page.locator("//tbody/td[9]");
        this.ActionsCol = page.getByRole('row').getByRole('button');
        this.AccActionsCol = page.getByRole('row').getByRole('button');
        this.ActionApprove = page.getByRole('menuitem', { name: 'Approve' });
        this.ActionReject = page.getByRole('menuitem', { name: 'Reject' });
        this.ActionReturn = page.getByRole('menuitem', { name: 'Return' });
        this.sidepanelCloseButton = page.getByRole('button').first();
        this.ApproveReq = page.getByRole('button', { name: 'Approve' });
        this.ApproveField = page.getByRole('textbox', { name: 'Enter a Note (Optional)' });
        this.RejectReq = page.getByRole('button', { name: 'Reject' });
        this.RejectField = page.getByRole('textbox', { name: 'Enter Reason (Optional)' });
        this.ReturnReq = page.getByRole('button', { name: 'Return' });
        this.ReturnField = page.getByRole('textbox', { name: 'Indicate missing documents or' });
        this.ActionAcknowledge = page.getByRole('menuitem', { name: 'Acknowledge' });
        this.AcknowledgeReq = page.getByRole('button', { name: 'Acknowledge' });
        this.Edit = page.getByText('Edit');
        this.Delete = page.getByText('Delete');
        this.ConfirmDelete = page.getByRole('button', { name: 'Delete' });
        //Request submission
        this.Next = page.getByRole('button', { name: 'Next' });
        this.SubmitReq = page.getByRole('button', { name: 'Submit Request' });
        this.SubmitBtn = page.getByRole('button', { name: 'Submit' });
        this.EPRNewNumber = page.getByText('Expense Payment Request No.');
    }
    async ClickAddTransBtn() {
        await this.AddTransactionsBtn.click();
    }
    AddTransBtn() {
        return this.AddTransactionsBtn;
    }
    async InputOnFields() {
        await this.BillingFrom.click();
        await this.BillingFromDate.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Billing From ==='));
        await this.BillingTo.click();
        await this.BillingToDate.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Billing To ==='));
        await this.DueDate.click();
        await this.DueSelectDate.first().click();
        console.log(chalk.green('=== ✔️ SUCESS Input Due date ==='));
        await this.ModeofPayment.click();
        await this.MoPList.waitFor({ state: 'visible' });
        const randomNum = Math.floor(Math.random() * 10) + 1;
        console.log(randomNum);
        await this.MopListData.click();
        console.log(chalk.green('=== ✔️ SUCESS MOP Input ==='));
        await this.Category.click();
        await this.CategoryList.waitFor({ state: 'visible' });
        await this.CategoryListData.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Category ==='));
        await this.SubCategory.click();
        await this.SubCategoryList.first().waitFor({ state: 'visible' });
        let count = await this.SubCategoryList.count();
        //console.log(`ETOOOOOOOOO: ${count}`)
        console.log(chalk.green('=== ✔️ SUCESS Input Sub-Category 1 ==='));
        const options = await this.SubCategoryListData.allTextContents();
        //console.log("Options in dropdown:", options);
        const randomNum3 = Math.floor(Math.random() * count);
        await this.SubCategoryListData.nth(randomNum3).click();
        await this.SubCategory2.click();
        await this.SubCategory2List.first().waitFor({ state: 'visible' });
        let count2 = await this.SubCategory2List.count();
        //console.log(`ETO2: ${count2}`)
        const options2 = await this.SubCategory2ListData.allTextContents();
        //console.log("Options in dropdown:", options2);
        let randomNum4 = Math.floor(Math.random() * count2);
        await this.SubCategory2ListData.nth(randomNum4).click();
        console.log(chalk.green('=== ✔️ SUCESS Input Sub-Category 2 ==='));
        // const element =await this.SubCategory2ListData.innerHTML()
        // // console.log(`ELEMENT ${element}`)
        await this.RefNo.fill(dets.ReferenceNo);
        console.log(chalk.green('=== ✔️ SUCESS Input Reference No. ==='));
        await this.Particulars.fill(dets.Particulars);
        console.log(chalk.green('=== ✔️ SUCESS File Attach ==='));
    }
    async InputOnFieldsForReturningEPRRequestor1(page) {
        await this.Company.click();
        await page.waitForTimeout(3000);
        console.log(chalk.green('=== ✔️ SUCESS Input Company ==='));
        await this.CompanySelect.click();
        await this.Payee.click();
        await page.waitForTimeout(4000);
        await this.PayeeSearch.fill('Requestor');
        //await this.PayeeSearch.fill('Accountant');
        await page.waitForTimeout(4000);
        await this.PayeeSelect.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Payee ==='));
        await this.BillingFrom.click();
        await this.BillingFromDate.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Billing From ==='));
        await this.BillingTo.click();
        await this.BillingToDate.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Billing To ==='));
        await this.DueDate.click();
        await this.DueSelectDate.first().click();
        console.log(chalk.green('=== ✔️ SUCESS Input Due date ==='));
        await this.ModeofPayment.click();
        await this.MoPList.waitFor({ state: 'visible' });
        const randomNum = Math.floor(Math.random() * 10) + 1;
        console.log(randomNum);
        await this.MopListData.click();
        console.log(chalk.green('=== ✔️ SUCESS MOP Input ==='));
        await this.Category.click();
        await this.CategoryList.waitFor({ state: 'visible' });
        await this.CategoryListData.click();
        console.log(chalk.green('=== ✔️ SUCESS Input Category ==='));
        await this.SubCategory.click();
        await this.SubCategoryList.first().waitFor({ state: 'visible' });
        let count = await this.SubCategoryList.count();
        // console.log(`ETOOOOOOOOO: ${count}`)
        // const options = await this.SubCategoryListData.allTextContents();
        // console.log("Options in dropdown:", options);
        const randomNum3 = Math.floor(Math.random() * count);
        await this.SubCategoryListData.nth(randomNum3).click();
        console.log(chalk.green('=== ✔️ SUCESS Input Sub-Category 1 ==='));
        await this.SubCategory2.click();
        await this.SubCategory2List.first().waitFor({ state: 'visible' });
        let count2 = await this.SubCategory2List.count();
        //console.log(`ETO2: ${count2}`)
        const options2 = await this.SubCategory2ListData.allTextContents();
        //console.log("Options in dropdown:", options2);
        let randomNum4 = Math.floor(Math.random() * count2);
        await this.SubCategory2ListData.nth(randomNum4).click();
        console.log("SUCESS SUB CAT 2");
        // const element =await this.SubCategory2ListData.innerHTML()
        // // console.log(`ELEMENT ${element}`)
        console.log(chalk.green('=== ✔️ SUCESS Input Sub-Category2 ==='));
        await this.RefNo.fill(dets.ReferenceNoEDIT);
        console.log(chalk.green('=== ✔️ SUCESS Input Reference No. ==='));
        await this.Particulars.fill(dets.ParticularsEDIT);
        console.log(chalk.green('=== ✔️ SUCESS Input Particulars ==='));
    }
    async InputOnFieldsForRequestor1(page) {
        await this.Company.click();
        await page.waitForTimeout(3000);
        await this.CompanySelect.click();
        await this.Payee.click();
        await page.waitForTimeout(4000);
        await this.PayeeSearch.fill('Requestor');
        //await this.PayeeSearch.fill('Accountant');
        await page.waitForTimeout(4000);
        await this.PayeeSelect.click();
        await this.BillingFrom.click();
        await this.BillingFromDate.click();
        console.log("SUCESS Input Billing From");
        await this.BillingTo.click();
        await this.BillingToDate.click();
        console.log("SUCESS Input Billing To");
        await this.DueDate.click();
        await this.DueSelectDate.first().click();
        console.log("SUCESS Input Due date");
        await this.ModeofPayment.click();
        await this.MoPList.waitFor({ state: 'visible' });
        const randomNum = Math.floor(Math.random() * 10) + 1;
        console.log(randomNum);
        await this.MopListData.click();
        await this.Category.click();
        await this.CategoryList.waitFor({ state: 'visible' });
        await this.CategoryListData.click();
        await this.SubCategory.click();
        await this.SubCategoryList.first().waitFor({ state: 'visible' });
        let count = await this.SubCategoryList.count();
        console.log(`ETOOOOOOOOO: ${count}`);
        const options = await this.SubCategoryListData.allTextContents();
        console.log("Options in dropdown:", options);
        const randomNum3 = Math.floor(Math.random() * count);
        await this.SubCategoryListData.nth(randomNum3).click();
        await this.SubCategory2.click();
        await this.SubCategory2List.first().waitFor({ state: 'visible' });
        let count2 = await this.SubCategory2List.count();
        console.log(`ETO2: ${count2}`);
        const options2 = await this.SubCategory2ListData.allTextContents();
        console.log("Options in dropdown:", options2);
        let randomNum4 = Math.floor(Math.random() * count2);
        await this.SubCategory2ListData.nth(randomNum4).click();
        console.log("SUCESS SUB CAT 2");
        // const element =await this.SubCategory2ListData.innerHTML()
        // // console.log(`ELEMENT ${element}`)
        await this.RefNo.fill(dets.ReferenceNo);
        await this.Particulars.fill(dets.Particulars);
    }
    // async InputFieldsonTransactions(page){
    //     await this.SubCat3.waitFor({state:'visible'});
    //     await this.SubCat3.fill(dets.SubCat3);
    //     const randomNum2 = Math.floor(Math.random() * 9) + 1;
    //     await this.Description.fill(dets.Description);
    //     await this.Location.fill(dets.Location);
    //     await this.LocationData.click()
    //     await this.Product.fill(dets.Product);
    //     await this.ProductData.click()
    //     await this.Project.fill(dets.Project);
    //     await this.ProjectData.click()
    //     await this.ChargeCostCenter.fill(dets.ChargeCostCenter)
    //     await this.ChargeCostCenterData.click();
    //     await this.CapexOpexCogs.fill(dets.Capex);
    //     await this.CapexOpexCogsData.click();
    //     const hunderdToMillion = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
    //     await this.NetAmnt.fill(`${hunderdToMillion}`);
    //     await this.Vatable.click();
    // }
    getCategoryDropdown() {
        return this.Category;
    }
    getSubCategoryDropdown() {
        return this.SubCat;
    }
    async InputFieldsonTransactions2(page) {
        await this.SubCat3.waitFor({ state: 'visible' });
        await this.SubCat3.click();
        await this.SubCat3Data.waitFor({ state: 'visible' });
        await this.SubCat3Data.click();
        console.log("SUCESS SUB CAT 3");
        await this.Description.fill(dets.Description);
        await this.Location.fill(dets.Location);
        await this.LocationData.click();
        await this.Product.fill(dets.Product);
        await this.ProductData.click();
        await this.Project.fill(dets.Project);
        await this.ProjectData.click();
        await this.ChargeCostCenter.fill(dets.ChargeCostCenter);
        await this.ChargeCostCenterData.click();
        await this.CapexOpexCogs.fill(dets.Capex);
        await this.CapexOpexCogsData.click();
        await this.Vatable.click();
    }
    async FillNetAmtBelow100k() {
        await this.NetAmnt.fill(dets.NetAmnt);
        ;
    }
    async FillNetAmtUpTo500k() {
        await this.NetAmnt.fill(dets.NetAmntUpto500k);
        ;
    }
    async FillNetAmtupTo1M() {
        await this.NetAmnt.fill(dets.NetAmntUpto1M);
        ;
    }
    async FillNetMorethan1M() {
        await this.NetAmnt.fill(dets.NetAmntMorethan1M);
        ;
    }
    async SingleFileAttachment() {
        await this.FileAttach.setInputFiles('files/sample99mb.zip');
        console.log(chalk.green('=== ✔️ SUCESS File Attach ==='));
    }
    async MultipleValidFileAttach() {
        await this.FileAttach.setInputFiles(['files/valid files/Document7.docx',
            'files/valid files/DSR.xlsx',
            'files/valid files/expense.jpg',
            'files/valid files/file_1.txt',
            'files/valid files/MFA logo - Copy.png',
            'files/valid files/sample.zip',
            'files/valid files/SEAOIL.pdf',
            'files/valid files/TESTING`~!@#$%^&()_+{}`.docx']);
        console.log(chalk.green('=== ✔️ SUCESS File Attach ==='));
    }
    async ClickAddNewTransactions() {
        await this.sidepanelAddTrans.click();
    }
    async ClickNext() {
        await this.Next.click();
    }
    async ClickSubmitRequest() {
        await this.SubmitReq.click();
    }
    async ClickSubmit() {
        await this.SubmitBtn.click();
    }
    async GetNewEPRNo() {
        let newEPR = await this.EPRNewNumber.innerText();
        const requestNumber = newEPR?.match(/\d+/)?.[0] ?? '';
        console.log(`EPR NUMBER: ${requestNumber}`);
        await saveEPRToFile(requestNumber); // save to JSON
        return requestNumber;
    }
    async CompareEPRDetails() {
        await expect(this.Company).toHaveValue(dets.Company);
        await expect(this.Payee).toHaveValue(dets.Payee);
        await expect(this.RefNo).toHaveValue(dets.ReferenceNoEDIT);
        await expect(this.Particulars).toHaveValue(dets.ParticularsEDIT);
        console.log("COMPARISON PASSED!");
    }
    async EditReturnedEPRforResubmission(latestEPR) {
        await this.RefNo.fill(`EDITED FROM ${latestEPR}`);
        await this.Particulars.fill(`EDITED FROM ${latestEPR}`);
    }
    //FOR TEST
    async ClickAddTransActionCol(latestEPR) {
        // Find the row with your EPR number
        const Accrow = this.page.getByRole('table').getByRole('button').first();
        await Accrow.waitFor({ state: 'visible', timeout: 60000 });
        // Then get the button inside that row
        await Accrow.click();
        console.log(`Clicked Action button for EPR: ${latestEPR}`);
    }
    async ClickActionCol(latestEPR) {
        if (!latestEPR || latestEPR.trim() === "") {
            throw new Error("latestEPR is empty. Cannot locate row.");
        }
        const row = this.page
            .getByRole('row')
            .filter({ hasText: latestEPR });
        const targetRow = row.first();
        await targetRow.waitFor({ state: "visible", timeout: 60000 });
        const actionButton = targetRow.getByRole('button');
        await actionButton.first().click();
        console.log(`Clicked Action button for EPR: ${latestEPR}`);
    }
    async ClickActionsColAccounting(latestEPR) {
        const row = this.page.getByRole('row', { name: latestEPR });
        await row.waitFor({ state: 'visible', timeout: 6000 });
        const actionButton = row.getByRole('button');
        await actionButton.click();
        console.log(`Clicked Action button Accounting for EPR: ${latestEPR}`);
    }
    async ApproveARequest() {
        await this.ActionApprove.click();
        await this.ApproveReq.click();
        await this.ApproveReq.waitFor({ state: 'hidden', timeout: 50000 });
    }
    async ApproveARequestwithNote() {
        await this.ActionApprove.click();
        await this.ApproveField.fill(dets.ApproveMess);
        await this.ApproveReq.click();
        await this.ApproveReq.waitFor({ state: 'hidden', timeout: 50000 });
    }
    async RejectARequest() {
        await this.ActionReject.click();
        await this.RejectReq.click();
    }
    async RejectARequestwithNote() {
        await this.ActionReject.click();
        await this.RejectField.fill(dets.RejectMess);
        await this.RejectReq.click();
        await this.RejectReq.waitFor({ state: 'hidden', timeout: 50000 });
    }
    async ReturnARequest() {
        await this.ActionReturn.click();
        await this.ReturnField.fill(dets.ReturnMess);
        await this.ReturnReq.click();
        await this.ReturnReq.waitFor({ state: 'hidden', timeout: 50000 });
    }
    async AcknowledgeARequest() {
        await this.ActionAcknowledge.click();
        await this.AcknowledgeReq.click();
        await this.AcknowledgeReq.waitFor({ state: 'hidden', timeout: 20000 });
    }
    async EditReturnedRequest() {
        await this.Edit.click();
    }
    async ClickDelete() {
        await this.Delete.click();
    }
    async ClickConfirmDelete() {
        await this.ConfirmDelete.click();
    }
    async CountTotalAmount() {
        let total = 0;
        await this.AmountCol.first().scrollIntoViewIfNeeded();
        const count = await this.AmountCol.count();
        console.log(`ETOOOOOOOOOOOOOOO: ${count}`);
        for (let i = 0; i < count; i++) {
            const text = await this.AmountCol.nth(i).innerText();
            // Clean any extra spaces and symbols like ₱ or $
            const value = text.replace(/[^\d.,-]/g, ""); // keep only numbers, comma, dot, minus
            const numericValue = parseFloat(value.replace(/,/g, ""));
            total += numericValue;
            console.log(`Running total: ${total}`);
        }
        const totalOverallText = await this.TotalAmount.innerText();
        console.log(`TOTAL OVERALL RAW TEXT: "${totalOverallText}"`);
        // Clean it up the same way
        const overallValue = totalOverallText.replace(/[^\d.,-]/g, "");
        const TOTAL = parseFloat(overallValue.replace(/,/g, ""));
        console.log(`TOTAL comparison → computed: ${total}, displayed: ${TOTAL}`);
        await expect(TOTAL).toBe(total);
    }
    async getSubCat2CountFromDOM() {
        return await this.page.evaluate(() => {
            const count = document.querySelectorAll('ul.MuiList-root div[role="button"]').length;
            return Array.from({ length: count }, (_, i) => i);
        });
    }
    async getSubCat2ArrayFromDOM() {
        return await this.page.evaluate(() => {
            const nodes = Array.from(document.querySelectorAll('ul.MuiList-root div[role="button"]'));
            return nodes.map(el => el.textContent?.trim() || '');
        });
    }
    async ValidateAllfieldsifPresent() {
        // ---------- PREVIOUS FIELDS ----------
        await this.BillingFrom.click();
        await this.BillingFromDate.click();
        console.log("SUCCESS Input Billing From");
        await this.BillingTo.click();
        await this.BillingToDate.click();
        console.log("SUCCESS Input Billing To");
        await this.DueDate.click();
        await this.DueSelectDate.first().click();
        console.log("SUCCESS Input Due date");
        await this.ModeofPayment.click();
        await this.MoPList.waitFor({ state: 'visible' });
        await this.MopListData.click();
        console.log("SUCCESS MOP Input");
        await this.RefNo.fill(dets.ReferenceNo);
        await this.Particulars.fill(dets.Particulars);
        await this.FileAttach.setInputFiles('files/file_1.txt');
        console.log("SUCCESS FILE ATTACH");
        // ---------- CATEGORY ----------
        await this.Category.click();
        await this.CategoryList.first().waitFor({ state: 'visible' });
        const catCount = await this.CategoryListData2.count();
        console.log(`CATEGORY COUNT: ${catCount}`);
        // 🔁 CATEGORY LOOP
        for (let cat = 1; cat < catCount; cat++) {
            await this.CategoryListData2.nth(cat).click();
            console.log(`Selected Category ${cat}`);
            // ---------- SUB CATEGORY 1 ----------
            await this.SubCategory.click();
            await this.SubCategoryList.first().waitFor({ state: 'visible' });
            const subCat1Count = await this.SubCategoryList.count();
            console.log(`SUB CAT1 COUNT: ${subCat1Count}`);
            for (let subCat1 = 0; subCat1 < subCat1Count; subCat1++) {
                await this.SubCategoryListData.nth(subCat1).click();
                console.log(`Selected SubCat1 ${subCat1}`);
                // ---------- SUB CATEGORY 2 (FIXED) ----------
                await this.SubCategory2.click();
                await this.SubCategory2List.first().waitFor({ state: 'visible' });
                // 📌 Snapshot SubCat2 options
                const subCat2Indices = await this.getSubCat2ArrayFromDOM();
                console.log(`SUB CAT2 OPTIONS:`, subCat2Indices);
                if (subCat2Indices.length === 0) {
                    console.warn('No SubCat2 found, skipping...');
                    continue;
                }
                for (const subCat2Text of subCat2Indices) {
                    await this.SubCategory2ListData
                        .filter({ hasText: subCat2Text })
                        .first()
                        .click();
                    console.log('Selected SubCat2:', subCat2Text);
                    // ----- TRANSACTION -----
                    await this.AddTransBtn().click();
                    await this.InputFieldsonTransactions2();
                    await this.sidepanelCloseButton.click();
                    await this.page.waitForTimeout(500);
                }
                // 🔁 Move to next SubCat1
                if (subCat1 + 1 < subCat1Count) {
                    await this.SubCategory.click();
                    await this.SubCategoryList.first().waitFor({ state: 'visible' });
                }
            }
            // 🔁 Move to next Category
            if (cat + 1 < catCount) {
                await this.Category.click();
                await this.CategoryList.first().waitFor({ state: 'visible' });
            }
        }
    }
}
