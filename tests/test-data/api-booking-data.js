const createBookingBody = {
    valid: {
        firstname : "Kevin",
        lastname : "Dela Cruz",
        totalprice : 345,
        depositpaid : true,
        bookingdates : {
            checkin : "2026-11-11",
            checkout : "2026-12-25"
        },
        additionalneeds : "WiFi Connection"
    },
    invalid: {
        firstname : "Kevin",
        lastname : "Dela Cruz",
        totalprice : 345,
        depositpaid : true,
        additionalneeds : "WiFi Connection"
    }
}

const updateBookingBody = {
    //update all fields
    allFields: {
        firstname : "Jane",
        lastname : "Doe",
        totalprice : 152,
        depositpaid : false,
        bookingdates : {
            checkin : "2026-11-13",
            checkout : "2026-12-28"
        },
        additionalneeds : "Free Drinks"
    },
    hasMissingFields: {
        firstname : "Jane"
    }
}

module.exports = {
    createBookingBody,
    updateBookingBody,
};