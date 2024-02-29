const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Address = require('../models/Address')
const { addressValidator } = require('../validators/validators')


exports.createAddress = async (req, res) => {
  console.log('User ID from request parameters:', req.params.userId);
  const validationResult = addressValidator.validate(req.body);
  if (validationResult.error) { 
    return res.status(400).json({ error: validationResult.error.details[0].message });
  }
  try {

    // Get role_id for 'regular_user'
    // Assuming role_name for regular users is 'regular_user'
    const userId = parseInt(req.params.userId);
    console.log('userId: ', userId)
    if (!userId) {
      return res.status(404).json({error: 'User not found'})
    }

    address = await Address.create({
        ...req.body, 
        user_id: userId 
    });
    
    res.status(201).json(address); // Sending back just the newly created object
  } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Server error'});
  }

}