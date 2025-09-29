import {Page, Locator, expect} from '@playwright/test';
import { TestInfo } from '@playwright/test';
import message from '../data/errorMessages.json'


export default class FieldErrors{
    readonly page: Page;
    readonly Company: Locator;
    readonly CompanyXbtn: Locator;
    readonly CompanyInputField: Locator;
    readonly Payee: Locator;
    readonly BillingFrom: Locator;
    readonly BillingTo: Locator;
    readonly DueDate: Locator;
    readonly ModeofPayemnt: Locator;
    readonly Category: Locator;
    readonly SubCat: Locator;
    readonly SubCat2: Locator;
    readonly RefNo: Locator;
    readonly FileAttachment: Locator;
    readonly FileAttach: Locator;
    readonly Particulars: Locator;
    readonly AddTransactionsBtn: Locator;
    readonly AddTransactions: Locator;
    readonly SubCat3: Locator;
    readonly Description: Locator;
    readonly Location: Locator;
    readonly Product: Locator;
    readonly Project: Locator;
    readonly ChargeCostCenter: Locator;
    readonly CapexOpexCogs: Locator;
    readonly NetAmnt: Locator;
    readonly NetAmntInputField: Locator;
    readonly sidepanelAddTrans: Locator;
    readonly sidepanelPage: Locator;

    constructor(page: Page){
        this.page = page;
        this.CompanyXbtn = page.locator('[id=":rc:"]');
        this.CompanyInputField = page.getByRole('textbox', { name: 'Select a Company' });
        this.Company = page.getByText('Please select a valid Company')
        this.Payee = page.getByText('Payee is required and must be')
        this.BillingFrom = page.getByText('Please select a Date.')
        this.BillingTo = page.getByText('Billing Period To must be')
        this.DueDate = page.getByText('Please enter a valid Date')
        this.ModeofPayemnt = page.getByText('Please select a Mode of Payment')
        this.Category = page.getByText('Category is required')
        this.SubCat = page.getByText('Sub Category 1 is required')
        this.SubCat2 = page.getByText('Sub Category 2 is required')
        this.RefNo = page.getByText('Reference number is required')
        this.FileAttachment = page.getByText('At least one file is required')
        this.FileAttach = page.locator(`input[type="file"]`)

        this.Particulars = page.getByText('Particulars is required')


        this.AddTransactionsBtn = page.getByRole('button', { name: 'Add a Transaction' })
        this.AddTransactions = page.getByText('At least one item is required')
        this.SubCat3 = page.getByText('Sub Category 3 is required')
        this.Description = page.getByText('Please provide a Description')
        this.Location = page.getByText('Please select a Location')
        this.Product = page.getByText('Please select a Product')
        this.Project = page.getByText('Please select a Project')
        this.ChargeCostCenter = page.getByText('Please select a Charge Cost')
        this.CapexOpexCogs = page.getByText('Please select an Expense Type')
        this.NetAmntInputField = page.getByRole('textbox', { name: 'Enter Amount' })
        this.NetAmnt = page.getByText('Please enter a valid amount')

        this.sidepanelAddTrans = page.getByRole('button', { name: 'Add Transaction' })

        this.sidepanelPage = page.locator("//div[@class='MuiBox-root css-1bht6gf']") 
    }

