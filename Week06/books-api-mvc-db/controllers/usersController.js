// controllers/usersController.js
const User = require('../models/user');

exports.createUser = async (req, res) => {
    try {
        const user = await User.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const result = await User.updateUser(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await User.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const users = await User.searchUsers(req.query.q);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search users' });
    }
};

exports.getUsersWithBooks = async (req, res) => {
    try {
        const users = await User.getUsersWithBooks();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching users with books' });
    }
};
