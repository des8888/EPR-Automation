import { Page, Locator , expect} from "@playwright/test";
import data from '../../data/filterData.json';
export default class SharedLocator{
    readonly page: Page;
    readonly EPRColumn: Locator;
    readonly EPRColumnAcc: Locator;
    readonly EPRColumn2: Locator;
    readonly NoDataMessage: Locator;
    readonly CategoryInputField: Locator;
    readonly CategoryInputArrow: Locator;
    readonly CategoryXBtn: Locator;
    readonly SubcategoryField: Locator;
    readonly SubcategoryArrow: Locator;
    readonly SubcategoryXBtn: Locator;
    readonly SubcategoryDataSelection: Locator;
    readonly FunnelFilter: Locator;

    readonly ApplyFilterBtn: Locator;

    readonly Export: Locator;
    readonly SearchField: Locator;
    readonly SearchFieldCancel: Locator;
    readonly CategoryColumn: Locator;
    readonly CategoryDataSelection: Locator;
    readonly SubCategoryColumn: Locator;

    readonly DateReqFIlterFrom: Locator;
    readonly DateReqFIlterTo: Locator;
    readonly CalendarIcon: Locator;
    readonly CalendarToIcon: Locator;

    readonly CalendarClear: Locator;

    readonly DateSubColumn: Locator;

    readonly Logout: Locator;
    readonly AccLogout: Locator;
    readonly L1Logout: Locator;
    readonly YesLogout: Locator;

    //Approvals
    readonly DoneTab: Locator;
    readonly Status: Locator;
    readonly AccStatus: Locator;
    readonly ApprovalsDashboard: Locator;
    readonly SelectMultiple: Locator;
    //Actions column

    //TOASTNOTIFICATION
    readonly Toast:Locator;

    constructor(page: Page){
        this.EPRColumn = page.locator("//tbody/tr[1]/td[1]");
        this.EPRColumnAcc = page.locator("//tbody/tr[1]/td[2]");
        this.EPRColumn2 = page.locator("//tbody//tr[2]/td[1]");

        this.NoDataMessage = page.getByText('You currently have no transaction added here.')

        this.CategoryInputField = page.locator('input[name="category"]')
        this.CategoryInputArrow = page.locator("button[id$=':r3:']")
        this.CategoryDataSelection = page.locator("ul div:nth-child(1)");
        this.SubcategoryField = page.locator("input[name='subcategory1']")
        this.SubcategoryArrow = page.locator("button[id$=':r1j:']")
        this.SubcategoryDataSelection = page.locator("ul div:nth-child(1)");

        this.FunnelFilter = page.locator('[id=":r7:"]')
        this.ApplyFilterBtn = page.getByRole('button', { name: 'Apply Filter' })

        this.CategoryColumn = page.locator("//tbody//td[3]")
        this.SubCategoryColumn = page.locator("//tbody//td[4]")

        this.SearchField = page.locator("input[name$='searchKey']")
        this.SearchFieldCancel = page.locator('form').getByRole('button').filter({ hasText: /^$/ }).nth(4)

        this.DateReqFIlterFrom =page.locator('input[name="startDateSubForm"]');
        this.DateReqFIlterTo = page.locator('input[name="endDateSubForm"]');
        this.CalendarIcon = page.locator("button[id=':r82:']")
        this.CalendarClear = page.getByText('Clear');

        this.CategoryXBtn = page.locator("button[id=':r5t:']")
        this.SubcategoryXBtn = page.locator("button[id=':r6q:']")

        this.DateSubColumn = page.locator("//tbody//td[6]")

        this.Logout = page.locator("(//button)[1]");
        this.AccLogout = page.locator("(//button)[1]");
        this.L1Logout = page.locator("(//button)[1]");
        this.YesLogout = page.getByRole('button', { name: 'Yes, Logout' })

        this.DoneTab = page.getByRole('button', { name: 'Done' });
        this.Status = page.locator("//tbody/tr[1]/td[11]")
        this.AccStatus = page.locator("//tbody/tr[1]/td[13]")
        this.ApprovalsDashboard = page.getByText('Approvals')
        this.SelectMultiple = page.getByRole('button', { name: 'Select Multiple' })

        //TOASTNOTIFICATION
        this.Toast = page.getByRole('alert')

    }

