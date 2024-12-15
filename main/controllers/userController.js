const User = require('../models/user.model');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

exports.createUser  = async (req, res) => {
    try {
        const data = req.body;
        
        const existingUser  = await User.findOne({ email: data.email });
        if (existingUser ) {
            return res.status(400).json({ message: 'User  already exists' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create a new user
        const newUser  = new User({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword, // Save the hashed password
        });

        // Save the user to the database
        await newUser.save();

        // Return the created user (excluding the password)
        res.status(201).json({
            message: "User  created successfully",
            user: {
                data: newUser
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.loginUser  = async (req, res) => {
    try {
        const { email, password } = req.body;


        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Return the user data and token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
            token, // Include the token in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};