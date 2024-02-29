const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isCurrentUser, isAdmin } = require('../middleware/authorization');


router.post('/:userId/address', (req, res, next) => isCurrentUser(req.params.userId, req, res, next), profileController.createAddress);

module.exports = router;