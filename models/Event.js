const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    team1: {
        type: String,
        required: true
    },
    team2: {
        type: String,
        required: true
    },
    score: {
        team1: {
            type: Number,
            default: 0
        },
        team2: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('Event', eventSchema);