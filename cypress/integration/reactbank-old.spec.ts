/* global cy, describe, it */

// this tests the ReactBank old and new scenarios
describe("React Bank test", function () {

  ////////////////////
  // test constants //
  ////////////////////

  const landingPageUrl = "https://demo1.testgold.dev";
  const loginEmailAddr = "email@example.com";
  const loginPassword = "admin123";

  const landingLoginButtonCss = "a.btn.btn-primary.btn-lg[href='/login']";
  const loginEmailCss = "input[name='email']";
  const loginPasswordCss = "input[name='password']";
  const loginSubmitCss = 'button.btn.btn-primary[type="submit"]';

  const logoutLinkCss = 'a[href="/logout"]';

  const balanceLinkCss = 'li > a[href="/panel/profile"] span';
  const balanceItemCss = "div.stats-balance";

  const helpLinkCss = 'li > a[href="/panel/help"] span';
  const helpNameCss = 'input[id="name"]';
  const helpEmailCss = 'input[id="email"]';

  const helpHomePhoneCss = '*[id="home_phone1234"]';
  const helpOfficePhoneCss = '*[id="office_phone1234"]';

  const helpMobilePhoneCss = '.mobilePhoneClass1234';
  const helpSubjectCss = 'select#subject';
  const helpMessageCss = 'textarea#message';
  const helpSendButtonCss = 'button[type="submit"]';

  const helpFormItems = {
    name: "Node User",
    email: "node@test.org",
    homePhone: "1-555-650-5555",
    officePhone: "1-555-440-5555",
    mobilePhone: "1-555-240-5555",
    message: "I'm a node user!"
  };

  it("logs in and runs the test steps", function () {

    // go the landing page
    cy.visit(landingPageUrl);

    // check we made it to the landing page
    cy.get('header.home-header').should('contain', 'Welcome to react-bank');

    // log in
    cy.get(landingLoginButtonCss).click();

    cy.get(loginEmailCss).type(loginEmailAddr);
    cy.get(loginPasswordCss).type(loginPassword);
    cy.get(loginSubmitCss).click();

    // on the user page, find the user's balance
    cy.get(balanceLinkCss).click();

    cy.get(balanceItemCss).should('contain', '11678');

    // on the help page, fill out the form and submit it
    cy.get(helpLinkCss).click();

    cy.get(helpNameCss).type(helpFormItems.name);
    cy.get(helpEmailCss).type(helpFormItems.email);
    cy.get(helpHomePhoneCss).type(helpFormItems.homePhone);
    cy.get(helpOfficePhoneCss).type(helpFormItems.officePhone);
    cy.get(helpMobilePhoneCss).type(helpFormItems.mobilePhone);
    cy.get(helpSubjectCss).type("Angry message");
    cy.get(helpMessageCss).type(helpFormItems.message);

    cy.get(helpSendButtonCss).should('exist').and('contain', 'Send message');
    cy.get(helpSendButtonCss).click();

    // log out
    cy.get(logoutLinkCss).click();

    // check we made it back to the landing page
    cy.get('header.home-header').should('contain', 'Welcome to react-bank');

  });

});
