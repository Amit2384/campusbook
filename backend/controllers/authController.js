const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

exports.register = async (req, res, next) => {
    try {
        const { role, name, email, password, phone } = req.body;

        // Check if user exists
        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Get role ID
        const roleRecord = await UserModel.getRoleByName(role || 'Buyer');
        if (!roleRecord) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const userId = await UserModel.createUser({
            role_id: roleRecord.id,
            name,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = {
            id: user.id,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findUserById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password
        const success = await UserModel.updatePasswordByEmail(email, hashedPassword);

        if (success) {
            res.json({ message: 'Password reset successful' });
        } else {
            res.status(500).json({ message: 'Failed to reset password' });
        }
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const success = await UserModel.updateUserProfile(req.user.id, { name, phone });
        
        if (success) {
            const updatedUser = await UserModel.findUserById(req.user.id);
            res.json({ message: 'Profile updated successfully', user: updatedUser });
        } else {
            res.status(400).json({ message: 'No changes made or user not found' });
        }
    } catch (err) {
        next(err);
    }
};

exports.uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image provided' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const success = await UserModel.updateProfileImage(req.user.id, imageUrl);

        if (success) {
            res.json({ message: 'Profile photo updated', profile_image: imageUrl });
        } else {
            res.status(400).json({ message: 'Failed to update profile photo' });
        }
    } catch (err) {
        next(err);
    }
};
