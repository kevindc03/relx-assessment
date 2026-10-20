const departureDay = 1;

module.exports = {
  return: {
    origin: 'cebu',
    destination: 'angeles city',
    departureDay: String(departureDay),
    returnDay: String(departureDay+2),
    cabinClass: 'First'
  },
  oneWay: {
    origin: 'nagoya',
    destination: 'tokyo',
    departureDay: String(departureDay),
    cabinClass: 'Economy'
  },
  multiCity: {
    origin: 'los angeles',
    destination: ['san francisco', 'miami'],
    departureDay: [String(departureDay), String(departureDay+10)],
    cabinClass: ['Business', 'Premium Economy']
  },
  restricted: {
    origin: 'manila',
    destination: 'iran',
    departureDay: String(departureDay),
    returnDay: String(departureDay+2),
    cabinClass: 'Business'
  },
};