import { Page, Locator, expect } from '@playwright/test';
import data from '../data/filterData.json';

export default class ApprovalsPage {
    readonly page: Page;
    readonly NewRequestBtn: Locator;
    readonly EPRColumn: Locator;
    readonly EPRNoColumn: Locator;
    readonly EPRNoColumnData: Locator;
    readonly subCat3: Locator;
    readonly ViewAllRequests: Locator;
    readonly OngoingTab: Locator;
    readonly DoneTab: Locator;
    readonly ReqName: Locator;
    readonly ReqNameData: Locator;
    readonly ApplyFilterBtn: Locator;
    readonly ReqNameColumn: Locator;
    readonly ActionsCol: Locator;
    readonly ViewReq: Locator;

    constructor(page: Page) {
        this.page = page;

        this.NewRequestBtn = page.locator("button[id=':r6:']");
        this.EPRColumn = page.locator("//tbody//td[1]");
        this.EPRNoColumn = page.locator("//tbody/tr[1]/td[1]");
        this.EPRNoColumnData = page.getByRole('cell').locator('a').nth(2);
        this.subCat3 = page.locator("//tbody/tr[1]/td[1]");
        this.ViewAllRequests = page.getByRole('button', { name: 'View All Requests' });
        this.OngoingTab = page.getByRole('button', { name: 'On-going' });
        this.DoneTab = page.getByRole('button', { name: 'Done' });

        // Requestor Name filter
        this.ReqName = page.getByRole('combobox', { name: 'Select Requestor' });
        this.ReqNameData = page.getByRole('option', { name: data.ReqName });
        this.ApplyFilterBtn = page.getByRole('button', { name: 'Apply Filter' });

        // Requestor Name column
        this.ReqNameColumn = page.locator("//tbody//td[5]");

        // Actions column
        this.ActionsCol = page.locator("//tbody/tr[1]/td[9]");
        this.ViewReq = page.getByText('View Request');
    }

    get NewRequestButton() {
        return this.NewRequestBtn;
    }
    get DoneTabButton() {
        return this.DoneTab;
    }
    get OngoingTabButton(){
        return this.OngoingTabButton;
    }

    async ClickNewRequest() {
        await this.NewRequestBtn.click();
    }

    async ValidateEPRReturnPage() {
        await expect(this.EPRNoColumn.first()).toHaveText(/\S/, { timeout: 5000 });
        await this.EPRNoColumnData.click();
        await expect(this.subCat3.first()).toHaveText(/\S/, { timeout: 7000 });
        await this.ViewAllRequests.scrollIntoViewIfNeeded();
        await this.ViewAllRequests.click();
        await expect(this.OngoingTab).toHaveClass(/css-2dm5bj/);
    }

    async ValidateEPRReturnPageviaActionButton() {
        await expect(this.EPRNoColumn.first()).toHaveText(/\S/, { timeout: 5000 });
        await this.ActionsCol.scrollIntoViewIfNeeded();
        await this.ActionsCol.click();
        await this.ViewReq.click();
        await expect(this.subCat3.first()).toHaveText(/\S/, { timeout: 7000 });
        await this.ViewAllRequests.scrollIntoViewIfNeeded();
        await this.ViewAllRequests.click();
        await expect(this.OngoingTab).toHaveClass(/css-2dm5bj/);
    }

    async RequestorNameFilter() {
        await this.ReqName.fill(data.ReqName);
    }
    async SelectReqName() {
        await this.ReqNameData.click();
    }
    async ClickApplyFilter() {
        await this.ApplyFilterBtn.click();
    }

    async ColumnVisibility() {
        await expect(this.EPRColumn.first()).toHaveText(/\S/, { timeout: 2000 });
    }

    async ReqNameValidation() {
        const count = await this.ReqNameColumn.count();
        for (let i = 0; i < count; i++) {
            const visText = await this.ReqNameColumn.nth(i).innerText();
            console.log(`Row ${i + 1} Visible Text: "${visText}"`);
            await expect(visText).toBe(data.ReqName);
        }
    }
}
