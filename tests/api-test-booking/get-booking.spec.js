const { test, expect } = require('@playwright/test');
const { createBooking } = require('./booking-helper');

const API_URL = 'https://restful-booker.herokuapp.com/booking';

test('Verify Get Booking endpoint', async ({request}) => {

    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid

    const getBooking = await request.get(`${API_URL}/${bookingId}`);
    expect(getBooking.status()).toBe(200);

    const bookingBody = await getBooking.json();
    expect(bookingBody.firstname).toBe(createdBooking.booking.firstname);
    expect(bookingBody.lastname).toBe(createdBooking.booking.lastname);
    expect(bookingBody.totalprice).toBe(createdBooking.booking.totalprice);
    expect(bookingBody.depositpaid).toBe(createdBooking.booking.depositpaid);
    expect(bookingBody.bookingdates.checkin).toBe(createdBooking.booking.bookingdates.checkin);
    expect(bookingBody.bookingdates.checkout).toBe(createdBooking.booking.bookingdates.checkout);
    expect(bookingBody.additionalneeds).toBe(createdBooking.booking.additionalneeds);

    expect(typeof bookingBody.firstname).toBe('string');
    expect(typeof bookingBody.lastname).toBe('string');
    expect(typeof bookingBody.totalprice).toBe('number');
    expect(typeof bookingBody.depositpaid).toBe('boolean');
    expect(typeof bookingBody.additionalneeds).toBe('string');    

});

test('Verify Get Booking endpoint - not existing booking id', async ({request}) => {

    const getBooking = await request.get(`${API_URL}/99999`);
    //page not found
    expect(getBooking.status()).toBe(404);

});