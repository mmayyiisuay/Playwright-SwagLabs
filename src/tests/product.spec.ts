import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { ProductPage } from '../pages/products.page';
import { validUsers, invalidUsers } from '../test-data/user';
import { updateStatus } from '../../updateSheet';
import { runTest, results } from '../utils/testHelper';

test.describe('Products Page', () => {
  let productPage: ProductPage;
  let browser: Browser;
  let context: BrowserContext;

  const sheetName = 'Product Page';
  const { username, password } = validUsers[0];

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    productPage = new ProductPage(await context.newPage());
    await productPage.precondition(username, password);
  });

  test.beforeEach(async () => {
    productPage = new ProductPage(await context.newPage());
    await productPage.precondition(username, password);
  });

  test.afterAll(async () => {
    await browser.close();
    console.table(results);
    await updateStatus(results);
  });

  test.describe('element test', () => {
    test('Verify Page', async () => {
      await productPage.verifyPage('https://www.saucedemo.com/inventory.html', sheetName);
    });
    test('Header', async () => {
      await productPage.checkHeader(sheetName, 'Products');
    });
    test('Hamburger menu', async () => {
      await productPage.hamburgerMenu(sheetName, username, password, productPage.precondition);
    });
    test('Cart Button', async () => {
      await productPage.cart(sheetName);
    });
  });

  test.describe('Sort Button', () => {
    test('visible sort button', async () => {
      await runTest('TC-PDP-001', sheetName, async () => {
        await productPage.visibleSortButton();
      });
    });

    test('check sort options', async () => {
      await runTest('TC-SB-001', sheetName, async () => {
        await productPage.checkSortButton();
      });
    });

    test('check sort a-z', async () => {
      await runTest('TC-SB-002', sheetName, async () => {
        await productPage.verifySorting('az');
      });
    });

    test('check sort z-a', async () => {
      await runTest('TC-SB-003', sheetName, async () => {
        await productPage.verifySorting('za');
      });
    });

    test('check sort lohi', async () => {
      await runTest('TC-SB-004', sheetName, async () => {
        await productPage.verifySorting('lohi');
      });
    });

    test('check sort hilo', async () => {
      await runTest('TC-SB-005', sheetName, async () => {
        await productPage.verifySorting('hilo');
      });
    });
  });

  test.describe('Card Products', () => {
    test('Display Inventory Items', async () => {
      await runTest('TC-CP-001', sheetName, async () => {
        await productPage.verifyCardProduct()
      });
    });
    test('Display Inventory Item Title', async () => {
      await runTest('TC-CP-002', sheetName, async () => {
        await productPage.verifyProductTitle()
      });
    });
    test('Display Inventory Item Description', async () => {
      await runTest('TC-CP-003', sheetName, async () => {
        await productPage.verifyProductDescription()
      });
    });

    test('Display Inventory Item Price', async () => {
      await runTest('TC-CP-004', sheetName, async () => {
        await productPage.verifyProductPrice()
      });
    });

    test('Display Add to Cart Button', async () => {
      await runTest('TC-CP-005', sheetName, async () => {
        await productPage.verifyAddToCartButton('add')
      });
    });

    test('Add Item to Cart', async () => {
      await runTest('TC-CP-006', sheetName, async () => {
        await productPage.addToCart();
      });
    });
    test('Remove Item from Cart', async () => {
      await runTest('TC-CP-007', sheetName, async () => {
        await productPage.verifyAddToCartButton('remove')
      });
    });

    test('Click on Inventory Item Image', async () => {
      await runTest('TC-CP-008', sheetName, async () => {
        await productPage.clickAndVerifyImages()
      });
    });

    test('Click on Inventory Item Title', async () => {
      await runTest('TC-CP-009', sheetName, async () => {
        await productPage.clickAndVerifyProductTitles()
      });
    });


  })

  test('Verify Social Links in footer', async () => {
    await productPage.verifySocialLinks(sheetName);
  });



});
