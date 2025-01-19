import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { validUsers, invalidUsers } from '../test-data/user';
import { updateStatus } from '../../updateSheet';
import { runTest, results } from '../utils/testHelper';



test.describe('Login Page Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let loginPage: LoginPage;

  const sheetName = 'Login Page';

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
  });

  test.beforeEach(async () => {
    loginPage = new LoginPage(await context.newPage());
    await loginPage.navigateTo();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.describe('Verify Page', () => {
    test('TC-VP-001 / TC-VP-002', async () => {
      await loginPage.verifyPage('https://www.saucedemo.com/',sheetName);
    });
  });

  test.describe('display', () => {
    test('TC-LNP-001 - Verify Placeholder Input Username Field', async () => {
      await runTest('TC-LNP-001',sheetName, async () => {
        await expect(loginPage.usernameField).toHaveAttribute('placeholder', 'Username');
      });
    });

    test('TC-LNP-002 - Verify Placeholder Input Password Field', async () => {
      await runTest('TC-LNP-002',sheetName, async () => {
        await expect(loginPage.passwordField).toHaveAttribute('placeholder', 'Password');
      });
    });
  });

  test.describe('functionality', () => {
    test('TC-LNF-001 - Invalid Password Login', async () => {
      await runTest('TC-LNF-001',sheetName, async () => {
        const { username, password } = validUsers[0];

        await loginPage.fillUsername(username);
        await loginPage.fillPassword(password);

        await loginPage.checkInputValue('#user-name', username); 
        await loginPage.checkInputValue('#password', password);
      });
    });

    test('TC-LNF-002 - Invalid Password Login', async () => {
      await runTest('TC-LNF-002',sheetName, async () => {
        const { username } = validUsers[0];
        await loginPage.fillUsername(username);
        await loginPage.fillPassword('p@ssw0rd');
        await loginPage.clickLogin();
        await loginPage.checkErrorMessage('Invalid password');
      });
    });

    test('TC-LNF-003 - Invalid Username Login', async () => {
      await runTest('TC-LNF-003',sheetName, async () => {
        const { password } = validUsers[0];
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword(password);
        await loginPage.clickLogin();
        await loginPage.checkErrorMessage('Invalid Username');
      });
    });

    test('TC-LNF-004 - Invalid Credentials Login', async () => {
      await runTest('TC-LNF-004',sheetName, async () => {
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword('p@ssw0rd');
        await loginPage.clickLogin();
        await loginPage.checkErrorMessage('Invalid Username and password');
      });
    });

    test('TC-LNF-005 - Blank Username', async () => {
      await runTest('TC-LNF-005',sheetName, async () => {
        const { password } = validUsers[0];
        await loginPage.fillPassword(password);
        await loginPage.clickLogin();
        await loginPage.checkErrorMessage('Blank Username');
      });
    });

    test('TC-LNF-006 - Blank Password', async () => {
      await runTest('TC-LNF-006',sheetName, async () => {
        const { username } = validUsers[0];
        await loginPage.fillUsername(username);
        await loginPage.clickLogin();
        await loginPage.checkErrorMessage('Blank Password');
      });
    });

    test('TC-LNF-007 - Blank User and Password', async () => {
      await runTest('TC-LNF-007',sheetName, async () => {
        await loginPage.clickLogin();
        await loginPage.checkErrorMessage('Blank Username and Password');
      });
    });

    test('TC-LNF-008 - Test multiple user credentials', async () => {
      let allPassed = true;

      await runTest('TC-LNF-008',sheetName, async () => {
        for (const user of validUsers) {
          const { username, password } = user;

          console.log(`Testing user: ${username}`);

          try {
            const page: Page = await context.newPage();
            await loginPage.navigateTo();
            await loginPage.fillUsername(username);
            await loginPage.fillPassword(password);
            await loginPage.clickLogin();

            const loggedIn = await loginPage.isLoggedIn();
            expect(loggedIn).toBe(true);

            console.log(`User ${username} logged in successfully.`);
            await page.close();
          } catch (error) {
            console.error(`Failed for user: ${username}`, error);
            allPassed = false;
          }
        }

        expect(allPassed).toBe(true);
      });
    });

    test('TC-LNF-009 - Test multiple user credentials', async () => {
      let allPassed = true;

      await runTest('TC-LNF-009',sheetName, async () => {
        for (const user of invalidUsers) {
          const { username, password } = user;

          console.log(`Testing user: ${username}`);

          try {
            const page: Page = await context.newPage();
            await loginPage.navigateTo();
            await loginPage.fillUsername(username);
            await loginPage.fillPassword(password);
            await loginPage.clickLogin();

            const loggedIn = await loginPage.isLoggedIn();
            expect(loggedIn).toBe(false);
            await loginPage.checkErrorMessage('Locked out')
            console.log(`User ${username} failed.`);

            await page.close();
          } catch (error) {
            console.error(`Failed for user: ${username}`, error);
            allPassed = false;
          }
        }

        expect(allPassed).toBe(true);
      });
    });
  });

  test.afterAll(async () => {
    console.table(results);
    await updateStatus(results);
  });
});
