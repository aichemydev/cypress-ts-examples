/* global cy, describe, it, Intl, expect */

// this tests the Real World App
describe("Real World app test", function () {

  // test constants
  const formatter = new Intl.NumberFormat(
    'en-US', { style: 'currency', currency: 'USD' }
  );
  const cleanStringRegex = /[|&;$%@"<>()+,]/g;

  const landingPageUrl = "https://demo5.testgold.dev";

  const userLoginDetails = {
    user1: {
      name: "ai_chemy",
      pass: "s3cret"
    },
    user2: {
      name: "aichemy_user",
      pass: "testgold123"
    }
  };

  const userBalance = {
    user1: {
      before: "",
      after: ""
    },
    user2: {
      before: "",
      after: ""
    }
  };

  const loginUserNameCss = "#username";
  const loginPasswordCss = "#password";
  const loginSubmitCss = "#signin-submit";

  const homeTab1Css = "[data-test='nav-public-tab'] > .MuiTab-wrapper";

  const logoutLinkCss = "div > [data-test='sidenav-signout']";

  const balanceTextCss = "#nav-header-balance[data-test='Account Balance']";
  const balanceItemCss = "h6[data-test='sidenav-user-balance']";

  const newTransactionLinkCss = "a[data-test='nav-top-new-transaction']";

  const searchBarCss = "#user-list-search-input";
  const searchedUserListItemCss = "li[data-test='user-list-item-0']";

  const amountFieldCss = "#amount";
  const addNoteFieldCss = "#transaction-create-description-input";

  const payButtonCss = "button[data-test='transaction-create-submit-payment']";

  const backButtonCss = "a[data-test='new-transaction-return-to-transactions']";

  const InputValues = {
    userNameToSearch: "ai_chemy",
    amountToSend: "10",
    noteForTransaction: "For family support",
  };

  //
  // run the test scenario
  //

  it("runs the test and sees if it succeeds", function () {

    // begin the test by visiting the webpage
    cy.visit(landingPageUrl);

    //
    // operate as user2 first and find our balance
    //

    // make sure we're on the landing page
    cy.get("h1.MuiTypography-root").should("exist").and("contain", "Sign in");

    // fill in the login form and submit it
    cy.get(loginUserNameCss).type(userLoginDetails["user2"]["name"]);
    cy.get(loginPasswordCss).type(userLoginDetails["user2"]["pass"]);
    cy.get(loginSubmitCss).click();

    // find this user's balance
    cy.get(balanceItemCss).invoke('text').then((balanceAmount) => {
      userBalance["user2"]["before"] = parseFloat(
        balanceAmount.replace(
          cleanStringRegex,
          ""
        )
      );

      cy.log("userBalance object is ", userBalance);

    });

    // log out as user2
    cy.get(logoutLinkCss).click();

    //
    // now, operate as user1
    //

    // make sure we're on the landing page
    cy.get("h1.MuiTypography-root").should("exist").and("contain", "Sign in");

    // fill in the login form and submit it
    cy.get(loginUserNameCss).type(userLoginDetails["user1"]["name"]);
    cy.get(loginPasswordCss).type(userLoginDetails["user1"]["pass"]);
    cy.get(loginSubmitCss).click();

    // find this user's balance
    cy.get(balanceItemCss).invoke('text').then((balanceAmount) => {
      userBalance["user1"]["before"] = parseFloat(
        balanceAmount.replace(
          cleanStringRegex,
          ""
        )
      );

      cy.log("userBalance object is ", userBalance);

    });

    //
    // send some money to user2 as user1
    //

    // click on the new transaction link
    cy.get(newTransactionLinkCss).click();

    // find the other user and click on them
    cy.get(searchBarCss).type(InputValues.userNameToSearch);
    cy.get(searchedUserListItemCss).click();

    // enter the amount of money to send and the reason
    cy.get(amountFieldCss).type(InputValues.amountToSend);
    cy.get(addNoteFieldCss).type(InputValues.noteForTransaction);

    // click on the pay button
    cy.get(payButtonCss).click();

    // wait for the payment to process
    cy.wait(2000);

    // check our account balance and make sure it's correct
    cy.get(balanceItemCss).invoke('text').then((balanceAmount) => {
      userBalance["user1"]["after"] = parseFloat(
        balanceAmount.replace(
          cleanStringRegex,
          ""
        )
      );

      cy.log("userBalance object is ", userBalance);

      // floating point approx-equal check
      expect(
        userBalance["user1"]["after"] + parseFloat(InputValues.amountToSend)
      ).to.be.closeTo(
        userBalance["user1"]["before"],
        0.1
      );

    });

    // return to the home page
    cy.get(backButtonCss).click();
    cy.get(homeTab1Css).should("have.text", "Everyone");

    // log out as user1
    cy.get(logoutLinkCss).click();

    // check we returned to the landing page
    cy.get("h1.MuiTypography-root").should("exist").and("contain", "Sign in");

    //
    // operate as user2 now and see if our balance increased as expected
    //

    // fill in the login form and submit it
    cy.get(loginUserNameCss).type(userLoginDetails["user2"]["name"]);
    cy.get(loginPasswordCss).type(userLoginDetails["user2"]["pass"]);
    cy.get(loginSubmitCss).click();

    // find this user's balance and make sure it increased
    cy.get(balanceItemCss).invoke('text').then((balanceAmount) => {
      userBalance["user2"]["after"] = parseFloat(
        balanceAmount.replace(
          cleanStringRegex,
          ""
        )
      );

      cy.log("userBalance object is ", userBalance);

      // floating point approx-equal check
      expect(
        userBalance["user2"]["before"] + parseFloat(InputValues.amountToSend)
      ).to.be.closeTo(
        userBalance["user2"]["after"],
        0.1
      );

    });

    // done with test, log out as user2
    cy.get(logoutLinkCss).click();

    // check we returned to the landing page
    cy.get("h1.MuiTypography-root").should("exist").and("contain", "Sign in");

  });

});
