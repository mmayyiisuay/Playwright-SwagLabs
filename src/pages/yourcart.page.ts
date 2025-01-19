import { Page, Locator, expect } from '@playwright/test';
import { ProductPage } from './products.page';

export class YourCart extends ProductPage {

    async precondition(username: string, password: string){
        await super.precondition(username, password);
        
    }

    

    
}