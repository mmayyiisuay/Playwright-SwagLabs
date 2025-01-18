import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly appLogo: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.locator('.login_logo');
    this.usernameField = page.locator('#user-name');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageContainer = page.locator('.error-message-container');
  }

  async navigateTo() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.url() === 'https://www.saucedemo.com/inventory.html';
  }

  async fillUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async checkInputValue(selector: string, expectedValue: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }

  async checkErrorMessage(errortype: string): Promise<void> {
    if (errortype === "Invalid Password" || errortype === "Invalid Username" || errortype === "Invalid Username and Password") {
        await expect(this.errorMessageContainer).toHaveText('Epic sadface: Username and password do not match any user in this service');
    }
    else if (errortype === "Blank Username" || errortype === "Blank Username and Password") {
        await expect(this.errorMessageContainer).toHaveText('Epic sadface: Username is required');
    }
    else if (errortype === "Blank Password") {
        await expect(this.errorMessageContainer).toHaveText('Epic sadface: Password is required');
    }
    else if (errortype === "Locked out"){
        await expect(this.errorMessageContainer).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    }
}

}
