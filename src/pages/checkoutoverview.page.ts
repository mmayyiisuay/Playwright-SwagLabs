import { Locator, Page, expect } from '@playwright/test';
import { CheckOut1 } from './checkoutinformation.page';
import { successfully } from '../test-data/yourinformation';


export class CheckOut2 extends CheckOut1 {

    readonly paymentInfo: Locator
    readonly shippingInfo: Locator
    readonly priceTotal: Locator
    readonly tax: Locator
    readonly total: Locator
    readonly finishBtn: Locator

    
    constructor(page: Page){
        super(page);
        this.paymentInfo = page.locator('[data-test="payment-info-value"]')
        this.shippingInfo = page.locator('[data-test="shipping-info-value"]')
        this.priceTotal = page.locator('[data-test="subtotal-label"]')
        this.tax = page.locator('[data-test="tax-label"]')
        this.total = page.locator('[data-test="total-label"]')
        this.finishBtn = page.locator('#finish')
    }
    
    
    async precondition(username: string, password: string): Promise<void> {
        await super.precondition(username, password);
        const user = successfully[0]
        await super.fillInformation(user.firstName, user.lastName, user.zip);
        await super.continueButtonClick()
    }

    async getPaymentInfo() {
        return this.paymentInfo.textContent();
      }
    
      async getShippingInfo() {
        return this.shippingInfo.textContent();
      }
    
      async getItemTotal() {
        const itemTotal = await this.priceTotal.textContent();
        return parseFloat(itemTotal?.replace('Item total: $', '') || '0');
      }

      async calculatePrices(){
        const productPrices = await this.getProductPrices();
        const pricesItems = productPrices.reduce((partialSum, a) => partialSum + a, 0);
        return pricesItems
      }

    
      async getTax() {
        const tax = await this.tax.textContent();
        return parseFloat(tax?.replace('Tax: $', '') || '0');
      }

      async calculateTax() {
        const pricesItems = await this.calculatePrices();
        const taxRate = 0.08; 
        const calculatedTax = parseFloat((pricesItems * taxRate).toFixed(2)); 
        return calculatedTax
      }
    
      async getTotal() {
        const total = await this.total.textContent();
        return parseFloat(total?.replace('Total: $', '') || '0');
      }    

      async finishButtonClick() {
        await this.finishBtn.click();
      }
    
    
}