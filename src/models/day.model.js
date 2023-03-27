const mongoose = require('mongoose');

const dayScema = new mongoose.Schema(
    {
        day_number: {
            type: Number,
            min: 0,
            default: 0,
        },
        complated_count:{
            type: Number,
            default: 0,
        },
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        practices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Practice'
          }]

    }, { collection: 'days', timestamps: true });

const Day = mongoose.model('Day', dayScema);

module.exports = Day;