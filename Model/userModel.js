const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  role: {
    type: String,
    default: 'user'  // Role is 'user' by default when a user is created
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  pincode: {
    type: String,
    match: /^[0-9]{6}$/,
    default: null
  },
  userNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password and generate userNumber
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    if (this.isNew) {
      const lastUser = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });

      if (lastUser && lastUser.userNumber) {
        const lastNumber = parseInt(lastUser.userNumber.replace('USER', ''));
        this.userNumber = `USER${String(lastNumber + 1).padStart(3, '0')}`;
      } else {
        this.userNumber = 'USER001';
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
