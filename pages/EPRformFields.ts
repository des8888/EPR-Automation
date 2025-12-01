import { Locator, Page, expect} from "@playwright/test";
import dets from '../data/inputFormData.json'
import { saveEPRToFile } from "../utils/fileUtils";
import EPR from "../data/eprData.json"

export default class EPRFields{
    readonly page: Page;
    readonly BillingFrom: Locator;
    readonly BillingFromDate: Locator;
    readonly BillingTo: Locator;
    readonly BillingToDate: Locator;
    readonly DueDate: Locator;
    readonly DueSelectDate: Locator;
    readonly ModeofPayment: Locator;
    readonly MoPList: Locator;
    readonly MopListData: Locator;
    readonly Category: Locator;
    readonly CategoryList: Locator;
    readonly CategoryListData: Locator;
    readonly SubCat: Locator;
    readonly SubCategory: Locator;
    readonly SubCategoryList: Locator;
    readonly SubCategoryListData: Locator;
    readonly SubCategory2: Locator;
    readonly SubCategory2List: Locator;
    readonly SubCategory2ListData: Locator;
    readonly FileAttach: Locator;
    readonly RefNo: Locator;
    readonly Particulars: Locator;

    private readonly AddTransactionsBtn: Locator;
    readonly SubCat3: Locator;
    readonly SubCat3Data: Locator;
    readonly Description: Locator;
    readonly Location: Locator;
    readonly LocationData: Locator;
    readonly Product: Locator;
    readonly ProductData: Locator;
    readonly Project: Locator;
    readonly ProjectData: Locator;
    readonly ChargeCostCenter: Locator;
    readonly ChargeCostCenterData: Locator;
    readonly CapexOpexCogs: Locator;
    readonly CapexOpexCogsData: Locator;
    readonly NetAmnt: Locator;
    readonly Vatable: Locator;
    readonly EWT: Locator;
    readonly sidepanelAddTrans: Locator;
    readonly sidepanelPage: Locator;
    readonly subCat3Col: Locator;

    readonly AmountCol: Locator;
    readonly TotalAmount: Locator;

    //Actions column on Trans table
    readonly ActionsCol: Locator;
    readonly AccActionsCol: Locator;
    readonly ActionApprove: Locator;
    readonly ActionReject: Locator;
    readonly ActionReturn: Locator;
    readonly ActionAcknowledge: Locator;
    readonly AcknowledgeReq: Locator;
    readonly ApproveReq: Locator;
    readonly RejectReq: Locator;
    readonly ReturnReq: Locator;
    readonly ReturnField: Locator;
    readonly Edit: Locator;
    readonly Delete: Locator;
    readonly ConfirmDelete: Locator;
    


     //Request submission
    readonly Next: Locator;
    readonly SubmitReq: Locator;
    readonly SubmitBtn: Locator;
    readonly EPRNewNumber: Locator;


