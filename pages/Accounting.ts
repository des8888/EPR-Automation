import { Page, Locator, expect } from '@playwright/test';
import data from '../data/tableHeader.json';

export default class AccountingPage {
    readonly page: Page;
    readonly Headers: Locator;

    constructor(page:Page){
        this.Headers = page.locator("//th")
    }
    async OngoingCheckHeaders(){
        let count = await this.Headers.count()
        console.log(`ETOOOOOOOO:${count}`);
        for(let i=0; i<count; i++){
            let head = this.Headers.nth(i);
            let title = await head.innerText()
            console.log(title);
            expect(title.trim()).toBe(data['Accounting Headers']['Ongoing Headers'][i])
            console.log('✅PASSED')
        }
    }
    async DoneCheckHeaders(){
        let count = await this.Headers.count()
        console.log(`ETOOOOOOOO:${count}`);
        for(let i=0; i<count; i++){
            let head = this.Headers.nth(i);
            let title = await head.innerText()
            console.log(title);
            expect(title.trim()).toBe(data['Accounting Headers']['Done Headers'][i])
            console.log('✅PASSED')
        }
    }
}