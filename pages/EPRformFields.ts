import { Locator, Page, expect} from "@playwright/test";
import dets from '../data/inputFormData.json'
import { read } from "fs";
import { time } from "console";

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
    readonly ActionAcknowledge: Locator;
    readonly AcknowledgeReq: Locator;
    readonly ApproveReq: Locator;
    readonly Edit: Locator;
    readonly Delete: Locator;
    readonly ConfirmDelete: Locator;
    


     //Request submission
    readonly Next: Locator;
    readonly SubmitReq: Locator;
    readonly SubmitBtn: Locator;
    readonly EPRNewNumber: Locator;


    constructor (page: Page){
        this.BillingFrom = page.getByRole('button', { name: 'Choose date' }).first()
        this.BillingFromDate = page.getByRole('gridcell', { name: `${dets.BillingFrom}` })
        this.BillingTo = page.getByRole('button', { name: 'Choose date' }).nth(1)
        this.BillingToDate = page.getByRole('gridcell', { name: `${dets.BillingTo}` })
        this.DueDate = page.locator('form div').filter({ hasText: 'Due Date Mode of Payment' }).getByLabel('Choose date')
        this.DueSelectDate = page.getByRole('gridcell', { name: `${dets.DueDate}` })
        this.ModeofPayment = page.getByRole('textbox', { name: 'Select Mode of Payment' })
        this.MoPList = page.locator(".MuiList-root.MuiList-padding.css-1bwj75t");
        const randomNum = Math.floor(Math.random() * 5) + 1;
        this.MopListData = page.getByRole('button').nth(randomNum)

        this.Category = page.getByRole('textbox', { name: 'Select a Category' })
        this.CategoryList = page.locator(".MuiList-root.MuiList-padding.css-1bwj75t")

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
        this.TotalAmount = page.locator('.MuiTypography-root.MuiTypography-h6.css-1kwadbg')
        //Actions column on trans table
        //this.ActionsCol = page.locator("//tbody/td[9]");
        this.ActionsCol = page.locator("//tbody/tr/td[11]/button")
        this.AccActionsCol = page.getByRole('row').getByRole('button')
        this.ActionApprove = page.getByRole('menuitem', { name: 'Approve' })
        this.ActionAcknowledge = page.getByRole('menuitem', { name: 'Acknowledge' })
        this.ApproveReq = page.getByRole('button', { name: 'Approve' })
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
        await this.DueDate.click()
        await this.DueSelectDate.first().click()
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
        // const element =await this.SubCategory2ListData.innerHTML()
        // // console.log(`ELEMENT ${element}`)
        await this.RefNo.fill(dets.ReferenceNo);
        await this.Particulars.fill(dets.Particulars);

        await this.FileAttach.setInputFiles('files/file_1.txt');
    }

    async InputFieldsonTransactions(page){
        await this.SubCat3.waitFor({state:'visible'});
        await this.SubCat3.fill(dets.SubCat3);
        const randomNum2 = Math.floor(Math.random() * 9) + 1;
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
        const hunderdToMillion = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
        await this.NetAmnt.fill(`${hunderdToMillion}`);
        await this.Vatable.click();
       
    }
    async InputFieldsonTransactions2(page){
        await this.SubCat3.waitFor({state:'visible'});
        await this.SubCat3.click()
        await this.SubCat3Data.waitFor({state:'visible'})
        await this.SubCat3Data.click()
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
        
        await this.NetAmnt.fill(dets.NetAmnt);
        await this.Vatable.click();
       
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
        return requestNumber;
    }

    //FOR TEST
    async ClickActionCol(){
        await this.ActionsCol.first().click();
    }

    async ClickActionsColAccounting(){
        await this.AccActionsCol.first().click();
    }

    async ApproveARequest(){
        await this.ActionApprove.click()
        await this.ApproveReq.click();
    }
    async AcknowledgeARequest(){
        await this.ActionAcknowledge.click()
        await this.AcknowledgeReq.click();
    }
    async ClickDelete(){
        await this.Delete.click();
    }
    async ClickConfirmDelete(){
        await this.ConfirmDelete.click();
    }
    async CountTotalAmount(){
        let total = 0;
        await this.AmountCol.first().scrollIntoViewIfNeeded();
        let count = await this.AmountCol.count();
        console.log(`ETOOOOOOOOOOOOOOO: ${count}`)
        for(let i=0;i<count;i++){
            let text = await this.AmountCol.nth(i)
            let amt = await text.innerText();
            let value = amt.split(" ")[1];
            let numericValue = parseFloat(value.replace(/,/g, ""));  //parsefloat converts string to number and /,/g remove commas

            total += numericValue;
            console.log(`TOTAAAAAAAAAAAAAAL: ${total}`)

        }
        let totalOverall = await this.TotalAmount.innerText();
        let trimTotalOverall = totalOverall.split(" ")[1]
        let TOTAL = parseFloat(trimTotalOverall.replace(/,/g, ""));
        console.log(`TOTAL OVERAAAAAAAAAAAAAAL: ${totalOverall}`)
        await expect(TOTAL).toBe(total);
    }


}