    constructor (page: Page){
        this.page = page;
        this.BillingFrom = page.getByRole('button', { name: 'Choose date' }).first()
        this.BillingFromDate = page.getByRole('gridcell', { name: `${dets.BillingFrom}` })
        this.BillingTo = page.getByRole('button', { name: 'Choose date' }).nth(1)
        this.BillingToDate = page.getByRole('gridcell', { name: `${dets.BillingTo}` }).first()
        this.DueDate = page.getByRole('button', { name: 'Choose date', exact: true })
        this.DueSelectDate = page.getByRole('gridcell', { name: `${dets.DueDate}` })
        this.ModeofPayment = page.getByRole('textbox', { name: 'Select Mode of Payment' })
        this.MoPList = page.locator(".MuiList-root.MuiList-padding.css-1bwj75t");
        const randomNum = Math.floor(Math.random() * 5) + 1;
        this.MopListData = page.getByRole('button').nth(randomNum)

        this.Category = page.getByRole('textbox', { name: 'Select a Category' })
        this.CategoryList = page.locator(".MuiList-root.MuiList-padding.css-1bwj75t")

        this.SubCat = page.getByRole('textbox', {name: 'Select a Sub Category'})

        const randomNum2 = Math.floor(Math.random() * 9) + 1;
        this.CategoryListData = page.getByRole('button').nth(randomNum2)
        
        this.SubCategory = page.getByRole('textbox', { name: 'Select Sub Category 1' })
        this.SubCategoryList = page.getByRole('button').filter({hasText: /^[A-Z\s]+$/,});

        this.SubCategoryListData = page.locator(".MuiList-root.MuiList-padding div[role='button']:visible");
        //const randomNum3 = Math.floor(Math.random() * 10) + 1;
        // const subCategoryListContainer = page.locator(".MuiList-root.MuiList-padding");
        // this.SubCategoryListData = page
        // .locator(".MuiList-root.MuiList-padding div[role='button']")
        // .filter({ hasText: /^[A-Z\s]+$/ });

        
        this.SubCategory2 = page.getByRole('textbox', { name: 'Select Sub Category 2' })
        this.SubCategory2List = page.getByRole('button').filter({hasText: /^[A-Z\s]+$/,});

        //this.SubCategory2ListData = page.getByRole('button', { name: 'COCOSHELL' })
        
        // this.SubCategory2ListData = page
        // .locator(".MuiList-root.MuiList-padding div[role='button']")
        // .filter({ hasText: /^[A-Z\s]+$/ });

        this.SubCategory2ListData = page.locator(".MuiList-root.MuiList-padding div[role='button']:visible");



        this.RefNo = page.getByPlaceholder('Enter Reference Number (max 1000 chars)');
        this.Particulars = page.getByPlaceholder('Enter particulars (max 1000 chars)');
        this.FileAttach = page.locator(`input[type="file"]`)
        
        this.AddTransactionsBtn = page.getByRole('button', { name: 'Add a Transaction' })
        this.SubCat3 = page.getByRole('combobox', { name: 'Select Sub Category' })
        this.subCat3Col = page.locator("//tbody/tr[1]/td[1]")

        this.SubCat3Data = page.getByRole('option',{ name: /.*/ }).first()
        this.Description = page.locator("input[name$='description']");
        this.Location = page.getByRole('combobox', { name: 'Select Location' })
        this.LocationData = page.getByRole('option', { name: dets.Location })
        this.Product = page.getByRole('combobox', { name: 'Select Product' })
        this.ProductData = page.getByRole('option', { name: dets.Product })
        this.Project = page.getByRole('combobox', { name: 'Select Project' })
        this.ProjectData = page.getByRole('option', { name: dets.Project })
        this.ChargeCostCenter =page.getByRole('combobox', { name: 'Select Cost Center' })
        this.ChargeCostCenterData =page.getByRole('option', { name: dets.ChargeCostCenter })
        this.CapexOpexCogs = page.getByRole('combobox', { name: 'Select Expense Type' })
        this.CapexOpexCogsData = page.getByRole('option', { name: dets.Capex })
        this.NetAmnt = page.locator("input[placeholder$='Enter Amount']")
        this.Vatable = page.locator("input[value='false'][name='vatable']")
        this.EWT = page.locator("input[value='false'][name='ewt']")
        this.sidepanelAddTrans = page.getByRole('button', { name: 'Add Transaction' })
        this.AmountCol = page.locator('//tbody/tr/td[8]')
        this.TotalAmount = page.locator(`//div[@class='MuiTypography-root MuiTypography-h6 css-r3iov6']`)
        //Actions column on trans table
        //this.ActionsCol = page.locator("//tbody/td[9]");
        this.ActionsCol = page.getByRole('row').getByRole('button')
        this.AccActionsCol = page.getByRole('row').getByRole('button')
        this.ActionApprove = page.getByRole('menuitem', { name: 'Approve' })
        this.ActionReject = page.getByRole('menuitem', { name: 'Reject' })
        this.ActionReturn = page.getByRole('menuitem', { name: 'Return' })


        this.ApproveReq = page.getByRole('button', { name: 'Approve' })
        this.RejectReq = page.getByRole('button', { name: 'Reject' })
        this.ReturnReq = page.getByRole('button', { name: 'Return' })
        this.ReturnField = page.getByRole('textbox', { name: 'Indicate missing documents or' })


        this.ActionAcknowledge = page.getByRole('menuitem', { name: 'Acknowledge' })
        this.AcknowledgeReq = page.getByRole('button', { name: 'Acknowledge' })


        this.Edit= page.getByText('Edit')
        this.Delete= page.getByText('Delete')
        this.ConfirmDelete= page.getByRole('button', { name: 'Delete' })

        //Request submission

        this.Next = page.getByRole('button', { name: 'Next' });
        this.SubmitReq = page.getByRole('button', { name: 'Submit Request' });
        this.SubmitBtn = page.getByRole('button', { name: 'Submit' });
        this.EPRNewNumber = page.getByText('Expense Payment Request No.');



    }
    async  ClickAddTransBtn() {
        await this.AddTransactionsBtn.click();
    }
    AddTransBtn() {
        return this.AddTransactionsBtn;
    }
    async InputOnFields(page){
        await this.BillingFrom.click();
        await this.BillingFromDate.click()
        console.log("SUCESS Input Billing From")
        await this.BillingTo.click()
        
        await this.BillingToDate.click()
        console.log("SUCESS Input Billing To")
        await this.DueDate.click()
        await this.DueSelectDate.first().click()
        console.log("SUCESS Input Due date")
        await this.ModeofPayment.click();
        await this.MoPList.waitFor({state:'visible'})
        const randomNum = Math.floor(Math.random() * 10) + 1;
        console.log(randomNum); 
        await this.MopListData.click();

        await this.Category.click();
        await this.CategoryList.waitFor({state:'visible'})
        await this.CategoryListData.click();
        
        await this.SubCategory.click();
        await this.SubCategoryList.first().waitFor({state:'visible'})
        let count = await this.SubCategoryList.count();
        console.log(`ETOOOOOOOOO: ${count}`)

        const options = await this.SubCategoryListData.allTextContents();
        console.log("Options in dropdown:", options);


        const randomNum3 = Math.floor(Math.random() * count);
        await this.SubCategoryListData.nth(randomNum3).click();


        await this.SubCategory2.click();
        await this.SubCategory2List.first().waitFor({ state: 'visible' });
        let count2 = await this.SubCategory2List.count();
        console.log(`ETO2: ${count2}`)
        const options2 = await this.SubCategory2ListData.allTextContents();
        console.log("Options in dropdown:", options2);
        let randomNum4 = Math.floor(Math.random() * count2);
        await this.SubCategory2ListData.nth(randomNum4).click();
        console.log("SUCESS SUB CAT 2")
        // const element =await this.SubCategory2ListData.innerHTML()
        // // console.log(`ELEMENT ${element}`)
        await this.RefNo.fill(dets.ReferenceNo);
        await this.Particulars.fill(dets.Particulars);

        await this.FileAttach.setInputFiles('files/file_1.txt');
        console.log("SUCESS FILE ATTACH")
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
    async InputFieldsonTransactions2(page){
        await this.SubCat3.waitFor({state:'visible'});
        await this.SubCat3.click()
        await this.SubCat3Data.waitFor({state:'visible'})
        await this.SubCat3Data.click()
        console.log("SUCESS SUB CAT 3")
        await this.Description.fill(dets.Description);
        await this.Location.fill(dets.Location);
        await this.LocationData.click()
        await this.Product.fill(dets.Product);
        await this.ProductData.click()
        await this.Project.fill(dets.Project);
        await this.ProjectData.click()
        await this.ChargeCostCenter.fill(dets.ChargeCostCenter)
        await this.ChargeCostCenterData.click();
        await this.CapexOpexCogs.fill(dets.Capex);
        await this.CapexOpexCogsData.click();
        
        await this.Vatable.click();
    }

    async FillNetAmtBelow100k(){
        await this.NetAmnt.fill(dets.NetAmnt);;
    }
    
    async FillNetAmtUpTo500k(){
        await this.NetAmnt.fill(dets.NetAmntUpto500k);;
    }
    
    async FillNetAmtupTo1M(){
        await this.NetAmnt.fill(dets.NetAmntUpto1M);;
    }
    
    async ClickAddNewTransactions(){
         await this.sidepanelAddTrans.click();
    }
    async ClickNext(){
       await this.Next.click();
    }
    async ClickSubmitRequest(){
        await this.SubmitReq.click();
    }
    async ClickSubmit(){
        await this.SubmitBtn.click();
    }

    
    async GetNewEPRNo(): Promise<string> {
        let newEPR = await this.EPRNewNumber.innerText();
        const requestNumber = newEPR?.match(/\d+/)?.[0] ?? '';
        console.log(`EPR NUMBER: ${requestNumber}`);
        await saveEPRToFile(requestNumber);  // save to JSON
        return requestNumber;
    }

    //FOR TEST
    async ClickAddTransActionCol(latestEPR:string) {
        // Find the row with your EPR number
        const Accrow = this.page.getByRole('table').getByRole('button').first()
        await Accrow.waitFor({ state: 'visible', timeout: 60000 });

        // Then get the button inside that row
        await Accrow.click();

        console.log(`Clicked Action button for EPR: ${latestEPR}`);
    }
    async ClickActionCol(latestEPR:string) {
        // Find the row with your EPR number
        const row = this.page.getByRole('row', { name: latestEPR });
        await row.waitFor({ state: 'visible', timeout: 60000 });

        // Then get the button inside that row
        const actionButton = row.getByRole('button');
        await actionButton.click();

        console.log(`Clicked Action button for EPR: ${latestEPR}`);
    }

    async ClickActionsColAccounting(latestEPR:string){
        const row = this.page.getByRole('row',{name: latestEPR});
        await row.waitFor({state:'visible', timeout:6000})


        const actionButton = row.getByRole('button');
        await actionButton.click();

        console.log(`Clicked Action button Accounting for EPR: ${latestEPR}`);
    }
    async ApproveARequest(){
        await this.ActionApprove.click()
        await this.ApproveReq.click();
        await this.ApproveReq.waitFor({ state: 'hidden', timeout: 50000 });
    }

    async RejectARequest(){
        await this.ActionReject.click()
        await this.RejectReq.click();
    }

    async ReturnARequest(){
        await this.ActionReturn.click()
        await this.ReturnField.fill(dets.ReturnMess);
        await this.ReturnReq.click();
    }
    async AcknowledgeARequest(){
        await this.ActionAcknowledge.click()
        await this.AcknowledgeReq.click();
        await this.AcknowledgeReq.waitFor({ state: 'hidden', timeout: 20000 });
    }
    async ClickDelete(){
        await this.Delete.click();
    }
    async ClickConfirmDelete(){
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



}