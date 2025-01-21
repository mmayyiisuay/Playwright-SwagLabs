import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { YourCartPage } from '../pages/yourcart.page';
import { validUsers, invalidUsers } from '../test-data/user';
import { updateStatus } from '../../updateSheet';
import { runTest, results } from '../utils/testHelper';

test.describe('Products Page', () => {
  let yourcartpage: YourCartPage;
  let browser: Browser;
  let context: BrowserContext;

  const sheetName = 'Your Cart Page';
  const { username, password } = validUsers[0];

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
  });

  test.beforeEach(async () => {
    yourcartpage = new YourCartPage(await context.newPage());
    await yourcartpage.precondition(username, password);
  });

  
  test.describe('element test', () => {
    test('Verify Page', async () => {
      await yourcartpage.verifyPage('https://www.saucedemo.com/cart.html', sheetName);
    });
    test('Header', async () => {
      await yourcartpage.checkHeader(sheetName, 'Your Cart');
    });
    test('Hamburger menu', async () => {
      
      await yourcartpage.hamburgerMenu(sheetName, username, password, yourcartpage.precondition);
    });
    test('Cart Button', async () => {
      await yourcartpage.cart(sheetName);
    });
  });


  test.describe('display', () => {
    test('Inventory Item List Displayed', async () => {
      await runTest('TC-YCP-001', sheetName, async () => {
        const randomItems = yourcartpage.getSelectedItems();
        const cartItems = await yourcartpage.getItemTitle(); 
        expect(cartItems).toEqual(randomItems);
      });
    });
    test('Clicking on Item Title', async () => {
        await runTest('TC-YCP-002', sheetName, async () => {
            await yourcartpage.verifyProductTitle()
        });
    });
    test('Verify Item Quantity', async () => {
        await runTest('TC-YCP-003', sheetName, async () => {
            await yourcartpage.verifyProductQuantity()
        });
    });
    test('Verify Item Description', async () => {
        await runTest('TC-YCP-004', sheetName, async () => {
            await yourcartpage.verifyProductDescription()
        });
    });

    test('Verify Item Price', async () => {
        await runTest('TC-YCP-005', sheetName, async () => {
            await yourcartpage.verifyProductPrice()
        });
    });
  });
  
  test.describe('function',() => {
    test('Continue Shopping Button',async () => {
        await runTest('TC-YCF-001', sheetName, async () => {
            await yourcartpage.continueButtonVisible();
            await yourcartpage.continueButtonClick();
            expect(yourcartpage.expectedURL(yourcartpage.URLs.productPage))
        });
    })
    test('Remove Button Functionality',async () => {
        await runTest('TC-YCF-002', sheetName, async () => {
            const randomItems = Array.from(yourcartpage.getSelectedItems());
            console.log('randomItems', randomItems);
        
            for (let i = 0; i < randomItems.length; i++) {
                const itemToRemove = randomItems[i];
                const removeBtnSelector = `[name="remove-${itemToRemove}"]`; 
                await yourcartpage.removeBtn(removeBtnSelector);
                
                const cartItems = await yourcartpage.getItemTitle();  
                console.log(`Cart items after removing ${itemToRemove}:`, cartItems);
                
                expect(cartItems).not.toContain(itemToRemove);
                
                randomItems.splice(i, 1);  
                i--; 
            } 
        });
    })
    
    test('Checkout Button Functionality',async () => {
        await runTest('TC-YCF-003', sheetName, async () => {
            await yourcartpage.checkoutButtonVisiBle();
            await yourcartpage.checkoutButtonClick()
            expect(yourcartpage.expectedURL(yourcartpage.URLs.checkout1))
            
        });
  })
    
  test('Verify Social Links in footer', async () => {
    await yourcartpage.verifySocialLinks(sheetName);
});

  
  test.afterAll(async () => {
    await browser.close();
    console.table(results);
    await updateStatus(results);
  });
});

})