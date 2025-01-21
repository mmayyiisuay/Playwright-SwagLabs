import { Locator, Page, expect } from '@playwright/test';
import { YourCartPage } from '../pages/yourcart.page';
import { UserInformation } from '../test-data/yourinformation';


export class CheckOut1 extends YourCartPage {
    
    readonly firstNameField: Locator
    readonly lastNameField: Locator
    readonly zipField: Locator
    readonly cancelButton: Locator
    readonly continueButton: Locator
    
    
    constructor(page: Page){
        super(page);
        this.firstNameField = this.page.locator('#first-name')
        this.lastNameField = this.page.locator('#last-name')
        this.zipField = this.page.locator('#postal-code')
        this.cancelButton = this.page.locator('#cancel')
        this.continueButton = this.page.locator('#continue')

    }
    
    
    async precondition(username: string, password: string): Promise<void> {
        await super.precondition(username, password);
        await super.checkoutButtonClick()
    }
    
    async firstNameVisible(){
        await expect(this.firstNameField).toBeVisible()
    }
    
    async lastNameVisible(){
        await expect(this.lastNameField).toBeVisible()
    }
    
    async zipCodeVisible(){
        await expect(this.zipField).toBeVisible()
    }
    
    async fillFirstName(firstname: string){
        await this.firstNameField.fill(firstname);
    }
    
    async fillLastName(lastname: string){
        await this.lastNameField.fill(lastname);
        
    }
    async fillZip(zip: string){
        await this.zipField.fill(zip);
    }
    
    async cancelBtnClick(){
        await this.cancelButton.click();
    }
    
    async fillInformation(firstname:string, lastname:string, zip:string){
        await this.fillFirstName(firstname)
        await this.fillLastName(lastname)
        await this.fillZip(zip)
    }
    
    async caseFillInformation(userInformation: UserInformation[],type: string) {
        for (const user of userInformation) {
          const { firstName, lastName, zip } = user;
          console.log(firstName, lastName, zip);
          await this.fillInformation(firstName, lastName, zip) 
          await this.continueButton.click();
          await this.checkErrorMessage(type)
        }
      }

    async checkErrorMessage(errortype: string): Promise<void> {
    if (errortype === "blankFristName" ) {
        await expect(this.errorMessageContainer).toHaveText('Error: First Name is required');
    }
    else if (errortype === "blanklastName") {
        await expect(this.errorMessageContainer).toHaveText('Error: Last Name is required');
    }
    else if (errortype === "blankzip") {
        await expect(this.errorMessageContainer).toHaveText('Error: Postal Code is required');
    }
    else {}
    
    
    }
}