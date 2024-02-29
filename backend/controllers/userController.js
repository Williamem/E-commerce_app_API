const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Address = require('../models/Address')
const { userValidator, addressValidator } = require('../validators/validators')

exports.createUser = async (req, res) => {
  const validationResult = userValidator.validate(req.body); // Validate input using Joi
  if (validationResult.error) { // if validation fails, return the error details
    return res.status(400).json({ error: validationResult.error.details[0].message });
  }
  try {
    //console.log(req.body);
    let user = await User.findOne({ where: {email: req.body.email} });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Get role_id for 'regular_user'
    // Assuming role_name for regular users is 'regular_user'
    const userRole = await UserRole.findOne({ where: {role_name: 'regular_user'} });

    user = await User.create({ 
        ...req.body, 
        password: hashedPassword,
        role_id: userRole.role_id // Use the id of 'regular_user' role 
    });
    
    res.status(201).json(user); // Sending back just the newly created object
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
}

exports.login = async (req, res) => {
  res.status(200).send({ message: 'Log in successful' });
}

exports.logout = async (req, res) => {
  req.logout(() => {
    res.send({ message: 'logged out' });
  })
}

