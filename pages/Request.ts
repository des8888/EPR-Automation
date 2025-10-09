import { Page, Locator, expect } from '@playwright/test';
import data from '../data/filterData.json';

export default class RequestPage {
    readonly page: Page;
    readonly NewRequestBtn: Locator;
    readonly ApproverName: Locator;
    readonly ApproverData: Locator;
    readonly ApproverNameCol: Locator;
    readonly ApplyFilterBtn: Locator;
    readonly StatusCol: Locator;
    readonly EPRNoColumn: Locator;
    readonly EPRNoColumnData: Locator;
    readonly subCat3: Locator;
    readonly ViewAllRequests: Locator;
    readonly PendingReqTab: Locator;
    readonly SummaryTab: Locator;
    readonly PendingReqHeaders: Locator;

    constructor(page: Page) {
        this.page = page;

        this.NewRequestBtn = page.getByRole('button', { name: 'NEW REQUEST' });
        this.ApproverName = page.getByRole('combobox', { name: 'Select Approver' });
        this.ApproverData = page.getByRole('option', { name: data.ReqName });
        this.ApplyFilterBtn = page.getByRole('button', { name: 'Apply Filter' });
        this.ApproverNameCol = page.locator("//tbody//td[5]");
        this.StatusCol = page.locator("//tbody//td[10]");
        this.EPRNoColumn = page.locator("//tbody/tr[1]/td[1]");
        this.EPRNoColumnData = page.getByRole('cell').locator('a').nth(2);
        this.subCat3 = page.locator("//tbody/tr[1]/td[1]");
        this.ViewAllRequests = page.getByText('View All Requests', { exact: true });
        this.PendingReqTab = page.getByRole('button', { name: 'Pending Request' });
        this.SummaryTab = page.getByRole('button', { name: 'Summary' });
        this.PendingReqHeaders = page.locator('th');
    }

    async ClickViewAllReq() {
        await this.ViewAllRequests.click();
        await expect(this.EPRNoColumn).toHaveText(/\S/, { timeout: 5000 });
    }
    get NewRequestButton() {
        return this.NewRequestBtn;
    }
    get HeadersValidation() {
        return this.PendingReqHeaders;
    }

    async ClickNewRequest() {
        await this.NewRequestBtn.click();
    }
    async ClickSummaryTab() {
        await this.SummaryTab.click();
    }
    async ClickPendingReqTab() {
        await this.PendingReqTab.click();
    }
    async ApproverNameFilter() {
        await this.ApproverName.fill(data.ReqName);
    }
    async SelectAppName() {
        await this.ApproverData.click();
    }
    async ClickApplyFilter() {
        await this.ApplyFilterBtn.click();
    }
    async waitForViewofViewAllReq() {
        await expect(this.ViewAllRequests).toBeVisible({ timeout: 180000 });
    }

    async ValidateEPRReturnPage() {
        await expect(this.EPRNoColumn.first()).toHaveText(/\S/, { timeout: 5000 });
        await this.EPRNoColumnData.click();
        await expect(this.subCat3.first()).toHaveText(/\S/, { timeout: 7000 });
        await this.ViewAllRequests.scrollIntoViewIfNeeded();
        await this.ViewAllRequests.click();
        await expect(this.PendingReqTab).toHaveClass(/css-2dm5bj/);
    }

    async ApproverNameonPendingReqValidation() {
        const count = await this.ApproverNameCol.count();
        for (let i = 0; i < count; i++) {
            const visText = await this.ApproverNameCol.nth(i).innerText();
            console.log(`Row ${i + 1} Visible Text: "${visText}"`);
            await expect(visText).toBe(data.ReqName);
        }
    }

    async StatusonSummaryTabValidation() {
        const count = await this.StatusCol.count();
        for (let i = 0; i < count; i++) {
            const visText = await this.StatusCol.nth(i).innerText();
            console.log(`Row ${i + 1} Visible Text: "${visText}"`);
            await expect(visText).toBe(data.ReqName);
        }
    }
}
