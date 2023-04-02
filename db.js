const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/parkingSpots'; // replace myDatabase with the name of your database

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB', err);
});
