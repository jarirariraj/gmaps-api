// import required libraries and models
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema for spots
const spotSchema = new Schema({
  id: Number,
  latitude: Number,
  longitude: Number
});

// define schema for new collection
const spotWithinRadiusSchema = new Schema({
  id: Number,
  latitude: Number,
  longitude: Number
});

// define the model for spots and spots_within_radius
const Spot = mongoose.model('Spot', spotSchema);
const SpotWithinRadius = mongoose.model('SpotWithinRadius', spotWithinRadiusSchema);

// function to find all spots within a specified radius from given latitude and longitude
async function findSpotsWithinRadius(latitude, longitude, radius) {
  const spots = await Spot.find({}); // find all spots
  const spotsWithinRadius = [];
  spots.forEach(spot => {
    // calculate distance from given latitude and longitude to current spot
    const distance = calculateDistance(latitude, longitude, spot.latitude, spot.longitude);
    if (distance <= radius) {
      spotsWithinRadius.push(spot); // add spot to list of spots within radius
    }
  });
  return spotsWithinRadius;
}

// function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // distance in km
  return d;
}

// function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// insert all spots within a specified radius into a new collection
async function insertSpotsWithinRadius(latitude, longitude, radius) {
  const spotsWithinRadius = await findSpotsWithinRadius(latitude, longitude, radius);
  await SpotWithinRadius.insertMany(spotsWithinRadius);
  console.log(`${spotsWithinRadius.length} spots inserted into 'spots_within_radius' collection`);
}

// connect to MongoDB database and call the insertSpotsWithinRadius function
mongoose.connect('mongodb://localhost:27017/parkingSpots', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const latitude = -46.117645;
    const longitude = 168.9313628;
    const radius = 50; // in km
    insertSpotsWithinRadius(latitude, longitude, radius);
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
