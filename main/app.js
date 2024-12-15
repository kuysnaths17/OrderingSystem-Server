const express = require('express');
const connectDB = require('./config/mongodb');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/mobile', userRoutes);


const PORT = process.env.MONGO_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})