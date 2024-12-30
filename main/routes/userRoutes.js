const express = require('express');
const { createUser, loginUser } = require('../controllers/userController');
const { fetchAllItems, fetchItemsByCategory } = require('../controllers/itemController');
const { fetchAllTables } = require('../controllers/tableController');
const router = express.Router();

//Users
router.post('/createUser', createUser);
router.post('/loginUser', loginUser);

//Items
router.get('/fetchAllItems', fetchAllItems);
router.get('/fetchItemsByCategory/:category', fetchItemsByCategory);

//Table
router.get('/fetchAllTables', fetchAllTables);


module.exports = router;