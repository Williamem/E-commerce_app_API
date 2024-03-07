const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


router.get('/', profileController.getUserProfile);
router.post('/address', profileController.createAddress);
router.put('/address/:addressId', profileController.updateAddress);

module.exports = router;