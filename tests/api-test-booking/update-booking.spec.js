const { test, expect } = require('@playwright/test');
const { createToken, createBooking } = require('./booking-helper');
const { updateBookingBody } = require('../test-data/api-booking-data');

const API_URL = 'https://restful-booker.herokuapp.com/booking';

test('Verify Update Booking - all fields are updated', async ({request}) => {

    const token = await createToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid

    const updateBooking = await request.put(`${API_URL}/${bookingId}`,{
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: `token=${token}`,
        },
        data: updateBookingBody.allFields,
    });

    expect(updateBooking.status()).toBe(200);

    //confirm response values if matches with the request
    const updatedBooking = await updateBooking.json();
    expect(updatedBooking.firstname).toBe(updateBookingBody.allFields.firstname);
    expect(updatedBooking.lastname).toBe(updateBookingBody.allFields.lastname);
    expect(updatedBooking.totalprice).toBe(updateBookingBody.allFields.totalprice);
    expect(updatedBooking.depositpaid).toBe(updateBookingBody.allFields.depositpaid);
    expect(updatedBooking.bookingdates.checkin).toBe(updateBookingBody.allFields.bookingdates.checkin);
    expect(updatedBooking.bookingdates.checkout).toBe(updateBookingBody.allFields.bookingdates.checkout);
    expect(updatedBooking.additionalneeds).toBe(updateBookingBody.allFields.additionalneeds);    

    expect(typeof updatedBooking.firstname).toBe('string');
    expect(typeof updatedBooking.lastname).toBe('string');
    expect(typeof updatedBooking.totalprice).toBe('number');
    expect(typeof updatedBooking.depositpaid).toBe('boolean');
    expect(typeof updatedBooking.additionalneeds).toBe('string');    

    //confirm GetBooking if the updated value is returned
    const getBooking = await request.get(`${API_URL}/${bookingId}`);
    const getBookingResponse = await getBooking.json();

    expect(getBookingResponse.firstname).toBe(updatedBooking.firstname);
    expect(getBookingResponse.lastname).toBe(updatedBooking.lastname);
    expect(getBookingResponse.totalprice).toBe(updatedBooking.totalprice);
    expect(getBookingResponse.depositpaid).toBe(updatedBooking.depositpaid);
    expect(getBookingResponse.bookingdates.checkin).toBe(updatedBooking.bookingdates.checkin);
    expect(getBookingResponse.bookingdates.checkout).toBe(updatedBooking.bookingdates.checkout);
    expect(getBookingResponse.additionalneeds).toBe(updatedBooking.additionalneeds);

});

test('Verify Update Booking - has missing fields', async ({request}) => {

    const token = await createToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid

    const updateBooking = await request.put(`${API_URL}/${bookingId}`,{
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: `token=${token}`,
        },
        data: updateBookingBody.hasMissingFields,
    });

    //invalid request
    expect(updateBooking.status()).toBe(400);

});