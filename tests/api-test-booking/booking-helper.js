const { expect } = require('@playwright/test');
const { createBookingBody } = require('../test-data/api-booking-data');

const API_URL = 'https://restful-booker.herokuapp.com/booking';
const AUTH_URL = 'https://restful-booker.herokuapp.com/auth';


async function createToken(request){
    const authResponse = await request.post(`${AUTH_URL}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username : "admin",
            password : "password123"
        }
    });

    expect(authResponse.ok()).toBeTruthy();
    const { token } = await authResponse.json();

    return token;
};

async function createBooking(request) {

    const createBooking = await request.post(`${API_URL}`,{
        data: createBookingBody.valid,
    })

    expect(createBooking.status()).toBe(200);

    const responseBody = await createBooking.json();
  
    return responseBody;
};

module.exports = {
  createBooking,
  createToken,
};