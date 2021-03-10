describe("Bank Test Suite", () => {

  ////////////////////
  // test constants //
  ////////////////////

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const cleanStringRegex = /[|&;$%@"<>()+,]/g;

  const landingPageUrl = "https://demo4.testgold.dev";

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
  }

  const loginUserNameCss = "#username";
  const loginPasswordCss = "#password";
  const loginSubmitCss = "#signin-submit";

  const homeTab1Css = "[data-test='nav-public-tab'] > .MuiTab-wrapper";

  const logoutLinkCss = "div > [data-test='sidenav-signout']";

  const balanceTextCss = "#nav-header-balance[data-test='Account Balance']";
  const balanceItemCss = "h6[data-test='sidenav-user-balance']";

  const newTransactionLinkCss = "a[data-test='nav-top-new-transaction']";

  const searchBarCss = "#user-list-search-input";
  const seachedUserListItemCss = "li[data-test='user-list-item-0']";

  const amountFieldCss = "#amount";
  const addNoteFieldCss = "#transaction-create-description-input";

  const payButtonCss = "button[data-test='transaction-create-submit-payment']";

  const backButtonCss = "a[data-test='new-transaction-return-to-transactions']";

  const InputValues = {
    userNameToSearch: "ai_chemy",
    ammountToSend: "100",
    NoteForTransaction: "For family support",
  }


  ///////////////////////
  // utility functions //
  ///////////////////////

  async function runUser2Case(callEve) {
    //
    // login User2
    //
    loginToRealWorldBank("user2")
      .then(
        //
        // balance check User2
        //
        findBalanceOnUserPage("user2", callEve)
          .then(
            //
            // logout User2
            //
            logoutFromRealWorldBank("user2")
          )
      );
  }

  ////////////////////
  // test functions //
  ////////////////////

  // tries to login into provided user
  async function loginToRealWorldBank(user) {

    console.log(`[RUNNER] doing login for ${user}`);

    const userName = userLoginDetails[user].name;
    const password = userLoginDetails[user].pass;

    console.log("[TEST] finding login username box and filling it in");
    cy.get(loginUserNameCss).type(userName);
    console.log("[TEST] finding login password box and filling it in");

    cy.get(loginPasswordCss).type(password);

    console.log("[TEST] finding login submit button");
    console.log("[TEST] clicking login submit button");
    cy.get(loginSubmitCss).click();

    console.log(`[RUNNER] ${user} logout done`);
    return;

  }

  // this logs out from the ReactBank website
  async function logoutFromRealWorldBank(user) {

    console.log(`[RUNNER] doing logout for ${user}`);

    console.log("[TEST] finding logout link");
    console.log("[TEST] clicking logout link");
    cy.get(logoutLinkCss).click();

    console.log(`[RUNNER] ${user} logout done`);
    return;
  }

  // tries to find and click on the balance item on the user page and get the
  // text of the balance item
  async function findBalanceOnUserPage(user, callEve) {

    console.log(`[RUNNER] doing balance check for ${user}`);

    console.log("[TEST] finding Balance item");
    cy.get(balanceTextCss).invoke('text').then((balanceText) => {
      cy.get(balanceItemCss).invoke('text').then((balanceAmount) => {
        userBalance[user][callEve] = balanceAmount;
        console.log(`[TEST] ${user}'s ${balanceText} is: ${userBalance[user][callEve]}`);
      });
    });

    console.log(`[RUNNER] ${user} balance check done`);
    return;

  }

  // tries to make a transaction and move back to home page
  async function makeTransaction() {

    console.log("[TEST] finding New Transaction link");
    console.log("[TEST] clicking New Transaction link");
    cy.get(newTransactionLinkCss).click();

    // search user to send amount
    console.log("[TEST] Step 1 start");

    console.log("[TEST] finding User");
    cy.get(searchBarCss).type(InputValues.userNameToSearch);
    console.log("[TEST] User found");

    console.log("[TEST] click on User");
    cy.get(seachedUserListItemCss).click();
    console.log(`[TEST] Step 1 complete`);

    console.log(`[TEST] Step 2 start`);

    console.log("[TEST] enter Amount to send");
    cy.get(amountFieldCss).type(InputValues.ammountToSend);

    console.log("[TEST] add Note");
    cy.get(addNoteFieldCss).type(InputValues.NoteForTransaction);

    console.log("[TEST] click on Pay button");
    cy.get(payButtonCss).click();
    cy.wait(2000);
    //
    // balance check User1 again
    //
    findBalanceOnUserPage("user1", "after")
    console.log(`[TEST] Step 2 complete`);

    console.log(`[TEST] Step 3 start`);

    console.log("[TEST] click on Return to home button");
    cy.get(backButtonCss).click();
    console.log(`[TEST] Step 3 complete`);

    return;
  }

  // tries to check if successfully return to home page
  async function checkIfReturnToHome() {

    console.log("[TEST] finding Nav bar");
    cy.get(homeTab1Css).should("have.text", "Everyone");

    return;
  }

  // tries to check if balance for both users changed or not
  async function verifyBalanceChange(user) {

    // get title just to make it promise otherwise function was calling earlier than transaction
    cy.title().then(() => {
      const beforeUpdateBalance = `${userBalance[user].before.replace(cleanStringRegex, "")}`;
      let originallyUpdateBalance = `${userBalance[user].after.replace(cleanStringRegex, "")}`;
      let updatedBalanceToCheckEquality = originallyUpdateBalance;

      if (user === "user2") {
        updatedBalanceToCheckEquality = `${parseFloat(parseFloat(updatedBalanceToCheckEquality) - parseFloat(InputValues.ammountToSend)).toFixed(2)}`;
      } else {
        updatedBalanceToCheckEquality = `${Number(updatedBalanceToCheckEquality) + Number(InputValues.ammountToSend)}`;
      }

      console.log(`[TEST] Start process to verify ${user} balance update`);
      expect(beforeUpdateBalance).to.equal(updatedBalanceToCheckEquality);
      console.log(`[TEST] Balance ${user} before transaction: ${formatter.format(beforeUpdateBalance)}`);
      console.log("[TEST] Balance successfully updated.");
      console.log(`[TEST] Balance ${user} after transaction: ${formatter.format(originallyUpdateBalance)}`);
      console.log(`[TEST] End process to verify ${user} balance update`);
    });
    return;
  }

  const runMain = () => {
    //
    // User2 login -> balance check -> logout
    //
    runUser2Case("before")
      .then(
        //
        // login User1
        //
        loginToRealWorldBank("user1")
          .then(
            //
            // balance check User1
            //
            findBalanceOnUserPage("user1", "before")
              .then(
                //
                // Making Transaction
                //
                makeTransaction()
                  .then(
                    //
                    // Check if return to home page
                    //
                    checkIfReturnToHome()
                      .then(
                        //
                        // logout User1
                        //
                        logoutFromRealWorldBank("user1")
                          .then(
                            //
                            // User2 login -> balance check -> logout
                            //
                            runUser2Case("after")
                          )
                          .then(
                            //
                            // Check is balance changed for user1 & user2
                            //
                            verifyBalanceChange("user2")
                              .then(
                                verifyBalanceChange("user1")
                              )
                          )
                      )
                  )
              )
          )
      );
  }

  it("2 User Balance check", () => {
    cy.visit(landingPageUrl);
    runMain();
  })
})