    get DoneTabButton() {
        return this.DoneTab;
    }
    async GetStatus(){
        let text = await this.Status.innerText();
        console.log(`EPR STATUS: ${text}`)
    }
    async AccGetStatus(){
        let text = await this.AccStatus.innerText();
        console.log(`STATUS: ${text}`)
        await expect(text).toBe('Acknowledged by Accounting')
    }
    async ToastNotificationMessage(){
        let toastText = await this.Toast.innerText()
        console.log(`TOAST NOTIFICATION: ${toastText}`)
    }
    async ClickFunnelFilter(){
        await this.FunnelFilter.click();
    }

    async SelectingCategory(){
        await this.CategoryInputField.click();
        await this.CategoryDataSelection.click();
        let catData = await this.CategoryInputField.inputValue()
        console.log(`CAT DATA: ${catData}`);
    }
    async GetCategoryDataonTable(){
        //await this.CategoryColumn.first().waitFor({state:'visible', timeout: 5000});
        await expect(this.CategoryColumn.first()).toHaveText(/\S/, {timeout: 5000})
        let cat = await this.CategoryInputField.inputValue();
        //console.log(`ETOOOOOOOOOO: ${cat}`)
        //let categoryData = await this.CategoryColumn.allTextContents();
            const count = await this.CategoryColumn.count();
            console.log(`SAME AS THE CATEGORY IS: ${count}` )

            for (let i = 0; i < count; i++) {
                const cell = this.CategoryColumn.nth(i);

                // Check if the cell is visible
                if (await cell.isVisible()) {
                    const visibleText = await cell.innerText();
                    expect(visibleText.trim()).toBe(cat);
                    console.log(`Row ${i + 1} Visible Text: "${visibleText}"`);
                } else {
                    console.log(`Row ${i + 1} is hidden/skipped.`);
                }
            }
    }
    async SelectingSubCategory(){
        await this.SubcategoryField.click();
        await this.SubcategoryDataSelection.click();
    }
    async GetSubCategoryDataonTable({page,evaluate}){
        await this.SubcategoryField.click();
        await this.SubcategoryDataSelection.click();
        let catData = await this.SubcategoryField.inputValue()
        console.log(`${catData}`);
        await expect(this.SubCategoryColumn.first()).toHaveText(/\S/, { timeout: 5000 });
        //await this.SubCategoryColumn.first().waitFor({state:'visible', timeout: 5000});
        let cat = await this.SubcategoryField.inputValue();
        //console.log(`ETOOOOOOOOOO: ${cat}`)
        //let categoryData = await this.CategoryColumn.allTextContents();
            const count = await this.SubCategoryColumn.count();
            console.log(`SAME AS THE SUBCATEGORY IS: ${count}` )

            for (let i = 0; i < count; i++) {
                const cell = this.SubCategoryColumn.nth(i);

                // Check if the cell is visible
                if (await cell.isVisible()) {
                    const visibleText = await cell.innerText();
                    expect(visibleText.trim()).toBe(cat);
                    console.log(`Row ${i + 1}: "${visibleText}"`);
                    // Zoom out to 80%
                        await page.evaluate(() => {
                        document.body.style.transform = "scale(0.8)";
                        document.body.style.transformOrigin = "0 0"; // Keep scaling from top-left
                        });

                } else {
                    console.log(`Row ${i + 1} is hidden/skipped.`);
                }
            }
    }
    async ValidateSearchField(page){
        await page.waitForTimeout(4000);
        let useEprNo = await this.EPRColumn2.first().innerText();
        await this.SearchField.fill(useEprNo);
        await expect(this.EPRColumn.first()).toHaveText(/\S/, {timeout:5000});
        await page.waitForTimeout(3000);
        let eprNo = await this.EPRColumn.innerText();
        await expect(eprNo).toBe(useEprNo)
        //nodata
        await page.reload()
        await this.SearchField.fill(data.WrongSearchFieldData);
        await page.waitForTimeout(3000);
        let noMessage = await this.NoDataMessage.innerText();  
        await expect(noMessage).toBe(data.NoDataMessage);
    }
    async ValidateEPRafterApproveonOngoingtable(requestNumber: string){
        await this.SearchField.fill(requestNumber);
        let noMessage = await this.NoDataMessage.innerText();  
        await expect(noMessage).toBe(data.NoDataMessage);
    }
    async ValidateDateFilter() {
            
            // Convert filter dates from data
            const fromDate = new Date(data.DateReqFrom);
            const toDate = new Date(data.DateReqTo);
            const formatDate = (date) => {
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            };

            const fromDateFormatted = formatDate(fromDate);
            const toDateFormatted = formatDate(toDate);
            console.log(`FROM DATE: ${fromDateFormatted}`)
            console.log(`TO DATE: ${toDateFormatted}`)

            await this.FunnelFilter.waitFor({ state: 'visible' });
            await this.FunnelFilter.click();
            await this.DateReqFIlterFrom.fill(data.DateReqFrom);
            await this.DateReqFIlterTo.fill(data.DateReqTo);
            await this.ApplyFilterBtn.click();


            await expect(this.DateSubColumn.first()).toHaveText(/\S/, { timeout: 5000 });
            const visibleText = await this.DateSubColumn.first().innerText();
            const count = await this.DateSubColumn.count();
            console.log(`COUNT:${count}`)

            for (let i = 0; i < count; i++) {
                const cell = this.DateSubColumn.nth(i);

                if (await cell.isVisible()) {
                    const visibleText = await cell.innerText();
                    console.log(`VISIBLE DATE: ${visibleText}`)

                    // Try multiple date formats
                    let trimmedDate = new Date(visibleText?.split(' - ')[0].trim());
                    console.log(`TRIMMED DATE: ${trimmedDate}`)

                    // If parsing fails, try explicitly with Date.parse
                    if (isNaN(trimmedDate.getTime())) {
                        trimmedDate = new Date(Date.parse(visibleText?.split(' - ')[0].trim()));
                    }

                    // Normalize
                    trimmedDate.setHours(0, 0, 0, 0);

                    console.log(`🔍 Row ${i + 1}: ${trimmedDate.toDateString()}`);
                    console.log(`📅 From: ${fromDate.toDateString()} | To: ${toDate.toDateString()}`);

                    const isInRange = trimmedDate >= fromDate && trimmedDate <= toDate;
                    console.log(`✅ Is in range? ${isInRange}`);

                    expect(isInRange).toBeTruthy();
                } else {
                    console.log(`⚠️ Row ${i + 1} is hidden/skipped.`);
                }
            }
    }
    async ValidateDateFilterForApprovals() {
            
            // Convert filter dates from data
            const fromDate = new Date(data.ApprovalsDateReqFrom);
            const toDate = new Date(data.ApprovalsDateReqFrom);
            const formatDate = (date) => {
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            };

            const fromDateFormatted = formatDate(fromDate);
            const toDateFormatted = formatDate(toDate);
            console.log(`FROM DATE: ${fromDateFormatted}`)
            console.log(`TO DATE: ${toDateFormatted}`)

            await this.FunnelFilter.waitFor({ state: 'visible' });
            await this.FunnelFilter.click();
            await this.DateReqFIlterFrom.fill(data.ApprovalsDateReqFrom);
            await this.DateReqFIlterTo.fill(data.ApprovalsDateReqFrom);
            await this.ApplyFilterBtn.click();


            await expect(this.DateSubColumn.first()).toHaveText(/\S/, { timeout: 5000 });
            const visibleText = await this.DateSubColumn.first().innerText();
            const count = await this.DateSubColumn.count();
            console.log(`COUNT:${count}`)

            for (let i = 0; i < count; i++) {
                const cell = this.DateSubColumn.nth(i);

                if (await cell.isVisible()) {
                    const visibleText = await cell.innerText();
                    console.log(`VISIBLE DATE: ${visibleText}`)

                    // Try multiple date formats
                    let trimmedDate = new Date(visibleText?.split(' - ')[0].trim());
                    console.log(`TRIMMED DATE: ${trimmedDate}`)

                    // If parsing fails, try explicitly with Date.parse
                    if (isNaN(trimmedDate.getTime())) {
                        trimmedDate = new Date(Date.parse(visibleText?.split(' - ')[0].trim()));
                    }

                    // Normalize
                    trimmedDate.setHours(0, 0, 0, 0);

                    console.log(`🔍 Row ${i + 1}: ${trimmedDate.toDateString()}`);
                    console.log(`📅 From: ${fromDate.toDateString()} | To: ${toDate.toDateString()}`);

                    const isInRange = trimmedDate >= fromDate && trimmedDate <= toDate;
                    console.log(`✅ Is in range? ${isInRange}`);

                    expect(isInRange).toBeTruthy();
                } else {
                    console.log(`⚠️ Row ${i + 1} is hidden/skipped.`);
                }
            }
    }
    async CountingCategoryTableData() {
        // Ensure at least one td is visible before counting (use your existing locator)
        await this.CategoryColumn.first().waitFor({ state: 'visible' });
        //await this.page.waitForTimeout(5000);
        const countCat = await this.CategoryColumn.count();
        console.log(`Category column count: ${countCat}`);
    }

