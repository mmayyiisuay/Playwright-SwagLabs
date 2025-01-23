import { Locator, Page, expect } from '@playwright/test';
import { CheckOut2 } from './checkoutoverview.page';


export class CheckOut3 extends CheckOut2 {

    readonly completeIcon: Locator
    readonly headerThanks: Locator
    readonly contextThanks: Locator
    readonly backtoproductBtn: Locator

    constructor(page: Page){
        super(page);
        this.completeIcon = page.locator('.pony_express')
        this.headerThanks = page.locator('.complete-header')
        this.contextThanks = page.locator('.complete-text')
        this.backtoproductBtn = page.locator('#back-to-products')
    }
    
    
    async precondition(username: string, password: string): Promise<void> {
        await super.precondition(username, password);
        await super.finishButtonClick()    
    }

    async getTextHeaderThanks(){
        const text = await this.headerThanks.textContent()
        return text
    }

    async getContextThanks(){
        const text = await this.contextThanks.textContent()
        return text
    }

    async backtoproductButtonClick(){
        await this.backtoproductBtn.click()
    }


    
}