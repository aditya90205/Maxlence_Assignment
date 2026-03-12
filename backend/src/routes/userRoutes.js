const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', protect, userController.getUsers);
router.get('/:id', protect, userController.getUserProfile);
router.put('/profile', protect, upload.single('profile_image'), userController.updateProfile);
router.delete('/:id', protect, authorize('Admin'), userController.deleteUser);

module.exports = router;
