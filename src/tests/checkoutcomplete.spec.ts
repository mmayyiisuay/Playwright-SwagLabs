import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { validUsers, invalidUsers } from '../test-data/user';
import { CheckOut3 } from '../pages/checkoutcomplete.page';
import { updateStatus } from '../../updateSheet';
import { runTest, results } from '../utils/testHelper';


test.describe('Checkout: Overview',() => {
    let  checkoutComplete: CheckOut3;
    let browser: Browser;
    let context: BrowserContext;
    const sheetName = 'Checkout: Complete';

    const { username, password } = validUsers[0];

      test.beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
      });
    
      test.beforeEach(async () => {
        checkoutComplete = new CheckOut3(await context.newPage());
        await checkoutComplete.precondition(username, password);
      });
      
      test.describe('element test', () => {
        test('Verify Page', async () => {
          await checkoutComplete.verifyPage(checkoutComplete.URLs.checkout3, sheetName);
        });
        test('Header', async () => {
          await checkoutComplete.checkHeader(sheetName, 'Checkout: Complete!');
        });
        test('Hamburger menu', async () => {
          
          await checkoutComplete.hamburgerMenu(sheetName, username, password, checkoutComplete.precondition);
        });
        test('Cart Button', async () => {
          await checkoutComplete.cart(sheetName);
        });
      });

      test.describe('display', () => {
        test('Checkmark Icon',async () => {
          await runTest('TC-CHPC-001',sheetName,async ()=>{
            await expect(checkoutComplete.completeIcon).toBeVisible();
          })
        })

        test('Complete Header',async () => {
          await runTest('TC-CHPC-002',sheetName,async ()=>{
            await expect(checkoutComplete.headerThanks).toBeVisible();
            const text = await checkoutComplete.getTextHeaderThanks()
            expect(text).toEqual('Thank you for your order!')
          })
        })

        test('Complete Text',async () => {
          await runTest('TC-CHPC-003',sheetName,async ()=>{
            await expect(checkoutComplete.headerThanks).toBeVisible();
            const text = await checkoutComplete.getContextThanks()
            expect(text).toEqual('Your order has been dispatched, and will arrive just as fast as the pony can get there!')
          })
        })
      })

      test.describe('functionality',() => {
        test('Back Home Button',async () => {
          await runTest('TC-CHFC-001',sheetName,async ()=>{
            await checkoutComplete.backtoproductButtonClick()
            expect(checkoutComplete.expectedURL(checkoutComplete.URLs.productPage))
          })
        })
      })

      
      test('Verify Social Links in footer', async () => {
        await checkoutComplete.verifySocialLinks(sheetName);
      });
      test.afterAll(async () => {
          await browser.close();
          console.table(results);
          await updateStatus(results);
      });
})