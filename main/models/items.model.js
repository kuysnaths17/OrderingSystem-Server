const mongoose = require('mongoose');

// Define Item schema
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    description: String,
    category: {type: String, enum: ['appetizer', 'main_course', 'dessert', 'beverages']},
    price: Number,
    photoUrl: String,
  });
  
  // Create Item model
  const Item = mongoose.model('Item', itemSchema);

module.exports = Item;