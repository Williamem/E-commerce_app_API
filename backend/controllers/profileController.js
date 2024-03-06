const { User, Address } = require('../models/index');
const { addressValidator } = require('../validators/validators')


exports.createAddress = async (req, res) => {
  const validationResult = addressValidator.validate(req.body);
  if (validationResult.error) { 
    return res.status(400).json({ error: validationResult.error.details[0].message });
  }
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId);
    if (!user) {
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

exports.getUserProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await User.findByPk(userId);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Retrieve all addresses for the specified user ID
        const addresses = await Address.findAll({
          where: { user_id: userId },
          include: {
            model: User,  // Include the User model for joining
            attributes: ['email'],  // Select the 'email' column from the User model
          },
          raw: true,  // Set raw to true to get the plain JSON objects
        });
    
        if (addresses.length === 0) {
          return res.status(404).json({ error: 'No addresses found for the user' });
        }
    
        res.status(200).json({ addresses: addresses });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};

exports.updateAddress = async (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log('userId: ', userId);
    const addressId = parseInt(req.params.addressId);
    console.log('addressId: ', addressId);
    const validationResult = addressValidator.validate(req.body);
    const {first_name, last_name, phone, country, state, city, address} = req.body;
    console.log('req.body: ', req.body);
    if (validationResult.error) { 
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }
    try {
        const user = await User.findByPk(userId);
        const existingAddress = await Address.findByPk(addressId);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        if (!existingAddress) {
        return res.status(404).json({ error: 'Address not found' });
        }
        await existingAddress.update({
            first_name,
            last_name,
            phone,
            country,
            state,
            city,
            address,
        });
        res.status(200).json(existingAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update the address' });
    }
}