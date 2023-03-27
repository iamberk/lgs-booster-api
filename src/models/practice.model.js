const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema({
    practice_type:{
        type: Number,
        required: true,
    },
    start_day:{
        type: Number,
        required: true,
        min: 1,
    },
    end_day:{
        type: Number,
        required: true,
        min: 1,
    },
    success_rate:{
        type: Number,
        default: 0,
    },
    seen_count:{
        type: Number,
        default: 0,
    },

},{ collection: "practices", timestamps: true });

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = Practice;