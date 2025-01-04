const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    itemImage: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemTotalPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    customerName:{
        type: String,
        required: true
    },
    tableID: {
        type: String,
        default: null
    },
    tableNumber: {
        type: String,
        default: null
    },
    items: {
        type: [itemSchema],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'complete'],
        default: 'pending'
    }
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;