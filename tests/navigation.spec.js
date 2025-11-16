import { test, expect } from '@playwright/test';

class BasePage {
  constructor(page) {
    this.page = page;
    this.header = this.page.locator('h1');
    this.links = {
      home: this.page.locator('a[href="index.html"]'),
      about: this.page.locator('a[href="about.html"]'),
      contact: this.page.locator('a[href="contact.html"]'),
    };
  }

  async goToHome() {
    await this.links.home.click();
  }

  async goToAbout() {
    await this.links.about.click();
  }

  async goToContact() {
    await this.links.contact.click();
  }

  async validateSingleH1() {
    const headings = await this.page.$$('h1');
    expect(headings.length).toEqual(1);
  }
}

class AboutPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async checkIfLoaded() {
    await expect(this.header).toHaveText('About');
  }
}

class ContactPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async checkIfLoaded() {
    await expect(this.header).toHaveText('Contact');
  }
}

class IndexPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async visit() {
    await this.page.goto('/');
  }

  async checkIfLoaded() {
    await expect(this.header).toHaveText('Home');
  }
}

test.describe('Site Navigation Tests', () => {
  let page;
  let homePage, aboutPage, contactPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    homePage = new IndexPage(page);
    aboutPage = new AboutPage(page);
    contactPage = new ContactPage(page);
  });

  test('Open Home Page', async () => {
    await homePage.visit();
    await homePage.checkIfLoaded();
    await homePage.validateSingleH1();
  });

  test('Navigate from Home to About and Validate h1 and URL', async () => {
    await homePage.visit();
    await homePage.checkIfLoaded();

    await homePage.goToAbout();
    await expect(page).toHaveURL(/about\.html$/);
    await aboutPage.checkIfLoaded();
  });

  test('Navigate from Home to Contact and Validate h1 and URL', async () => {
    await homePage.visit();
    await homePage.checkIfLoaded();

    await homePage.goToContact();
    await expect(page).toHaveURL(/contact\.html$/);
    await contactPage.checkIfLoaded();
  });

  test('Navigate from About to Home and Validate h1 and URL', async () => {
    await page.goto('/about.html');
    await aboutPage.checkIfLoaded();

    await aboutPage.goToHome();
    await expect(page).toHaveURL(/index\.html$/);
    await homePage.checkIfLoaded();
  });
});
