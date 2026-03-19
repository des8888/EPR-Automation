import { Page, Locator, expect } from "@playwright/test";
import details from '../data/inputFormData.json';

    let today = new Date();
    let day = today.getDate();
    console.log(day);

  let formatted = today.toLocaleDateString('en-US', {
    month: 'long',   // full month name
    day: '2-digit',  // 09
    year: 'numeric'  // 2026
});
export default class AdminPage{
    readonly page: Page;
    readonly Profile: Locator;
    readonly Approvals: Locator;
    readonly NewDelegationBtn: Locator;
    readonly Filter: Locator;
    readonly Search: Locator;


    readonly ApprovalDelegationTitle: Locator;
    readonly DelegateApproverDropdown: Locator;
    readonly DelegateApproverData: Locator;
    readonly DelegationStartDateBtn: Locator;
    readonly DelegationEndDateBtn: Locator;
    readonly DelegationReason: Locator;
    readonly DelegateApproverBtn: Locator;
    readonly DelegateBtn: Locator;

    readonly ViewApprovalHierarchy: Locator;
    readonly Hierarchy: Locator;

    readonly Status: Locator;



    constructor (page: Page){
        this.page = page;
        this.Profile = page.getByText('Profile');
        this.Approvals = page.getByRole('button', { name: 'Approvals' })
        this.NewDelegationBtn = page.getByRole('button', {name: 'New Delegation'});
        this.Filter = page.locator("//button[@id=':r1i:']//*[name()='svg']");
        this.Search = page.getByRole('textbox', { name: 'Search…' })

        this.ApprovalDelegationTitle = page.locator('p').filter({ hasText: 'Approval Delegation' }).first()
        this.DelegateApproverDropdown = page.getByRole('combobox', { name: 'Select a Delegate Approver' })
        this.DelegateApproverData = page.getByRole('option',{ name: /.*/ }).first()
        this.DelegationStartDateBtn = page.getByRole('button', { name: 'Choose date' }).first()
        this.DelegationEndDateBtn = page.getByRole('button', { name: 'Choose date', exact: true })
        this.DelegationReason = page.locator('input[name="reason"]')
        this.DelegateApproverBtn = page.getByRole('button', { name: 'Delegate Approver' })
        this.DelegateBtn = page.getByRole('button', { name: 'Delegate' })


        this.ViewApprovalHierarchy = page.getByRole('button', { name: 'View Approval Hierarchy' })

        this.Hierarchy = page.locator('div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.css-76zbm4')

        this.Status = page.locator('span.MuiChip-label.MuiChip-labelMedium.css-s01idy')

        
//page.getByText('Approver delegated successfully.', { exact: true })
//page.locator(`//tr[td[contains(., 'Approver2 Tester')] and td[contains(., 'March 10, 2026')]]//div`)
    }



    delegationDate(day: number | string) {
    return this.page.getByRole('gridcell', { name: day.toString() });
    }

    async clickApprovalHierarchyBtn(){
        await expect(this.ViewApprovalHierarchy).toBeVisible({ timeout: 180000 })
        await this.ViewApprovalHierarchy.click();
    }

    async createDelegation(){
        console.log(day);
        await this.NewDelegationBtn.click();
        await this.ApprovalDelegationTitle.waitFor({state: "visible", timeout: 3000})
        await this.DelegateApproverDropdown.fill(details.DelegateApprover);
        await this.DelegateApproverData.click()
        await this.DelegationStartDateBtn.click();
        await this.delegationDate(day).click();
        await this.DelegationEndDateBtn.click()
        await this.page.waitForTimeout(3000);
        await this.delegationDate(day).click();
        await this.DelegationReason.fill(details.DelegationReason)
        await this.DelegateApproverBtn.click();
        
        await this.DelegateBtn.click();
        await this.page.waitForTimeout(3000)
        await expect(this.NewDelegationBtn).toBeVisible({timeout:180000})
    }

    async clickProfile(){
        await this.Profile.click();
    }

    async clickApprovals(){
        await this.Approvals.click();
    }

    async checkHierarchy(){
        const allText = await this.Hierarchy.allTextContents();
        const combinedText = allText.join(' ')
        console.log(`Hierarchy Text: ${combinedText}`)
        await expect(combinedText).toContain('L1 Approver');
        await expect(combinedText).toContain('approver3');
        await expect(combinedText).toContain('Delegated Approver')
    }

    async validateDelegationStatus(){
        const status = 'Active';
        await this.Status.filter({hasText: new RegExp(`${formatted}.*${status}`)})
    }

}