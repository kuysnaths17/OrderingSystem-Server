const Item = require('../models/items.model');

exports.fetchAllItems = async (req, res) => {
    try {
        const items = await Item.find()
        res.status(200).json(items);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
}

exports.fetchItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = await Item.find({ category }); // Fetch items by category
        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found for this category' });
        }
        res.status(200).json(items);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
}