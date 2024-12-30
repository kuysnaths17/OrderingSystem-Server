const Table = require('../models/table.model');

exports.fetchAllTables = async (req, res) => {
    try {
        const tables = await Table.find()
        res.status(200).json(tables);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching tables', error: error.message });
    }
}