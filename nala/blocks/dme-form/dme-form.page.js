export default class DmeFormPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('.dme-form #email');
    this.partnerNameField = page.locator('.dme-form #partnerName');
    this.customerVIPField = page.locator('.dme-form #customerVIP');
    this.customerCountryField = page.locator('.dme-form #customerCountry');
    this.customerRegionField = page.locator('.dme-form #customerRegion');
    this.adobeSalesOrderField = page.locator('.dme-form #adobeSalesOrder');
    this.orderAmountField = page.locator('.dme-form #orderAmount');
    this.durationField = page.locator('.dme-form #duration');
    this.formSubmitButton = page.locator('.form-submit-wrapper button');
    this.notFound404 = page.locator('#not-found');
  }
}
