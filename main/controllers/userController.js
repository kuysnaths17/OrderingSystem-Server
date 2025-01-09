const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.createUser = async (req, res) => {
    try {
        const data = req.body;

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ isCreated: false, message: 'Email already used.' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create a new user
        const newUser = new User({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: hashedPassword, // Save the hashed password
        });

        // Save the user to the database
        await newUser.save();

        if (newUser) {
            res.status(201).json({ isCreated: true, message: 'User created successfully', user: newUser });

        }

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ isCreated: false, message: 'Error creating user', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ isFound: false, message: `Your email ${email} is not registered yet.` });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ isFound: false, message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Return the user data and token
        res.status(200).json({
            isFound: true,
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

exports.findUserByEmail = async (req, res) => {
    try {
        const { email, code } = req.body; // Assuming the email is passed as a URL parameter

        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ isFound: false, message: `User  with email ${email} not found.` });
        }

        if (user) {
            // Nodemailer configuration
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.NODEMAILER_USER, // Your email
                    pass: process.env.NODEMAILER_PASSWORD, // Your email password or an app password
                },
            });
            const mailOptions = {
                from: `"Prethegem" <no-reply@yourdomain.com>`, // Ensure a valid email format
                to: email, // Recipient email address
                subject: `Password Reset Code`, // Clear and concise subject // Enables direct replies to the user's email
                text: `
                    Hello ${user.first_name} ${user.last_name} , 
                    Your code is: ${code}
                    `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res
                        .status(500)
                        .json({ message: "Failed to send email", error: error.toString() });
                }
                console.log("Email sent:", info.response);
                res
                    .status(200)
                    .json({ message: "Email sent successfully", info: info.response });
            });
        }
        // Return the user data
        res.status(200).json({
            isFound: true,
            message: 'User  found successfully',
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ isFound: false, message: 'Error finding user', error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { email } = req.params; // Extract email from URL parameters
        const { newPassword } = req.body; // Extract new password from the request body

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ isUpdated: false, message: `User with email ${email} not found.` });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Return success response
        res.status(200).json({ isUpdated: true, message: 'Password updated successfully.' });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ isUpdated: false, message: 'Error updating password', error: error.message });
    }
};