const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    table_number: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'reserved', 'occupied'],
    },
}, {timestamps: true})

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;