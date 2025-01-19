import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from './login.page';

export class ProductPage extends LoginPage {
  readonly sortButton: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.sortButton = page.locator('.product_sort_container');

  }

  async precondition(username: string, password: string) {
    await this.page.goto('https://www.saucedemo.com/');
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    console.log('login successfully');
  }

  async visibleSortButton() {
    await expect(this.sortButton).toBeVisible();
  }

  async getOptionValues() {
    const optionValues = await this.page.locator('select.product_sort_container option').evaluateAll((options: HTMLOptionElement[]) => {
      return options.map(option => option.value);
    });
    return optionValues;
  }

  async checkSortButton() {
    await this.sortButton.click();
    const optionValues = await this.getOptionValues();
    const expectedValues = ['az', 'za', 'lohi', 'hilo'];
    expect(optionValues).toEqual(expectedValues);
    this.page.close()
  }


  async verifyProductsAtoZ(): Promise<void> {
    
    const names = await this.getProductNames();
    const isSorted = names.slice(1).every((name, i) => {
      return names[i].localeCompare(name) <= 0;
    });
    expect(isSorted).toBe(true);
  }

  async verifyProductsZtoA(): Promise<void> {
    const names = await this.getProductNames();
    const isSorted = names.slice(1).every((name, i) => {
      return names[i].localeCompare(name) >= 0;
    });
    expect(isSorted).toBe(true);
  }

  async verifyPriceLowToHigh(): Promise<void> {
    const prices = await this.getProductPrices();
    const isSorted = prices.slice(1).every((price, i) => prices[i] <= price);
    expect(isSorted).toBe(true);
  }

  async verifyPriceHighToLow(): Promise<void> {
    const prices = await this.getProductPrices();
    const isSorted = prices.slice(1).every((price, i) => prices[i] >= price);
    expect(isSorted).toBe(true);
  }

  async verifySorting(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortButton.selectOption(sortOption)
    switch (sortOption) {
      case 'az':
        await this.verifyProductsAtoZ();
        break;
      case 'za':
        await this.verifyProductsZtoA();
        break;
      case 'lohi':
        await this.verifyPriceLowToHigh();
        break;
      case 'hilo':
        await this.verifyPriceHighToLow();
        break;
    }
  }
  
  async verifyAddToCartButton(type: 'add' | 'remove' ): Promise<void> {
    const transformedNames = await this.productsIDName();
    let typebutton : string
    if(type === 'add') {typebutton = 'add-to-cart-';} else typebutton = 'remove-';
    for(let i = 0; i < transformedNames.length; i++) {
      const addToCartButton = this.page.locator(`[name="${typebutton}${transformedNames[i]}"]`);
      console.log(`Checking visibility of: ${addToCartButton}`);
      await expect(addToCartButton).toBeVisible();
    }
    
  }

  async getProductIdsFromLinks(): Promise<string[]> {
    const linkElements = this.page.locator('.inventory_item_img a');
  
    const ids = await linkElements.evaluateAll((elements: HTMLElement[]) =>
      elements.map(el => el.getAttribute('id') || '')
    );
  
    const filteredIds = ids.filter(id => id !== '');
    console.log(`Extracted IDs: ${filteredIds}`);
  
    return filteredIds;
  }
  
  async clickAndVerifyImages(): Promise<void> {
    const productIds = await this.getProductIdsFromLinks();
    console.log(`Product IDs: ${productIds}`);
  
    const images = this.page.locator('.inventory_item_img img');
    const count = await images.count();
    console.log(`Number of images: ${count}`);
  
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const altText: string | null = await image.getAttribute('alt');
      
      if (altText !== null) {
        console.log(`Clicking on image with alt: ${altText}`);
        await image.click();
        await this.verifyProductId(productIds, i, altText);
      } else {
        console.error("Alt text is null");
      }
      
      await this.page.goBack();
    }
  }
  
  async clickAndVerifyProductTitles(): Promise<void> {
    const productIds = await this.getProductIdsFromLinks();
    console.log(`Product IDs: ${productIds}`);
  
    const productTitles = this.page.locator('.inventory_item_name');
    const count = await productTitles.count();
    console.log(`Number of product titles: ${count}`);
  
    for (let i = 0; i < count; i++) {
      const productTitle = productTitles.nth(i);
      const titleText: string | null = await productTitle.textContent();
  
      if (titleText !== null) {
        console.log(`Clicking on product title: ${titleText}`);
        await productTitle.click();
        await this.verifyProductId(productIds, i, titleText);
      } else {
        console.error("Title text is null");
      }
  
      await this.page.goBack();
    }
  }
  
  async verifyProductId(productIds: string[], index: number, identifier: string): Promise<void> {
    const currentUrl = this.page.url();
    const currentId = currentUrl.split('id=')[1];
    console.log(`Current URL ID: ${currentId}`);
  
    if (productIds[index].includes(currentId)) {
      console.log(`ID matched for product: ${identifier}`);
    } else {
      console.error(`ID mismatch for product: ${identifier}`);
    }
  }
  
}