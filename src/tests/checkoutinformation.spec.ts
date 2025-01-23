import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { validUsers, invalidUsers } from '../test-data/user';
import { CheckOut1 } from '../pages/checkoutinformation.page';
import { updateStatus } from '../../updateSheet';
import { runTest, results } from '../utils/testHelper';
import { blankFristName,blanklastName,blankzip,successfully} from '../test-data/yourinformation';



test.describe('Checkout: Your Information',() => {
    let  checkoutInformation: CheckOut1;
    let browser: Browser;
    let context: BrowserContext;
    const sheetName = 'CheckoutInformation';

    const { username, password } = validUsers[0];

      test.beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
      });
    
      test.beforeEach(async () => {
        checkoutInformation = new CheckOut1(await context.newPage());
        await checkoutInformation.precondition(username, password);
      });
      
      // test('sdf', async () => {
      //   await checkoutInformation.precondition(username, password);
      // })
      test.describe('element test', () => {
        test('Verify Page', async () => {
          await checkoutInformation.verifyPage(checkoutInformation.URLs.checkout1, sheetName);
        });
        test('Header', async () => {
          await checkoutInformation.checkHeader(sheetName, 'Checkout: Your Information');
        });
        test('Hamburger menu', async () => {
          
          await checkoutInformation.hamburgerMenu(sheetName, username, password, checkoutInformation.precondition);
        });
        test('Cart Button', async () => {
          await checkoutInformation.cart(sheetName);
        });
      });

      test.describe('display', () => {
        test('Verify Lable Input Visible',async () => {
          await runTest('TC-CHP1-002',sheetName , async () => {
            await checkoutInformation.firstNameVisible()
          })
          await runTest('TC-CHP1-003',sheetName , async () => {
            await checkoutInformation.lastNameVisible()
          })
          await runTest('TC-CHP1-004',sheetName , async () => {
            await checkoutInformation.zipCodeVisible()
          })
        })
        
      })

      test.describe('functionality',() => {
        test('Verify Cancle button is working',async () => {
          await runTest('TC-CHF1-001',sheetName,async () => {
            await checkoutInformation.cancelBtnClick();
            
            expect(checkoutInformation.expectedURL(checkoutInformation.URLs.yourCart))
            
          })
          
        })

        test('Filled input fields',async () => {
          //continue with blank First Name
          await runTest('TC-CHF1-003',sheetName,async () => {
            console.log('Blank First Name')
            await checkoutInformation.caseFillInformation(blankFristName,'blankFristName')

          })
          // continue with blank Last Name 
          
          await runTest('TC-CHF1-004',sheetName,async () => {
            console.log('Blank Last Name')
            await checkoutInformation.caseFillInformation(blanklastName,'blanklastName')
            
          })
          
          // continue with blank Zip/Postal Code"
          await runTest('TC-CHF1-005',sheetName,async () => {
            console.log('user blank zip')
            await checkoutInformation.caseFillInformation(blankzip,'blankzip')
            
          })
          
          // successfully with valid feild
          await runTest('TC-CHF1-006',sheetName,async () => {
            console.log('user successfully')
            await checkoutInformation.caseFillInformation(successfully,'successfully')
            // expect(checkoutInformation.expectedURL(checkoutInformation.URLs.checkout2))
          })
        })

      })
      test('Verify Social Links in footer', async () => {
        await checkoutInformation.verifySocialLinks(sheetName);
      });
      test.afterAll(async () => {
          await browser.close();
          console.table(results);
          await updateStatus(results);
      });
})