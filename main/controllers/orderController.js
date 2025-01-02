const Order = require('../models/order.model');
const Table = require('../models/table.model');
const Item = require('../models/items.model');

exports.insertOrder = async (req, res) => {
    try {
        // Step 1: Insert the new order
        const order = new Order(req.body);
        const newOrder = await order.save();

        // Step 2: Update the quantity of each item in the order
        for (const item of newOrder.items) {
            await Item.findByIdAndUpdate(
                item.itemId,
                { $inc: { quantity: -item.quantity } }, // Decrease the quantity
                { new: true }
            );
        }

        // Step 3: Update the status of the table
        await Table.findByIdAndUpdate(
            newOrder.tableID,
            { status: 'reserved' }, // Change the table status to 'occupied'
            { new: true }
        );

        // Step 4: Return the successful response
        res.status(201).json({isCompleted: true, message: 'Thank you for your order.', newOrder });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({isCompleted: false, message: 'Error inserting order', error: error.message });
    }
}

exports.getOrderStatus = async (req, res) => {
    try {
        const { tableID } = req.params;
        const order = await Order.findOne({ tableID: tableID })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(1); // Limit the result to 1 (latest order)
        if (order) {
            res.status(200).json({ message: 'Order found', order });
        }
        else {
            res.status(404).json({ message: 'No order found for this table' });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching order status', error: error.message });
    }
}