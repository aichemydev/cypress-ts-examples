Start by going to https://nocode.testgold.dev/login website. Create a login either using your github id or google or using your email and password.   

Login and go to https://nocode.testgold.dev/settings . ( Activation might take a few hours after login)   

The token visible in this page is referred to as the CYPRESS_TG_TOKEN .   

On your command line Run npm install -D to install Cypress  and the @aichemy/testgold-cypress-plugin package.   

See the `cypress.json` file for options to tweak for the Interceptor. Also,
   look at the `cypress/support/index.js` and `cypress/plugins/index.js` file to
   see how the Cypress plugin is activated.

Run the below commands to set the respective tokens to activate Test Gold.

    export CYPRESS_TG_ENABLED=true ( use SET CYPRESS_TG_ENABLED=true for windows)  
    export CYPRESS_TG_TOKEN=aiotoken-goes-here ( use SET CYPRESS_TG_TOKEN=aiotoken-goes-here for windows)  
    
Run

    "npm test" to start the Cypress runner.   
 
 This will open the Cypress UI and show all the tests available in the folder.  
 
Run the reactbank-old.spec.js first to train Test Gold and wait for it to complete.

Run the reactbank-new.spec.js in order to see the healing in action.   
Other tests are in: https://github.com/aichemydev/cypress-examples/cypress/integration

Note that the same test reactbank-new-spec.js will fail if CYPRESS_TG_ENABLED=false or a token variable is not specified.

```npm run testgold``` runs the interceptor with TestGold
