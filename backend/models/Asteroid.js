const mongoose = require('mongoose');

const asteroidSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    impactDate: {
        type: Date,
        required: true
    },
    impactLocation: {
        country: {
            type: String,
            required: true
        },
        latitude: Number,
        longitude: Number
    },
    // You can add other fields as needed
});

module.exports = mongoose.model('Asteroid', asteroidSchema);
