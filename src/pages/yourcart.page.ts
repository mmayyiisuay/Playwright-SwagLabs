import { Page, Locator, expect } from '@playwright/test';
import { ProductPage } from './products.page';

export class YourCartPage extends ProductPage {
  private randomItems: Set<string> = new Set(); 
  readonly productQuantity: Locator;
  readonly continueButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productQuantity = this.page.locator('.cart_quantity')
    this.continueButton = this.page.locator('#continue-shopping')
    this.checkoutButton = this.page.locator('#checkout')
  }

    async precondition(username: string, password: string){
        await super.precondition(username, password);
        await this.resetState();
        await this.selectedItemtoCart();
        await this.cartButton.click();
    }

    async selectedItemtoCart() {
      const transformedNames = await this.productsIDName();
      const randomCount = Math.floor(Math.random() * transformedNames.length) + 1;
      const randomItems = new Set<string>();
      
      while (randomItems.size < randomCount) {
        const randomIndex = Math.floor(Math.random() * transformedNames.length);
        randomItems.add(transformedNames[randomIndex]);
      }
      console.log('randomItems:', randomItems);
      
      this.randomItems = randomItems;
      
      for (const item of randomItems) {
        const addToCartButton = this.page.locator(`[name="add-to-cart-${item}"]`);
        await addToCartButton.click();
      }
      return randomItems;
    }
    getSelectedItems() {
      return this.randomItems;
    }

    

    async getItemTitle() {

      const productTitles = this.page.locator('.inventory_item_name');
      const count = await productTitles.count();
      const cartItems = new Set<string>();
    
      for (let i = 0; i < count; i++) {
        const productTitleElement = productTitles.nth(i);
        let productTitle = await productTitleElement.textContent();
    
        if (productTitle) {
          productTitle = productTitle.toLowerCase().replace(/\s+/g, '-').trim();
          cartItems.add(productTitle);
        } else {
          console.error(`Item ${i + 1} has no title`);
        }
      }
      console.log('Formatted cart items:', cartItems);
      return cartItems;
    }
    

    async verifyProductQuantity(){
      const count = await this.productQuantity.count();
    for (let i = 0; i < count; i++) {
      await expect(this.productQuantity.nth(i)).toBeVisible();     
    }
    }

    async continueButtonVisible(){
      await expect(this.continueButton).toBeVisible();
    }

    async continueButtonClick(){
      await this.continueButton.click();
    }

    async removeBtn(removeButton: string){
      await this.page.locator(removeButton).click();
    }

    async checkoutButtonVisiBle(){
      await expect(this.checkoutButton).toBeVisible()
    }

    async checkoutButtonClick(){
      await this.checkoutButton.click()
    }




    


    

    
}