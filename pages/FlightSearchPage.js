const { expect } = require('@playwright/test');
const flightSearchData = require('../tests/test-data/flight-search-data');

class FlightSearchPage {
    constructor(page){
        this.page = page;
        this.logo = page.locator(".gPDR-logo-image");
        this.login = page.getByRole("button",{name: "Sign in"});

        //search flight
        this.searchButton = page.getByRole("button",{ name: "Search", exact: true });
        this.removeOrigin = page.getByRole("button", { name: "Remove value", exact: true });
        this.origin = page.getByRole("combobox", { name: "Origin location", exact: true });
        this.destination = page.getByRole("combobox", { name: "Destination location", exact: true });
        this.locationOption = page.getByRole("option");
        this.departure = page.getByLabel("Departure");
        this.departureMonth = this.getNextMonth();
        this.cabinClass = page.locator(".Uqct-title").last();
        this.month = this.departureMonth.slice(0,3);
    }

    //function to use for locating departure date
    getNextMonth() {
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const strNextMonthDate = nextMonthDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
        }).replace(' ', ', ');

        return strNextMonthDate;
    }

    async verifyLogoIsVisible() {
        await expect(this.logo).toBeVisible();
    }

    async verifyLoginIsVisible() {
        await expect(this.login).toBeVisible();
    }

    async searchRestrictedFlight(tripType)
    {
        await expect(this.page.locator(".Uqct-title").first()).toBeVisible();
        await this.selectTripType(tripType);
        await this.removeOrigin.click();
        await expect(this.page.getByPlaceholder("From?")).toBeVisible();
        await this.origin.fill(flightSearchData.restricted.origin);
        await this.locationOption.first().click();
        await expect(this.page.getByPlaceholder("From?")).not.toBeVisible();
        await this.destination.fill(flightSearchData.restricted.destination);
        await this.locationOption.first().click();
        await this.departure.first().click();
        const departureDate = this.page.getByRole('button', { name: `${flightSearchData.restricted.departureDay} ${this.departureMonth}` }).first();
        await departureDate.click();
        const returnDate = this.page.getByRole('button', { name: `${flightSearchData.return.returnDay} ${this.departureMonth}` }).first();
        await returnDate.click();
        await this.cabinClass.click();  
        await this.page.getByText(flightSearchData.restricted.cabinClass).click();    

        await this.searchButton.click();
        //await expect(this.page.getByText("Restricted destination")).toBeVisible();

        this.page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Restricted destination');
        await dialog.accept(); 
        });
    }

    async searchFlight(tripType)
    {
        //select Trip Type
        const tripTypeName = await this.selectTripType(tripType);
        
        //Search Flight for each trip type
        if(tripType === 'return')
        {
            await this.removeOrigin.click();
            await expect(this.page.getByPlaceholder("From?")).toBeVisible();
            await this.searchFlightReturn();
        }
        else if(tripType === 'oneway')
        {
            await this.removeOrigin.click();
            await expect(this.page.getByPlaceholder("From?")).toBeVisible();
            await this.searchFlightOneWay();
        }
        else if(tripType === 'multicity')
        {
            await this.searchFlightMultiCity();
        }

        await this.searchButton.click();
        await expect(this.page).toHaveURL(/flight-search/);
        await expect(this.page.locator(".lfBz")).toBeVisible();
        await expect(this.page.locator(".ev1_-list-view")).toBeVisible();
        await expect(this.page.getByText("No flights found")).not.toBeVisible();

        //Verify search result for each trip type
        if(tripType === 'return')
        {
            await expect(this.page.getByRole("button",{name:tripTypeName})).toBeVisible();
            await expect(this.page.getByRole("option",{name:flightSearchData.return.origin})).toBeVisible();
            await expect(this.page.getByRole("option",{name:flightSearchData.return.destination})).toBeVisible();
            await expect(this.page.getByRole("button",{name:flightSearchData.return.cabinClass})).toBeVisible();
        }
        else if(tripType === 'oneway')
        {
            await expect(this.page.getByRole("button",{name:tripTypeName})).toBeVisible();
            await expect(this.page.getByRole("option",{name:flightSearchData.oneWay.origin})).toBeVisible();
            await expect(this.page.getByRole("option",{name:flightSearchData.oneWay.destination})).toBeVisible();
            await expect(this.page.getByRole("button",{name:flightSearchData.oneWay.cabinClass})).toBeVisible();
        }
        else if(tripType === 'multicity')
        {
            await expect(this.page.getByRole("button",{name:tripTypeName})).toBeVisible();
            await expect(this.page.getByRole("button",{name:`${flightSearchData.multiCity.departureDay[0]} ${this.month}, ${flightSearchData.multiCity.departureDay[1]} ${this.month}`})).toBeVisible();
            await expect(this.page.getByRole("button",{name:"Multiple"})).toBeVisible();
        }
    }

    async searchFlightReturn() {
        await this.origin.fill(flightSearchData.return.origin);
        await this.locationOption.first().click();
        await this.destination.fill(flightSearchData.return.destination);
        await this.locationOption.first().click();
        await this.departure.first().click();
        const departureDate = this.page.getByRole('button', { name: `${flightSearchData.return.departureDay} ${this.departureMonth}` }).first();
        await departureDate.click();
        const returnDate = this.page.getByRole('button', { name: `${flightSearchData.return.returnDay} ${this.departureMonth}` }).first();
        await returnDate.click();
        await this.cabinClass.click();
        await this.page.getByRole('radio', { name: flightSearchData.return.cabinClass, exact: true }).first().click();   
    
    }

    async searchFlightOneWay() {
        await this.origin.fill(flightSearchData.oneWay.origin);
        await this.locationOption.first().click();
        await this.destination.fill(flightSearchData.oneWay.destination);
        await this.locationOption.first().click();
        await this.departure.first().click();
        const departureDate = this.page.getByRole('button', { name: `${flightSearchData.oneWay.departureDay} ${this.departureMonth}` }).first();
        await departureDate.click();
        await this.cabinClass.click();
        await this.page.getByRole('radio', { name: flightSearchData.oneWay.cabinClass, exact: true }).first().click();   
    }

    async searchFlightMultiCity() {
        //clear all fields and row
        await this.page.getByText("Clear all").click();
        const row = await this.page.locator(".f-iD");
        const rowCount = await row.count();
        for(let i = rowCount; i > 1; i--)
        {
            await this.page.getByRole("button", {name:"Remove leg number"}).nth(i-1).click();
        }
        await this.page.getByText("Add another flight").click();
        await expect(this.page.locator(".f-iD").nth(1)).toBeVisible();
        await this.page.getByRole("combobox",{name:"Origin location"}).first().fill(flightSearchData.multiCity.origin);
        await this.locationOption.first().click();
        const updatedRow = await this.page.locator(".f-iD");
        const updatedRowCount = await updatedRow.count();
        for(let i = 0; i < updatedRowCount; i++)
        {
            await this.page.getByRole("combobox",{name:"Destination location"}).nth(i).fill(flightSearchData.multiCity.destination[i]);
            await this.locationOption.first().click();
            await this.page.getByRole("button",{name:"Departure date"}).nth(i).click();
            const departureDate = this.page.getByRole('button', { name: `${flightSearchData.multiCity.departureDay[i]} ${this.departureMonth}` }).first();
            await departureDate.click();
            await this.page.locator(".f-iD .Uqct-title").nth(i).click();
            await this.page.getByRole('option', { name: flightSearchData.multiCity.cabinClass[i], exact: true }).first().click();
        }
   
    };

    async selectTripType(tripType) {
        const options = {
            return: "Return",
            oneway: "One-way",
            multicity: "Multi-city",
        };

        const tripTypeName = options[tripType];
        if (!tripTypeName) {
            throw new Error(`Invalid Trip Type: ${tripType}`);
        }

        const tripTypeCombobox = this.page.getByRole("combobox").first();
        await tripTypeCombobox.click();

        const option = this.page.getByRole("option", { name: tripTypeName, exact: true });
        await expect(option).toBeVisible();
        await option.click();

        return tripTypeName;
    };
}

module.exports = {FlightSearchPage};

