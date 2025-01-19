export interface TestResult {
  id: string;
  status: string;
  error?: string;
  sheetName: string;
}

export const results: TestResult[] = [];

export const logResult = (testName: string, condition: boolean, sheetName: string, errorMessage = '') => {
  results.push({
    id: testName,
    status: condition ? 'PASS' : 'FAIL',
    error: condition ? undefined : errorMessage,
    sheetName: sheetName, 
  });
};

export const runTest = async (testName: string, sheetName: string, action: () => Promise<void>) => {
  try {
    await action();
    logResult(testName, true, sheetName);
  } catch (error) {
    logResult(testName, false, sheetName, (error as Error).message);
    console.error(`Test ${testName} failed:`, error);
  }
};
