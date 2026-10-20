const { test, expect } = require('@playwright/test');
const { createBooking } = require('./booking-helper');
const { createBookingBody } = require('../test-data/api-booking-data');

test('Verify Create Booking endpoint with all required fields', async ({request}) => {
    const createdBooking = await createBooking(request);

    //verify newly created booking generates an ID
    expect(createdBooking).toHaveProperty('bookingid');

    //verify response value if matches with the request
    expect(createdBooking.booking.firstname).toBe(createBookingBody.valid.firstname);
    expect(createdBooking.booking.lastname).toBe(createBookingBody.valid.lastname);
    expect(createdBooking.booking.totalprice).toBe(createBookingBody.valid.totalprice);
    expect(createdBooking.booking.depositpaid).toBe(createBookingBody.valid.depositpaid);
    expect(createdBooking.booking.bookingdates.checkin).toBe(createBookingBody.valid.bookingdates.checkin);
    expect(createdBooking.booking.bookingdates.checkout).toBe(createBookingBody.valid.bookingdates.checkout);
    expect(createdBooking.booking.additionalneeds).toBe(createBookingBody.valid.additionalneeds);

    //verify data type of each response field
    //did not include date since json has no date type
    expect(typeof createdBooking.bookingid).toBe('number');
    expect(typeof createdBooking.booking.firstname).toBe('string');
    expect(typeof createdBooking.booking.lastname).toBe('string');
    expect(typeof createdBooking.booking.totalprice).toBe('number');
    expect(typeof createdBooking.booking.depositpaid).toBe('boolean');
    expect(typeof createdBooking.booking.additionalneeds).toBe('string');     
        
});

test('Verify Create Booking endpoint with missing fields', async ({request}) => {
    const API_URL = 'https://restful-booker.herokuapp.com/booking';
    const createInvalidBooking = await request.post(`${API_URL}`,{
        data: createBookingBody.invalid,
    })

    //assuming error 500 is expected (based on postman)
    //in actual scenario, the requirement should be confirmed
    expect(createInvalidBooking.status()).toBe(500);
});
