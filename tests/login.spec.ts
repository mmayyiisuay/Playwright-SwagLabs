import { test, expect } from '@playwright/test';
import { updateStatus } from '../updateSheet';

test.describe('Swag Labs Tests - Login Page', () => {
  const results: Array<{ id: string; status: string }> = []; // เก็บผลลัพธ์

  const logResult = (testName: string, condition: boolean) => {
    results.push({ id: testName, status: condition ? 'PASS' : 'FAIL' });
  };

  const runTest = async (testName: string, action: () => Promise<void>) => {
    try {
      await action();
      logResult(testName, true);
    } catch (error) {
      logResult(testName, false);
      throw error;
    }
  };

  test('TC-VP-001 - Verify URL', async ({ page }) => {
    await runTest('TC-VP-001', async () => {
      await page.goto('https://www.saucedemo.com/');
      expect(page.url()).toBe('https://www.saucedemo.com/');
    });
  });

  test.afterAll(async () => {
    await updateStatus(results);
  });
});
