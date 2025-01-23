import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { validUsers, invalidUsers } from '../test-data/user';
import { CheckOut2 } from '../pages/checkoutoverview.page';
import { updateStatus } from '../../updateSheet';
import { runTest, results } from '../utils/testHelper';
import { blankFristName,blanklastName,blankzip,successfully} from '../test-data/yourinformation';



test.describe('Checkout: Overview',() => {
    let  checkoutOverview: CheckOut2;
    let browser: Browser;
    let context: BrowserContext;
    const sheetName = 'Checkout: Overview';

    const { username, password } = validUsers[0];

      test.beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
      });
    
      test.beforeEach(async () => {
        checkoutOverview = new CheckOut2(await context.newPage());
        await checkoutOverview.precondition(username, password);
      });
      
      test.describe('element test', () => {
        test('Verify Page', async () => {
          await checkoutOverview.verifyPage(checkoutOverview.URLs.checkout2, sheetName);
        });
        test('Header', async () => {
          await checkoutOverview.checkHeader(sheetName, 'Checkout: Overview');
        });
        test('Hamburger menu', async () => {
          
          await checkoutOverview.hamburgerMenu(sheetName, username, password, checkoutOverview.precondition);
        });
        test('Cart Button', async () => {
          await checkoutOverview.cart(sheetName);
        });
      });

      test.describe('display', () => {
        test('Inventory Item List Displayed', async () => {
          await runTest('TC-YCP-001', sheetName, async () => {
            const randomItems = checkoutOverview.getSelectedItems();
            const cartItems = await checkoutOverview.getItemTitle(); 
            expect(cartItems).toEqual(randomItems);
          });
        });
        test('Clicking on Item Title', async () => {
            await runTest('TC-YCP-002', sheetName, async () => {
                await checkoutOverview.verifyProductTitle()
            });
        });
        test('Verify Item Quantity', async () => {
            await runTest('TC-YCP-003', sheetName, async () => {
                await checkoutOverview.verifyProductQuantity()
            });
        });
        test('Verify Item Description', async () => {
            await runTest('TC-YCP-004', sheetName, async () => {
                await checkoutOverview.verifyProductDescription()
            });
        });
    
        test('Verify Item Price', async () => {
            await runTest('TC-YCP-005', sheetName, async () => {
                await checkoutOverview.verifyProductPrice()
            });
        });
      });

      test.describe('functionality', () => {
        test('Verify Payment Info', async () => {
          await runTest('TC-CHF2-001', sheetName, async () => {
            const paymentInfo = await checkoutOverview.getPaymentInfo();
            expect(paymentInfo).toBe('SauceCard #31337');
          });
        });
      
        test('Verify Shipping Information', async () => {
          await runTest('TC-CHF2-002', sheetName, async () => {
            const shippingInfo = await checkoutOverview.getShippingInfo();
            expect(shippingInfo).toBe('Free Pony Express Delivery!');
          });
        });
      
        test('Verify Item Price Calculation', async () => {
          await runTest('TC-CHF2-003', sheetName, async () => {
            const itemTotal = await checkoutOverview.getItemTotal();
            // console.log(itemTotal)
            const pricesItems = await checkoutOverview.calculatePrices()
            // console.log(pricesItems)
            expect(itemTotal).toEqual(pricesItems)
          });
        });
      
        test('Verify Tax Calculation', async () => {
            await runTest('TC-CHF2-004', sheetName, async () => {
            const tax = await checkoutOverview.getTax();
            expect(tax).toEqual(await checkoutOverview.calculateTax()); 
            });
          });
          
      
        test('Verify Total Price Calculation', async () => {
          await runTest('TC-CHF2-005', sheetName, async () => {
            const total = await checkoutOverview.getTotal();
            const pricesItems = await checkoutOverview.calculatePrices()
            const tax = await checkoutOverview.calculateTax()
            expect(total).toEqual(pricesItems+tax);
          });
        });

        test('Verify Cancel button is working', async () => {
            await runTest('TC-CHF2-006', sheetName, async () => {
            await checkoutOverview.cancelBtnClick();
            await expect(checkoutOverview.page).toHaveURL(checkoutOverview.URLs.productPage);
            });
        });
        
        test('Verify Finish button is working', async () => {
        await runTest('TC-CHF2-007', sheetName, async () => {
            await checkoutOverview.finishButtonClick();
            await expect(checkoutOverview.page).toHaveURL(checkoutOverview.URLs.checkout3); 
            });
        });
      
      });
      
      

      test.describe('display', () => {
        test('Verify Lable Input Visible',async () => {
          await runTest('TC-CHP1-002',sheetName , async () => {
            
          })
        })
        
      })

      
      test('Verify Social Links in footer', async () => {
        await checkoutOverview.verifySocialLinks(sheetName);
      });
      test.afterAll(async () => {
          await browser.close();
          console.table(results);
          await updateStatus(results);
      });
})