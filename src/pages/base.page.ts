import { Page, Locator, expect,test } from '@playwright/test';
import { runTest, results } from '../utils/testHelper';

export class BasePage {
  readonly page: Page;
  readonly verifyURL: string;
  readonly headerContainer: Locator;
  readonly hamburgerButton: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;
  readonly menuContainer: Locator;
  readonly allItemsOption: Locator;
  readonly aboutOption: Locator;
  readonly logoutOption: Locator;
  readonly resetAppStateOption: Locator;
  readonly closeMenuButton: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly productDescription: Locator;
  readonly cardProduct : Locator;
  readonly productInfo : Locator;
  appLogo: Locator;

  readonly URLs = {
    loginPage: 'https://www.saucedemo.com/',
    productPage: 'https://www.saucedemo.com/inventory.html',
    yourCart: 'https://www.saucedemo.com/cart.html',
    checkout1: 'https://www.saucedemo.com/checkout-step-one.html',
    checkout2: 'https://www.saucedemo.com/checkout-step-two.html',
    checkout3: 'https://www.saucedemo.com/checkout-complete.html',
    about: 'https://saucelabs.com/',
    productInfo: 'https://www.saucedemo.com/inventory-item.html'
  };
  
  constructor(page: Page) {
    this.page = page;
    this.verifyURL = page.url();
    this.appLogo = page.locator('login_logo')
    this.headerContainer = page.locator('.header_secondary_container > .title')
    this.hamburgerButton = page.locator('#react-burger-menu-btn')
    this.cartButton = page.locator('#shopping_cart_container')
    this.cartBadge = page.locator('.shopping_cart_badge')
    this.menuContainer = page.locator('.bm-menu'); 
    this.allItemsOption = page.locator('#inventory_sidebar_link');
    this.aboutOption = page.locator('#about_sidebar_link');
    this.logoutOption = page.locator('#logout_sidebar_link');
    this.resetAppStateOption = page.locator('#reset_sidebar_link');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.productTitles = page.locator('.inventory_item_name');
    this.productDescription = page.locator('.inventory_item_desc');
    this.productPrices = page.locator('.inventory_item_price');
    this.cardProduct = page.locator('.inventory_item');
  }
  async navigateTo(url: string) {
    await this.page.goto(url);
  }
  
  
  async expectedURL(expectedUrl: string) {
    const currentUrl = this.page.url(); 
    expect(currentUrl).toBe(expectedUrl); 
  }
  
  async checkLogo(isLoginPage: boolean) {
    if(isLoginPage) {
      await expect(this.appLogo).toHaveText(/Swag Labs/); 
    }
    else {
      this.appLogo = this.page.locator('app_logo')
    }
    
  }
  
  async verifyPage(expectedUrl: string,sheetName: string) {
    await runTest('TC-VP-001',sheetName,async ()=> {
      await this.expectedURL(expectedUrl);
    })
    await runTest('TC-VP-002',sheetName,async ()=> {
      if(sheetName === 'Login Page'){
        await this.checkLogo(true);
      }else await this.checkLogo(false);
    })
  }
  
  async checkHeader(sheetName: string,titlePage: string){
    await runTest('TC-HD-001',sheetName,async ()=> {
      await expect(this.headerContainer).toHaveText(titlePage)
    })
    await runTest('TC-HD-002',sheetName,async ()=> {
      await expect(this.hamburgerButton).toBeVisible()
    })
    await runTest('TC-HD-003',sheetName,async ()=> {
      await expect(this.cartButton).toBeVisible()
    })
    
  }

  async resetState(){
    await this.hamburgerButton.click();
    await this.page.locator('#reset_sidebar_link').click();
    await this.page.reload();
    console.log('reset state')

  }
  
  async hamburgerMenu(sheetName: string, username: string, password: string, precondition: Function) {
    
    await runTest('TC-HM-001', sheetName, async () => {
      await this.hamburgerButton.click();
      await expect(this.menuContainer).toBeVisible();
    });
    
    await runTest('TC-HM-002', sheetName, async () => {
      await this.allItemsOption.click();
      await expect(this.page).toHaveURL(this.URLs.productPage);  
      await this.page.goBack();
      await this.page.reload();
    });
    
    await runTest('TC-HM-003', sheetName, async () => {
      const temp: string = this.page.url();
      await this.hamburgerButton.click();
      await this.aboutOption.click();
      await expect(this.page).toHaveURL(this.URLs.about)
      await this.page.goBack()
      await expect(this.page).toHaveURL(temp);
    });
    
    await runTest('TC-HM-004', sheetName, async () => {
      await this.hamburgerButton.click(); 
      await this.logoutOption.click();
      await expect(this.page).toHaveURL(this.URLs.loginPage);
    });
    
    await runTest('TC-HM-005', sheetName, async () => {
      await precondition.call(this, username, password); 
      await this.hamburgerButton.click();
      await this.closeMenuButton.click();
      await expect(this.menuContainer).not.toBeVisible();
      
    });
    
  }

