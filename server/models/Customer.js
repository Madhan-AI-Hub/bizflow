const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    default: 'CUSTOMER'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const bcrypt = require('bcryptjs');

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
customerSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create compound index for businessId and phone to ensure unique customers per business
customerSchema.index({ businessId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);
