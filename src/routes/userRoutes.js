const express = require('express');
const upload = require('../middleware/upload');
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Authentication routes
router.post('/register', upload.single('avatar'), register);
router.post('/login', login);

// User CRUD routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', upload.single('avatar'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 