  async addToCart(): Promise<void> {
    const transformedNames = await this.productsIDName();
    for(let i = 0; i < transformedNames.length; i++) {
      const addToCartButton = this.page.locator(`[name="add-to-cart-${transformedNames[i]}"]`);
      await addToCartButton.click();
    }
  }
  async removeToCart(): Promise<void> {
    const transformedNames = await this.productsIDName();
    for(let i = 0; i < transformedNames.length; i++) {
      const removeToCartButton = this.page.locator(`[name="remove-${transformedNames[i]}"]`);
      await removeToCartButton.click();
    }
  }

  async verifyCartBadge(expectedCount: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(expectedCount.toString());
  }
  
  async cart(sheetName: string){
    await runTest('TC-CIB-001', sheetName,async ()=>{
      await this.cartButton.click()
      await expect(this.page).toHaveURL(this.URLs.yourCart)
      await this.page.goBack()

      })

      // await runTest('TC-CIB-002', sheetName, async () => {
      //   const transformedNames = await this.productsIDName();

      //   for(let i = 0; i < transformedNames.length; i++) {
      //     const addToCartButton = this.page.locator(`[name="add-to-cart-${transformedNames[i]}"]`);
      //     await addToCartButton.click();
      //     await this.verifyCartBadge(i+1);
      //   }
      //   for(let i = 0; i < transformedNames.length; i++) {
      //     const addToCartButton = this.page.locator(`[name="remove-${transformedNames[i]}"]`);
      //     await addToCartButton.click();
      //     await this.verifyCartBadge(i+1);
      //   }
      // });
  }

  async  verifyCardProduct(){
    const count = await this.cardProduct.count();
    for (let i = 0; i < count; i++) {
      await expect(this.cardProduct.nth(i)).toBeVisible();     
    }
  }
  
  async verifyProductTitle(){
    const count = await this.productTitles.count();
    for (let i = 0; i < count; i++) {
      await expect(this.productTitles.nth(i)).toBeVisible();     
    }
  }

  async verifyProductDescription(){
    const count = await this.productDescription.count();
    for (let i = 0; i < count; i++) {
      await expect(this.productDescription.nth(i)).toBeVisible();     
    }
  }
  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.evaluateAll(
      (elements: HTMLElement[]) => elements.map(el => el.textContent || '')
    );
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }
  
  async verifyProductPrice(){
    const count = await this.productPrices.count();
    for (let i = 0; i < count; i++) {
      await expect(this.productPrices.nth(i)).toBeVisible();     
    }
  }
  
  async getProductNames(): Promise<string[]> {
    return await this.productTitles.evaluateAll(
      (elements: HTMLElement[]) => elements.map(el => el.textContent || '')
    );
  }
  
  async productsIDName(): Promise<string[]> {
    const names = await this.getProductNames();
    console.log("Original product names:", names);
    const transformedNames = names.map(name => 
      `${name.toLowerCase().replace(/\s+/g, '-')}`
    );
    console.log("Transformed product IDs:", transformedNames);
    
    return transformedNames;
  }

  async verifySocialLinks(sheetName: string): Promise<void> {

    await runTest('TC-FT-001', sheetName, async () => {
      const twitterLink = this.page.locator('a[data-test="social-twitter"]');
      const twitterHref = await twitterLink.getAttribute('href');
      expect(twitterHref).toBe('https://twitter.com/saucelabs');
    });

    await runTest('TC-FT-002', sheetName, async () => {
      const facebookLink = this.page.locator('a[data-test="social-facebook"]');
      const facebookHref = await facebookLink.getAttribute('href');
      expect(facebookHref).toBe('https://www.facebook.com/saucelabs');
    });

    await runTest('TC-FT-003', sheetName, async () => {
      const linkedInLink = this.page.locator('a[data-test="social-linkedin"]');
      const linkedInHref = await linkedInLink.getAttribute('href');
      expect(linkedInHref).toBe('https://www.linkedin.com/company/sauce-labs/');
    });

    await runTest('TC-FT-004', sheetName, async () => {
      const copyrightText = this.page.locator('.footer_copy');
      await expect(copyrightText).toHaveText('© 2025 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');
    });
}



  
}
