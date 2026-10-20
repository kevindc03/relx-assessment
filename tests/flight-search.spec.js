const { test, expect } = require('@playwright/test');
const { FlightSearchPage } = require('../pages/FlightSearchPage')


//a. Develop tests for validation the logo and login button is displayed
test('Verify logo and login button is displayed', async({page}) => {
    const flightSearchPage = new FlightSearchPage(page);

    await page.goto('');
    await flightSearchPage.verifyLogoIsVisible();
    await flightSearchPage.verifyLoginIsVisible();

});

//b. Develop tests for searching flights
test('Search for a Return Flight', async({page}) => {
    const flightSearchPage = new FlightSearchPage(page);

    await page.goto('');
    await flightSearchPage.searchFlight('return');
});

test('Search for a One Way Flight', async({page}) => {
    const flightSearchPage = new FlightSearchPage(page);

    await page.goto('');
    await flightSearchPage.searchFlight('oneway');
});

test('Search for a Multi City Flight', async({page}) => {
    const flightSearchPage = new FlightSearchPage(page);

    await page.goto('');
    await flightSearchPage.searchFlight('multicity');
});

test('Search Result has restricted Destination', async({page}) => {

    const flightSearchPage = new FlightSearchPage(page);

    await page.goto('');
    await flightSearchPage.searchRestrictedFlight('return');
});