    async ClickLogout(){
        await this.Logout.click();
        await this.YesLogout.click();
    }
    async ClickLogoutL1(){
        await this.L1Logout.click();
        await this.YesLogout.click();
    }
    async ClickLogoutAcc(){
        await this.AccLogout.click();
        await this.YesLogout.click();
    }

    async ClickApprovals(){
        await this.ApprovalsDashboard.click();
        await this.SelectMultiple.waitFor({state:'visible', timeout:1000});
    }

    async WaitForSelectMultipleBtn(){
        await this.SelectMultiple.waitFor({state:'visible', timeout:1000});
    }

    async UseSearch(requestNumber: string) {
        // Fill search field
        await this.SearchField.fill(requestNumber);
        await this.SearchField.press('Enter'); // trigger search

        // Wait until the first EPR cell contains the expected request number
        await expect(this.EPRColumn.first(), {
            timeout: 50000
        }).toHaveText(requestNumber);

        // Optionally, get the text after waiting
        const eprNo = await this.EPRColumn.first().innerText();
        console.log(`EPR found: ${eprNo}`);
    }
    async UseSearchAccounting(requestNumber: string) {
        await this.SearchField.fill(requestNumber);
        await this.SearchField.press('Enter'); // trigger search
        // Wait until the first EPR cell contains the expected request number
        await expect(this.EPRColumnAcc, {
            timeout: 50000
        }).toHaveText(requestNumber);

        // Optionally, get the text after waiting
        const eprNo = await this.EPRColumnAcc.innerText();
        console.log(`EPR found: ${eprNo}`);
    }

    async ValidateUseSearchforNoData(requestNumber: string) {
        await this.SearchField.fill(requestNumber);
        await this.SearchField.press('Enter'); // trigger search
        await this.SearchField.fill(requestNumber);
        await this.SearchField.press('Enter'); // trigger search
        await expect(this.NoDataMessage).toHaveText(data.NoDataMessage, { timeout: 5000 });

    }

}