    async NewRequestFormFieldsErrors(){
        await this.page.waitForTimeout(3000)
        await this.CompanyXbtn.click();
        while (await this.CompanyInputField.inputValue() !== "") {
            await this.CompanyXbtn.click();
            await this.page.waitForTimeout(100);
        }
        await this.AddTransactionsBtn.click();
        const companyText = await this.Company.innerText();
        await expect(companyText).toBe(message.company);
         console.log("COMPANY ERROR MESSAGE PASSED")
        const payeeText = await this.Payee.innerText();
        await expect(payeeText).toBe(message.payee);
         console.log("PAYEE ERROR MESSAGE PASSED")
        const bilFromText = await this.BillingFrom.innerText();
        await expect(bilFromText).toBe(message.billingFrom);
        console.log("BILL FROM ERROR MESSAGE PASSED")
        const bilToText = await this.BillingTo.innerText();
        await expect(bilToText).toBe(message.billingTo);
        console.log("BILL TO ERROR MESSAGE PASSED")
        const dueText = await this.DueDate.innerText();
        await expect(dueText).toBe(message.dueDate);
        console.log("DUE DATE ERROR MESSAGE PASSED")
        const modeText = await this.ModeofPayemnt.innerText();
        await expect(modeText).toBe(message.modeOfPayment);
        console.log("MODE OF PAYMENT ERROR MESSAGE PASSED")
        const subcatText = await this.SubCat.innerText();
        await expect(subcatText).toBe(message.subCat1);
        console.log("SUBCATEGORY ERROR MESSAGE PASSED")
        const subcat2Text = await this.SubCat2.innerText();
        await expect(subcat2Text).toBe(message.subCat2);
        console.log("SUBCATEGORY 2 ERROR MESSAGE PASSED")

        const refnotext = await this.RefNo.innerText();
        await expect(refnotext).toBe(message.refNo);
        console.log("REFERENCE NUMBER ERROR MESSAGE PASSED")
        const filetext = await this.FileAttachment.innerText();
        await expect(filetext).toBe(message.fileAttachments);
        console.log("FILE ATTACHMENT ERROR MESSAGE PASSED")
        const particularText = await this.Particulars.innerText();
        await expect(particularText).toBe(message.particulars);
        console.log("PARTICULARS ERROR MESSAGE PASSED")
        const AddTransText = await this.AddTransactions.innerText();
        await expect(AddTransText).toBe(message.addTransactions);
        console.log("ADD TRANS ERROR MESSAGE PASSED")
    }

    async AddTransactionsFieldsErrors(page){
        await this.AddTransactionsBtn.click();
        // await page.evaluate(() => {
        //     document.body.style.transform = 'scale(0.8)';
        //     document.body.style.transformOrigin = '0 0';
        // });
        await this.NetAmntInputField.scrollIntoViewIfNeeded()
        await this.sidepanelAddTrans.click();

        await this.SubCat3.scrollIntoViewIfNeeded();
        const subcat3Text = await this.SubCat3.innerText();
        await expect(subcat3Text).toBe(message.subCat3);
        console.log("SUBCATEGORY 3 ERROR MESSAGE PASSED")

        const descText = await this.Description.innerText();
        await expect(descText).toBe(message.description);
         console.log("DESCRIPTION ERROR MESSAGE PASSED")

        const locText = await this.Location.innerText();
        await expect(locText).toBe(message.location);
         console.log("LOCATION ERROR MESSAGE PASSED")

        const productText = await this.Product.innerText();
        await expect(productText).toBe(message.product);
         console.log("PRODUCT ERROR MESSAGE PASSED")

        const proJText = await this.Project.innerText();
        await expect(proJText).toBe(message.project);
         console.log("PROJECT ERROR MESSAGE PASSED")

        const centerText = await this.ChargeCostCenter.innerText();
        await expect(centerText).toBe(message.chargeCost);
         console.log("CHARGE COST CENTER ERROR MESSAGE PASSED")

        const cogsText = await this.CapexOpexCogs.innerText();
        await expect(cogsText).toBe(message['capex/opex/cogs']);
         console.log("CAPEX OPEX COGS ERROR MESSAGE PASSED")

        const amountText = await this.NetAmnt.innerText();
        await expect(amountText).toBe(message.netAmount);
        console.log("NET AMOUNT ERROR MESSAGE PASSED")
    }

    
    async FileAttachmentError(page){
        await this.FileAttach.setInputFiles([
            'files/invalid files/file_1.txt'
        ]);

        
    }

}