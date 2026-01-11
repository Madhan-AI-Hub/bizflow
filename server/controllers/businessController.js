const Business = require('../models/Business');

// @desc    Get business profile
// @route   GET /api/business
// @access  Private
exports.getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId).populate('ownerId', 'name email');
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update business profile
// @route   PUT /api/business
// @access  Private (Admin only)
exports.updateBusinessProfile = async (req, res) => {
  try {
    const { name, category, email, phone, address, gstNumber, licenseNumber, description } = req.body;

    const business = await Business.findById(req.user.businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Update fields
    if (name) business.name = name;
    if (category) business.category = category;
    if (email !== undefined) business.email = email;
    if (phone !== undefined) business.phone = phone;
    if (address !== undefined) business.address = address;
    if (gstNumber !== undefined) business.gstNumber = gstNumber;
    if (licenseNumber !== undefined) business.licenseNumber = licenseNumber;
    if (description !== undefined) business.description = description;

    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
