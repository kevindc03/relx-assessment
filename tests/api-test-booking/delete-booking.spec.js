const { test, expect } = require('@playwright/test');
const { createToken, createBooking } = require('./booking-helper');

const API_URL = 'https://restful-booker.herokuapp.com/booking';

test('Verify Delete Booking endpoint', async ({request}) => {

    const token = await createToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid

    const deleteBooking = await request.delete(`${API_URL}/${bookingId}`,{
        headers: {
            'Content-Type': 'application/json',
            Cookie: `token=${token}`,
        }
    });

    expect(deleteBooking.status()).toBe(201);

    //confirm GetBooking if the deleted Booking ID was removed
    const getBooking = await request.get(`${API_URL}/${bookingId}`);
    //page not found
    expect(getBooking.status()).toBe(404);

});

test('Verify Delete Booking endpoint - invalid booking id', async ({request}) => {

    const token = await createToken(request);
    const deleteBooking = await request.delete(`${API_URL}/99999`,{
        headers: {
            'Content-Type': 'application/json',
            Cookie: `token=${token}`,
        }
    });

    //supposed to be 404 when trying to delete a non existing ID
    //actual scenario: requirement should be verified and create necessary defect for the API issue
    expect(deleteBooking.status()).toBe(405);

});